import { API_URL } from "./config.js";

let sessionId = null;

export async function initSession() {
  const response = await fetch(`${API_URL}/api/session`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error("Failed to create session.");
  }
}

export function getSessionId() {
  return sessionId;
}
