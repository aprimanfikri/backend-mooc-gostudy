const { Notification } = require("../models");
const ApiError = require("../utils/apiError");

const createNotif = async (req, res, next) => {
  const { category, title, description } = req.body;
  try {
    if (!category || !title || !description) {
      throw new ApiError("All value fields are require", 400);
    }
    const newNotif = await Notification.create({
      category,
      title,
      description,
    });

    res.status(201).json({
      status: "success",
      message: "Notification created successfully",
      data: {
        newNotif,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllNotif = async (req, res, next) => {
  try {
    const notif = await Notification.findAll();
    res.status(200).json({
      status: "success",
      message: "All Notif fetched successfully",
      data: {
        notif,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getNotifById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByPk(id);
    if (!notif) {
      throw new ApiError("Notification not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: `Notification ${notif.id} is found!`,
      data: {
        notif,
      },
      date: new Date().toISOString,
    });
  } catch (error) {
    next(error);
  }
};

const updateNotif = async (req, res, next) => {
  try {
    const { category, title, description } = req.body;
    const { id } = req.params;
    // if (!category || !title || !description) {
    //   throw new ApiError('All value fields are required', 400);
    // }
    const notif = await Notification.findByPk(id);
    if (!notif) {
      throw new ApiError("Notification not found", 404);
    }
    const updatedNotif = await notif.update({
      category,
      title,
      description,
    });
    res.status(200).json({
      status: "success",
      message: "Notification updated successfully",
      data: {
        updatedNotif,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotif = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByPk(id);
    if (!notif) {
      throw new ApiError("Notification not found", 404);
    }
    await notif.destroy();
    res.status(200).json({
      status: "success",
      message: "Notification deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotif,
  getAllNotif,
  getNotifById,
  updateNotif,
  deleteNotif,
};
