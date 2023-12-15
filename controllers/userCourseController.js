const { Op } = require("sequelize");
const { UserCourse, UserModule, Course, User } = require("../models");
const ApiError = require("../utils/apiError");

const clickModule = async (req, res, next) => {
  try {
    const { moduleId, courseId } = req.params;
    const userId = req.user.id;

    if (!userId) {
      throw new ApiError("ID user tidak ada", 404);
    }

    // Cek apakah UserModule sudah ada
    let userModule = await UserModule.findOne({
      where: { userId, moduleId },
    });

    if (!userModule) {
      // Jika belum ada, buat UserModule baru
      userModule = await UserModule.create({
        userId,
        moduleId,
        isStudied: true, // Setelah mengklik, anggap sudah belajar
      });
    } else {
      // Jika sudah ada, set isStudied menjadi true
      await userModule.update({ isStudied: true });
    }

    // Hitung total progress dan update UserCourse
    const userModules = await UserModule.findAll({
      where: { userId },
    });

    const totalStudiedModules = userModules.filter(
      (module) => module.isStudied
    ).length;
    const totalModules = userModules.length;

    // Hitung persentase progress
    const totalProgress = (totalStudiedModules / totalModules) * 100;
    await UserCourse.update(
      { totalProgress },
      {
        where: { userId, courseId },
      }
    );

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
