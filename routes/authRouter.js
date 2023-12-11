const router = require('express').Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');

router.post('/register', userController.register);
router.post('/verify', authenticate, userController.verifyOtp);
router.post('/resend', authenticate, userController.resendOtp);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', authenticate, userController.resetPassword);
router.post('/login', userController.login);

router.post('/login/admin', userController.loginAdmin);

module.exports = router;
