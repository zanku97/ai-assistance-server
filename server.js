import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

/* CORS FIX */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors()); // allow preflight requests

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.post("/chat", async (req, res) => {

  const message = req.body.message  || "Hello";

  try {

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
         content: `
You are the AI assistant for DigitalKeyHub.

IMPORTANT BUSINESS RULES:
- DigitalKeyHub delivers products via **WhatsApp**, NOT email.
- After purchase, customers receive their keys or accounts directly on WhatsApp.
- Always mention WhatsApp delivery when users ask about delivery.
- Never say delivery happens through email.

DigitalKeyHub sells:
- Windows activation keys
- VPN subscriptions
- Video editing software
- Photo editing software
- Antivirus software
- Microsoft Office keys
- AI software keys

Support guidelines:
- Give SHORT answers (2–4 sentences max)
- Be clear and helpful
- Only answer questions related to DigitalKeyHub
- If a user asks something unrelated, politely redirect them.

Example answers:
Q: How will I receive my product?
A: After your purchase, we send your product directly to your WhatsApp number.

Q: Do you send the key by email?
A: No. DigitalKeyHub delivers all products through WhatsApp for faster delivery.

When explaining steps, keep them simple and clear.

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