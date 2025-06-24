/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import './chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/ask`, {
        message: input,
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error connecting to server." }]);
    }
  };

  const sendFeedback = async (text, helpful) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/feedback`, {
        message: text,
        helpful: helpful,
      });
      console.log("Feedback sent:", { text, helpful });
    } catch (err) {
      console.error("Feedback error:", err);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.sender}`}>
            {msg.text}
            {msg.sender === "bot" && (
              <div className="feedback-buttons">
                <button onClick={() => sendFeedback(msg.text, true)}>👍</button>
                <button onClick={() => sendFeedback(msg.text, false)}>👎</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask a question..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
