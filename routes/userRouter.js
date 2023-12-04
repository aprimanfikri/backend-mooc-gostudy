const router = require("express").Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");
const upload = require("../middlewares/uploader");
const checkRole = require("../middlewares/checkRole");

router.get("/me", authenticate, userController.whoAmI);

router.put(
  "/update",
  authenticate,
  upload.single("image"),
  userController.updateProfile
);

router.put("/update-password", authenticate, userController.updatePassword);

router.get("/", authenticate, checkRole("admin"), userController.getAllUsers);

router
  .route("/:id")
  .get(authenticate, checkRole("admin"), userController.getUserById)
  .delete(authenticate, checkRole("admin"), userController.deleteUser);

module.exports = router;
