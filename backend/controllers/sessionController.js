import crypto from "node:crypto";
import { getConnectedChatId } from "../telegramBot.js";
import { setSession, getSession as getSessionData } from "../sessionStore.js";

export async function createSession(req, res) {
  const sessionId = crypto.randomUUID();

  await setSession(sessionId, {
    telegramChatId: null,
    selectedNumber: null,
    telegramAction: null,
  });

res.cookie("sessionId", sessionId, {
  httpOnly: true,
  sameSite: "none", 
  secure: true,  
});

  res.json({
    success: true,
  });
}

export async function getSession(req, res) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: "No session found.",
    });
  }

  const session = await getSessionData(sessionId);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Invalid session.",
    });
  }

  res.json({
    success: true,
    session,
  });
}