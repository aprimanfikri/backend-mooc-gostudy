const { Course } = require('../models');
const imagekit = require('../lib/imagekit');
const ApiError = require('../middlewares/errorHandler');

const createCourse = async (req, res) => {
  const {
    name,
    level,
    categoryId,
    description,
    classCode,
    totalModule,
    type,
    price,
    totalDuration,
    courseBy,
  } = req.body;

  const file = req.file;

  // Get extension file
  const split = file.originalname.split('.');
  const extension = split[split.length - 1];

  // Upload file to imagekit
  const img = await imagekit.upload({
    file: file.buffer,
    fileName: `IMG-${Date.now()}.${extension}`,
  });

  try {
    const newCourse = await Course.create({
      name,
      imageUrl: img.url,
      level,
      categoryId,
      description,
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
      data: {
        newCourse,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const updateCourse = async (req, res) => {
  const {
    name,
    level,
    categoryId,
    description,
    classCode,
    totalModule,
    type,
    price,
    totalDuration,
    courseBy,
  } = req.body;

  const file = req.file;
  let img;

  try {
    const courseId = req.params.id;
    if (!courseId) {
      return next(new ApiError('ID not found!', 404));
    }
    if (file) {
      // Get extension file
      const split = file.originalname.split('.');
      const extension = split[split.length - 1];

      // Upload file to imagekit
      img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });
    }
    const newCourse = await Course.update(
      {
        name,
        imageUrl: img.url,
        level,
        categoryId,
        description,
        classCode,
        totalModule,
        type,
        price,
        totalDuration,
        courseBy,
        createdBy: req.user.id,
      },
      { where: { id: courseId } }
    );
    res.status(200).json({
      status: 'success',
      message: 'Course Updated',
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    if (!courseId) {
      return next(new ApiError('ID not found!', 404));
    }

    await Course.destroy({ where: { id: courseId } });

    res.status(200).json({
      status: 'success',
      message: 'Course deleted',
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.findAll({ where: searchCriteria });

    res.status(200).json({
      status: 'success',
      data: {
        courses,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findOne({
      where: {
        id: courseId,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourse,
  getCourseById,
};
