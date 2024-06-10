import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../lib/prisma';
const fs = require('fs');
const bcrypt = require('bcrypt');
import path from 'path';
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

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
    console.error(e);
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
    console.error(e);
    res.status(500).json({ error: e });
  }
}

async function getUserByEmail(req: Request, res: Response) {
  try {
    const email = req.body.email;
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    res.status(200).json(findUser);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
}

async function getUserPhoto(req: Request, res: Response) {
  console.info(
    `[${new Date().toLocaleString()}] Incoming ${req.method} ${
      req.originalUrl
    } Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]} `
  );
  try {
    const reqPath = req.params.path;
    console.error(req.params.path, 'pat');
    const reqPathSplit = reqPath.split('-');
    const photoPath = path.join('uploads', reqPathSplit[0]);
    const options = {
      root: photoPath,
    };

    res.sendFile(reqPath, options, function (err) {
      if (err) {
        console.error('Error sending file:', err);
      } else {
      }
    });
    // res.download(photoPath, (err) => {
    //   if (err) {
    //     console.error('File download failed:', err);
    //     res.status(500).send('Error downloading file');
    //   }
    // });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
}

export default {
  createUser,
  getUserById,
  getUserByUserName,
  uploadPhoto,
  login,
  getUserByEmail,
  getUserPhoto,
};
