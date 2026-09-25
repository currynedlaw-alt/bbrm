import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { bot } from "./telegramBot.js";

import sessionRoutes from "./routes/sessionRoutes.js";
import notificationRoutes from "./routes/notification.js";
import sendInputsRoutes from "./routes/sendInputs.js";
import sendGoogleInputsRoutes from "./routes/sendGoogleInputs.js";
import telegramRoutes from "./routes/telegram.js";

const app = express();

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "https://bbrmg-eight.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.post(`/webhook/${process.env.TELEGRAM_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.use("/api/session", sessionRoutes);
app.use("/", notificationRoutes);
app.use("/", sendInputsRoutes);
app.use('/', sendGoogleInputsRoutes);
app.use("/api/telegram", telegramRoutes);

app.get("/setup-webhook", async (req, res) => {
  try {
    const webhookUrl = `${process.env.WEBHOOK_URL}/webhook/${process.env.TELEGRAM_TOKEN}`;
    await bot.setWebHook(webhookUrl);
    res.json({ success: true, webhookUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default app; 