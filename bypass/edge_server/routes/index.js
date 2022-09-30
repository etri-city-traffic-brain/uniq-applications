module.exports = (app) => {
  app.use("/user", require("./user"));
  app.use("/tracking", require("./tracking"));
};
