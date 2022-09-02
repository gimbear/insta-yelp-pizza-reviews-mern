const cloudinary = require('cloudinary').v2;

const fileUpload = async (file) => {
  return await cloudinary.uploader.upload(file.path);
};

module.exports = fileUpload;
