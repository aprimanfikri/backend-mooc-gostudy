const multer = require('multer');
const path = require('path');

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/vid');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}${path.extname(file.originalname)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4' && ext !== '.mov' && ext !== '.mkv') {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
});
