const { Module } = require('../models');
const imagekit = require('../lib/imagekit');
const ApiError = require('../middlewares/errorHandler');

const createModule = async (req, res) => {
  const { no, name, description, chapterId } = req.body;

  const files = req.files;
  let video;
  try {
    if (!no || !name || !description || !chapterId) {
      throw new ApiError('All value fields are required', 400);
    }
    if (files) {
      files.map(async (file) => {
        // Get extension file
        const split = file.originalname.split('.');
        const extension = split[split.length - 1];

        // Upload file to imagekit
        video = await imagekit.upload({
          file: file.buffer,
          fileName: `VID-${Date.now()}.${extension}`,
        });
      });
    }

    const newModule = await Module.create({
      no,
      name,
      description,
      chapterId,
      videoUrl: video.url,
      duration: video.duration,
      createdBy: req.user.id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        newModule,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const updateModule = async (req, res) => {
  const { no, name, description, chapterId } = req.body;

  const files = req.files;
  let video;
  try {
    if (!no || !name || !description || !chapterId) {
      throw new ApiError('All value fields are required', 400);
    }

    const moduleId = req.params.id;
    if (!moduleId) {
      return next(new ApiError('ID not found!', 404));
    }

    if (files) {
      files.map(async (file) => {
        // Get extension file
        const split = file.originalname.split('.');
        const extension = split[split.length - 1];

        // Upload file to imagekit
        video = await imagekit.upload({
          file: file.buffer,
          fileName: `VID-${Date.now()}.${extension}`,
        });
      });
    }

    const newModule = await Module.update(
      {
        no,
        name,
        description,
        chapterId,
        videoUrl: video.url,
        duration: video.duration,
        createdBy: req.user.id,
      },
      {
        where: { id: moduleId },
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Module updated!',
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const deleteModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    if (!moduleId) {
      return next(new ApiError('ID not found!', 404));
    }

    await Module.destroy({ where: { id: moduleId } });

    res.status(200).json({
      status: 'success',
      message: 'Module deleted',
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const getAllModule = async (req, res) => {
  try {
    const modules = await Module.findAll({ where: searchCriteria });

    res.status(200).json({
      status: 'success',
      data: {
        modules,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const getModuleById = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const module = await Module.findOne({
      where: {
        id: moduleId,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        module,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

module.exports = {
  createModule,
  updateModule,
  deleteModule,
  getAllModule,
  getModuleById,
};
