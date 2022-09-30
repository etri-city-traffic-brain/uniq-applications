module.exports = (app) => {
  app.use("/user", require("./user"));
  app.use("/phone", require("./phone"));
  app.use("/service", require("./service"));
  app.use("/edge", require("./edge"));
  app.use("/bypass", require("./bypass"));
  app.use("/tracking", require("./tracking"));
  app.use("/privacy", require("./privacy"));
};
