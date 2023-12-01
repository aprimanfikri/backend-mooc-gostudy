const imagekit = require("../lib/imagekit");
const { User, Verified } = require("../models");
const ApiError = require("../utils/apiError");
const { hash, compare } = require("../utils/bcrypt");
const { sendOtpVerification } = require("./otpController");
const transporter = require("../config/nodemailer");
const { generateToken } = require("../utils/jwt");

const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name) {
      throw new ApiError("Name is required", 400);
    }
    if (name.length < 3) {
      throw new ApiError("Name must be at least 3 characters", 400);
    }
    if (!email) {
      throw new ApiError("Email is required", 400);
    }
    if (!password) {
      throw new ApiError("Password is required", 400);
    }
    if (password.length < 8) {
      throw new ApiError("Password must be at least 8 characters", 400);
    }
    if (!phoneNumber) {
      throw new ApiError("Phone number is required", 400);
    }
    if (phoneNumber.length < 10) {
      throw new ApiError("Phone number must be at least 10 numbers", 400);
    }
    const user = await User.findOne({
      where: { email },
    });
    if (user) {
      throw new ApiError("Email already exists", 400);
    }
    const hashedPassword = await hash(password);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = generateToken(newUser);
    await sendOtpVerification(newUser.id, email);
    // res.cookie("token", token, { httpOnly: true });
    const otp = await Verified.findOne({ where: { userId: newUser.id } });
    res.status(201).json({
      status: "success",
      message: "Register successfully",
      data: {
        user: newUser,
        token,
        otp: otp.otp,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new ApiError("Email is required", 400);
    }
    if (!password) {
      throw new ApiError("Password is required", 400);
    }
    const user = await User.findOne({
      where: { email },
      include: ["Verified"],
    });
    if (!user) {
      throw new ApiError("Email does not exist", 400);
    }
    if (!user.verify) {
      throw new ApiError("Email not verified", 400);
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new ApiError("Password is incorrect", 400);
    }
    const token = generateToken(user);
    res.status(200).json({
      status: "success",
      message: "Your account has been logged in successfully",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      throw new ApiError("OTP is required", 400);
    }
    const { id } = req.user;
    const user = await User.findByPk(id);
    if (!user) {
      throw new ApiError("User does not exist", 404);
    }
    if (user.verify) {
      throw new ApiError("User is already verified", 400);
    }
    const verifiedOtp = await Verified.findOne({
      where: { userId: id },
    });
    if (!verifiedOtp) {
      throw new ApiError("OTP does not exist", 404);
    }
    // const match = await compare(otp, verifiedOtp.otp);
    // if (!match) {
    //   throw new ApiError("OTP does not match", 400);
    // }
    if (verifiedOtp.expiresAt < Date.now()) {
      throw new ApiError("OTP has expired", 400);
    }
    await verifiedOtp.destroy();
    await user.update({ verify: true });
    // res.clearCookie("token");
    const token = generateToken(user);
    res.status(200).json({
      status: "success",
      message: "Email verification successful",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findByPk(id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    if (user.verify) {
      throw new ApiError("User is already verified", 400);
    }
    await sendOtpVerification(user.id, user.email);
    res.status(200).json({
      status: "success",
      message: "OTP has been resent to your email",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ApiError("Email is required", 400);
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    const token = generateToken(user, "1m");
    const resetLink = `${process.env.BACKEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: user.email,
      subject: "Reset Your Password",
      html: `<div>
        <p>Hi ${user.name || user.email},</p>
      <div>Click <a href="${resetLink}">here</a> to reset your password.</div>
      </div>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      status: "success",
      message: "Please check your email",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password) {
      throw new ApiError("Password is required", 400);
    }
    if (password.length < 8) {
      throw new ApiError("Password must be at least 8 characters", 400);
    }
    if (!confirmPassword) {
      throw new ApiError("Confirm password is required", 400);
    }
    if (password !== confirmPassword) {
      throw new ApiError("Passwords do not match", 400);
    }
    const { id } = req.user;
    const user = await User.findByPk(id);
    if (!user) {
      throw new ApiError("User does not exist", 404);
    }
    if (password === user.password) {
      throw new ApiError("Password cannot be the same as old password", 400);
    }
    res.clearCookie("token");
    await user.update({ password: await hash(password) });
    res.status(200).json({
      status: "success",
      message: "Password successfully reset",
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const file = req.file;
    const { id } = req.user;
    const user = await User.findByPk(id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    let imgUrl;
    let imgId;
    if (file) {
      const split = file.originalname.split(".");
      const fileType = split[split.length - 1];
      if (user.imageId) {
        await imagekit.deleteFile(user.imageId);
      }
      const uploadImage = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: `${user.id}.${fileType}`,
        folder: "/gostudy/profile-image",
      });
      imgUrl = uploadImage.url;
      imgId = uploadImage.fileId;
    }
    const updatedUser = await user.update({
      ...req.body,
      imageUrl: imgUrl,
      imageId: imgId,
    });
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword) {
      throw new ApiError("Old password is required", 400);
    }
    if (!newPassword) {
      throw new ApiError("New password is required", 400);
    }
    if (newPassword.length < 8) {
      throw new ApiError("New password must be at least 8 characters", 400);
    }
    if (!confirmPassword) {
      throw new ApiError("Confirm password is required", 400);
    }
    if (newPassword !== confirmPassword) {
      throw new ApiError("Passwords do not match", 400);
    }
    const { id } = req.user;
    const user = await User.findByPk(id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      throw new ApiError("Old password is incorrect", 400);
    }
    if (newPassword === user.password) {
      throw new ApiError(
        "New password cannot be the same as old password",
        400
      );
    }
    await user.update({ password: await hash(newPassword) });
    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: "success",
      message: "All users fetched successfully",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

const whoAmI = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findByPk(id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new ApiError("Email is required", 400);
    }
    if (!password) {
      throw new ApiError("Password is required", 400);
    }
    const user = await User.findOne({
      where: { email },
      include: ["Verified"],
    });
    if (!user) {
      throw new ApiError("Email does not exist", 400);
    }
    if (user.role !== "admin") {
      throw new ApiError("You are not admin", 400);
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new ApiError("Password is incorrect", 400);
    }
    const token = generateToken(user);
    res.status(200).json({
      status: "success",
      message: "Your account has been logged in successfully",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    if (user.imageId) {
      await imagekit.deleteFile(user.imageId);
    }
    await user.destroy();
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
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
  updatePassword,
  getAllUsers,
  whoAmI,
  loginAdmin,
  getUserById,
  deleteUser,
};
