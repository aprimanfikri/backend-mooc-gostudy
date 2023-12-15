const { Payment, Module } = require("../models");
const ApiError = require("../utils/apiError");

const giveAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { moduleId } = req.params;
    const userCourseRelation = await Payment.findOne({
      where: {
        userId,
      },
    });

    const module = await Module.findOne({
      where: {
        id: moduleId,
      },
    });

    if (userCourseRelation.isPaid === true && module.status === 0) {
      return next(new ApiError("Anda belum membeli course ini!", 400));
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = giveAccess;
