const { UserNotification, Notification } = require("../models");
const ApiError = require("../utils/apiError");

const getNotifForUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!userId) {
      throw new ApiError("ID user tidak ada", 404);
    }

    const userNotif = await UserNotification.findOne({
      where: { id },
      include: {
        model: Notification,
      },
    });

    if (!userNotif) throw new ApiError("Notifikasi tidak ditemukan", 404);

    await userNotif.update({ isRead: true });

    const greetingMsg = `Hi, ${req.user.name}`;

    res.status(200).json({
      status: "success",
      message: "Sukses mengirim notifikasi",
      data: {
        greetingMsg,
        userNotif,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUserNotif = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      throw new ApiError("ID user tidak ada", 404);
    }

    const allNotif = await UserNotification.findAll({
      where: { userId },
      include: [
        {
          model: Notification,
        },
      ],
    });

    res.status(200).json({
      status: "success",
      message: "Berhasil mengambil semua notifikasi",
      data: {
        allNotif,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifForUser,
  getAllUserNotif,
};
