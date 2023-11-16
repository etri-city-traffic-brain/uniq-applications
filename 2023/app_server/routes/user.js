const express = require("express");
const router = express.Router();
const passport = require("passport");
const { passportCreate } = require("../mods/passport");
const { query } = require("../mods/dbconnection");
const uuid = require("uuid/v4");
const moment = require("moment");

/**
 * @api {get} /user 사용자 인증 예제
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Bearer TOKEN
 *
 * @apiSuccess {String} result 결과
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("respond with a resource");
  }
);

/**
 * @api {get} /user/create 사용자 토큰 생성 예제
 * @apiGroup User
 *
 * @apiSuccess {String} token 사용자토큰
 */
router.get("/create", (req, res) => {
  var token = passportCreate({ mid: "test" });
  res.json({ token });
});

/**
 * @api {post} /user 사용자 등록
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Bearer TOKEN
 *
 * @apiSuccess {String} result 결과
 */
router.post("/", (req, res) => {
  var phone = req.body.phone;
  var version = req.body.version;
  var token = req.body.token;
  var push = req.body.push;
  var device = req.body.device;

  if (push != "Y" && push != "y" && push != "N" && push != "n") {
    push = "Y";
  }

  var uid = uuid().replace(/-/g, "");
  var curdate = moment().format("YYYY-MM-DD HH:mm:ss");

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

  query("app", "INSERT INTO TB_MEMBER SET ? ON DUPLICATE KEY UPDATE ?;", [
    param,
    param_update,
  ])
    .then(() => {
      res.send("done.");
    })
    .catch((err) => {
      console.log(err);
      res.send("error.");
    });
});

/**
 * @api {get} /user/:phone 사용자 정보 확인
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Bearer TOKEN
 *
 * @apiSuccess {String} result 결과
 */
router.get("/:phone", (req, res) => {
  var phone = req.params.phone;

  query("app", "SELECT * FROM TB_MEMBER WHERE mid = ?;", phone)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send("error.");
    });
});

/**
 * @api {patch} /user/:phone 사용자 정보 수정
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Bearer TOKEN
 *
 * @apiSuccess {String} result 결과
 */
router.patch("/:phone", (req, res) => {
  var phone = req.params.phone;
  var version = req.body.version;
  var token = req.body.token;
  var push = req.body.push;
  var device = req.body.device;

  if (push != "Y" && push != "y" && push != "N" && push != "n") {
    push = "Y";
  }

  var curdate = moment().format("YYYY-MM-DD HH:mm:ss");

  var param = { uptdate: curdate };

  if (version) {
    param.version = version;
  }

  if (token) {
    param.token = token;
  }

  if (push) {
    param.push = push;
  }

  if (device) {
    param.device = device;
  }

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
