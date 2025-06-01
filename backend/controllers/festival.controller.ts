import { OpenAI, RateLimitError } from 'openai';
import { Request, Response } from 'express';
import { Festival } from '../models/Festival';
import { User } from '../models/User';
import dotenv from "dotenv";
dotenv.config();
const baseURL = "https://api.aimlapi.com/v1";
const apiKey = process.env.AI_API_KEY;

const api = new OpenAI({
  apiKey,
  baseURL,
});

type GetFestivalsFromAiRequestBody = {
  priceArea: number;
  location: string;
  date: string;
  page: number
}

export async function getFestivalsFromAi(req: Request, res: Response) {
  const { date, priceArea, location, page, email } = req.query as unknown as GetFestivalsFromAiRequestBody & { email: string };

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const genreList = (!user.favoriteGenres || user.favoriteGenres.length === 0)
    ? "pop" // Default genre if none are set
    : user.favoriteGenres.join(", ");

  const question = `Return a JSON array of 2 *different* ${genreList} music festivals in 2025 that have not been listed in previous pages (this is page ${page}), price area:${priceArea}$,general location-${location}, genre, general date-${date} Each object must have: name, genre, location,startDate,endDate,locationCode (nearest airport), cityCode (nearest city),category - Only One of three types urban, nature or desert, website. Dates in YYYY-MM-DD. Response must be max 256 characters.`;
  console.log(question.length)
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
    const jsonString = response?.match(/\[.*?\]/s)?.[0];

    if (!jsonString) {
      console.log('Invalid response format from AI:', response);
    } else {
      try {
        const data = JSON.parse(jsonString);
        console.log('Parsed data:', data);
      } catch (error) {
        console.log('JSON parsing error:', error.message);
      }
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
        category: fest.category,
        name: fest.name,
        location: fest.location,
        startDate: fest.startDate,
        endDate: fest.endDate,
        locationCode: fest.locationCode,
        genre: fest.genre,
        website: fest.website,
      });

      savedFestivals.push(newFestival);
    }


    res.status(200).send({ festivals: festivalsRaw });

  } catch (error) {
    console.log(error);

    // Check if the error is that we are out of tokens
    if (error instanceof RateLimitError || error.status === 403) {
      res.status(429).json({ error: 'Rate limit exceeded. Please wait and try again later.' });
    } else {
      // If it's another error, handle it normally
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  }
}
