const router = require('express').Router();

const categoryController = require('../controllers/categoryController');

router
  .route('/')
  .get(categoryController.getAllCategory)
  .post(categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategoryById)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
