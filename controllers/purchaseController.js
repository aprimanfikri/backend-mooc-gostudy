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
    const Purchases = await Purchase.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!Purchases) {
      throw new ApiError("Purchase data not found!", 404);
    }

    res.status(201).json({
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
    const updatedPurchases = await Purchase.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!updatedPurchases) {
      throw new ApiError("Purchase data not found!", 404);
    }

    const purchase = await Purchase.update(
      {
        price,
        paymentMethod,
        status,
        expiredAt,
        userId,
        courseId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      status: "success",
      message: "Purchase data has been updated!",
      data: {
        purchase,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deletePurchase = async (req, res, next) => {
  try {
    const deletedPurchase = await Purchase.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedPurchase) {
      throw new ApiError("Purchase data not found!", 404);
    }

    await Purchase.destroy({
      where: {
        id: req.params.id,
      },
    });

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
