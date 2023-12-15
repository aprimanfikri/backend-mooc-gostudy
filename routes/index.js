const router = require("express").Router();
const Auth = require("./authRouter");
const User = require("./userRouter");
const Course = require("./courseRouter");
const Chapter = require("./chapterRoutes");
const Module = require("./moduleRouter");
const Category = require("./categoryRouter");
const Payment = require("./paymentRouter");
const Notification = require("./notificationRouter");
const UserCourse = require("./userCourseRouter");

const render = require("./render");

router.use(render);

router.use("/api/v1/auth", Auth);
router.use("/api/v1/user", User);
router.use("/api/v1/course", Course);
router.use("/api/v1/chapter", Chapter);
router.use("/api/v1/module", Module);
router.use("/api/v1/category", Category);
router.use("/api/v1/payment", Payment);
router.use("/api/v1/notification", Notification);

router.all("*", (req, res) => {
  res.render("error", {
    title: "Error Page",
  });
});

module.exports = router;
