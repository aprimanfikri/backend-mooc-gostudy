const router = require("express").Router();

const ApiError = require("../utils/apiError");
const User = require("./userRouter");
const Course = require("./courseRouter");
const Module = require("./moduleRouter");
const Category = require("./categoryRouter");
const Purchase = require("./purchaseRouter");

const render = require("./render");

router.use(render);

router.use("/api/v1/auth", User);
router.use("/api/v1/course", Course);
router.use("/api/v1/module", Module);
router.use("/api/v1/category", Category);
router.use("/api/v1/purchase", Purchase);

router.all("*", (req, res, next) => {
  res.render("error", {
    title: "Error Page",
});

module.exports = router;
