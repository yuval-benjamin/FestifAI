import express, { Request, Response } from 'express';
import { spotifyRouter } from './routers/spotify.route';
import { festivalRouter } from './routers/festival.router';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json())
app.use('/festivals',festivalRouter);

app.use('/spotify', spotifyRouter);

app.listen(port, () => {
  console.log(`FestifAI server listening at http://localhost:${port}`);
});
