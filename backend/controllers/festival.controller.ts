import { OpenAI, RateLimitError } from 'openai';
import { Request, Response } from 'express';
import { Festival } from '../models/Festival';

const baseURL = "https://api.aimlapi.com/v1";
const apiKey = process.env.AI_API_KEY;

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
  // const { genre, lowPrice, highPrice } = req.body as GetFestivalsFromAiRequestBody;
  // const question = `Return a JSON array of 5 festivals in 2025 for ${genre} music, within ${lowPrice}$-${highPrice}$. Ensure festival dates are correct by verifying them from the official festival website. Each object must have: name, country, dates, and website.`

  try {
    // const completion = await api.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "user",
    //       content: question,
    //     },
    //   ],
    //   temperature: 0.7,
    //   max_tokens: 256,
    // });

    // const response = completion.choices[0].message.content;
    const response = `[
      {
        "name": "Test",
        "country": "USA",
        "dates": "April 11-13, 2025",
        "website": "https://www.coachella.com/"
      },
      {
        "name": "Glastonbury Festival",
        "country": "UK",
        "dates": "June 25-29, 2025",
        "website": "https://www.glastonburyfestivals.co.uk/"
      },
      {
        "name": "Lollapalooza",
        "country": "USA",
        "dates": "July 31 - August 3, 2025",
        "website": "https://www.lollapalooza.com/"
      },
      {
        "name": "Rock in Rio",
        "country": "Brazil",
        "dates": "September 19-28, 2025",
        "website": "https://www.rockinrio.com/"
      },
      {
        "name": "Primavera Sound",
        "country": "Spain",
        "dates": "June 5-7, 2025",
        "website": "https://www.primaverasound.com/"
      }
    ]`;
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
    console.log(`Festival ${name} already exists, skipping...`);
    continue;
  }

  const newFestival = await Festival.create({
    name: fest.name,
    country: fest.country,
    dates: fest.dates,
    website: fest.website,
  });

  savedFestivals.push(newFestival);
}


  res.status(200).json({ festivals: savedFestivals });
  
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
  
  // res.status(200).send({ festivals: response?.match(/\[.*\]/s)?.[0].replace(/\s+/g, ' ') });