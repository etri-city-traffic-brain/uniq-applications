const express = require("express");
const router = express.Router();
const passport = require("passport");
const { passportCreate } = require("../mods/passport");
const { query } = require("../mods/dbconnection");
const uuid = require("uuid/v4");
const moment = require("moment");


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
        time_begin datetime NOT NULL,
        jsondata longtext,
        PRIMARY KEY (uuid, time_begin),
        KEY time_begin (time_begin),
        KEY uuid (uuid)
      );`;
    query("app", queryStr)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

/**
 * @api {post} / 주행정보 등록
 * @apiGroup tracking
 *
 * @apiHeader {String} Authorization Bearer TOKEN
 *
 * @apiSuccess {String} result 결과
 */
router.post("/", async (req, res) => {
  var phone = req.body.phone;
  var time_begin = req.body.timeBegin;
  var jsondata = req.body.jsonData;

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

  var tableName = "TB_TRACKING_" + moment(time_begin).format("YYYYMMDD");

  await createTrackingTable(tableName).catch((err) => {
    console.log("catch = ", err);
    res.send("error.");
  });

  var param = {
    uuid,
    time_begin,
    jsondata
  };

  // console.log(param);

  query("app", `INSERT INTO ${tableName} SET ?;`, param)
    .then(() => {
      res.send("done.");
    })
    .catch((err) => {
      console.log(err);
      res.send("error.");
    });
});

module.exports = router;
