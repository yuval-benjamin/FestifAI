import { OpenAI, RateLimitError } from 'openai';
import { Request, Response } from 'express';

const baseURL = "https://api.aimlapi.com/v1";
const systemPrompt = "You are an expert on all music festivals happening around the world in the next year, we need the answers back in a json format so we can parse it";
// const apiKey = process.env.AI_API_KEY;
const apiKey = "
db94c6e5c45e438b82afca62dd2efa00"

const api = new OpenAI({
    apiKey,
    baseURL,
  });

// Send a question to chatGPT
async function askChatGPT(req: Request, res: Response) {
    // const question = req.body.question;
    const question = "answer so we can run JSON.parse(answer).give 3 festival pop music,europe,range 2000$. for 2025-get the exact dates from the festival websites-send back 3 festivals with these fields: name, country, dates, price, website";

    if (!question) {
      return res.status(400).json({ error: 'Missing question in request body' });
    }
  
    try {
      const completion = await api.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          // {
          //   role: "system",
          //   content: systemPrompt,
          // },
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

export { askChatGPT };