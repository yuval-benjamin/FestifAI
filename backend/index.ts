import express, { Request, Response } from 'express';
import { connectToMongoDB } from './config/mongo';
import { spotifyRouter } from './routers/spotify.route';
import { festivalRouter } from './routers/festival.router';
import dotenv from "dotenv";
import { amadeusRouter } from './routers/amadeus.router';
dotenv.config();
connectToMongoDB();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
const port = 3000;

app.use(express.json())
app.use('/festivals',festivalRouter);

app.use('/spotify', spotifyRouter);
app.use('/amadeus', amadeusRouter);


app.listen(port, () => {
  console.log(`FestifAI server listening at http://localhost:${port}`);
});