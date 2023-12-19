const transporter = require("../config/nodemailer");
const { Verified } = require("../models");
const ApiError = require("../utils/apiError");

const sendOtpVerification = async (id, email) => {
  try {
    const exists = await Verified.findOne({ where: { userId: id } });
    if (exists) {
      await exists.destroy();
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    // const hashedOtp = await hash(otp.toString());
    await Verified.create({
      userId: id,
      otp,
      expiresAt: Date.now() + 1000 * 60 * 10,
    });
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Email Verification",
      html: `<p>Your OTP is ${otp}</p>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(error.message, 500);
  }
};

module.exports = {
  sendOtpVerification,
};
