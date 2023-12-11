const midtransClient = require("midtrans-client");
const crypto = require("crypto");
const { Payment, Course, UserCourse } = require("../models");
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

    if (!course) {
      throw new ApiError("Course not found!", 404);
    }

    const createPayment = await Payment.create({
      userId: req.user.id,
      courseId,
      price: course.price,
    });

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
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

    const dataPayment = {
      res: JSON.stringify(transaction),
    };

    res.status(201).json({
      status: "success",
      message: "Transaksi dibuat!",
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
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
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

        const userCourseData = {
          userId: payment.userId,
          courseId: payment.courseId,
          isAccessible: true,
        };

        const newUserCourse = await UserCourse.create(userCourseData);
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
      status: "success",
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
    const payments = await Payment.findAll();
    res.status(200).json({
      status: "success",
      data: {
        payments,
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
