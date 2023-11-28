const { verifyToken } = require("../../utils/jwt");

const forgotPasswordView = (req, res) => {
  res.render("forgotPassword", {
    title: "Forgot Password",
  });
};

const resetPasswordView = (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.redirect("/404");
  }
  res.render("resetPassword", {
    title: "Reset Password",
    token,
  });
};

module.exports = { forgotPasswordView, resetPasswordView };
