const { Payment } = require("../models");
const ApiError = require("../utils/apiError");

// eslint-disable-next-line consistent-return
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
      if (userPayment.status === "expire") {
        await userPayment.destroy();
        return next();
        // eslint-disable-next-line no-else-return
      } else {
        throw new ApiError("Anda sudah membeli course ini!", 400);
      }
    }

    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = denyPayment;
