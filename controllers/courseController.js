const { Course } = require('../models');
const imagekit = require('../lib/imagekit');
const ApiError = require('../utils/apiError');

const createCourse = async (req, res, next) => {
  try {
    const {
      name,
      level,
      categoryId,
      description,
      benefits,
      classCode,
      totalModule,
      type,
      price,
      totalDuration,
      courseBy,
    } = req.body;

    if (
      !name ||
      !level ||
      !categoryId ||
      !description ||
      !benefits ||
      !classCode ||
      !totalModule ||
      !type ||
      !price ||
      !totalDuration ||
      !courseBy
    ) {
      throw new ApiError('All value fields are required', 400);
    }
    if (classCode.length < 5) {
      throw new ApiError('Class code must be at least 5 characters', 400);
    }

    const course = await Course.findOne({ where: { name } });
    const file = req.file;
    const split = file.originalname.split('.');
    const fileType = split[split.length - 1];
    const uploadImage = await imagekit.upload({
      file: file.buffer.toString('base64'),
      fileName: `IMG-${name}.${fileType}`,
      folder: '/gostudy/course-image',
    });
    const newCourse = await Course.create({
      name,
      imageUrl: uploadImage.url,
      imageId: uploadImage.fileId,
      level,
      categoryId,
      description,
      benefits,
      classCode,
      totalModule,
      type,
      price,
      totalDuration,
      courseBy,
      createdBy: req.user.id,
    });
    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
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
      totalModule,
      type,
      price,
      totalDuration,
      courseBy,
    } = req.body;

    if (
      !name ||
      !level ||
      !categoryId ||
      !description ||
      !benefits ||
      !classCode ||
      !totalModule ||
      !type ||
      !price ||
      !totalDuration ||
      !courseBy
    ) {
      throw new ApiError('All value fields are required', 400);
    }
    if (classCode.length < 5) {
      throw new ApiError('Class code must be at least 5 characters', 400);
    }

    const file = req.file;
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) {
      throw new ApiError('Course not found', 404);
    }
    let image;
    if (file) {
      const split = file.originalname.split('.');
      const fileType = split[split.length - 1];
      if (course.imageId) {
        await imagekit.deleteFile(course.imageId);
      }
      const uploadImage = await imagekit.upload({
        file: file.buffer.toString('base64'),
        fileName: `${course.name}.${fileType}`,
        folder: '/gostudy/course-image',
      });
      image = uploadImage;
    }
    const updatedCourse = await course.update({
      name,
      imageUrl: image.url,
      imageId: image.fileId,
      level,
      categoryId,
      description,
      benefits,
      classCode,
      totalModule,
      type,
      price,
      totalDuration,
      courseBy,
      createdBy: req.user.id,
    });
    res.status(200).json({
      status: 'success',
      message: 'Course updated successfully',
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
      throw new ApiError('Course not found', 404);
    }
    if (course.imageId) {
      await imagekit.deleteFile(course.imageId);
    }
    await course.destroy();
    res.status(200).json({
      status: 'success',
      message: 'Course deleted',
    });
  } catch (error) {
    next(error);
  }
};

const getAllCourse = async (req, res, next) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json({
      status: 'success',
      message: 'All courses fetched successfully',
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
    const course = await Course.findByPk(id);
    if (!course) {
      throw new ApiError('Course not found', 404);
    }
    res.status(200).json({
      status: 'success',
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
