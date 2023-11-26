const router = require("express").Router();

const userController = require("../controllers/userController");

const {
  authenticate,
  authenticateTemporary,
  setAuthCookie,
} = require("../middlewares/auth");

const checkRole = require("../middlewares/checkRole");

router.post("/register", userController.register);
router.post("/verify", authenticateTemporary, userController.verifyOtp);
router.post("/resend", authenticateTemporary, userController.resendOtp);
router.post("/forgot-password", userController.forgotPassword);
router.post(
  "/reset-password/:token",
  setAuthCookie,
  userController.resetPassword
);
router.post("/login", userController.login);
router.post("/update", authenticate, userController.updateProfile);

router.get(
  "/all",
  authenticate,
  checkRole("admin"),
  userController.getAllUsers
);

module.exports = router;
