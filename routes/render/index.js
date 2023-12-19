const express = require("express");

const router = express.Router();

const {
  forgotPasswordView,
  resetPasswordView,
} = require("../../controllers/render");

router.get("/forgot-password", forgotPasswordView);
router.get("/reset-password", resetPasswordView);

module.exports = router;
