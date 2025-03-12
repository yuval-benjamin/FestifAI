import express, { Request, Response } from 'express';
import { spotifyRouter } from './routers/spotify.route';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello FestifAI!');
});

app.use('/spotify', spotifyRouter);

app.listen(port, () => {
  console.log(`FestifAI server listening at http://localhost:${port}`);
});
 