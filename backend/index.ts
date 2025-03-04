import express, { Request, Response } from 'express';
import { spotifyRouter } from './routers/spotify.route';
import { askChatGPT } from './chat.service';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.get('/test', (req: Request, res: Response) => {
  askChatGPT(req, res);
});

app.use('/spotify', spotifyRouter);

app.listen(port, () => {
  console.log(`FestifAI server listening at http://localhost:${port}`);
});
