const router = require('express').Router();
const chaptersController = require('../controllers/chaptersController');
const { authenticate } = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router
  .route('/')
  .get(chaptersController.getAllChapters)
  .post(authenticate, checkRole('admin'), chaptersController.createChapter);

router
  .route('/:id')
  .get(chaptersController.getChapterById)
  .patch(authenticate, checkRole('admin'), chaptersController.updateChapter)
  .delete(authenticate, checkRole('admin'), chaptersController.deleteChapter);

module.exports = router;
