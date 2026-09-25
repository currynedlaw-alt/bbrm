import { initLogin } from "./login.js";
import { initSession } from "./session.js";
import { API_URL } from "./config.js";

const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme() {
  document.documentElement.dataset.theme = themeQuery.matches
    ? "dark"
    : "light";
}

applyTheme();

themeQuery.addEventListener("change", applyTheme);

await initSession();
initLogin();
fetch(`${API_URL}/notify?variant=google`);