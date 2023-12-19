const router = require("express").Router();
const { authenticate } = require("../middlewares/auth");

const paymentController = require("../controllers/paymentController");
const denyPayment = require("../middlewares/deniedDoubleTransaction");

router.post(
  "/",
  authenticate,
  denyPayment,
  paymentController.createTransaction
);
router.post("/v2", authenticate, paymentController.createTransactionv2);
router.get("/", authenticate, paymentController.getAllPayment);
router.post("/payment-callback", paymentController.paymentCallback);
router.get("/:orderId", paymentController.getPaymentDetail);
router.get("/payment-history", paymentController.userPaymentHistory);

module.exports = router;
