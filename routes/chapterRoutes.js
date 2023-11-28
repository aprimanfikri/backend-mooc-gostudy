const router = require("express").Router();

const chaptersController = require("../controllers/chaptersController");

const { authenticate } = require("../middlewares/auth");

const checkRole = require("../middlewares/checkRole");

router
  .route("/")
  .get(chaptersController.getAllChapters)
  .post(chaptersController.createChapter);

router
  .route("/:id")
  .get(chaptersController.getChapterById)
  .patch(chaptersController.updateChapter)
  .delete(chaptersController.deleteChapter);

module.exports = router;
