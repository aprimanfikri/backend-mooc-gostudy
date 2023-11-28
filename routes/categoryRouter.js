const router = require('express').Router();

const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router
  .route('/')
  .get(authenticate, checkRole('admin'), categoryController.getAllCategory)
  .post(authenticate, checkRole('admin'), categoryController.createCategory);

router
  .route('/:id')
  .get(authenticate, checkRole('admin'), categoryController.getCategoryById)
  .patch(authenticate, checkRole('admin'), categoryController.updateCategory)
  .delete(authenticate, checkRole('admin'), categoryController.deleteCategory);

module.exports = router;
