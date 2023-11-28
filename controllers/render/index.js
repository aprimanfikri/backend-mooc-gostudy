const { verifyToken, generateToken } = require("../../utils/jwt");

const forgotPasswordView = (req, res) => {
  res.render("forgotPassword", {
    title: "Forgot Password",
  });
};

const resetPasswordView = (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.redirect("/404");
    }
    verifyToken(token);
    res.render("resetPassword", {
      title: "Reset Password",
      message: null,
    });
  } catch (error) {
    res.render("resetPassword", {
      title: "Reset Password",
      message: error.message,
    });
  }
};

module.exports = { forgotPasswordView, resetPasswordView };
