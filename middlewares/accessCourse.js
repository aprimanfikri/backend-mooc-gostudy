const { Payment, Module, Course, Chapter } = require('../models');
const ApiError = require('../utils/apiError');

const giveAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { moduleId, courseId } = req.params;

    const userHasPayment = await Payment.findOne({
      where: {
        userId,
        courseId,
        status: 'paid',
      },
    });

    const course = await Course.findOne({
      where: {
        id: courseId,
      },
    });

    const module = await Module.findOne({
      where: {
        id: moduleId,
      },
    });

    if (!module) {
      return next(new ApiError('Module not found!', 404));
    }

    const chapter = await Chapter.findOne({
      where: {
        courseId,
      },
      include: [
        {
          model: Module,
          where: {
            id: moduleId,
          },
        },
      ],
    });

    if (!chapter) {
      return next(new ApiError('Chapter not found!', 404));
    }

    if (!userHasPayment) {
      if (course && course.type === 'Free') {
        return next(); // User can access modules in Free courses
      }
      if (course && course.type === 'Premium') {
        if (module.isUnlocked === true) {
          return next();
        }
        return next(
          new ApiError('You have not purchased access to this course!', 400)
        );
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = giveAccess;
