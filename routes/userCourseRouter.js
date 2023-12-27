const router = require("express").Router();
const userCourseController = require("../controllers/userCourseController");
const giveAccess = require("../middlewares/accessCourse");
const { authenticate } = require("../middlewares/auth");

router.get("/", authenticate, userCourseController.getUserCourse);
router.patch("/:id", authenticate, userCourseController.updateUserCourse);

router.get("/course/:courseId", authenticate, userCourseController.openCourse);

router.get(
  "/course/:courseId/modules/:moduleId",
  authenticate,
  giveAccess,
  userCourseController.clickModule
);

module.exports = router;
