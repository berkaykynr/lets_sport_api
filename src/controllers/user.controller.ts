import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../lib/prisma';

const createUser = async (req: Request, res: any) => {
  try {
    const user = await prisma.user.create({
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username + Math.floor(Math.random() * 100000),
        password: req.body.password,
        email: req.body.email + Math.floor(Math.random() * 100000),
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
    console.log(err);
    res.status(500).send(err);
  }
};

async function uploadPhoto(req: any, res: any) {
  console.info(
    `[${new Date().toLocaleString()}] Incoming ${req.method} ${
      req.originalUrl
    } Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]} `
  );
  try {
    res.send(req.files['photo'][0].filename);
  } catch (err) {
    console.error('Error while upload photo: ', err);
  }
}
async function getUserById(req: Request, res: Response) {
  console.info(
    `[${new Date().toLocaleString()}] Incoming ${req.method} ${
      req.originalUrl
    } Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]} `
  );
  try {
    const userId = req.body.userId;
    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    res.status(200).json(findUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}

async function getUserByUserName(req: Request, res: Response) {
  console.info(
    `[${new Date().toLocaleString()}] Incoming ${req.method} ${
      req.originalUrl
    } Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]} `
  );
  try {
    const { userName } = req.body;
    const findUser = await prisma.user.findUnique({
      where: {
        username: userName,
      },
    });
    res.status(200).json(findUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}

async function fetchCitiesTurkey(req: Request, res: Response) {
  try {
    const response = await axios.get(
      'https://raw.githubusercontent.com/hsndmr/turkiye-city-county-district-neighborhood/main/data.json'
    );

    const list: any = [];
    for (const item of response.data) {
      const addedData = await prisma.turkeyAddress.create({
        data: {
          city: item,
        },
      });
      list.push(addedData);
    }
    res.status(200).json({ status: list });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}

export default {
  createUser,
  getUserById,
  getUserByUserName,
  fetchCitiesTurkey,
  uploadPhoto,
};
