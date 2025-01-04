import express, { Request, Response } from 'express';
const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello FestifAI!');
});

app.listen(port, () => {
  console.log(`FestifAI server listening at http://localhost:${port}`);
});
 