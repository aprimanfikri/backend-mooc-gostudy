const { Category } = require("../models");
const ApiError = require("../utils/apiError");
const imagekit = require("../lib/imagekit");

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (!name) {
      throw new ApiError("Name is required", 400);
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
      folder: "/gostudy/category-image",
    });
    const newCat = await Category.create({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "_"),
      imageUrl: uploadImage.url,
      imageId: uploadImage.fileId,
    });
    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: {
        newCat,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (!name) {
      throw new ApiError("Name is required", 400);
    }
    const { file } = req;
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      throw new ApiError("Category not found!", 404);
    }
    if (file && file.size > MAX_FILE_SIZE) {
      throw new ApiError("File size exceeds the limit (5MB)", 400);
    }
    let image;
    if (file) {
      const split = file.originalname.split(".");
      const fileType = split[split.length - 1];
      const uploadImage = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: `IMG-${name}.${fileType}`,
        folder: "/gostudy/category-image",
      });
      image = uploadImage;
      if (category.imageId) {
        await imagekit.deleteFile(category.imageId);
      }
    }
    const updatedCategory = await category.update({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "_"),
      imageUrl: image.url,
      imageId: image.fileId,
    });
    res.status(200).json({
      status: "success",
      message: "Category updated!",
      data: {
        updatedCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      throw new ApiError("Category not found!", 404);
    }
    if (!category.imageId) {
      await imagekit.deleteFile(category.imageId);
    }
    await category.destroy();
    res.status(200).json({
      status: "success",
      message: "Category deleted!",
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      status: "success",
      message: "All categories fetched succesfully",
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      throw new ApiError("Category not found!", 404);
    }
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
};
