const express = require("express");
const moment = require("moment");
const router = express.Router();
const { query } = require("../mods/dbconnection");

const getUuid = (mid) => {
  return new Promise((resolve, reject) => {
    query("app", "SELECT uuid FROM TB_MEMBER WHERE mid = ?;", mid)
      .then((result) => {
        resolve(result[0].uuid);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const createTrackingTable = (tableName) => {
  return new Promise((resolve, reject) => {
    var queryStr = `CREATE TABLE IF NOT EXISTS ${tableName} (
        uuid varchar(100) NOT NULL,
        trackingid varchar(30) NOT NULL,
        regdate datetime NOT NULL,
        coordinate varchar(100) DEFAULT NULL,
        speed int DEFAULT NULL,
        PRIMARY KEY (uuid, trackingid, regdate)
      );`;
    query("edge", queryStr)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

router.post("/", async (req, res) => {
  var phone = req.body.phone;
  var trackingid = req.body.trackingid;
  var regdate = req.body.regdate;
  var coordinate = req.body.coordinate;
  var speed = req.body.speed;

  var uuid;

  await getUuid(phone)
    .then((result) => {
      uuid = result;
    })
    .catch((err) => {
      console.log("catch = ", err);
      res.send("error.");
    });

  if (!uuid) {
    res.send("error.");
  }

  var tableName = "TB_TRACKING_" + moment().format("YYYYMMDD");

  await createTrackingTable(tableName).catch((err) => {
    console.log("catch = ", err);
    res.send("error.");
  });

  var param = {
    uuid: uuid,
    trackingid: trackingid,
    regdate: regdate,
    coordinate: coordinate,
    speed: speed,
  };

  // console.log(param);

  query("edge", `INSERT INTO ${tableName} SET ?;`, param)
    .then(() => {
      res.send("done.");
    })
    .catch((err) => {
      console.log(err);
      res.send("error.");
    });
});

module.exports = router;
