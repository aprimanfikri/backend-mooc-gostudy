const router = require('express').Router();
const Auth = require('./authRouter');
const User = require('./userRouter');
const Course = require('./courseRouter');
const Chapter = require('./chapterRouter');
const Module = require('./moduleRouter');
const Category = require('./categoryRouter');
const Payment = require('./paymentRouter');
const Notification = require('./notificationRouter');
const UserCourse = require('./userCourseRouter');
const UserNotif = require('./userNotifRouter');

const render = require('./render');

router.use(render);

router.use('/api/v1/auth', Auth);
router.use('/api/v1/user', User);
router.use('/api/v1/course', Course);
router.use('/api/v1/chapter', Chapter);
router.use('/api/v1/module', Module);
router.use('/api/v1/category', Category);
router.use('/api/v1/payment', Payment);
router.use('/api/v1/notification', Notification);
router.use('/api/v1/view-course', UserCourse);
router.use('/api/v1/my-notification', UserNotif);

router.get('*', (req, res) => {
  res.status(404).render('error', {
    title: 'Error Page - Not Found',
    url: req.url,
  });
});

module.exports = router;
