const { Op } = require("sequelize");
const { UserCourse, UserModule } = require("../models");
const ApiError = require("../utils/apiError");

const progressVideo = async (req, res, next) => {
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
        isUnlocked: true, // Anda mungkin perlu menyesuaikan sesuai dengan logika aplikasi Anda
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

module.exports = {
  progressVideo,
  getUserCourse,
};
