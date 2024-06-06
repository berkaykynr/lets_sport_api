import express from 'express';
import UserController from '../controllers/user.controller';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    const uploadPath = path.join(
      'uploads',
      req.body.username ? req.body.username : 'unnamed'
    );
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, req.body.username + '-' + Date.now() + '-' + file.originalname);
  },
});

// her fotoğraf için ayrı istek discord usuluü

const upload = multer({ storage: storage });
const cpUploadPhoto = upload.fields([{ name: 'photo', maxCount: 1 }]);

router.post('/create', UserController.createUser);
router.post('/uploadPhoto', cpUploadPhoto, UserController.uploadPhoto);
router.post('/getUserById', UserController.getUserById);
router.post('/getUserByUserName', UserController.getUserByUserName);

export default router;
