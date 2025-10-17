// donate.js
// controls the donate button and modal (fade-in), close anywhere to dismiss
const donateBtn = document.getElementById('donateBtn');
const donateModal = document.getElementById('donateModal');

if (donateBtn && donateModal) {
  function openDonate() {
    donateModal.hidden = false;
  }
  function closeDonate() {
    donateModal.hidden = true;
  }

  donateBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openDonate();
  });

  // close when clicking backdrop or anywhere inside modal (per request: click anywhere to close)
  donateModal.addEventListener('click', () => {
    closeDonate();
  });

  // prevent clicks on nothing (optional): also close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDonate();
  });
}