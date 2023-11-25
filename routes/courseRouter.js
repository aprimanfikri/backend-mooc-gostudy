const router = require('express').Router();

const courseController = require('../controllers/courseController');

router.post('/', courseController.createCourse);
router.get('/', courseController.getAllCourse);

router.patch(':id', courseController.updateCourse);
router.get('/:id', courseController.getCourseById);
router.delete(':/id', courseController.deleteCourse);

module.exports = router;
