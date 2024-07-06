import { Request, Response } from 'express';
import prisma from '../lib/prisma';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const moment = require('moment')().format('YYYY-MM-DD HH:mm:ss');
const createUser = async (req: Request, res: any) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        branches: req.body.branches,
        sex: req.body.sex,
        profile_photo: req.body.profile_photo,
        photos: req.body.photos,
      },
    });

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

async function createEvent(req: Request, res: Response) {
  try {
    const username = req.body.username;

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const event = await prisma.event.create({
      data: {
        eventDate: new Date(req.body.eventDate),
        owner: {
          connect: {
            id: user.id,
          },
        },
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        branch: req.body.branch,
        participants: {},
        description: req.body.description,
      },
    });

    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

async function login(req: Request, res: Response) {
  console.info(
    `[${new Date().toLocaleString()}] Incoming ${req.method} ${
      req.originalUrl
    } Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]} `
  );
  try {
    const email = req.body.mail;
    const password = req.body.password;
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (findUser && (await bcrypt.compare(password, findUser.password))) {
      const token = jwt.sign({ userId: findUser.id }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
}

async function fetchEvents(req: Request, res: Response) {
  try {
    const events = await prisma.event.findMany();
    if (events) res.status(200).send(events);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

async function fetchEventUser(req: Request, res: Response) {
  try {
    const id = req.body.id;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (user) res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

export default {
  createUser,
  login,
  createEvent,
  fetchEvents,
  fetchEventUser,
};
