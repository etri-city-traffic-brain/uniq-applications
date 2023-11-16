const { query } = require("../mods/dbconnection");
const { getDistance } = require("../mods/common_func");
var fbAdmin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
const moment = require("moment");
const pointInPolygon = require("point-in-polygon");

var bypassInfoList = null;
var uuidList = null;
var trackingInfoList = null;

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(serviceAccount),
});

const getTokenByUuid = (uuid) => {
  return new Promise((resolve, reject) => {
    query("app", "SELECT token FROM TB_MEMBER WHERE uuid = ?;", uuid)
      .then((result) => {
        resolve(result[0].token);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const getBypassInfo = () => {
  return new Promise((resolve, reject) => {
    query("edge", "SELECT * FROM TB_BYPASS;")
      .then((result) => {
        bypassInfoList = result;
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const getUuidList = () => {
  return new Promise((resolve, reject) => {
    var tableName = "TB_TRACKING_" + moment().format("YYYYMMDD");
    // var tableName = "TB_TRACKING_" + moment().format("20211103");
    var queryTime = moment()
      .subtract(1, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");
    // queryTime = moment().format("2021-11-03 00:00:00");
    var queryStr = `SELECT uuid FROM ${tableName} WHERE regdate >= ? GROUP BY uuid;`;

    query("edge", queryStr, queryTime)
      .then((result) => {
        uuidList = result;
        resolve();
      })
      .catch((err) => {
        uuidList = [];
        if (err.errno != 1146) console.log(err); // 1146 : ER_NO_SUCH_TABLE
        reject(err);
      });
  });
};

const getTrackingInfo = (uuid) => {
  return new Promise((resolve, reject) => {
    var tableName = "TB_TRACKING_" + moment().format("YYYYMMDD");
    // var tableName = "TB_TRACKING_" + moment().format("20211103");
    var queryTime = moment()
      .subtract(1, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");
    // var queryTime = moment().format("2021-11-03 00:00:00");
    var queryStr = `SELECT * FROM ${tableName} WHERE uuid = ? AND regdate >= ? ORDER BY regdate DESC;`;

    query("edge", queryStr, [uuid, queryTime])
      .then((result) => {
        trackingInfoList = result;
        resolve();
      })
      .catch((err) => {
        trackingInfoList = [];
        if (err.errno != 1146) console.log(err); // 1146 : ER_NO_SUCH_TABLE
        reject(err);
      });
  });
};

const getPushInfo = (uuid) => {
  return new Promise((resolve, reject) => {
    query(
      "edge",
      "SELECT * FROM TB_PUSH WHERE uuid = ? ORDER BY regdate DESC limit 1;",
      uuid
    )
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const insertPushInfo = (uuid, message, send) => {
  return new Promise((resolve, reject) => {
    var params = {
      uuid,
      jsondata: JSON.stringify(message),
      regdate: moment().format("YYYY-MM-DD HH:mm:ss"),
      send
    };

    query("edge", "INSERT INTO TB_PUSH SET ?", params)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const sendPushMsg = (uuid, message) => {
  getPushInfo(uuid).then((result) => {
    var send = false;
    if (result.length == 0) {
      send = true;
    } else {
      var curTime = moment();
      var sendTime = moment(result[0].regdate);
      var duration = moment.duration(curTime.diff(sendTime)).asMinutes();
      if (duration > 5) send = true;
    }

    if (send == true) {   // push는 발송하지 않고 로그 기록만 추가
      // fbAdmin
      //   .messaging()
      //   .send(message)
      //   .then((response) => {
      //     console.log("success : ", response);
      //     insertPushInfo(uuid, message, "Y");
      //   })
      //   .catch((err) => {
      //     console.log("error : ", err);
      //   });
      insertPushInfo(uuid, message, "N");
    }
  });
};

const getRoadInfo = () => {
  return new Promise((resolve, reject) => {
      query("edge", "SELECT * FROM TB_ROAD;").then(result => {
          resolve(result);
      }).catch((err) => {
          reject(err);
      });
  });
};

const checkTraffic = (roadInfoList) => {
  for (var idx in roadInfoList) {
    var roadInfo = roadInfoList[idx];
    if (roadInfo.check_traffic == 'Y') {
      var speed = parseInt(roadInfo.max_speed * 0.3);
      // console.log(speed, roadInfo.max_speed);
      if (roadInfo.avg_speed && roadInfo.avg_speed < speed) {   // 평균 속도가 최대 속도 30% 미만이면 정체
        // console.log(roadInfo.name, roadInfo.avg_speed);
        return true;
      }
    }
  }

  return false;
}

const createImgList = (roadInfoList) => {
  var resultList = ['http://a.wedrive.kr:6558/img/region1/bg.png'];
  if (roadInfoList.length != 8) {
    console.log("error : length of roadInfoList is ", roadInfoList.length);
    return null;
  }

  for (var idx in roadInfoList) {
    var roadInfo = roadInfoList[idx];
    var color = 'green';
    var speedRed = parseInt(roadInfo.max_speed * 0.3);      // 평균 속도가 최대 속도 30% 미만이면 정체
    var speedYellow = parseInt(roadInfo.max_speed * 0.7);   // 평균 속도가 최대 속도 70% 미만이면 서행
    var index = parseInt(idx) + 1;
    // console.log(roadInfoList[idx].id);
    if (roadInfo.avg_speed && roadInfo.avg_speed < speedRed) {
      color = 'red';
    } else if (roadInfo.avg_speed && roadInfo.avg_speed < speedYellow) {
      color = 'yellow';
    }
    
    var tempPath = `http://a.wedrive.kr:6558/img/region1/${color}/${index}.png`;
    resultList.push(tempPath);
  }

  return resultList;
}

daemonMain = () => {
  setInterval(async () => {
    var roadInfoList = null;
    var imgList = null;

    bypassInfoList = null;

    await getRoadInfo().then(result => {
      roadInfoList = result;
    }).catch(err => {
        console.log(err);
    });

    if (roadInfoList == null) {
        console.log("error : roadInfoList is null!!");
        return;
    }

    if (checkTraffic(roadInfoList) == false) {
      return;
    }

    imgList = createImgList(roadInfoList);
    // console.log(imgList);

    await getBypassInfo();

    if (bypassInfoList) {
      // 경로 저장 테이블에서 uuid 목록 확인
      await getUuidList().catch(() => {
        return;
      });

      if (uuidList && uuidList.length > 0) {
        // 비교 대상 uuid가 있을 경우 우회 경로 정보와 비교
        for (var idx = 0; idx < bypassInfoList.length; idx++) {
          var geofence = JSON.parse(bypassInfoList[idx].coordinate);
          var diffPoint = [bypassInfoList[idx].lat, bypassInfoList[idx].lng];
          for (var idx2 = 0; idx2 < uuidList.length; idx2++) {
            // uuid별 이동 경로 정보 확인
            await getTrackingInfo(uuidList[idx2].uuid).catch(() => {
              return;
            });

            if (trackingInfoList.length > 2) {
              var found = false;
              // uuid별 가장 최근 위치가 우회 경로 전달 지오펜스에 위치해있는지 확인
              for (var idx3 = 0; idx3 < geofence.length; idx3++) {
                if (
                  pointInPolygon(
                    JSON.parse(trackingInfoList[0].coordinate),
                    geofence[idx3]
                  ) == true
                ) {
                  found = true;
                  break;
                }
              }

              if (found == true) {
                // uuid별 가장 최근 위치가 우회 경로 전달 지오펜스내에 위치할 경우 최근부터 과거 순으로 거리가 멀어지는지 확인
                // 거리가 멀어질 경우 접근하고 있다고 판단하여 우회 경로 정보 전달
                var lastDiff = 0;
                for (var idx4 = 0; idx4 < 2; idx4++) {
                  if (idx4 == 0) {
                    lastDiff = getDistance(
                      JSON.parse(trackingInfoList[idx4].coordinate),
                      diffPoint,
                      2
                    );
                  } else {
                    var diff = getDistance(
                      JSON.parse(trackingInfoList[idx4].coordinate),
                      diffPoint,
                      2
                    );

                    if (diff > lastDiff) {
                      var contents = JSON.parse(bypassInfoList[idx].contents);
                      var message = {
                        data: {
                          title: contents.title,
                          subtitle: contents.subtitle,
                          imgSrc: contents.imgsrc,
                          message: contents.message,
                          imgList,
                          bypass: "true",
                        },
                        token: await getTokenByUuid(uuidList[idx2].uuid),
                      };
                      //   console.log(message);

                      sendPushMsg(uuidList[idx2].uuid, message);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, 3000);
};

daemonMain();
