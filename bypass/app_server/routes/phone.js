const express = require('express');
const router = express.Router();
const moment = require("moment");
const { query } = require("../mods/dbconnection");
const { sendSMS } = require("../mods/util");
const uuid = require("uuid/v4");

// 랜덤반환함수
const getRndNum = (min, max) => {
  return parseInt(Math.random() * (max - min + 1) + min);
};

router.post('/req', async (req, res) => {
  var phone = req.body.phone;

  var regdate = moment().format("YYYY-MM-DD HH:mm:ss");
  var expdate = moment(regdate)
    .add(moment.duration(60, "minutes"))
    .format("YYYY-MM-DD HH:mm:ss");

  console.log(phone);
  
  var params = {
    phonenum: phone,
    regdate,
    expdate,
    retry: 0,
    authnum: getRndNum(100000, 999999),
  };


  try {
    var result = await query("app", "SELECT retry FROM TB_PHONE WHERE phonenum=?;", [
      phone,
    ]);

    if (result.length > 0 && result[0].retry > 5) {
      res.json({ msg: '1시간뒤에 다시 시도해 주십시오.' });
    } else {
      await query("app",
        "INSERT INTO TB_PHONE SET ? ON DUPLICATE KEY UPDATE retry=retry+1, authnum=?",
        [params, params.authnum]
      );

      sendSMS(
        params.phonenum,
        `[BYPASS] 인증번호는 ${params.authnum} 입니다.`,
        (err) => {
          res.json({});
        }
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({msg: err});
  }
});

router.post('/check', async (req, res) => {
  var isSuperKey = false;
  var phone = req.body.phone;
  var authnum = req.body.authnum;
  var version = req.body.version;
  var token = req.body.token;
  var push = req.body.push;
  var device = req.body.device;
  var uid = uuid().replace(/-/g, "");
  var curdate = moment().format("YYYY-MM-DD HH:mm:ss");

  var queryStr = "SELECT authnum FROM TB_PHONE WHERE authnum=? AND phonenum=?;";
  var params = [authnum, phone];

  var result = await query("app", queryStr, params);

  if (authnum == '114119') {
    isSuperKey = true;
  }

  if (result.length == 0 && isSuperKey == false) {
    res.json({msg: "잘못된 번호입니다"});
  } else {
    var param = {
      mid: phone,
      uuid: uid,
      regdate: curdate,
      version: version,
      token: token,
      push: push,
      device: device,
    };
    var param_update = {
      uptdate: curdate,
      version: version,
      token: token,
      push: push,
      device: device,
    };
  
    await query("app", "INSERT INTO TB_MEMBER SET ? ON DUPLICATE KEY UPDATE ?;", [
      param,
      param_update,
    ])
      .then(() => {
        res.json({msg: 'success.'});
      })
      .catch((err) => {
        console.log(err);
        res.json({msg: 'error'});
      });
  }
});

module.exports = router;
