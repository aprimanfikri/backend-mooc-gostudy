const { Category } = require('../models');
const ApiError = require('../middlewares/errorHandler');

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const newCat = await Category.create({
      name,
    });

    res.status(201).json({
      status: 'success',
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
    const catId = req.params.id;
    if (catId) {
      return next(new ApiError('ID not found!', 404));
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
    if (catId) {
      return next(new ApiError('ID not found!', 404));
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
