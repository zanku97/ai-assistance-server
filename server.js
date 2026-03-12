import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.post("/chat", async (req, res) => {

  const message = req.body.message;

  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are a helpful website assistant."
      },
      {
        role: "user",
        content: message
      }
    ]
  });

  res.json({
    reply: completion.choices[0].message.content
  });

});

app.listen(3000, () => {
  console.log("AI server running on port 3000");
});