import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import config from '../config/configServer.js';

cloudinary.config({
  cloud_name: config.upload.name,
  api_key: config.upload.key,
  api_secret: config.upload.secret
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: function (req, file) {
      return `hrm_system/${file.fieldname}`;
    }
  },
});

const uploadCloud = multer({
  storage: storage, limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
    files: 1,
  },
});

module.exports = uploadCloud;