const router = require('express').Router();

const User = require('./userRouter');
const Course = require('./courseRouter');
const Module = require('./moduleRouter');

router.use('/api/v1/auth', User);
router.use('/api/v1/course', Course);
router.use('/api/v1/module', Module);

module.exports = router;
