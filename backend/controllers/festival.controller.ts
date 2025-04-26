import { OpenAI, RateLimitError } from 'openai';
import { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
const baseURL = "https://api.aimlapi.com/v1";
const apiKey = process.env.AI_API_KEY;

const api = new OpenAI({
  apiKey,
  baseURL,
});

type GetFestivalsFromAiRequestBody = {
  highPrice: number;
  lowPrice: number;
}


export async function getFestivalsFromAi(req: Request, res: Response) {
  const { lowPrice, highPrice } = req.query as unknown as GetFestivalsFromAiRequestBody;
  const genre = "pop"
  const question = `Return a JSON array of 3 festivals in 2025 for ${genre} music, within ${lowPrice}$-${highPrice}$. Ensure festival dates are correct by verifying them from the official festival website. Each object must have:name,location,startDate,endDate, a locationCode of the nearest airport, a cityCode of the nearest city, and website.response only be upto 256 letter, dates have to be in a format of YYYY-MM-DD`

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

    res.status(200).send({ festivals: JSON.parse(response?.match( /\[.*\]/s)?.[0].replace(/\s+/g, ' ')) });

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
