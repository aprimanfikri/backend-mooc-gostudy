const { User } = require('../models');
const ApiError = require('../utils/apiError');
const { verifyToken } = require('../utils/jwt');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new ApiError('Authorization token is required', 401));
    }
    if (!token.startsWith('Bearer ')) {
      return Promise.reject(
        new ApiError('Invalid authorization token format', 401),
      );
    }
    const tokenValue = token.split('Bearer ')[1];
    const payload = verifyToken(tokenValue);
    const user = await User.findByPk(payload.id);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  authenticate,
};
