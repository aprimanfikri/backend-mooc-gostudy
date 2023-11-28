const { Module } = require('../models');
const imagekit = require('../lib/imagekit');
const ApiError = require('../utils/apiError');

const createModule = async (req, res) => {
  const { no, name, description, chapterId } = req.body;

  const files = req.files;
  let video;
  try {
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
      videoId: video.fileId,
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
    next(error);
  }
};

const updateModule = async (req, res) => {
  const { no, name, description, chapterId } = req.body;

  const files = req.files;
  let video;
  try {
    const moduleId = req.params.id;
    if (!moduleId) {
      return next(new ApiError('ID not found!', 404));
    }
    let video;
    if (file) {
      const split = file.originalname.split('.');
      const fileType = split[split.length - 1];
      if (module.videoId) {
        await imagekit.deleteFile(module.videoId);
      }
      const uploadVideo = await imagekit.upload({
        file: file.buffer,
        fileName: `VID-${Date.now()}.${fileType}`,
        folder: '/gostudy/module-video',
      });
      video = uploadVideo;
    } else {
      video = {
        url: videoUrl,
        fileId: null,
        duration: null,
      };
    }
    const updatedModule = await module.update({
      no,
      name,
      description,
      chapterId,
      videoUrl: video.url,
      videoId: video.fileId,
      duration: video.duration,
      createdBy: req.user.id,
    });

    res.status(200).json({
      status: 'success',
      message: 'Module updated!',
      data: {
        updatedModule,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const module = await Module.findByPk(id);
    if (!module) {
      throw new ApiError('Module not found!', 404);
    }
    if (module.videoId) {
      await imagekit.deleteFile(module.videoId);
    }
    await module.destroy();
    res.status(200).json({
      status: 'success',
      message: 'Module deleted',
    });
  } catch (error) {
    next(error);
  }
};

const getAllModule = async (req, res, next) => {
  try {
    const modules = await Module.findAll();
    res.status(200).json({
      status: 'success',
      message: 'Get all modules successfully',
      data: {
        modules,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getModuleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const module = await Module.findByPk(id);
    if (!module) {
      throw new ApiError('Module not found!', 404);
    }
    res.status(200).json({
      status: 'success',
      message: 'Get module by id successfully',
      data: {
        module,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createModule,
  updateModule,
  deleteModule,
  getAllModule,
  getModuleById,
};
