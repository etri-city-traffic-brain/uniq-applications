const push2Client = require("../daemon/push2Client");
const calRoadSpeed = require("../daemon/calRoadSpeed");

module.exports = (app) => {
  app.use("/user", require("./user"));
  app.use("/tracking", require("./tracking"));
};
