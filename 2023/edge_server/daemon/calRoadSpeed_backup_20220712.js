const { query } = require("../mods/dbconnection");
const { getDistance } = require("../mods/common_func");
const moment = require("moment");
const pointInPolygon = require("point-in-polygon");

var roadInfoList = null;
var trackingIdList = null;

const getRoadInfo = () => {
    return new Promise((resolve, reject) => {
        query("edge", "SELECT * FROM TB_ROAD;").then(result => {
            roadInfoList = result;
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

const updateRoadInfo = (roadId, speedAvg) => {
    return new Promise((resolve, reject) => {
        var updateDate = moment().format("YYYY-MM-DD HH:mm:ss");
        query("edge", "UPDATE TB_ROAD SET avg_speed = ?, update_date = ? WHERE id = ?;", [speedAvg, updateDate,roadId]).then(result => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

const getTrackingIdList = () => {
    return new Promise((resolve, reject) => {
        var tableName = `TB_TRACKING_${moment().format("YYYYMMDD")}`;
        var searchTime = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");

        // query("edge", `SELECT uuid, trackingid FROM ${tableName} WHERE regdate >= ? GROUP BY uuid, trackingid;`, [searchTime]).then(result => {
        query("edge", `SELECT uuid, trackingid FROM TB_TRACKING_20211103 GROUP BY uuid, trackingid;`).then(result => {
            trackingIdList = result;
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

const getTrackingInfo = (uuid, trackingId) => {
    return new Promise((resolve, reject) => {
        var tableName = `TB_TRACKING_${moment().format("YYYYMMDD")}`;
        var searchTime = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");

        // query("edge", `SELECT * FROM ${tableName} WHERE regdate >= ? AND uuid = ? AND trackingid = ? ORDER BY regdate DESC;`, [searchTime, uuid, trackingId]).then(result => {
        query("edge", `SELECT * FROM TB_TRACKING_20211103 WHERE uuid = ? AND trackingid = ? ORDER BY regdate DESC;`, [uuid, trackingId]).then(result => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
};

const daemonMain = () => {
    setInterval(async () => {
        roadInfoList = null;
        trackingIdList = null;

        await getRoadInfo().catch(err => {
            console.log(err);
        });

        if (roadInfoList == null) {
            console.log("error : roadInfoList is null!!");
            return;
        }

        await getTrackingIdList().catch(err => {
            console.log(err);
        });

        if (trackingIdList == null) {
            console.log("error : trackingIdList is null!!");
            return;
        }

        for (var idx1 in roadInfoList) {
            var roadInfo = roadInfoList[idx1];
            var findCnt = 0;
            var speedSum = 0;
            var speedAvg = 0;

            for (var idx2 in trackingIdList) {
                var trackingId = trackingIdList[idx2];
                await getTrackingInfo(trackingId.uuid, trackingId.trackingid)
                .then(result => {
                    for(var idx3 in result) {
                        if (idx3 == 0) continue;
                        var tracking1 = result[idx3 - 1];
                        var tracking2 = result[idx3];
                        if (pointInPolygon(JSON.parse(tracking1.coordinate), JSON.parse(roadInfo.coordinate)) == true &&
                            pointInPolygon(JSON.parse(tracking2.coordinate), JSON.parse(roadInfo.coordinate)) == true) {
                            var dist1 = getDistance(JSON.parse(tracking1.coordinate), [roadInfo.lat, roadInfo.lng], 2);
                            var dist2 = getDistance(JSON.parse(tracking2.coordinate), [roadInfo.lat, roadInfo.lng], 2);
                            if (dist1 < dist2) {
                                findCnt++;
                                speedSum += tracking2.speed;
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            }

            if (findCnt > 0) {
                speedAvg = parseInt(speedSum / findCnt);
                // console.log(roadInfo.id, speedAvg);
                await updateRoadInfo(roadInfo.id, speedAvg);
            }
        }
    }, 1000 * 60 * 30);
};

daemonMain();