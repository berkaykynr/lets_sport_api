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

async function markAsSeen(req: Request, res: Response) {
  const { messageId } = req.body;
  try {
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { seen: true },
    });
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark message as seen' });
  }
}

function messageSocket(io: Server, socket: Socket) {
  socket.on('join', async ({ userId }: { userId: string }) => {
    console.log(`${userId} joined conversation`);
  });

  socket.on('sendMessage', async (messageData: any) => {
    const { text, senderId, receiverId } = messageData;
    try {
      const message = await prisma.message.create({
        data: {
          text,
          senderId,
          receiverId,
          seen: false,
        },
      });

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: senderId,
              receiverId: receiverId,
            },
            {
              senderId: receiverId,
              receiverId: senderId,
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      io.emit('newMessage', messages);
    } catch (error) {
      console.error('Error creating message:', error);
    }
  });

  socket.on('loadMessages', async ({ senderId, receiverId, limit, offset }) => {
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: senderId,
              receiverId: receiverId,
            },
            {
              senderId: receiverId,
              receiverId: senderId,
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      });

      socket.emit('messagesLoaded', messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  });

  socket.on('markAsSeen', async (messageId) => {
    try {
      const updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: { seen: true },
      });

      // Mesajın görüldüğünü tüm kullanıcılarla paylaş
      io.emit('messageSeen', updatedMessage);
    } catch (error) {
      console.error('Error marking message as seen:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
}

export default {
  getReceiverUser,
  messageSocket,
  markAsSeen,
};
