const router = require('express').Router();

const userController = require('../controllers/userController');

const auth = require('../middlewares/auth');

router.post('/register', userController.register);
router.post('/:userId/verify', userController.verifyOtp);
router.post('/resend', userController.resendOtp);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/login', userController.login);
router.post('/update', auth, userController.updateProfile);

module.exports = router;
