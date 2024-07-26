import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { io } from '../server';
import { Server, Socket } from 'socket.io';

async function getReceiverUser(req: Request, res: Response) {
  try {
    const { receiverId } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });
    if (user) res.status(200).send(user);
    else res.status(500).json({ message: 'user not found' });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

function messageSocket(io: Server, socket: Socket) {
  socket.on('join', async ({ userId }: { userId: string }) => {
    console.log(`${userId} joined conversation`);
  });

  socket.on('sendMessage', async (messageData: any) => {
    const { text, senderId, receiverId, conversationId } = messageData;
    try {
      const message = await prisma.message.create({
        data: {
          text,
          senderId,
          receiverId,
          conversationId,
          seen: false,
        },
      });

      io.to(conversationId).emit('receiveMessage', message);
    } catch (error) {
      console.error('Error creating message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
}

export default {
  getReceiverUser,
  messageSocket,
};
