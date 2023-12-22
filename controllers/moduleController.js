const fs = require('fs');
const { Module, Chapter, Course } = require('../models');
const imagekit = require('../lib/imagekit');
const ApiError = require('../utils/apiError');
const { processVideo } = require('../utils/compress');
const { isoDuration, getYouTubeVideoId } = require('../utils/yt');

const { GOOGLE_API_KEY, GOOGLE_BASE_URL } = process.env;

const createModule = async (req, res, next) => {
  try {
    const { noModule, name, description, chapterId, videoUrl, isUnlocked } =
      req.body;
    if (!noModule || !name || !description || !chapterId) {
      throw new ApiError('All value fields are required', 400);
    }

    const { file } = req;
    if (!file && !videoUrl) {
      throw new ApiError(
        'Please provide either a video file or a video URL.',
        400
      );
    }
    const existingModule = await Module.findOne({
      where: {
        noModule,
        chapterId,
      },
    });

    if (existingModule) {
      throw new ApiError(
        'Module with the same number already exists in this chapter',
        409
      );
    }

    let video;
    if (file) {
      const split = file.originalname.split('.');
      const fileType = split[split.length - 1];
      const uploadVideo = await imagekit.upload({
        file: file.buffer.toString('base64'),
        fileName: `VID-${name}.${fileType}`,
        folder: '/gostudy/module-video',
      });
      video = uploadVideo;
    } else {
      const videoId = getYouTubeVideoId(videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube video URL');
      }
      if (!videoId) {
        throw new Error('Invalid YouTube video URL', 404);
      }
      const params = {
        part: 'contentDetails',
        id: videoId,
        key: GOOGLE_API_KEY,
      };
      const queryString = new URLSearchParams(params).toString();
      const fullUrl = `${GOOGLE_BASE_URL}?${queryString}`;
      const headers = {
        Accept: 'application/json',
      };
      const getData = await fetch(fullUrl, {
        headers,
      });
      const data = await getData.json();
      const durationInSeconds = isoDuration(
        data?.items[0]?.contentDetails?.duration
      );
      video = {
        url: videoUrl,
        fileId: null,
        duration: durationInSeconds,
      };
    }

    const newModule = await Module.create({
      noModule,
      name,
      description,
      chapterId,
      videoUrl: video.url,
      videoId: video.fileId,
      duration: video.duration,
      createdBy: req.user.id,
      isUnlocked,
    });

    const chapter = await Chapter.findOne({
      where: {
        id: newModule.chapterId,
      },
    });

    const moduleCount = await Module.count({
      include: [
        {
          model: Chapter,
          where: {
            courseId: chapter.courseId,
          },
        },
      ],
    });

    const course = await Course.findByPk(chapter.courseId);

    course.totalModule = moduleCount;

    if (newModule.duration) {
      const total = course.totalDuration + newModule.duration;
      course.totalDuration = total;
    }

    await course.save();

    const updatedChapter = await Chapter.findOne({
      where: {
        id: newModule.chapterId,
      },
    });

    const updatedModuleCount = await Module.count({
      where: {
        chapterId: updatedChapter.id,
      },
    });

    updatedChapter.totalModule = updatedModuleCount;

    if (newModule.duration) {
      const updatedTotalDuration =
        updatedChapter.totalDuration + newModule.duration;
      updatedChapter.totalDuration = updatedTotalDuration;
    }

    await updatedChapter.save();

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

const updateModule = async (req, res, next) => {
  try {
    const { noModule, name, description, chapterId, videoUrl, isUnlocked } =
      req.body;

    const { id } = req.params;
    const { file } = req;
    const module = await Module.findByPk(id);
    if (!module) {
      throw new ApiError('Module not found!', 404);
    }

    let video;
    if (file) {
      const split = file.originalname.split('.');
      const fileType = split[split.length - 1];
      const uploadVideo = await imagekit.upload({
        file: file.buffer,
        fileName: `VID-${Date.now()}.${fileType}`,
        folder: '/gostudy/module-video',
      });
      video = uploadVideo;
    } else {
      const videoId = getYouTubeVideoId(videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube video URL', 404);
      }
      const params = {
        part: 'contentDetails',
        id: videoId,
        key: GOOGLE_API_KEY,
      };
      const queryString = new URLSearchParams(params).toString();
      const fullUrl = `${GOOGLE_BASE_URL}?${queryString}`;
      const headers = {
        Accept: 'application/json',
      };
      const getData = await fetch(fullUrl, {
        headers,
      });
      const data = await getData.json();
      const durationInSeconds = isoDuration(
        data?.items[0]?.contentDetails?.duration
      );
      video = {
        url: videoUrl,
        fileId: null,
        duration: durationInSeconds,
      };
    }

    const chapter = await Chapter.findOne({
      where: {
        id: module.chapterId,
      },
    });

    const course = await Course.findByPk(chapter.courseId);

    if (video.duration) {
      const total = course.totalDuration - module.duration;
      const totalDuration = total + video.duration;
      course.totalDuration = totalDuration;
    } else {
      const total = course.totalDuration - module.duration;
      course.totalDuration = total;
    }

    await course.save();

    if (video.duration) {
      const total = chapter.totalDuration - module.duration;
      const totalDuration = total + video.duration;
      chapter.totalDuration = totalDuration;
    } else {
      const total = chapter.totalDuration - module.duration;
      chapter.totalDuration = total;
    }

    await chapter.save();

    const updatedModule = await module.update({
      noModule,
      name,
      description,
      chapterId,
      videoUrl: video.url,
      videoId: video.fileId,
      duration: video.duration,
      createdBy: req.user.id,
      isUnlocked,
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
    // if (module.videoId) {
    //   await imagekit.deleteFile(module.videoId);
    // }
    const chapter = await Chapter.findByPk(module.chapterId);

    const course = await Course.findByPk(chapter.courseId);

    if (module.duration) {
      const total = chapter.totalDuration - module.duration;
      chapter.totalDuration = total;
    }

    if (module.duration) {
      const total = course.totalDuration - module.duration;
      course.totalDuration = total;
    }

    chapter.totalModule -= 1;

    course.totalModule -= 1;

    await chapter.save();

    await course.save();

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

const createModuleV2 = async (req, res, next) => {
  try {
    const { noModule, name, description, chapterId, videoUrl, status } =
      req.body;
    const { file } = req;
    if (!noModule || !name || !description || !chapterId) {
      throw new ApiError('All value fields are required', 400);
    }
    if (!file && !videoUrl) {
      throw new ApiError(
        'Please provide either a video file or a video URL.',
        400
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
      noModule,
      name,
      description,
      chapterId,
      videoUrl: video.url,
      videoId: video.fileId,
      duration: video.duration,
      createdBy: req.user.id,
      status,
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

module.exports = {
  createModule,
  updateModule,
  deleteModule,
  getAllModule,
  getModuleById,
  createModuleV2,
};
