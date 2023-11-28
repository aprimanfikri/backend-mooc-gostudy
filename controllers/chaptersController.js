const { Chapter, Course } = require("../models");
const ApiError = require("../utils/apiError");

const createChapter = async (req, res, next) => {
  const { noChapter, name, courseId } = req.body;

  try {
    if (!noChapter || !name || !courseId) {
      return res.status(400).json({
        status: "Failed",
        message: "Atribute tidak boleh kosong",
      });
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

    res.status(201).json({
      status: "success",
      message: "Course created successfully",
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
      return res.status(400).json({
        status: "Failed",
        message: "Atribute tidak boleh kosong",
      });
    }
    const chapter = await Chapter.findByPk(id);
    if (!chapter) {
      throw new ApiError("Chapter not found", 404);
    }

    const updatedChapter = await Chapter.update(
      {
        noChapter,
        name,
        courseId,
      },
      {
        where: {
          id,
        },
      }
    );
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
