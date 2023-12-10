const { Chapter, Course, Module } = require("../models");
const ApiError = require("../utils/apiError");

const createChapter = async (req, res, next) => {
  const { noChapter, name, courseId } = req.body;
  try {
    if (!noChapter || !name || !courseId) {
      throw new ApiError("All value fields are required", 400);
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new ApiError("Course ID not found!", 404);
    }
    const newChapter = await Chapter.create({
      noChapter,
      name,
      courseId,
    });

    const module = await Module.findOne({
      where: {
        chapterId: newChapter.id,
      },
    });

    const moduleCount = await Module.count({
      where: {
        chapterId: newChapter.id,
      },
    });

    const totalDuration = module ? module.duration : 0;

    await Course.update(
      {
        totalModule: moduleCount,
        totalDuration,
      },
      {
        where: {
          id: courseId,
        },
      }
    );

    res.status(201).json({
      status: "success",
      message: "Chapter created successfully",
      data: {
        newChapter,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateChapter = async (req, res, next) => {
  try {
    const { noChapter, name, courseId } = req.body;
    const { id } = req.params;
    if (!noChapter || !name || !courseId) {
      throw new ApiError("All value fields are required", 400);
    }
    const chapter = await Chapter.findByPk(id);
    if (!chapter) {
      throw new ApiError("Chapter not found", 404);
    }
    const updatedChapter = await chapter.update({
      noChapter,
      name,
      courseId,
    });
    res.status(200).json({
      status: "success",
      message: "Chapter updated successfully",
      data: {
        updatedChapter,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.findByPk(id);
    if (!chapter) {
      throw new ApiError("Chapter not found", 404);
    }
    await chapter.destroy();
    res.status(200).json({
      status: "success",
      message: "Chapter deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getAllChapters = async (req, res, next) => {
  try {
    const chapters = await Chapter.findAll();
    res.status(200).json({
      status: "success",
      message: "All chapters fetched successfully",
      data: {
        chapters,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getChapterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.findByPk(id);
    if (!chapter) {
      throw new ApiError("Chapter not found", 404);
    }
    res.status(200).json({
      status: "success",
      data: {
        chapter,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChapter,
  updateChapter,
  deleteChapter,
  getAllChapters,
  getChapterById,
};
