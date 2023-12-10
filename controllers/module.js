const fs = require('fs');
const { Module } = require('../models');
const imagekit = require('../lib/imagekit');
const ApiError = require('../utils/apiError');
const { processVideo } = require('../utils/compress');

const createModule = async (req, res, next) => {
  try {
    const {
      no, name, description, chapterId, videoUrl,
    } = req.body;
    const { file } = req;
    if (!no || !name || !description || !chapterId) {
      throw new ApiError('All value fields are required', 400);
    }
    if (!file && !videoUrl) {
      throw new ApiError(
        'Please provide either a video file or a video URL.',
        400,
      );
    }
    let video;
    if (file) {
      const outputPath = `output-${file.filename}`;
      await processVideo(file.path, outputPath);
      fs.unlinkSync(file.path);
      const split = file.originalname.split('.');
      const fileType = split[split.length - 1];
      const fileData = fs.readFileSync(outputPath);
      const uploadVideo = await imagekit.upload({
        file: fileData.toString('base64'),
        fileName: `VID-${name}.${fileType}`,
        folder: '/gostudy/module-video',
      });
      video = uploadVideo;
      fs.unlinkSync(outputPath);
    } else {
      video = {
        url: videoUrl,
        fileId: null,
        duration: null,
      };
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

module.exports = { createModule };
