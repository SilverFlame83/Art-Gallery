const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const examController = require("../controllers/examController");
const errorController = require("../controllers/errorController");

module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use('/exam', examController);
  app.use('*', errorController)
};
