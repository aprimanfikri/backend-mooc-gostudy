const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/apiError');

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, 'public/vid');
    },
    filename: (req, file, next) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      next(null, `${file.fieldname}-${uniqueSuffix}`);
    },
  }),
  fileFilter: (req, file, next) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4' && ext !== '.mov' && ext !== '.mkv') {
      return next(
        new ApiError('Only .mp4, .mov, and .mkv format allowed!', 400)
      );
    }
    return next(null, true);
  },
});
