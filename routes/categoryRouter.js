const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const { authenticate } = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");
const upload = require("../middlewares/uploader");

router
  .route("/")
  .get(categoryController.getAllCategory)
  .post(
    authenticate,
    checkRole("admin"),
    upload.single("image"),
    categoryController.createCategory
  );

router
  .route("/:id")
  .get(authenticate, checkRole("admin"), categoryController.getCategoryById)
  .patch(
    authenticate,
    checkRole("admin"),
    upload.single("image"),
    categoryController.updateCategory
  )
  .delete(authenticate, checkRole("admin"), categoryController.deleteCategory);

module.exports = router;
