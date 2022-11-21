const { query } = require("../mods/dbconnection");
const moment = require("moment");
const pointInPolygon = require("point-in-polygon");

const insert_avgspd = (resVal) => {
  return new Promise((resolve, reject) => {
    var queryStr = `INSERT INTO TB_INTERSECTION_SPD VALUES(?, ?, ?, ?)  ON DUPLICATE KEY UPDATE avg_spd = ?, reg_date = ?`;
    var regDt = moment().format("YYYY-MM-DD HH:mm:ss");
    query("local_app", queryStr, [
      resVal.time_range,
      resVal.cctv_id,
      resVal.avg_spd,
      regDt,
      resVal.avg_spd,
      regDt,
    ])
      .then(() => {
        console.log("done.");
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getAvgByCctv = (cctvid) => {
  return new Promise((resolve, reject) => {
    var curTime = moment().format("YYYY-MM-DD HH:mm:00");
    var searchTime = moment()
      .subtract(5, "minutes")
      .format("YYYY-MM-DD HH:mm:00");

    query(
      "bypass",
      `SELECT AVG(trvl_spd) AS avg_spd FROM CTB_CRSRD_TRA_5MIN WHERE cctv_id = ? AND tr_vol > 1 AND reg_dt <= ? AND reg_dt >= ?;`,
      [cctvid, curTime, searchTime]
    )
      .then(async (result) => {
        console.log(result);
        var resVal = { cctv_id: cctvid, avg_spd: -1, time_range: "" };
        if (result[0].avg_spd != null) {
          resVal.avg_spd = result[0].avg_spd.toFixed(3);
        }
        resVal.time_range = curTime;
        console.log("test1");
        await insert_avgspd(resVal);
        console.log("test2");
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 5분마다 CCTV 속도 체크 후 기록
const daemonMain = async () => {
  setInterval(async () => {
    await getAvgByCctv("C0001")
      .then(() => {
        console.log("done1.");
      })
      .catch((err) => {
        console.log(err);
      });

    await getAvgByCctv("C0002")
      .then(() => {
        console.log("done2.");
      })
      .catch((err) => {
        console.log(err);
      });

    await getAvgByCctv("C0003")
      .then(() => {
        console.log("done3.");
      })
      .catch((err) => {
        console.log(err);
      });

    await getAvgByCctv("C0004")
      .then(() => {
        console.log("done4.");
      })
      .catch((err) => {
        console.log(err);
      });
  }, 1000 * 60 * 5);
};

daemonMain();
