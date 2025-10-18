// hzone.js
// Opens a full-page "好看的" gallery after 5 clicks on the Ciallo button.
// Images h1.png ... h100.png shown side-by-side, initially blurred; click toggles blur.

import { requestPassword } from './password.js';

const cialloBtn = document.getElementById('cialloBtn');
if (!cialloBtn) throw new Error('Ciallo button not found');

let clickCount = 0;

function createStyles() {
  if (document.getElementById('__hzone_styles__')) return;
  const s = document.createElement('style');
  s.id = '__hzone_styles__';
  s.textContent = `
    .hzone-modal {
      position: fixed;
      inset: 0;
      background: rgba(255,255,255,0.98);
      z-index: 20000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 24px;
      overflow: auto;
    }
    .hzone-header {
      width: 100%;
      max-width: 1200px;
      display:flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .hzone-title {
      font-size: 20px;
      font-weight: 800;
    }
    .hzone-close {
      border: none;
      background: #111;
      color: #fff;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
    }
    .hzone-grid {
      width: 100%;
      max-width: 1200px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 10px;
    }
    .hzone-item {
      position: relative;
      overflow: hidden;
      background: #f7f7f7;
      border: 1px solid #e6e6e6;
      border-radius: 6px;
      cursor: pointer;
    }
    .hzone-item img {
      display:block;
      width:100%;
      height:100%;
      object-fit:cover;
      transition: filter 180ms ease;
      filter: blur(6px);
      user-select: none;
      -webkit-user-drag: none;
    }
    .hzone-item.unblur img {
      filter: none;
    }
    @media (max-width:520px) {
      .hzone-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
    }
  `;
  document.head.appendChild(s);
}

function buildModal() {
  createStyles();
  const modal = document.createElement('div');
  modal.className = 'hzone-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', '好看的画廊');

  const header = document.createElement('div');
  header.className = 'hzone-header';

  const title = document.createElement('div');
  title.className = 'hzone-title';
  title.textContent = '好看的';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'hzone-close';
  closeBtn.setAttribute('aria-label', '关闭');
  closeBtn.textContent = '×';

  closeBtn.addEventListener('click', () => {
    if (modal.parentNode) modal.parentNode.removeChild(modal);
  });

  header.appendChild(title);
  header.appendChild(closeBtn);
  modal.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'hzone-grid';

  // create 100 images h1.png ... h100.png
  for (let i = 1; i <= 100; i++) {
    const item = document.createElement('div');
    item.className = 'hzone-item';
    const img = document.createElement('img');
    img.alt = `好看的 ${i}`;
    img.draggable = false;
    img.src = `h${i}.png`;
    // toggle blur on click (click once unblurs, click again blurs)
    item.addEventListener('click', (e) => {
      item.classList.toggle('unblur');
    });
    item.appendChild(img);
    grid.appendChild(item);
  }

  modal.appendChild(grid);

  // allow clicking backdrop area (outside header/grid) to not close accidentally;
  // user must click '×' to exit as per spec (but spec allowed top-right x).
  // pressing Escape closes modal
  function onKey(e) {
    if (e.key === 'Escape') {
      if (modal.parentNode) modal.parentNode.removeChild(modal);
      window.removeEventListener('keydown', onKey);
    }
  }
  window.addEventListener('keydown', onKey);

  return modal;
}

function openHzone() {
  // if already open, focus nothing
  if (document.querySelector('.hzone-modal')) return;
  // show confirm prompt first
  if (document.querySelector('.hzone-confirm')) return;
  const confirm = document.createElement('div');
  confirm.className = 'hzone-confirm';
  confirm.innerHTML = `<div class="hzone-confirm-panel" role="dialog" aria-label="确认">
    <div style="font-weight:700;margin-bottom:12px">要看点好看的嘛？</div>
    <div style="display:flex;gap:8px;justify-content:center">
      <button class="confirm-yes">包的bro</button>
      <button class="confirm-no">牛逼别</button>
    </div>
  </div>`;
  // simple styles (only added once)
  if (!document.getElementById('__hzone_confirm_styles__')) {
    const s = document.createElement('style');
    s.id = '__hzone_confirm_styles__';
    s.textContent = `.hzone-confirm{position:fixed;inset:0;background:rgba(0,0,0,0.36);display:flex;align-items:center;justify-content:center;z-index:20001}.hzone-confirm-panel{background:#fff;padding:16px;border-radius:10px;border:1px solid #e6e6e6;min-width:260px;text-align:center}.hzone-confirm-panel button{padding:8px 10px;border-radius:8px;border:1px solid #bbb;background:#111;color:#fff;cursor:pointer;font-weight:700}.hzone-confirm-panel .confirm-no{background:#fff;color:#111}`;
    document.head.appendChild(s);
  }
  document.body.appendChild(confirm);
  // handlers
  confirm.querySelector('.confirm-yes').addEventListener('click', async () => {
    // show password prompt before opening the hzone
    const proceed = await requestPassword({ promptText: '请输入密码', correct: '30-07-2025' });
    if (confirm.parentNode) confirm.parentNode.removeChild(confirm);
    if (proceed) {
      const modal = buildModal();
      document.body.appendChild(modal);
      modal.scrollTop = 0;
    } else {
      // do nothing if incorrect / cancelled
    }
  }, { once: true });
  confirm.querySelector('.confirm-no').addEventListener('click', () => {
    if (confirm.parentNode) confirm.parentNode.removeChild(confirm);
  }, { once: true });
}

cialloBtn.addEventListener('click', (e) => {
  // allow existing handlers (do not stop propagation)
  clickCount++;
  if (clickCount >= 5) {
    clickCount = 0;
    // small delay to allow any other effects to run
    setTimeout(openHzone, 80);
  }
  // reset counter after a short idle to avoid accidental long-term accumulation
  clearTimeout(cialloBtn.__hzone_reset_timer);
  cialloBtn.__hzone_reset_timer = setTimeout(() => { clickCount = 0; }, 2000);
});