/**
 * Wrapper helpers for Gemini (Google Generative AI).
 * Uses gemini-1.5-flash (fast) by default.
 */

import dotenv from "dotenv";
dotenv.config(); // ✅ ensures .env is loaded before anything else

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

console.log(
  "Gemini API Key Loaded:",
  process.env.GEMINI_API_KEY ? "Yes ✅" : "No ❌"
);

// Safely run a model call
async function runModel(prompt, maxRetries = 1) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result?.response?.text?.() || "";
  } catch (err) {
    console.error("Gemini error:", err?.message || err);
    if (maxRetries > 0) {
      return runModel(prompt, maxRetries - 1);
    }
    return "";
  }
}

// Summarize text (returns string)
export async function summarizeDoc(content) {
  if (!process.env.GEMINI_API_KEY)
    return "Auto-summary disabled (no API key)";

  const prompt = `Summarize the following document into 2–4 concise sentences:\n\n${content}`;
  const summary = await runModel(prompt);
  return summary || "Error generating summary";
}

// Generate tags (returns array of strings)
export async function generateTags(content, maxTags = 6) {
  if (!process.env.GEMINI_API_KEY) return ["ai-disabled"];

  const prompt = `Extract up to ${maxTags} short single-word or phrase tags for this document. Return them comma-separated:\n\n${content}`;
  const raw = await runModel(prompt);

  if (!raw) return ["ai-error"];

  const tags = raw
    .split(/,|\n/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, maxTags);

  return tags.length ? tags : ["ai-error"];
}

// Semantic relevance helper
export async function semanticSearch(query, docs, maxResults = 5) {
  if (!process.env.GEMINI_API_KEY)
    return { answer: "Semantic search disabled (no API key)" };

  const context = docs
    .map(
      (d) =>
        `Title: ${d.title}\nContent excerpt: ${d.content.slice(0, 800)}`
    )
    .join("\n\n---\n\n");

  const prompt = `You are a search assistant. Given the query: "${query}", return the top ${maxResults} relevant docs from this context. Format as JSON: [{"title":"...","reason":"..."}]\n\nCONTEXT:\n${context}`;

  const raw = await runModel(prompt);
  try {
    return { items: JSON.parse(raw) };
  } catch {
    return { items: null, raw };
  }
}

// Q&A given docs
export async function answerQuestion(question, docs) {
  if (!process.env.GEMINI_API_KEY) return "Q&A disabled (no API key)";

  const context = docs
    .map((d) => `Title: ${d.title}\nContent: ${d.content}`)
    .join("\n\n---\n\n");

  const prompt = `Answer the user's question using ONLY these docs. If not found, say "I don't know based on the provided documents."\n\nDOCUMENTS:\n${context}\n\nQUESTION: ${question}\n\nAnswer:`;

  const answer = await runModel(prompt);
  return answer || "Error generating answer";
}
