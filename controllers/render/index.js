const { verifyToken } = require('../../utils/jwt');

const forgotPasswordView = (req, res) => res.render('forgotPassword', {
  title: 'Forgot Password',
});

const resetPasswordView = (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.redirect('/404');
    }
    verifyToken(token);
    return res.render('resetPassword', {
      title: 'Reset Password',
      message: null,
    });
  } catch (error) {
    return res.render('resetPassword', {
      title: 'Reset Password',
      message: error.message,
    });
  }
};

module.exports = { forgotPasswordView, resetPasswordView };
