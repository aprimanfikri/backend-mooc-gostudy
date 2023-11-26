const jwt = require("jsonwebtoken");
const ApiError = require("./apiError");

const generateToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error) {
      throw new ApiError("Authorization token has expired", 401);
    }
    throw new ApiError("Invalid authorization token", 401);
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
