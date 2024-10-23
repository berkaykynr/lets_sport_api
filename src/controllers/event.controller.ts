import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { Server, Socket } from "socket.io";
const moment = require("moment")().format("YYYY-MM-DD HH:mm:ss");

async function createEvent(req: Request, res: Response) {
  try {
    const username = req.body.username;
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

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
        id: req.body.id,
      },
    });
    if (user) res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

async function fetchEventDetail(req: any, res: Response) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: req.body.id,
      },
    });
    if (event) res.status(200).send(event);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

async function checkIsRequestedEvent(req: any, res: Response) {
  const { senderId, eventId } = req.body;
  try {
    const eventsRequests = await prisma.eventRequest
      .findFirst({
        where: {
          eventId,
          senderId,
        },
      })
      .then((e) => {
        // console.log(eventsRequests, ': EVENTS');
        if (eventsRequests !== null)
          res.status(200).json({ status: "ok", eventsRequests });
        else res.status(200).json({ status: "not" });
      });
  } catch (err) {
    res.status(500).send(err);
  }
}

async function eventRequestIds(req: any, res: Response) {
  const { userId } = req.body;
  try {
    const requests = await prisma.eventRequest.findMany({
      where: {
        senderId: userId,
      },
    });
    let responseData: Array<string> = [];

    if (requests) {
      requests.map((item) => {
        responseData.push(item.eventId);
      });
    }
    res.status(200).send(responseData);
  } catch (err: any) {
    res.status(500).send(err);
  }
}

async function eventRequest(req: any, res: Response) {
  const { userId, event } = req.body;
  try {
    const requestEvent = await prisma.eventRequest.create({
      data: {
        eventId: event.id,
        senderId: userId,
        userId: event.userId,
      },
    });
    console.log(requestEvent, ": eventRequest func");
    if (requestEvent) res.send(200);
  } catch (err) {
    res.status(500).send(err);
  }
}

function eventSocket(io: Server, socket: Socket) {
  socket.on("fetchEventRequests", async (userId) => {
    try {
      const requests = [];

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      const eventRequests = await prisma.eventRequest.findMany({
        where: {
          userId: userId,
        },
        include: {
          eventOwner: true,
        },
      });

      if (eventRequests)
        eventRequests.map(async (item) => {
          if (item.status == false && item.response == false) {
            const event = await prisma.event.findUnique({
              where: {
                id: item.eventId,
              },
            });
            const senderUser = await prisma.user.findUnique({
              where: {
                id: item.senderId,
              },
            });

            console.log(
              senderUser?.username,
              " profil: ",
              senderUser?.profile_photo,
              " sex:",
              senderUser?.sex,
              " rate: ",
              senderUser?.rate,
              " addres: ",
              senderUser?.address
            );
            console.log(event);
          }

          // requests.push({
          // })
        });

      console.log(eventRequests);

      if (user) socket.emit("fetchEventRequests", eventRequests);
    } catch (err) {
      console.error("fetchEventRequests error : ", err);
    }
  });

  // socket.on('requestedEvents', async (data) => {
  //   const { userId, eventId } = data;
  //   try {
  //     const events = await prisma.eventRequest.findMany({
  //       where: {
  //         eventId: eventId,
  //         senderId: userId,
  //       },
  //     });
  //     console.log(events, ' :requestedEvents socket');
  //     socket.emit('fetchedRequestedEvent', events);
  //   } catch (err) { }
  // });

  socket.on("requestEvent", async (data) => {
    try {
      const request = await prisma.eventRequest.create({
        data: {
          eventId: data.event.id,
          userId: data.event.userId,
          senderId: data.senderId,
        },
      });
    } catch (err) {
      console.error("requestEvent error : ", err);
    }
  });
}

export default {
  createEvent,
  fetchEvents,
  fetchEventUser,
  fetchEventDetail,
  eventSocket,
  checkIsRequestedEvent,
  eventRequestIds,
  eventRequest,
};
