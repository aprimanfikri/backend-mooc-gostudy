const { Op } = require("sequelize");
const {
  UserCourse,
  UserModule,
  Course,
  Chapter,
  Module,
  Category,
} = require("../models");
const ApiError = require("../utils/apiError");
const transporter = require("../config/nodemailer");
const generateCertificate = require("./certificateController");

const openCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId },
      include: [
        {
          model: Chapter,
          include: Module,
        },
      ],
    });

    if (!course) {
      throw new ApiError("Course not found", 404);
    }

    const findUserCourse = await UserCourse.findOne({
      where: { userId, courseId },
    });

    if (
      findUserCourse &&
      findUserCourse.isAccessible === true &&
      course.type === "Premium"
    ) {
      course.Chapters.forEach((chapter) => {
        chapter.Modules.forEach((module) => {
          // eslint-disable-next-line no-param-reassign
          module.isUnlocked = true;
        });
      });
    }

    res.status(200).json({
      status: "success",
      message: `Course ${courseId} opened`,
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

const clickModule = async (req, res, next) => {
  try {
    const { moduleId, courseId } = req.params;
    const userId = req.user.id;

    if (!userId) {
      throw new ApiError("ID user tidak ada", 404);
    }

    const course = await Course.findOne({
      where: {
        id: courseId,
      },
      include: [
        {
          model: Chapter,
          include: Module,
        },
      ],
    });

    if (!course) {
      throw new ApiError("Course not found", 404);
    }

    const chapterIds = course.Chapters.map((chapter) => chapter.id);

    let userModule = await UserModule.findOne({
      where: { userId, moduleId },
    });

    const findModule = await Module.findOne({
      where: {
        id: moduleId,
      },
    });

    if (!findModule) {
      throw new ApiError("Module not found", 404);
    }

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
      where: { userId, chapterId: { [Op.in]: chapterIds } },
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
        {
          totalProgress,
          isAccessible:
            course.type === "Free" ? true : userCourseRelation.isAccessible,
        },
        {
          where: { userId, courseId },
        }
      );

      if (totalProgress === 100 && !userCourseRelation.certificateSent) {
        const modifiedPdfBytes = await generateCertificate(
          req.user.name,
          course.name
        );
        const fileName = `${req.user.name}-${course.name}.pdf`;
        const mailOptions = {
          from: process.env.NODEMAILER_EMAIL,
          to: req.user.email,
          subject: "Certificate of Completion",
          text: `Dear ${req.user.name},\n\nCongratulations! You have successfully completed the course: ${course.name}.\n\nPlease find your certificate attached.\n\nBest regards,\nGoStudy`,
          attachments: [
            {
              filename: fileName,
              content: modifiedPdfBytes,
              encoding: "base64",
            },
          ],
        };

        await transporter.sendMail(mailOptions);

        await userCourseRelation.update({ certificateSent: true });
      }
    } else {
      await UserCourse.create({
        userId,
        courseId,
        totalProgress,
        isAccessible: course.type === "Free",
      });
    }

    res.status(200).json({
      success: true,
      message: "Module clicked successfully",
      data: {
        module: {
          findModule,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserCourse = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const userId = req.user.id;

    const whereCondition = { userId };

    if (status === "in_progress") {
      whereCondition.totalProgress = { [Op.lt]: 100.0 };
    } else if (status === "selesai") {
      whereCondition.totalProgress = 100.0;
    }

    if (search) {
      whereCondition["$Course.name$"] = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const course = await UserCourse.findAll({
      where: whereCondition,
      include: [
        {
          model: Course,
          include: [
            {
              model: Category,
              as: "Category",
            },
          ],
        },
      ],
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

const updateUserCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isAccessible } = req.body;

    const userCourse = await UserCourse.findByPk(id);

    if (!userCourse) {
      throw new ApiError("History Course Not Found", 404);
    }

    await userCourse.update({
      isAccessible,
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

module.exports = {
  openCourse,
  clickModule,
  getUserCourse,
  updateUserCourse,
};
