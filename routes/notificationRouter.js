const router = require("express").Router();
const notificationController = require("../controllers/notificationController");
const { authenticate } = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");

router
  .route("/")
  .get(notificationController.getAllNotif)
  .post(authenticate, checkRole("admin"), notificationController.createNotif);

router.post(
  "/send-all/:id",
  authenticate,
  checkRole("admin"),
  notificationController.sendPromoNotification
);

router
  .route("/:id")
  .get(notificationController.getNotifById)
  .patch(authenticate, checkRole("admin"), notificationController.updateNotif)
  .delete(authenticate, checkRole("admin"), notificationController.deleteNotif);

module.exports = router;
