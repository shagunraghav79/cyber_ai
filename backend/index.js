
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import chatbotRoutes from './routes/chatbot.route.js';
import urlScanner from "./routes/url.scanner.route.js";
import passwordRoute from "./routes/pwd.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4002;

app.use(express.json());
app.use(cors());



// DB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// Routes
app.use("/bot/v1", chatbotRoutes);
app.use("/api/url", urlScanner);
app.use("/api/password", passwordRoute);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
