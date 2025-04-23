import { OpenAI, RateLimitError } from 'openai';
import { Request, Response } from 'express';
import { Festival } from '../models/Festival';
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
  const question = `Return a JSON array of 3 festivals in 2025 for ${genre} music, within ${lowPrice}$-${highPrice}$. Ensure festival dates are correct by verifying them from the official festival website. Each object must have:name,location,startDate,endDate, a locationCode of the nearest airport and website.response only be upto 256 letter, dates have to be in a format of YYYY-MM-DD`

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
    const jsonString = response?.match(/\[.*\]/s)?.[0].replace(/\s+/g, ' ');

    if (!jsonString) {
      console.log('Invalid response format from AI:', response);
    }

    const festivalsRaw = JSON.parse(jsonString);
    const savedFestivals = [];

    for (const fest of festivalsRaw) {
      const name = fest.name;

      // Check if the festival with the same name already exists
      const existingFestival = await Festival.findOne({ name });

      if (existingFestival) {
        console.log(`Festival ${name} already exists in DB, skipping...`);
        continue;
      }

      const newFestival = await Festival.create({
        name: fest.name,
        location: fest.location,
        startDate: fest.startDate,
        endDate: fest.endDate,
        locationCode: fest.locationCode,
        website: fest.website,
      });

      savedFestivals.push(newFestival);
    }


    res.status(200).send({ festivals: festivalsRaw });
  
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
