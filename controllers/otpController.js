const transporter = require('../config/nodemailer');
const { Verified } = require('../models');
const { hash } = require('../utils/bcrypt');
const ApiError = require('../utils/apiError');

const sendOtpVerification = async ({ id, email }) => {
  try {
    const existingVerifiedOtp = await Verified.findOne({
      where: { userId: id },
    });
    let otp;
    let hashedOtp;
    if (existingVerifiedOtp) {
      otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      hashedOtp = await hash(otp);
      await existingVerifiedOtp.update({
        otp: hashedOtp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 10,
      });
    } else {
      otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      hashedOtp = await hash(otp);
      await Verified.create({
        userId: id,
        otp: hashedOtp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 10,
      });
    }
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Email Verification',
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
