const jwt = require('jsonwebtoken');
const { User, Verified } = require('../models');
const ApiError = require('../utils/apiError');
const { hash, compare } = require('../utils/bcrypt');
const { sendOtpVerification } = require('./otpController');
const transporter = require('../config/nodemailer');
const { generateToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
    });
    if (user) {
      throw new ApiError('Email already exists', 400);
    }
    const hashedPassword = await hash(password);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    await sendOtpVerification({ id: newUser.id, email });
    res.status(201).json({
      status: 'success',
      message: 'Register successfully',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      include: ['Verified'],
    });
    if (!user) {
      throw new ApiError('Email does not exist', 400);
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new ApiError('Password is incorrect', 400);
    }
    if (!user.verified) {
      throw new ApiError('Please verify your email', 400);
    }
    const token = generateToken(user);
    res.status(200).json({
      status: 'success',
      message: 'Your account has been logged in successfully',
      data: {
        token,
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const userId = req.params.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    const verifiedOtp = await Verified.findOne({
      where: { userId: userId },
    });
    if (!verifiedOtp || !(await compare(otp, verifiedOtp.otp))) {
      throw new ApiError('Invalid OTP', 400);
    }
    if (verifiedOtp.expiresAt < Date.now()) {
      throw new ApiError('OTP has expired', 400);
    }
    await User.update({ verified: true }, { where: { id: userId } });
    res.status(200).json({
      status: 'success',
      message: 'Email verification successful',
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    if (user.verified) {
      throw new ApiError('User is already verified', 400);
    }
    await sendOtpVerification({ id: user.id, email });
    res.status(200).json({
      status: 'success',
      message: 'OTP has been resent to your email',
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_RESET_SECRET, {
      expiresIn: '1h',
    });
    const resetLink = `${process.env.APP_BASE_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: user.email,
      subject: 'Reset Your Password',
      html: `<div>
        <p>Hi ${user.name || user.email},</p>
      <div>Click <a href="${resetLink}">here</a> to reset your password.</div>
      </div>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      status: 'success',
      message: 'Please check your email',
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    if (!user.password) {
      throw new ApiError('User has not set a password', 400);
    }
    const isMatch = await compare(newPassword, user.password);
    if (isMatch) {
      throw new ApiError(
        'New password cannot be the same as old password',
        400
      );
    }
    const hashedPassword = await hash(newPassword);
    await User.update(
      {
        password: hashedPassword,
        verified: true,
      },
      { where: { id: user.id } }
    );
    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    await user.update({
      ...req.body,
    });

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

module.exports = {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  updateProfile,
};
