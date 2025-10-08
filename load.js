export function showLoading({ title = '加载中', total = 1 } = {}) {
  let overlay = document.getElementById('__loading_overlay__');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = '__loading_overlay__';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-panel" role="status" aria-live="polite">
        <div class="loading-title" id="__loading_title__">${title}</div>
        <div class="progress-track" aria-hidden="false">
          <div class="progress-bar" id="__loading_bar__" style="width:0%"></div>
        </div>
        <div style="margin-top:8px;font-size:13px;color:#666" id="__loading_text__">0 / ${total}</div>
      </div>
    `;
    document.body.appendChild(overlay);
  } else {
    overlay.querySelector('#__loading_title__').textContent = title;
    overlay.querySelector('#__loading_bar__').style.width = '0%';
    overlay.querySelector('#__loading_text__').textContent = `0 / ${total}`;
  }
  // store totals on element for updates
  overlay.dataset.total = String(total);
  overlay.classList.add('visible');
}

export function updateLoading({ loaded = 0, total = null } = {}) {
  const overlay = document.getElementById('__loading_overlay__');
  if (!overlay) return;
  const t = total !== null ? total : Number(overlay.dataset.total) || 1;
  const pct = Math.round((loaded / Math.max(1, t)) * 100);
  const bar = overlay.querySelector('#__loading_bar__');
  const txt = overlay.querySelector('#__loading_text__');
  if (bar) bar.style.width = `${pct}%`;
  if (txt) txt.textContent = `${loaded} / ${t}`;
}

export function hideLoading() {
  const overlay = document.getElementById('__loading_overlay__');
  if (!overlay) return;
  overlay.classList.remove('visible');
  // remove after transition
  setTimeout(() => {
    if (overlay && overlay.parentNode) overlay.remove();
  }, 220);
}