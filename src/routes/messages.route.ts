import express from 'express';
import MessageController from '../controllers/messages.controller';
import fs from 'fs';
import path from 'path';
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    const uploadPath = path.join(
      'uploads',
      req.query.username ? req.query.username : 'undefined'
    );

    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: function (req: any, file: any, cb: any) {
    cb(null, req.query.username + '-' + Date.now() + '-' + file.originalname);
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

router.post(
  '/getReceiverUser',
  authenticateToken,
  MessageController.getReceiverUser
);
router.post('/markAsSeen', authenticateToken, MessageController.markAsSeen);

export default router;
