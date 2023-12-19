const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerFiltering = (req, file, next) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "video/mp4"
  ) {
    return next(null, true);
  }
  return next(
    new ApiError("Only .png, .jpg, .jpeg, and .mp4 format allowed!", 400)
  );
};

const upload = multer({
  fileFilter: multerFiltering,
});

module.exports = upload;
