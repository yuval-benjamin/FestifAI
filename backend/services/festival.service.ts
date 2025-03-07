import { OpenAI, RateLimitError } from 'openai';
import { Request, Response } from 'express';

const baseURL = "https://api.aimlapi.com/v1";
// const apiKey = process.env.AI_API_KEY;
const apiKey = "db94c6e5c

45e438b82afca62dd2efa00"

const api = new OpenAI({
    apiKey,
    baseURL,
  });

type GetFestivalsFromAiRequestBody = {
  genre: string;
  highPrice: number;
  lowPrice: number;
}

export async function getFestivalsFromAi(req: Request, res: Response) {
  const { genre, lowPrice, highPrice } = req.body as GetFestivalsFromAiRequestBody;
  // const question = `answer so we can run JSON.parse(answer).${genre} music,range ${lowPrice}$-${highPrice}$.2025 Festivals- VERY IMPORTANT to get exact festival date from the festival website -send back 5 festivals with these fields:name,country,dates,website`;
  const question = `Return a JSON array of 5 festivals in 2025 for ${genre} music, within ${lowPrice}$-${highPrice}$. Ensure festival dates are correct by verifying them from the official festival website. Each object must have: name, country, dates, and website.`
    if (!question) {
      res.status(400).json({ error: 'Missing question in request body' });
      return
    }

    try {
      const completion = await api.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      });

      const response = completion.choices[0].message.content;
      console.log(response);

      res.status(200).send({ answer: response?.match(/\[.*\]/s)?.[0].replace(/\s+/g, ' ') });

    } catch (error) {
        console.log(error);

      // Check if the error is that we are out of tokens
      if (error instanceof RateLimitError) {
        res.status(429).json({ error: 'Rate limit exceeded. Please wait and try again later.' });
      } else {
          // If it's another error, handle it normally
          res.status(500).json({ error: 'An error occurred while processing your request.' });
      }
    }
  }