const {
  UserCourse,
  UserModule,
  Course,
  Chapter,
  Module,
} = require("../models");
const ApiError = require("../utils/apiError");

const openCourse = async (req, res, next) => {
  try {
    const { user } = req;
    const courseId = req.params.id;

    const course = await Course.findByPk(courseId);

    if (!course) {
      return next(new ApiError("Course tidak ditemukan", 404));
    }

    const userCourseRelation = {
      include: [
        {
          model: Course,
          include: [
            {
              model: Chapter,
              attributes: ["id", "noChapter", "name"],
              include: [
                {
                  model: Module,
                  attributes: [
                    "id",
                    "noModule",
                    "name",
                    "videoUrl",
                    "duration",
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    };

    const [userCourse, created] = await UserCourse.findOrCreate({
      where: {
        userId: user.id,
        courseId,
      },
      defaults: {
        userId: user.id,
        courseId,
        isAccessible: course.type === "Free",
        totalProgress: 0.0,
      },
      include: userCourseRelation.include,
      order: userCourseRelation.order,
    });

    if (!created) {
      return res.status(200).json({
        status: "Success",
        message: "Berhasil mendapatkan detail course user",
        data: {
          userCourse,
        },
      });
    }

    const userCourseBuffer = await UserCourse.findByPk(userCourse.id, {
      include: [
        {
          model: Course,
          include: [
            {
              model: Chapter,
              attributes: ["id", "noChapter", "name"],
              include: [
                {
                  model: Module,
                  attributes: [
                    "id",
                    "noModule",
                    "name",
                    "videoUrl",
                    "duration",
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (
      userCourseBuffer &&
      userCourseBuffer.Course &&
      userCourseBuffer.Course.chapters
    ) {
      const chapters = userCourseBuffer.Course.chapters;

      if (Array.isArray(chapters) && chapters.length > 0) {
        // Iterasi setiap chapter
        await Promise.all(
          chapters.map(async (chapter, chapterIndex) => {
            if (
              chapter.Modules &&
              Array.isArray(chapter.Modules) &&
              chapter.Modules.length > 0
            ) {
              // Iterasi setiap module dalam chapter
              await Promise.all(
                chapter.Modules.map(async (module, moduleIndex) => {
                  try {
                    // Pastikan module.id dan chapter.id telah terdefinisi
                    if (module.id !== undefined && chapter.id !== undefined) {
                      await UserModule.create({
                        userId: user.id,
                        moduleId: module.id,
                        chapterId: chapter.id,
                        isUnlocked: moduleIndex === 0 && chapterIndex === 0,
                      });
                    }
                  } catch (error) {
                    return next(new ApiError(error.message, 500));
                  }
                })
              );
            }
          })
        );
      }
    }

    const newUserCourse = await UserCourse.findByPk(userCourse.id, {
      include: userCourseRelation.include,
      order: userCourseRelation.order,
    });

    res.status(200).json({
      status: "Success",
      message: "Berhasil mengikuti course",
      data: {
        userCourse: newUserCourse,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

module.exports = openCourse;
