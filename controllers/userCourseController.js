const { Op } = require("sequelize");
const {
  UserCourse,
  UserModule,
  Course,
  User,
  Chapter,
  Module,
} = require("../models");
const ApiError = require("../utils/apiError");

const clickModule = async (req, res, next) => {
  try {
    const { moduleId, courseId } = req.params;
    const userId = req.user.id;

    if (!userId) {
      throw new ApiError("ID user tidak ada", 404);
    }

    let userModule = await UserModule.findOne({
      where: { userId, moduleId },
    });

    const findModule = await Module.findOne({
      where: {
        id: moduleId,
      },
    });

    if (!userModule) {
      userModule = await UserModule.create({
        userId,
        moduleId,
        chapterId: findModule.chapterId,
        isStudied: true,
      });
    } else {
      await userModule.update({ isStudied: true });
    }

    const userModules = await UserModule.findAll({
      where: { userId },
    });

    const totalStudiedModules = userModules.filter(
      (module) => module.isStudied
    ).length;

    const totalModulesInCourse = await Course.count({
      where: { id: courseId },
      include: {
        model: Chapter,
        include: Module,
      },
    });

    const totalProgress =
      totalModulesInCourse > 0
        ? (totalStudiedModules / totalModulesInCourse) * 100
        : 0;

    const userCourseRelation = await UserCourse.findOne({
      where: {
        userId,
        courseId,
      },
    });

    if (userCourseRelation) {
      await UserCourse.update(
        { totalProgress },
        {
          where: { userId, courseId },
        }
      );
    } else {
      await UserCourse.create({
        userId,
        courseId,
        totalProgress,
      });
    }

    res.status(200).json({
      success: true,
      message: "Module clicked successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getUserCourse = async (req, res, next) => {
  try {
    const { filterStatus } = req.query;
    const userId = req.user.id;

    let whereCondition = { userId };

    if (filterStatus) {
      whereCondition.filterStatus = filterStatus;
    }

    whereCondition.totalProgress = { [Op.lt]: 100.0 };

    const course = await UserCourse.findAll({
      where: whereCondition,
    });

    res.status(200).json({
      status: "success",
      message: "Sukses mengambil data course",
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createUserCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;
    if (!courseId || !userId) {
      throw new ApiError("All value fields are required", 400);
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new ApiError("Course ID not found!", 404);
    }
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError("User ID not found!", 404);
    }
    const userCourse = await UserCourse.create({
      userId,
      courseId,
    });

    res.status(201).json({
      status: "success",
      message: "User Course created successfully",
      data: {
        userCourse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    if (!courseId || !userId) {
      throw new ApiError("All value fields are required", 400);
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new ApiError("Course ID not found!", 404);
    }
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError("User ID not found!", 404);
    }

    const userCourse = await UserCourse.update({
      status: true,
      where: {
        courseId,
        userId,
      },
    });

    res.status(200).json({
      status: "success",
      message: "User Course updated successfully",
      data: {
        userCourse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    if (!courseId || !userId) {
      throw new ApiError("All value fields are required", 400);
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new ApiError("Course ID not found!", 404);
    }
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError("User ID not found!", 404);
    }

    const userCourse = await UserCourse.delete({
      where: {
        courseId,
        userId,
      },
    });

    res.status(200).json({
      status: "success",
      message: "User Course deleted successfully",
      data: {
        userCourse,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  clickModule,
  getUserCourse,
  createUserCourse,
  updateUserCourse,
  deleteUserCourse,
};
