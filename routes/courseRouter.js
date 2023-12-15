const router = require("express").Router();
const courseController = require("../controllers/courseController");
const { authenticate } = require("../middlewares/auth");
const upload = require("../middlewares/uploader");
const checkRole = require("../middlewares/checkRole");
const { progressVideo } = require("../controllers/userCourseController");
const openCourse = require("../controllers/openCourse");

router
  .route("/")
  .get(courseController.getAllCourse)
  .post(
    authenticate,
    checkRole("admin"),
    upload.single("image"),
    courseController.createCourse
  );

router
  .route("/:id")
  .get(authenticate, courseController.getCourseById)
  .patch(
    authenticate,
    checkRole("admin"),
    upload.single("image"),
    courseController.updateCourse
  )
  .delete(authenticate, checkRole("admin"), courseController.deleteCourse);

module.exports = router;
