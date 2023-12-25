const { Chapter, Course } = require("../models");
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
    const existingChapter = await Chapter.findOne({
      where: {
        noChapter,
        courseId,
      },
    });
    if (existingChapter) {
      throw new ApiError("Chapter with the same number already exists!", 409);
    }
    const newChapter = await Chapter.create({
      noChapter,
      name,
      courseId,
    });

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
    const { name } = req.body;
    const { id } = req.params;
    if (!name) {
      throw new ApiError("All value fields are required", 400);
    }
    const chapter = await Chapter.findByPk(id);
    if (!chapter) {
      throw new ApiError("Chapter not found", 404);
    }
    const updatedChapter = await chapter.update({
      name,
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

const getChapterByCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chapters = await Chapter.findAll({
      where: {
        courseId: id,
      },
      order: [["id", "ASC"]],
    });
    if (!chapters) {
      throw new ApiError("Chapter not found", 404);
    }
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

module.exports = {
  createChapter,
  updateChapter,
  deleteChapter,
  getAllChapters,
  getChapterById,
  getChapterByCourse,
};
