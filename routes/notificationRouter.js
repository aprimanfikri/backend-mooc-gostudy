const router = require("express").Router();
const notificationController = require("../controllers/notificationController");

router
  .route("/")
  .get(notificationController.getAllNotif)
  .post(notificationController.createNotif);

router
  .route("/:id")
  .get(notificationController.getNotifById)
  .patch(notificationController.updateNotif)
  .delete(notificationController.deleteNotif);

module.exports = router;
