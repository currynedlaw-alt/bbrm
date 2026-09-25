import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const PROJECT_PREFIX = "bbr:";

const CHAT_ID_KEY = `${PROJECT_PREFIX}telegram:connectedChatId`;

export async function saveChatId(chatId) {
  await redis.set(CHAT_ID_KEY, chatId);
}

export async function loadChatId() {
  const chatId = await redis.get(CHAT_ID_KEY);
  return chatId || null;
}

const SESSION_PREFIX = `${PROJECT_PREFIX}session:`;

export async function setSession(sessionId, data, ttlSeconds = 60 * 60 * 24) {
  await redis.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(data), {
    ex: ttlSeconds,
  });
}

export async function getSession(sessionId) {
  const data = await redis.get(`${SESSION_PREFIX}${sessionId}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data;
}

export async function deleteSession(sessionId) {
  await redis.del(`${SESSION_PREFIX}${sessionId}`);
}