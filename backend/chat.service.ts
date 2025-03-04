import { OpenAI, RateLimitError } from 'openai';

const baseURL = "https://api.aimlapi.com/v1";
const systemPrompt = "You are an expert on all music festivals happening around the world in the next year, we need the answers back in a json format so we can parse it";
const apiKey = "sk-proj-kOO
S8O2hLd2LXs17aHGiCZDTg6wdVje4_EWa-Gz5lvAd_St_RDnoX9PegGbRkwTulaOCCGvPmST3BlbkFJRRhrqD3tuHlRUACLIlDs_wFk81-xbZVsxs6dmnN3K7XVUDmfCwNyAhAYFzkWOq-6c54W_qbnMA";

const api = new OpenAI({
    apiKey,
    baseURL,
  });

// Send a question to chatGPT
async function askChatGPT() {
    const question = "we need a list of festivals for people who like rock music they want to spend around 2000 dollars near europe";
    try {
      const completion = await api.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      });

      console.log(completion)
      const response = completion.choices[0].message.content;
    //   res.status(200).send({ answer: response });

    } catch (error) {
        // console.log(error);
        console.log(error)
      // Check if the error is that we are out of tokens
      if (error instanceof RateLimitError) {
        // res.status(429).json({ error: 'Rate limit exceeded. Please wait and try again later.' });
      } else {
          // If it's another error, handle it normally
        //   res.status(500).json({ error: 'An error occurred while processing your request.' });
      }

    }
  }

export { askChatGPT };