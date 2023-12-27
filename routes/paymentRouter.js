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
router.get("/history", authenticate, paymentController.paymentHistory);
router.get("/delete/:courseId", authenticate, paymentController.deletePayment);
router.post("/v2", authenticate, paymentController.createTransactionv2);
router.get("/", authenticate, paymentController.getAllPayment);
router.post("/payment-callback", paymentController.paymentCallback);
router.get("/:id", paymentController.getPaymentDetail);
router.patch("/:id", authenticate, paymentController.updatePaymentStatus);
module.exports = router;
