const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  var title = req.body.title;
  if (!title) {
    title = "test";
  }
  console.log(title);

  res.render("bypass", { title });
});

router.get("/mobile", (req, res) => {
  var title = req.body.title;
  if (!title) {
    title = "test";
  }
  console.log(title);

  res.render("bypassm", { title });
});

module.exports = router;
