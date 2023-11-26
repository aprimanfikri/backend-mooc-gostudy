const router = require("express").Router();

const courseController = require("../controllers/courseController");

router
  .route("/")
  .get(courseController.getAllCourse)
  .post(courseController.createCourse);

router
  .route("/:id")
  .get(courseController.getCourseById)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;
