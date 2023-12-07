const midtransClient = require("midtrans-client");
const crypto = require("crypto");
const { Payment, Course } = require("../models");
const ApiError = require("../utils/apiError");

const createTransaction = async (req, res, next) => {
  const { courseId } = req.body;

  try {
    const course = await Course.findOne({
      where: {
        id: courseId,
      },
      include: ["Category"],
    });

    const createPayment = await Payment.create({
      userId: req.user.id,
      courseId,
      price: course.price,
    });

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.SERVER_KEY,
      clientKey: process.env.CLIENT_KEY,
    });

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: createPayment.id,
        gross_amount: createPayment.price,
      },
      customer_details: {
        first_name: req.user.name,
        email: req.user.email,
        phone: req.user.phoneNumber,
      },
      item_details: {
        id: course.id,
        price: course.price,
        name: course.name,
        category: course.Category.name,
        quantity: 1,
      },
    });

    console.log(transaction);

    const dataPayment = {
      res: JSON.stringify(transaction),
    };

    res.status(200).json({
      status: "success",
      message: "Transaksi dalam proses",
      data: {
        dataPayment,
      },
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    next(error);
  }
};

const paymentCallback = async (req, res, next) => {
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
  } = req.body;

  try {
    const serverKey = process.env.SERVER_KEY;
    const hashed = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hashed === signature_key) {
      if (transaction_status === "settlement") {
        const payment = await Payment.findOne({ where: { id: order_id } });
        if (!payment) throw new ApiError("Transaksi tidak ada", 404);

        payment.status = "paid";
        await payment.save();
      }
    }

    res.status(200).json({
      status: "success",
      message: "Transaksi sukses!",
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentDetail = async (req, res, next) => {
  const id = req.params.id;

  try {
    const payment = await Payment.findOne({
      id,
    });

    res.status(200).json({
      data: {
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllPayment = async (req, res, next) => {
  try {
    const purchases = await Payment.findAll();
    res.status(200).json({
      status: "success",
      data: {
        purchases,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  paymentCallback,
  getPaymentDetail,
  getAllPayment,
};
