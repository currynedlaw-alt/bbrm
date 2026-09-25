import { initFilter } from "./filter.js";
import { initModal } from "./modal.js";
import { initAuthModal } from "./auth-modal.js";
import { initProviderModal } from "./provider-modal.js";
import { initForm } from "./form.js";

document.addEventListener("DOMContentLoaded", () => {
  initFilter();
  initModal();
  initAuthModal();
  initProviderModal();
  initForm();
});
