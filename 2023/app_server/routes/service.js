const express = require("express");
const router = express.Router();
const moment = require("moment");
const { query } = require("../mods/dbconnection");

router.patch("/tokenupdate", (req, res) => {
  var phone = req.body.phone;
  var token = req.body.token;

  var curdate = moment().format("YYYY-MM-DD HH:mm:ss");

  var param = { uptdate: curdate, token: token };

  query("app", "UPDATE TB_MEMBER SET ? WHERE mid = ?;", [param, phone])
    .then(() => {
      res.send("done.");
    })
    .catch((err) => {
      console.log(err);
      res.send("error.");
    });
});

router.patch("/pushenable", (req, res) => {
  var phone = req.body.phone;
  var push = req.body.push;

  if (push != "Y" && push != "y" && push != "N" && push != "n") {
    push = "Y";
  }

  var curdate = moment().format("YYYY-MM-DD HH:mm:ss");

  var param = { uptdate: curdate, push: push };

  query("app", "UPDATE TB_MEMBER SET ? WHERE mid = ?;", [param, phone])
    .then(() => {
      res.send("done.");
    })
    .catch((err) => {
      console.log(err);
      res.send("error.");
    });
});

module.exports = router;
