const router = require("express").Router();
const openCourse = require("../controllers/openCourse");
const { authenticate } = require("../middlewares/auth");

router.route("/:id").get(authenticate, openCourse);

module.exports = router;
