import { Request, Response } from 'express';
import prisma from '../lib/prisma';

async function getConversationId(req: Request, res: Response) {
  try {
    const { senderId, receiverId }: { senderId: string; receiverId: string } =
      req.body;

    if (receiverId && senderId) {
      const conversation = await prisma.conversation.findFirst({
        where: {
          AND: [{ receiverId: receiverId }, { senderId: senderId }],
        },
      });

      if (conversation) {
        res.status(200).json({ conversationId: conversation.id });
      } else {
        const conversation = await prisma.conversation.create({
          data: {
            senderId: senderId,
            receiverId: receiverId,
            users: {
              connect: [{ id: senderId }, { id: receiverId }],
            },
          },
        });

        res.status(200).json({ conversationId: conversation.id });
      }
    } else {
      res.status(400).json({ message: 'senderId and receiverId are required' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

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

async function fetchMessages(req: Request, res: Response) {
  try {
    const {
      conversationId,
      page,
      limit,
    }: { conversationId: string; page: number; limit: number } = req.body;

    if (!conversationId) {
      return res.status(400).json({ message: 'conversationId is required' });
    }

    const pageNumber = page || 1;
    const limitNumber = limit || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const messages = await prisma.message.findMany({
      where: { conversationId: conversationId },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: limitNumber,
    });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

export default {
  getConversationId,
  getReceiverUser,
  fetchMessages,
};
