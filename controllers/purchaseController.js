const { Purchase } = require("../models");
const ApiError = require("../utils/apiError");

const getAllPurchase = async (req, res, next) => {
  try {
    const Purchases = await Purchase.findAll();
    res.status(200).json({
      status: "success",
      data: {
        Purchases,
      },
    });
  } catch (error) {
    next(error);
  }
};

const findPurchaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Purchases = await Purchase.findByPk(id);
    if (!Purchases) {
      throw new ApiError("Purchase data not found!", 404);
    }
    res.status(200).json({
      status: "success",
      message: "Get purchase data by id success!",
      data: {
        Purchases,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createPurchase = async (req, res, next) => {
  try {
    const { price, paymentMethod, status, expiredAt, userId, courseId } =
      req.body;
    const newPurchase = await Purchase.create({
      price,
      paymentMethod,
      status,
      expiredAt,
      userId,
      courseId,
    });
    res.status(201).json({
      status: "success",
      message: "Purchase data created successfully!",
      data: {
        newPurchase,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updatePurchase = async (req, res, next) => {
  try {
    const { price, paymentMethod, status, expiredAt, userId, courseId } =
      req.body;
    const { id } = req.params;
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      throw new ApiError("Purchase data not found!", 404);
    }
    const updatedPhurchase = await purchase.update({
      price,
      paymentMethod,
      status,
      expiredAt,
      userId,
      courseId,
    });
    res.status(200).json({
      status: "success",
      message: "Purchase data has been updated!",
      data: {
        updatedPhurchase,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deletePurchase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      throw new ApiError("Purchase data not found!", 404);
    }
    await purchase.destroy();
    res.status(200).json({
      status: "Success",
      message: "Purchase data successfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPurchase,
  findPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
