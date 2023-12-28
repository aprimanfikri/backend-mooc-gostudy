const router = require("express").Router();
const { authenticate } = require("../middlewares/auth");

const paymentController = require("../controllers/paymentController");
const denyPayment = require("../middlewares/deniedDoubleTransaction");
const checkRole = require("../middlewares/checkRole");

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
router.get(
  "/",
  authenticate,
  checkRole("admin"),
  paymentController.getAllPayment
);
router.post("/payment-callback", paymentController.paymentCallback);
router.get(
  "/:id",
  authenticate,
  checkRole("admin"),
  paymentController.getPaymentDetail
);

router.patch(
  "/:id",
  authenticate,
  checkRole("admin"),
  paymentController.updatePaymentStatus
);
module.exports = router;
