const multer = require('multer');

const multerFiltering = (req, file, cb) => {
  if (
    file.mimetype === 'image/png'
    || file.mimetype === 'image/jpg'
    || file.mimetype === 'image/jpeg'
    || file.mimetype === 'video/mp4'
  ) {
    return cb(null, true);
  }
  return cb('File yang diupload bukan png/jpg/jpeg.');
};

const upload = multer({
  fileFilter: multerFiltering,
});

module.exports = upload;
