const { Op } = require("sequelize");
const { Course, Category, Chapter, Module } = require("../models");
const imagekit = require("../lib/imagekit");
const ApiError = require("../utils/apiError");

const createCourse = async (req, res, next) => {
  try {
    const {
      name,
      level,
      categoryId,
      description,
      benefits,
      classCode,
      type,
      price,
      promoPercentage,
      courseBy,
      rating,
    } = req.body;

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (
      !name ||
      !level ||
      !categoryId ||
      !description ||
      !benefits ||
      !classCode ||
      !type ||
      !price ||
      !courseBy
    ) {
      throw new ApiError("All value fields are required", 400);
    }
    if (classCode.length < 5) {
      throw new ApiError("Class code must be at least 5 characters", 400);
    }

    const course = await Course.findOne({ where: { name } });
    if (course) {
      throw new ApiError("Course name already exist", 400);
    }
    const { file } = req;
    if (!file) {
      throw new ApiError("Image is required", 400);
    }
    if (file && file.size > MAX_FILE_SIZE) {
      throw new ApiError("File size exceeds the limit (5MB)", 400);
    }
    const split = file.originalname.split(".");
    const fileType = split[split.length - 1];
    const uploadImage = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: `IMG-${name}.${fileType}`,
      folder: "/gostudy/course-image",
    });

    const benefitsArray = benefits.split(",");
    const newCourse = await Course.create({
      name,
      imageUrl: uploadImage.url,
      imageId: uploadImage.fileId,
      level,
      categoryId,
      description,
      benefits: benefitsArray,
      classCode,
      type,
      price,
      promoPercentage,
      courseBy,
      rating,
      createdBy: req.user.id,
    });
    res.status(201).json({
      status: "success",
      message: "Course created successfully",
      data: {
        newCourse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const {
      name,
      level,
      categoryId,
      description,
      benefits,
      classCode,
      type,
      price,
      promoPercentage,
      courseBy,
      rating,
    } = req.body;
    let benefitsArray;
    if (benefits) {
      benefitsArray = benefits.split(",");
    }
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const { file } = req;
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      throw new ApiError("Course not found", 404);
    }

    if (file && file.size > MAX_FILE_SIZE) {
      throw new ApiError("File size exceeds the limit (5MB)", 400);
    }

    let image = {
      url: course.imageUrl,
      fileId: course.imageId,
    };

    if (file) {
      const split = file.originalname.split(".");
      const fileType = split[split.length - 1];
      const uploadImage = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: `${course.name}.${fileType}`,
        folder: "/gostudy/course-image",
      });

      image = {
        url: uploadImage.url,
        fileId: uploadImage.fileId,
      };
    }

    const updatedCourse = await course.update({
      name,
      imageUrl: image.url,
      imageId: image.fileId,
      level,
      categoryId,
      description,
      benefits: benefitsArray,
      classCode,
      type,
      price,
      promoPercentage,
      courseBy,
      rating,
      createdBy: req.user.id,
    });

    res.status(200).json({
      status: "success",
      message: "Course updated successfully",
      data: {
        updatedCourse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) {
      throw new ApiError("Course not found", 404);
    }
    if (course.imageId) {
      await imagekit.deleteFile(course.imageId);
    }
    await course.destroy();
    res.status(200).json({
      status: "success",
      message: "Course deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getAllCourse = async (req, res, next) => {
  try {
    const { level, type, categoryName, createdAt, promo, search } = req.query;
    const searchCriteria = {};

    const validLevels = ["Beginner", "Intermediate", "Advanced"];
    if (level && validLevels.includes(level)) {
      searchCriteria.level = level;
    }
    const validTypes = ["Free", "Premium"];
    if (type && validTypes.includes(type)) {
      searchCriteria.type = type;
    }
    if (categoryName) {
      const categoryNames = categoryName.split(",").map((name) => name.trim());
      searchCriteria["$Category.name$"] = {
        [Op.iLike]: { [Op.any]: categoryNames },
      };
    }
    if (createdAt && createdAt.trim().toLowerCase() === "true") {
      searchCriteria.createdAt = {
        [Op.lte]: new Date(),
      };
    }
    if (promo && promo.toLowerCase() === "true") {
      searchCriteria.promoPercentage = {
        [Op.ne]: 0,
      };
    }
    if (search) {
      searchCriteria.name = { [Op.iLike]: `%${search}%` };
    }

    const orderDirection =
      createdAt && createdAt.trim().toLowerCase() === "true" ? "ASC" : "DESC";

    const courses = await Course.findAll({
      where: searchCriteria,
      include: [
        { model: Category, as: "Category" },
        {
          model: Chapter,
          include: Module,
        },
      ],
      order: [["createdAt", orderDirection]],
    });

    res.status(200).json({
      status: "success",
      message: "All courses fetched successfully",
      data: {
        courses,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findOne({
      where: { id },
      include: {
        model: Chapter,
        include: Module,
      },
    });
    if (!course) {
      throw new ApiError("Course not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "Course found!",
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourse,
  getCourseById,
};
