import express, { Request, Response } from 'express';
import UserRouter from './routes/user.route';

const app = express();
const port = 8080;
const cors = require('cors');

async function main() {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/user', UserRouter);

  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main();
