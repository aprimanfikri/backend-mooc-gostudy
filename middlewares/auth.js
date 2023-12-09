const { User } = require('../models');
const ApiError = require('../utils/apiError');
const { verifyToken } = require('../utils/jwt');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new ApiError('Missing authorization token', 401));
    }
    if (!token.startsWith('Bearer ')) {
      return next(new ApiError('Invalid authorization token format', 401));
    }
    const tokenValue = token.split('Bearer ')[1];
    const payload = verifyToken(tokenValue);
    const user = await User.findByPk(payload.id);
    if (!user) {
      return next(
        new ApiError('User not found or invalid authorization token', 404),
      );
    }
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  authenticate,
};
