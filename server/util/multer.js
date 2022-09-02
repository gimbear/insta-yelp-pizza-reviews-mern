const multer = require('multer');
const path = require('path');

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    console.log('Multer middleware processing file...');

    //console.log(file);
    let ext = path.extname(file.originalname);
    //console.log("file", ext, file);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
});
