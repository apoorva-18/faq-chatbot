// server/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getAIResponse } from "./huggingFace.js"; // Optional - OpenAI

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let unansweredQueries = [];
app.get("/", (req, res) => {
  res.send("API is working 👋");
});
app.post("/api/ask", async (req, res) => {
  const { message } = req.body;
    console.log("📩 Received from frontend:", message);


  try {
    const response = await getAIResponse(message); 
    console.log("🤖 Replying with:", response);
    res.json({ reply: response });// Use AI logic here
    if (!response) {
      unansweredQueries.push(message);
    }
    res.json({ reply: response || "Sorry, I don't know that yet." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
