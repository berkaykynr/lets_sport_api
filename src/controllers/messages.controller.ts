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
  if (messageId)
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
  socket.on('join', async (userId) => {
    socket.join(userId);
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

      // io.to(senderId).to(receiverId).emit('refreshConversations');
      io.to(senderId).emit('refreshConversations');
      io.to(receiverId).emit('refreshConversations');
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
        take: limit > 0 ? limit : 100,
        skip: offset,
      });

      socket.emit('messagesLoaded', messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  });

  socket.on('markAsSeen', async (messageId) => {
    if (messageId)
      try {
        const updatedMessage = await prisma.message.update({
          where: { id: messageId },
          data: { seen: true },
        });

        // Mesajın görüldüğünü tüm kullanıcılarla paylaş
        io.emit('refreshConversations');
        io.emit('messageSeen', updatedMessage);
      } catch (error) {
        console.error('Error marking message as seen:', error);
      }
  });

  socket.on('loadConversations', async ({ senderId }) => {
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [{ senderId }, { receiverId: senderId }],
        },
        orderBy: {
          createdAt: 'desc',
        },
        distinct: ['senderId', 'receiverId'],
        select: {
          id: true,
          createdAt: true,
          text: true,
          image: true,
          senderId: true,
          receiverId: true,
          seen: true,
        },
      });

      const userConversations: Record<
        string,
        { lastMessage: any; unseenMessages: any[] }
      > = {};

      messages.forEach((message) => {
        const otherUserId =
          message.senderId === senderId ? message.receiverId : message.senderId;

        if (!userConversations[otherUserId]) {
          userConversations[otherUserId] = {
            lastMessage: message,
            unseenMessages: [],
          };
        }

        if (!message.seen && message.receiverId === senderId) {
          userConversations[otherUserId].unseenMessages.push(message);
        } else if (message.seen && message.receiverId === senderId) {
          // Update lastMessage if necessary
          if (
            message.createdAt >
            userConversations[otherUserId].lastMessage.createdAt
          ) {
            userConversations[otherUserId].lastMessage = message;
          }
        }
      });

      const userIds = Object.keys(userConversations);
      const users = await prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo: true,
        },
      });

      const userMap = new Map<string, any>();
      users.forEach((user) => {
        userMap.set(user.id, user);
      });

      const currentTime = new Date();
      const conversationArray: any[] = userIds.map((otherUserId) => {
        const conversation = userConversations[otherUserId];
        const user = userMap.get(otherUserId);
        if (!user) {
          throw new Error(`User not found for ID: ${otherUserId}`);
        }
        const lastMessageTime = new Date(conversation.lastMessage.createdAt);
        const timeDiffMinutes = Math.floor(
          (currentTime.getTime() - lastMessageTime.getTime()) / 60000
        );

        return {
          userId: otherUserId,
          profilePhoto: user.profile_photo,
          firstName: user.first_name,
          lastName: user.last_name,
          lastMessage: conversation.lastMessage,
          unseenMessagesCount: conversation.unseenMessages.length,
          lastMessageTimeDiff:
            timeDiffMinutes < 60
              ? `${timeDiffMinutes} minutes ago`
              : `${Math.floor(timeDiffMinutes / 60)} hours ago`,
        };
      });

      socket.emit('conversationsLoaded', conversationArray);
    } catch (err) {
      console.error('Error getting conversation list:', err);
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
