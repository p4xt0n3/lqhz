// ...existing code...
import mitt from 'mitt';
// add load module
import { showLoading, updateLoading, hideLoading } from './load.js';

/**
 * 配置：图片所在根目录
 * 请将图片放置为：./comics/PX/px-1.jpeg 等（全部为 .jpeg）
 */
const IMAGE_ROOT = '.';

/**
 * 章节页数映射（已扩展到 P1-P49）
 * 其余章节标记为未上线
 */
const chapterPages = {
  P1: 5, P2: 3, P3: 4, P4: 5, P5: 7,
  P6: 6, P7: 4, P8: 5, P9: 9, P10: 9,
  P11: 9, P12: 11, P13: 10, P14: 14, P15: 12,
  P16: 10, P17: 10, P18: 9, P19: 11, P20: 10,
  P21: 9, P22: 10, P23: 10, P24: 9, P25: 9,
  P26: 9, P27: 9, P28: 9, P29: 10, P30: 9,
  P31: 8, P32: 8, P33: 8, P34: 10, P35: 9,
  P36: 9, P37: 9, P38: 9, P39: 10, P40: 10,
  P41: 9, P42: 10, P43: 9, P44: 13, P45: 10, P46: 10, P47: 9, P48: 10, P49: 9,
  P50: 10, P51: 7, P52: 9, P53: 9, P54: 9, P55: 9, P56: 9, P57: 10, P58: 10, P59: 14
};

const TOTAL_CHAPTERS = 500; // updated: 5 pages × 100 parts each

const bus = mitt();

const reader = document.getElementById('reader');
const catalogBtn = document.getElementById('catalogBtn');
const catalogModal = document.getElementById('catalogModal');
const catalogList = document.getElementById('catalogList');
const contactBtn = document.getElementById('contactBtn');
const contactModal = document.getElementById('contactModal');
const catalogPages = document.getElementById('catalogPages');

let currentChapter = null;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
// track current catalog page (was missing which prevented clicks/initial render)
let currentCatalogPage = 1;

// Ciallo feature: flying text + sound
const cialloBtn = document.getElementById('cialloBtn');

// preload audio element
const cialloAudio = new Audio('ciallo.mp3');
cialloAudio.preload = 'auto';

function randColor() {
  // pick a vivid random color but avoid extremes
  const h = Math.floor(Math.random() * 360);
  const s = 75;
  const l = 55;
  return `hsl(${h} ${s}% ${l}%)`;
}

cialloBtn.addEventListener('click', () => {
  // play sound (attempt)
  try { cialloAudio.currentTime = 0; cialloAudio.play().catch(()=>{}); } catch(e) {}

  // create flying text
  const el = document.createElement('div');
  el.className = 'ciallo-fly';
  el.textContent = 'Ciallo～(∠・ω< )';
  el.style.color = randColor();

  // randomized vertical position slightly
  const vh = Math.max(80, window.innerHeight - 60);
  const topPx = Math.floor(window.innerHeight * (0.2 + Math.random() * 0.6));
  el.style.top = `${topPx}px`;

  document.body.appendChild(el);

  // force layout then animate to left off-screen
  requestAnimationFrame(() => {
    const travel = - (window.innerWidth + el.offsetWidth);
    el.style.transform = `translateX(${travel}px)`;
  });

  // clean up after animation
  setTimeout(() => {
    el.classList.add('exit');
    setTimeout(() => { if (el.parentNode) el.remove(); }, 300);
  }, 1700);
});

function updateNavButtons() {
  if (!currentChapter) {
    prevBtn.disabled = true; nextBtn.disabled = true;
    return;
  }
  const num = Number(currentChapter.slice(1));
  prevBtn.disabled = num <= 1;
  nextBtn.disabled = num >= TOTAL_CHAPTERS;
}

prevBtn.addEventListener('click', () => {
  if (!currentChapter) return;
  const num = Number(currentChapter.slice(1));
  if (num > 1) bus.emit('select', `P${num - 1}`);
});
nextBtn.addEventListener('click', () => {
  if (!currentChapter) return;
  const num = Number(currentChapter.slice(1));
  if (num < TOTAL_CHAPTERS) bus.emit('select', `P${num + 1}`);
});

