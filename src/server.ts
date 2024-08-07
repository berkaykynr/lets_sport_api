import express, { Request, Response } from 'express';
import UserRouter from './routes/user.route';
import EventRouter from './routes/event.route';
import MessagesRouter from './routes/messages.route';
import prisma from './lib/prisma';
import messagesController from './controllers/messages.controller';
import { Socket } from 'socket.io';
import eventController from './controllers/event.controller';
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 8080;
const cors = require('cors');

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

async function main() {
  app.use('/api/user', UserRouter);
  app.use('/api/event', EventRouter);
  app.use('/api/messages', MessagesRouter);

  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  io.on('connection', (socket: Socket) => {
    console.log('a user connected', socket.id);
    messagesController.messageSocket(io, socket);
    eventController.eventSocket(io, socket);
  });

  io.listen(3000);
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main();
