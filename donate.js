// donate.js
// controls the donate button and modal; click anywhere (backdrop or panel) closes

const donateBtn = document.getElementById('donateBtn');
const donateModal = document.getElementById('donateModal');

if (donateBtn && donateModal) {
  function openDonate() {
    donateModal.hidden = false;
    // focus for accessibility
    const h = donateModal.querySelector('#donateTitle');
    if (h) h.focus?.();
  }
  function closeDonate() {
    donateModal.hidden = true;
  }

  donateBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openDonate();
  });

  // close when clicking backdrop or anywhere in modal (as requested)
  donateModal.addEventListener('click', (e) => {
    // any click inside modal should close; prevent accidental double handling
    if (e.target.closest('.modal-panel') || e.target.matches('.modal-backdrop') || donateModal.contains(e.target)) {
      closeDonate();
    }
  });

  // allow ESC to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !donateModal.hidden) closeDonate();
  });
}