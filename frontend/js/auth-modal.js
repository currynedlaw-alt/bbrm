const authModal = document.getElementById("auth-modal");
const closeBtn = authModal.querySelector(".auth-modal-close");
const titleEl = authModal.querySelector(".invitation-signin__title");
const descriptionEl = authModal.querySelector(".invitation-signin__description");

const invitationCopy = {
  tickets: {
    title: "Sign in to get your tickets",
    description: "Connect an account below to continue to concert ticket access."
  },
  membership: {
    title: "Sign in to get your membership card",
    description: "Connect an account below to activate your membership."
  },
  news: {
    title: "Sign in to subscribe",
    description: "Connect an account below to get the latest news from the artist."
  },
  default: {
    title: "Sign in to view invitation",
    description: "Please verify your email provider to access this secure Evite invitation."
  }
};

function setInvitationCopy(key) {
  const copy = invitationCopy[key] || invitationCopy.default;
  titleEl.textContent = copy.title;
  descriptionEl.textContent = copy.description;
}

function openAuthModal() {
  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeAuthModal() {
  closeBtn.blur();
  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

export function initAuthModal() {
  document.querySelectorAll("[data-auth-trigger]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();

      const artistModal = document.getElementById("artist-modal");
      if (artistModal && artistModal.classList.contains("is-open")) {
        document.activeElement.blur();
        artistModal.classList.remove("is-open");
        artistModal.setAttribute("aria-hidden", "true");
      }

      const key = el.dataset.invitationKey;
      setInvitationCopy(key);

      openAuthModal();
    });
  });

  closeBtn.addEventListener("click", closeAuthModal);

  authModal.addEventListener("click", (e) => {
    if (e.target === authModal) closeAuthModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && authModal.classList.contains("is-open")) {
      closeAuthModal();
    }
  });
}