import express from 'express';
import UserController from '../controllers/user.controller';
import fs from 'fs';
import path from 'path';
import userController from '../controllers/user.controller';
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    const uploadPath = path.join(
      'uploads',
      req.body.username ? req.body.username : 'undefined'
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
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
const upload = multer({ storage: storage });
const cpUploadPhoto = upload.fields([{ name: 'photo', maxCount: 1 }]);

router.post('/create', UserController.createUser);
router.post('/uploadPhoto', cpUploadPhoto, UserController.uploadPhoto);
router.post('/getUserById', authenticateToken, UserController.getUserById);
router.post(
  '/getUserByUserName',
  authenticateToken,
  UserController.getUserByUserName
);
router.post(
  '/getUserByEmail',
  authenticateToken,
  UserController.getUserByEmail
);
router.get(
  '/getUserPhoto:path',
  // authenticateToken
  UserController.getUserPhoto
);
router.post('/login', UserController.login);

export default router;
