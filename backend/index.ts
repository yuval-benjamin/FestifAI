import express, { Request, Response } from 'express';
import { connectToMongoDB } from './config/mongo';
import { spotifyRouter } from './routers/spotify.route';
import { festivalRouter } from './routers/festival.router';
import dotenv from "dotenv";
import { amadeusRouter } from './routers/amadeus.router';
import cors from 'cors';
import { categoryRouter } from './routers/category.router';
import https from 'https';
import http from 'http';
import fs from 'fs';

dotenv.config();
connectToMongoDB();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
const port: string = process.env.PORT || "3000";

app.use(cors());

app.use(express.json())
app.use(cors());
app.use('/festivals', festivalRouter);
app.use('/category', categoryRouter);

app.use('/spotify', spotifyRouter);
app.use('/amadeus', amadeusRouter);


// app.listen(port, () => {
//   console.log(`FestifAI server listening at http://localhost:${port}`);
// });

if(process.env.NODE_ENV !== 'production') {
  console.log("development env");
  http.createServer(app).listen(port)
} else {
  const options = {
    key: fs.readFileSync('./client-key.pem'),
    cert: fs.readFileSync('./client-cert.pem')
  }
  console.log("production env")
  https.createServer(options, app).listen(443)
}