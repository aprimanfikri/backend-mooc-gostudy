const router = require('express').Router();
const { authenticate } = require('../middlewares/auth');

const paymentController = require('../controllers/paymentController');

router.post('/', authenticate, paymentController.createTransaction);
router.get('/', authenticate, paymentController.getAllPayment);
router.post('/payment-callback', paymentController.paymentCallback);
router.get('/:id', paymentController.getPaymentDetail);

module.exports = router;
