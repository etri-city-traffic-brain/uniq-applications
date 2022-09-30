const express = require("express");
const router = express.Router();
const { query } = require("../mods/dbconnection");

router.get("/", (req, res) => {
  query("app", "SELECT * FROM TB_EDGE_SERVER;")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send("error.");
    });
});

router.get("/version", (req, res) => {
  query("app", "SELECT * FROM TB_EDGE_SERVER WHERE serverid = 'ES_INFO';")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send("error.");
    });
});

module.exports = router;
