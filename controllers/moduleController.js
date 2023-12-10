const { Module, Chapter, Course } = require("../models");
const imagekit = require("../lib/imagekit");
const ApiError = require("../utils/apiError");

const createModule = async (req, res, next) => {
  try {
    const { no, name, description, chapterId, videoUrl } = req.body;
    const file = req.file;
    if (!no || !name || !description || !chapterId) {
      throw new ApiError("All value fields are required", 400);
    }
    if (!file && !videoUrl) {
      throw new ApiError(
        "Please provide either a video file or a video URL.",
        400
      );
    }
    let video;
    if (file) {
      const split = file.originalname.split(".");
      const fileType = split[split.length - 1];
      const uploadVideo = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: `VID-${name}.${fileType}`,
        folder: "/gostudy/module-video",
      });
      video = uploadVideo;
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

    const chapter = await Chapter.findOne({
      where: {
        id: newModule.chapterId,
      },
    });

    const moduleCount = await Module.count({
      where: {
        chapterId: chapter.id,
      },
    });

    const existingModuleDuration = await Module.sum("duration", {
      where: {
        chapterId: chapter.id,
      },
    });

    const totalDuration = existingModuleDuration + (newModule.duration || 0);

    await Course.update(
      {
        totalModule: moduleCount,
        totalDuration,
      },
      {
        where: {
          id: chapter.courseId,
        },
      }
    );

    res.status(201).json({
      status: "success",
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
    const { no, name, description, chapterId, videoUrl } = req.body;
    const { id } = req.params;
    const file = req.file;
    const module = await Module.findByPk(id);
    if (!module) {
      throw new ApiError("Module not found!", 404);
    }
    if (!no || !name || !description || !chapterId) {
      throw new ApiError("All value fields are required", 400);
    }
    let video;
    if (file) {
      const split = file.originalname.split(".");
      const fileType = split[split.length - 1];
      if (module.videoId) {
        await imagekit.deleteFile(module.videoId);
      }
      const uploadVideo = await imagekit.upload({
        file: file.buffer,
        fileName: `VID-${Date.now()}.${fileType}`,
        folder: "/gostudy/module-video",
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
      status: "success",
      message: "Module updated!",
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
      throw new ApiError("Module not found!", 404);
    }
    if (module.videoId) {
      await imagekit.deleteFile(module.videoId);
    }
    await module.destroy();
    res.status(200).json({
      status: "success",
      message: "Module deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getAllModule = async (req, res, next) => {
  try {
    const modules = await Module.findAll();
    res.status(200).json({
      status: "success",
      message: "Get all modules successfully",
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
      throw new ApiError("Module not found!", 404);
    }
    res.status(200).json({
      status: "success",
      message: "Get module by id successfully",
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
