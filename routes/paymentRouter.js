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
router.delete(
  "/delete/:courseId",
  authenticate,
  paymentController.deletePayment
);
router.get("/", authenticate, paymentController.getAllPayment);
router.post("/payment-callback", paymentController.paymentCallback);
router.get("/:id", paymentController.getPaymentDetail);

module.exports = router;
