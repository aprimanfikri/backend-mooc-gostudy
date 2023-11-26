const router = require("express").Router();

const moduleController = require("../controllers/moduleController");

router
  .route("/")
  .get(moduleController.getAllModule)
  .post(moduleController.createModule);

router
  .route("/:id")
  .get(moduleController.getModuleById)
  .patch(moduleController.updateModule)
  .delete(moduleController.deleteModule);

module.exports = router;
