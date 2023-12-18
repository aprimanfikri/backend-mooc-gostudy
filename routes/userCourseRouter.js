const router = require('express').Router();
const userCourseController = require('../controllers/userCourseController');
const giveAccess = require('../middlewares/accessCourse');
const { authenticate } = require('../middlewares/auth');

// router.get("/progressVideo", authenticate, userCourseController.progressVideo);
router.get('/', authenticate, userCourseController.getUserCourse);

router.post('/:courseId', authenticate, userCourseController.createUserCourse);

router.put('/:courseId', authenticate, userCourseController.updateUserCourse);

router.delete(
  '/:courseId',
  authenticate,
  userCourseController.deleteUserCourse
);

router.get(
  '/course/:courseId/modules/:moduleId',
  authenticate,
  giveAccess,
  userCourseController.clickModule
);

module.exports = router;
