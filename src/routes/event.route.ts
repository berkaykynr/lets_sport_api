import express, { Request } from 'express';
import UserController from '../controllers/user.controller';
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
import EventController from '../controllers/event.controller';
const router = express.Router();

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

router.post('/create', authenticateToken, EventController.createEvent);
router.post('/fetchEvents', authenticateToken, EventController.fetchEvents);
router.post(
  '/fetchEventUser',
  authenticateToken,
  EventController.fetchEventUser
);
router.post(
  '/fetchEventDetail',
  authenticateToken,
  EventController.fetchEventDetail
);
router.post(
  '/checkIsRequested',
  authenticateToken,
  EventController.checkIsRequested
);
export default router;
