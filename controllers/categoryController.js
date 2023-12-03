const { Category } = require('../models');
const ApiError = require('../middlewares/errorHandler');

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return next(new ApiError('Name is required', 400));
    }

    const newCat = await Category.create({
      name,
    });

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: {
        newCat,
      },
    });
  } catch {
    return next(new ApiError(error.message, 400));
  }
};

const updateCategory = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return next(new ApiError('Name is required', 400));
    }
    const catId = req.params.id;
    const categoryExist = Category.findByPk(catId);
    if (!categoryExist) {
      return next(new ApiError('Category not found!', 404));
    }

    const newCat = await Category.update(
      {
        name,
      },
      {
        where: { id: catId },
      }
    );

    res.status(201).json({
      status: 'success',
      message: 'Category updated!',
    });
  } catch {
    return next(new ApiError(error.message, 400));
  }
};

const deleteCategory = async (req, res) => {
  try {
    const catId = req.params.id;
    const categoryExist = Category.findByPk(catId);
    if (!categoryExist) {
      return next(new ApiError('Category not found!', 404));
    }

    await Category.destroy({
      where: { id: catId },
    });

    res.status(201).json({
      status: 'success',
      message: 'Category deleted!',
    });
  } catch {
    return next(new ApiError(error.message, 400));
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      status: 'success',
      message: 'All categories fetched succesfully',
      data: {
        categories,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const getCategoryById = async (req, res) => {
  try {
    const catId = req.params.id;
    const categoryExist = Category.findByPk(catId);
    if (!categoryExist) {
      return next(new ApiError('Category not found!', 404));
    }

    const category = await Category.findOne({
      where: {
        id: catId,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
};
