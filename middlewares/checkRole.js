const ApiError = require('../utils/apiError');

const checkRole = (role) => async (req, res, next) => {
  try {
    if (req.user.role !== role) {
      throw new ApiError("You don't have permission to access", 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkRole;
