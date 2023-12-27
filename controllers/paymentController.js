const midtransClient = require("midtrans-client");
const crypto = require("crypto");
const { Payment, Course, UserCourse, Category, User } = require("../models");
const ApiError = require("../utils/apiError");

const createTransaction = async (req, res, next) => {
  const { courseId } = req.body;
  let totalPrice;

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

    if (course.promoPercentage !== 0) {
      const discountPrice = course.price * (course.promoPercentage / 100);
      totalPrice = course.price - discountPrice;
    } else {
      totalPrice = course.price;
    }

    const orderId = `ORDER-${course.classCode}-${req.user.id}-${Date.now()}`;

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: totalPrice,
      },
      customer_details: {
        first_name: req.user.name,
        email: req.user.email,
        phone: req.user.phoneNumber,
      },
      item_details: {
        id: course.id,
        price: totalPrice,
        name: course.name,
        category: course.Category.name,
        quantity: 1,
      },
    });

    const createPayment = await Payment.create({
      orderId,
      userId: req.user.id,
      courseId,
      price: totalPrice,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });

    res.status(201).json({
      status: "success",
      message: "Transaksi dibuat!",
      data: {
        createPayment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* eslint-disable camelcase */
const paymentCallback = async (req, res, next) => {
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
    settlement_time,
    transaction_time,
    payment_type,
  } = req.body;

  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const hashed = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hashed === signature_key) {
      const payment = await Payment.findOne({
        where: { orderId: order_id },
      });
      if (!payment) throw new ApiError("Transaksi tidak ada", 404);
      if (transaction_status === "capture") {
        if (fraud_status === "accept") {
          payment.status = "paid";
          payment.settlementTime = transaction_time;
          payment.paymentType = payment_type;
          await payment.save();

          const findUserCourse = await UserCourse.findOne({
            where: {
              userId: payment.userId,
            },
          });

          if (findUserCourse) {
            await findUserCourse.update({
              isAccessible: true,
            });
          } else {
            await UserCourse.create({
              userId: payment.userId,
              courseId: payment.courseId,
              isAccessible: true,
            });
          }
        }
      } else if (transaction_status === "settlement") {
        payment.status = "paid";
        payment.settlementTime = settlement_time;
        payment.paymentType = payment_type;
        await payment.save();

        const findUserCourse = await UserCourse.findOne({
          where: {
            userId: payment.userId,
          },
        });

        if (findUserCourse) {
          await findUserCourse.update({
            isAccessible: true,
          });
        } else {
          await UserCourse.create({
            userId: payment.userId,
            courseId: payment.courseId,
            isAccessible: true,
          });
        }
      } else if (transaction_status === "expire") {
        payment.status = "expire";
        payment.settlementTime = transaction_time;
        payment.paymentType = payment_type;
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
/* eslint-enable camelcase */

const getPaymentDetail = async (req, res, next) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw new ApiError("Payment not found!", 404);
    }

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
    const payments = await Payment.findAll({
      include: [
        {
          model: Course,
          as: "Course",
          include: {
            model: Category,
            as: "Category",
          },
        },
        {
          model: User,
          as: "User",
        },
      ],
    });
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

const paymentHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      throw new ApiError("User not found", 404);
    }

    const historyPayments = await Payment.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Course,
          attributes: [
            "id",
            "name",
            "imageUrl",
            "categoryId",
            "price",
            "promoPercentage",
            "level",
            "totalModule",
            "totalDuration",
            "courseBy",
            "rating",
          ],
          include: [
            {
              model: Category,
              as: "Category",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    const formattedHistory = historyPayments.map((payment) => ({
      orderId: payment.orderId,
      course: {
        id: payment.Course.id,
        name: payment.Course.name,
        imageUrl: payment.Course.imageUrl,
        price: payment.Course.price,
        promoPercentage: payment.Course.promoPercentage,
        category: payment.Course.Category.name,
        level: payment.Course.level,
        totalModule: payment.Course.totalModule,
        totalDuration: payment.Course.totalDuration,
        courseBy: payment.Course.courseBy,
        rating: payment.Course.rating,
      },
      price: payment.price,
      status: payment.status,
      createdAt: payment.createdAt.toISOString(),
    }));

    res.status(200).json({
      status: "success",
      message: "Get payment history successfully",
      data: {
        historyPayment: formattedHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const dataPayment = await Payment.findOne({
      where: {
        userId,
        courseId,
      },
    });

    if (!dataPayment) {
      throw new ApiError("Riwayat pembayaran tidak ditemukan!", 404);
    }

    await dataPayment.destroy();

    res.status(200).json({
      status: "success",
      message: "Pembelian dibatalkan",
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
  paymentHistory,
  deletePayment,
};
