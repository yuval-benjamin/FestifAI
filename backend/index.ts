import express from 'express';
import { festivalRouter } from './routers/festival.router';
const app = express();
const port = 3000;

app.use(express.json())
app.use('/festivals',festivalRouter);

app.listen(port, () => {
  console.log(`FestifAI server listening at http://localhost:${port}`);
});
