import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getAIResponse } from "./huggingFace.js"; // Replace with your own logic if needed

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage
let unansweredQueries = [];
let feedbackStorage = [];

// Health check
app.get("/", (req, res) => {
  res.send("✅ API is working 👋");
});

// Handle chatbot questions
app.post("/api/ask", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message must be a string." });
  }

  console.log("📩 Received from frontend:", message);

  try {
    const response = await getAIResponse(message);
    console.log("🤖 Replying with:", response);

    if (!response || response.toLowerCase().includes("sorry")) {
      unansweredQueries.push({
        question: message,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({ reply: response || "Sorry, I don't know that yet." });
  } catch (err) {
    console.error("❌ Error in /api/ask:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Handle feedback
app.post("/api/feedback", (req, res) => {
  const { message, helpful } = req.body;

  if (!message || typeof helpful !== "boolean") {
    return res.status(400).json({ error: "Invalid feedback payload." });
  }

  feedbackStorage.push({
    message,
    helpful,
    timestamp: new Date().toISOString(),
  });

  console.log("📊 Feedback received:", { message, helpful });
  res.status(200).json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
