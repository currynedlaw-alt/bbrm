export function initFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.artist-card');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const label = btn.dataset.label;

      cards.forEach((card) => {
        const show = label === '*' || card.dataset.label === label;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}