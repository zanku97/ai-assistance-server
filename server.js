import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.post("/chat", async (req, res) => {

  const message = req.body.message;

  try {

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are the AI assistant for DigitalKeyHub.

DigitalKeyHub sells:
- Windows activation keys
- VPN subscriptions
- Video editing software
- Photo editing software

Help users:
• Find products
• Understand pricing
• Learn how to buy
• Get activation instructions

Always answer clearly and guide the user step-by-step.
`
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

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Something went wrong." });
  }

});

app.listen(3000, () => {
  console.log("AI server running on port 3000");
});