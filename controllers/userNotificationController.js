const { UserNotification, Notification } = require("../models");
const ApiError = require("../utils/apiError");

const getNotifForUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!userId) {
      throw new ApiError("ID user tidak ada", 404);
    }

    const notif = await Notification.findByPk(id);

    if (!notif) throw new ApiError("Notifikasi tidak ditemukan", 404);

    let userNotif = await UserNotification.findOne({
      where: { userId, notifId: id },
    });

    if (!userNotif) {
      userNotif = await UserNotification.create({
        userId,
        notifId: id,
      });
    } else {
      await userNotif.update({ isRead: true });
    }

    const greetingMsg = `Hi, ${req.user.name}`;

    res.status(200).json({
      status: "success",
      message: "Sukses mengirim notifikasi",
      data: {
        greetingMsg,
        notif,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifForUser };
