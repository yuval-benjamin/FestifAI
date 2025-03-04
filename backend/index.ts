import express, { Request, Response } from 'express';
import { askChatGPT } from './chat.service';
const app = express();
const port = 3000;

app.get('/test', (req: Request, res: Response) => {
  askChatGPT()
});

app.listen(port, () => {
  console.log(`FestifAI server listening at http://localhost:${port}`);
});
