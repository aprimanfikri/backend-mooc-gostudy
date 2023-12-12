const { User, UserCourse } = require("../models");
const ApiError = require("../utils/apiError");

const giveAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userCourseRelation = await UserCourse.findOne({
      where: {
        userId,
      },
    });
    if (!userCourseRelation) {
      return next(new ApiError("Anda belum membeli course ini!", 400));
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = giveAccess;
