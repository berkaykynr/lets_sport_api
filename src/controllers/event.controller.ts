import { Request, Response } from 'express';
import prisma from '../lib/prisma';
const moment = require('moment')().format('YYYY-MM-DD HH:mm:ss');

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

async function fetchEvents(req: Request, res: Response) {
  try {
    const events = await prisma.event.findMany();
    if (events) res.status(200).send(events);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

async function fetchEventUser(req: any, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
    });

    if (user) res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

export default {
  createEvent,
  fetchEvents,
  fetchEventUser,
};
