import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const chatWithGemini = async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    // Model select karna hoga
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Response generate karo
    const result = await model.generateContent(message);

    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini API failed" });
  }
};
