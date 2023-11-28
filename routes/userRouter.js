const router = require("express").Router();

const userController = require("../controllers/userController");

const { authenticate } = require("../middlewares/auth");

const upload = require("../middlewares/uploader");

const checkRole = require("../middlewares/checkRole");

router.post("/register", userController.register);
router.post("/verify", authenticate, userController.verifyOtp);
router.post("/resend", authenticate, userController.resendOtp);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", authenticate, userController.resetPassword);
router.post("/login", userController.login);
router.put(
  "/update",
  authenticate,
  upload.single("image"),
  userController.updateProfile
);

router.get(
  "/all",
  authenticate,
  checkRole("admin"),
  userController.getAllUsers
);

router.get("/me", authenticate, userController.whoAmI);

module.exports = router;
