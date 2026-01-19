module.exports = function (app) {
  app.use("/quizzes", require("./quizRoutes.route"));
  app.use("/question", require("./questionRoutes.route"));
};
