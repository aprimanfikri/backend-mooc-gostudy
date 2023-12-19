const { Payment } = require("../models");
const ApiError = require("../utils/apiError");

const denyPayment = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!userId) {
      throw new ApiError("ID user tidak ada", 404);
    }

    const userPayment = await Payment.findOne({
      where: {
        userId,
        courseId,
      },
    });

    if (userPayment) {
      return next(new ApiError("Anda sudah membeli course ini!", 400));
    }

    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = denyPayment;
