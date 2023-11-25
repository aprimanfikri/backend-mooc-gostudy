const router = require('express').Router();

const moduleController = require('../controllers/moduleController');

router.post('/', moduleController.createModule);
router.get('/', moduleController.getAllModule);

router.patch(':id', moduleController.updateModule);
router.get('/:id', moduleController.getModuleById);
router.delete(':/id', moduleController.deleteModule);

module.exports = router;
