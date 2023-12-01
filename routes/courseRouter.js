const router = require('express').Router();

const courseController = require('../controllers/courseController');

const { authenticate } = require('../middlewares/auth');

const upload = require('../middlewares/uploader');

const checkRole = require('../middlewares/checkRole');

router
  .route('/')
  .get(courseController.getAllCourse)
  .post(
    authenticate,
    checkRole('admin'),
    upload.single('image'),
    courseController.createCourse
  );

router
  .route('/:id')
  .get(courseController.getCourseById)
  .patch(
    authenticate,
    checkRole('admin'),
    upload.single('image'),
    courseController.updateCourse
  )
  .delete(authenticate, checkRole('admin'), courseController.deleteCourse);

module.exports = router;
