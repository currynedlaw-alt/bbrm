const modal = document.getElementById('artist-modal');
const modalName = modal.querySelector('.modal-artist-name');
const modalImage = modal.querySelector('.modal-artist-image');
const modalLabelLogo = modal.querySelector('.modal-label-logo');
const closeBtn = modal.querySelector('.modal-close');

function openModal(trigger) {
  const name = trigger.dataset.artistName || '';
  const img = trigger.querySelector('img'); // main artist photo
  const labelLogo = trigger.querySelector('.artist-label-logo');

  modalName.textContent = name;
  modalImage.src = img ? img.src : '';
  modalImage.alt = name;
  modalLabelLogo.src = labelLogo ? labelLogo.src : '';
  modalLabelLogo.alt = '';

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  closeBtn.blur(); 
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

export function initModal() {
  document.querySelectorAll('[data-modal-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(trigger);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // click on overlay, not the box itself
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}