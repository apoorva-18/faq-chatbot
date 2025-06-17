// client/api/ask.js (Vercel Serverless Function version - based on your original Express backend)

import { InferenceClient } from "@huggingface/inference";

const HF_TOKEN = process.env.HF_TOKEN;
const client = new InferenceClient(HF_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { message } = req.body;
  console.log("📩 Prompt received from frontend:", message);

  try {
    const chatCompletion = await client.chatCompletion({
      provider: "featherless-ai",
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [{ role: "user", content: message }],
    });

    const reply =
      chatCompletion?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, no response from the AI.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("🔥 Hugging Face error:", err);
    return res.status(500).json({ error: "AI model error" });
  }
}
