const router = require("express").Router();
const userNotificationController = require("../controllers/userNotificationController");
const { authenticate } = require("../middlewares/auth");

router.get("/", authenticate, userNotificationController.getAllUserNotif);
router.get("/:id", authenticate, userNotificationController.getNotifForUser);

module.exports = router;
