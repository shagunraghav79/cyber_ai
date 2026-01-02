
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path
const dataPath = path.join(__dirname, "../data/data.json");

// Load JSON
const cyberData = JSON.parse(fs.readFileSync(dataPath, "utf8"));



const { default: User } = await import('../models/user.model.js');
const { default: Bot } = await import('../models/bot.model.js');



export const message = async (req, res) => {
  try {
    const { text } = req.body;
    console.log(text);

    if (!text?.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Save user message
    const userMessage = await User.create({
      sender: "user",
      text
    });

    // Small built-in replies
    const botResponses = {
      "hello": "hi, how can I help you?",
      "hi":"hi, how can I help you?",
      "hy":"hi, how can I help you?",
      "who are you": "I am a chatbot",
      "what is your name": "my name is ChatBot",
      "bye": "goodbye! have a nice day",
      "who made you": "I was created by Shagun"
    };

    const normalizedText = text.toLowerCase().trim();

    // 1️⃣ Check small replies
    let responseText = botResponses[normalizedText];

    // 2️⃣ If not found → check big cyberData.json
    if (!responseText && cyberData[normalizedText]) {
      responseText = cyberData[normalizedText];
    }

    // 3️⃣ If still not found
    if (!responseText) {
      responseText = "I'm sorry, I didn't understand that. I'm still learning.";
    }

    // Save bot reply
    const botMessage = await Bot.create({
      text: responseText
    });

    return res.status(200).json({
      usermessage: userMessage.text,
      botmessage: botMessage.text
    });

  } catch (error) {
    console.error("Error handling message:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

