import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const HF_TOKEN = process.env.HF_TOKEN;

if (!HF_TOKEN) {
  console.error("❌ HF_TOKEN is missing from .env");
  process.exit(1);
}

const client = new InferenceClient(HF_TOKEN);

export async function getAIResponse(prompt) {
  console.log("🧠 Prompt received:", prompt);

  try {
    const chatCompletion = await client.chatCompletion({
      provider: "featherless-ai",
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("✅ Hugging Face response:", chatCompletion);

    return (
      chatCompletion?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't understand that."
    );
  } catch (err) {
    console.error("🔥 Hugging Face error:", err.message);
    return "Sorry, I'm having trouble answering that.";
  }
}
