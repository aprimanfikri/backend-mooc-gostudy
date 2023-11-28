const router = require("express").Router();

const moduleController = require("../controllers/moduleController");

const { authenticate } = require("../middlewares/auth");

const upload = require("../middlewares/uploader");

const checkRole = require("../middlewares/checkRole");

router
  .route("/")
  .get(moduleController.getAllModule)
  .post(
    authenticate,
    checkRole("admin"),
    upload.single("video"),
    moduleController.createModule
  );

router
  .route("/:id")
  .get(moduleController.getModuleById)
  .patch(
    authenticate,
    checkRole("admin"),
    upload.single("video"),
    moduleController.updateModule
  )
  .delete(moduleController.deleteModule);

module.exports = router;
