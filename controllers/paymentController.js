const midtransClient = require("midtrans-client");
const crypto = require("crypto");
const { Purchase, Course } = require("../models");
const ApiError = require("../utils/apiError");

const createTransaction = async (req, res, next) => {
  const { price, courseId } = req.body;

  try {
    const course = await Course.findOne({
      where: {
        id: courseId,
      },
      include: ["Category"],
    });

    const createPayment = await Purchase.create({
      userId: req.user.id,
      courseId,
      price,
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
        name: req.user.name,
        email: req.user.email,
      },
      // item_details: {
      //   course_name: course.name,
      //   level: course.level,
      //   category: course.Category.name,
      //   class_code: course.classCode,
      // },
    });

    console.log(transaction);

    const dataPayment = {
      res: JSON.stringify(transaction),
    };

    res.status(200).json({
      status: "success",
      message: "Transaction dalam proses",
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
  const { id, status_code, gross_amount, signature_key, transaction_status } =
    req.body;

  try {
    const serverKey = process.env.SERVER_KEY;
    const hashed = crypto
      .createHash("sha512")
      .update(id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hashed === signature_key) {
      if (transaction_status === "settlement") {
        const payment = await Purchase.findOne({ where: { id } });
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
    const payment = await Purchase.findOne({
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

module.exports = {
  createTransaction,
  paymentCallback,
  getPaymentDetail,
};