/* replace the previous "Build catalog items P1 - P52" block with paged renderer */
function renderCatalogPage(page = 1) {
  catalogList.innerHTML = '';
  const start = (page - 1) * 100 + 1;
  const end = Math.min(page * 100, TOTAL_CHAPTERS);
  for (let i = start; i <= end; i++) {
    const id = `P${i}`;
    const item = document.createElement('button');
    item.className = 'catalog-item';
    item.type = 'button';
    item.textContent = id;
    if (!chapterPages[id]) {
      item.setAttribute('aria-disabled', 'true');
      item.title = '等着';
    } else {
      item.addEventListener('click', () => {
        bus.emit('select', id);
        closeModal();
      });
    }
    catalogList.appendChild(item);
  }
  // update page button pressed states
  const btns = catalogPages.querySelectorAll('.page-btn');
  btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.page === String(page) ? 'true' : 'false'));
}

catalogPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.page-btn');
  if (!btn) return;
  const p = Number(btn.dataset.page) || 1;
  currentCatalogPage = p;
  renderCatalogPage(p);
});

/* initialize first render */
renderCatalogPage(currentCatalogPage);

/* Modal controls */
function openModal() {
  catalogModal.hidden = false;
  // focus first enabled item
  const first = catalogList.querySelector('.catalog-item:not([aria-disabled="true"])');
  if (first) first.focus();
}
function closeModal() { catalogModal.hidden = true; }
catalogBtn.addEventListener('click', openModal);
catalogModal.addEventListener('click', (e) => {
  if (e.target.matches('[data-close], .modal-backdrop')) closeModal();
});

/* Contact modal controls */
function openContact() {
  contactModal.hidden = false;
  const close = contactModal.querySelector('[data-close]');
  // focus close button for accessibility
  if (close) close.focus();
}
function closeContact() { contactModal.hidden = true; }
contactBtn.addEventListener('click', openContact);
contactModal.addEventListener('click', (e) => {
  if (e.target.matches('[data-close], .modal-backdrop')) closeContact();
});

/* Render chapter */
bus.on('select', (chapterId) => {
  currentChapter = chapterId;
  updateNavButtons();
  renderStatus(`正在加载 ${chapterId}…`);
  const count = chapterPages[chapterId];
  if (!count) {
    renderStatus('该章节未上线');
    return;
  }

  // show loading overlay
  showLoading({ title: `加载 ${chapterId}`, total: count });

  const frag = document.createDocumentFragment();
  let loaded = 0;
  let errored = 0;

  for (let i = 1; i <= count; i++) {
    const img = document.createElement('img');
    img.className = 'page-img';
    img.loading = 'lazy';
    const lower = chapterId.toLowerCase(); // p1, p2, ...
    img.alt = `${chapterId} 第 ${i} 页`;
    img.src = `${IMAGE_ROOT}/${lower}-${i}.jpeg`;

    // handle load / error to update progress
    img.addEventListener('load', () => {
      loaded++;
      updateLoading({ loaded, total: count });
      if (loaded + errored === count) {
        // all settled
        hideLoading();
      }
    });
    img.addEventListener('error', () => {
      errored++;
      updateLoading({ loaded, total: count });
      // replace with status node placeholder so layout remains
      const note = statusNode(`图片加载失败：${chapterId}/${lower}-${i}.jpeg`);
      note.className = 'reader-status';
      // replace image with placeholder after it's attached
      setTimeout(() => {
        if (img.parentNode) img.replaceWith(note);
      }, 0);
      if (loaded + errored === count) {
        hideLoading();
      }
    });

    frag.appendChild(img);
  }
  reader.innerHTML = '';
  reader.appendChild(frag);
  // scroll into view top of reader
  reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* Helpers */
function renderStatus(text) {
  reader.innerHTML = '';
  reader.appendChild(statusNode(text));
}
function statusNode(text) {
  const p = document.createElement('p');
  p.className = 'reader-status';
  p.textContent = text;
  return p;
}

// 初始状态提示
renderStatus('点击左下角 "C" 打开目录');
