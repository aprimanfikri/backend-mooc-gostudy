const { User } = require("../models");
const ApiError = require("../utils/apiError");
const { verifyToken } = require("../utils/jwt");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new ApiError(401, "Missing authorization token"));
    }
    if (!token.startsWith("Bearer ")) {
      return next(new ApiError(401, "Invalid authorization token format"));
    }
    const tokenValue = token.split("Bearer ")[1];
    const payload = verifyToken(tokenValue);
    const user = await User.findByPk(payload.id);
    if (!user) {
      return next(
        new ApiError(401, "User not found or invalid authorization token")
      );
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, error.message));
  }
};
