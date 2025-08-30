import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

console.log("Loaded GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // ✅ Use correct model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent("Say hello from Gemini");
    console.log("Gemini response:", result.response.text());
  } catch (err) {
    console.error("Gemini test error:", err.message || err);
  }
}

test();
