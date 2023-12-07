const router = require("express").Router();
const { authenticate } = require("../middlewares/auth");

const paymentController = require("../controllers/paymentController");

router.post("/", authenticate, paymentController.createTransaction);
router.post(
  "/payment-callback",
  authenticate,
  paymentController.paymentCallback
);
router.get("/:id", paymentController.getPaymentDetail);

module.exports = router;
