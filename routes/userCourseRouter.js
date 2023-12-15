const router = require("express").Router();
const userCourseController = require("../controllers/userCourseController");
const { authenticate } = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");

router.get("/progressVideo", authenticate, userCourseController.progressVideo);
router.get("/", authenticate, userCourseController.getUserCourse);

router.post("/:courseId", authenticate, userCourseController.createUserCourse);

router.put("/:courseId", authenticate, userCourseController.updateUserCourse);

router.delete(
  "/:courseId",
  authenticate,
  userCourseController.deleteUserCourse
);

module.exports = router;
