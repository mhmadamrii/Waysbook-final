const multer = require('multer');
const storageEngine = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads') },
  filename: (req, file, cb) => { cb (null, Date.now() + '-' + file.originalname.replace(/\s/g, "")); }, })

// Filter file type
const bookFilter = (req, file, cb) => {
  if (
    file.mimetype == "application/pdf" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg") {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

exports.uploadFile = multer({ storage: storageEngine, fileFilter: bookFilter })