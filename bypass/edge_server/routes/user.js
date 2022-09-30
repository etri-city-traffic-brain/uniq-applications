const express = require("express");
const router = express.Router();
const passport = require("passport");
const { passportCreate } = require("../mods/passport");
const { query } = require("../mods/dbconnection");

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

module.exports = router;
