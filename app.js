// ...existing code...
import mitt from 'mitt';

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
  P41: 9, P42: 10, P43: 9, P44: 13, P45: 10, P46: 10, P47: 9, P48: 10, P49: 9
};

const bus = mitt();

const reader = document.getElementById('reader');
const catalogBtn = document.getElementById('catalogBtn');
const catalogModal = document.getElementById('catalogModal');
const catalogList = document.getElementById('catalogList');

let currentChapter = null;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateNavButtons() {
  if (!currentChapter) {
    prevBtn.disabled = true; nextBtn.disabled = true;
    return;
  }
  const num = Number(currentChapter.slice(1));
  prevBtn.disabled = num <= 1;
  nextBtn.disabled = num >= 49;
}

prevBtn.addEventListener('click', () => {
  if (!currentChapter) return;
  const num = Number(currentChapter.slice(1));
  if (num > 1) bus.emit('select', `P${num - 1}`);
});
nextBtn.addEventListener('click', () => {
  if (!currentChapter) return;
  const num = Number(currentChapter.slice(1));
  if (num < 49) bus.emit('select', `P${num + 1}`);
});

/* Build catalog items P1 - P49 */
for (let i = 1; i <= 49; i++) {
  const id = `P${i}`;
  const item = document.createElement('button');
  item.className = 'catalog-item';
  item.type = 'button';
  item.textContent = id;
  if (!chapterPages[id]) {
    item.setAttribute('aria-disabled', 'true');
    item.title = '未上线';
  } else {
    item.addEventListener('click', () => {
      bus.emit('select', id);
      closeModal();
    });
  }
  catalogList.appendChild(item);
}

/* Modal controls */
function openModal() {
  catalogModal.hidden = false;
  // focus first enabled item
  const first = catalogList.querySelector('.catalog-item[aria-disabled="false"], .catalog-item:not([aria-disabled])');
  if (first) first.focus();
}
function closeModal() { catalogModal.hidden = true; }
catalogBtn.addEventListener('click', openModal);
catalogModal.addEventListener('click', (e) => {
  if (e.target.matches('[data-close], .modal-backdrop')) closeModal();
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
  const frag = document.createDocumentFragment();
  for (let i = 1; i <= count; i++) {
    const img = document.createElement('img');
    img.className = 'page-img';
    img.loading = 'lazy';
    const lower = chapterId.toLowerCase(); // p1, p2, ...
    img.alt = `${chapterId} 第 ${i} 页`;
    img.src = `${IMAGE_ROOT}/${lower}-${i}.jpeg`;
    img.onerror = () => {
      img.replaceWith(statusNode(`图片加载失败：${chapterId}/${lower}-${i}.jpeg`));
    };
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