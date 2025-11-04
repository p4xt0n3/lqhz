// functions.js
// Arrow key navigation for comic parts:
// - Left / Right: previous / next part
// - Up: go to first available part (P1)
// - Down: go to latest available part (highest Pn present in chapterPages)

export function initPartNav({ getCurrent, emitSelect, totalChapters, getLatest } = {}) {
  if (typeof getCurrent !== 'function' || typeof emitSelect !== 'function') return;

  function isTypingTarget(e) {
    const t = e.target;
    if (!t) return false;
    const tag = t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
    if (t.isContentEditable) return true;
    return false;
  }

  // create a small box under the total image count badge to show current Part
  (function createPartBox() {
    // avoid duplicate
    if (document.getElementById('__current_part_box__')) return;
    const badge = document.getElementById('__count_badge__');
    // if no badge yet, still create and place near top-right
    const box = document.createElement('div');
    box.id = '__current_part_box__';
    box.className = 'count-badge'; // reuse visual style for consistency
    box.style.top = (badge ? (badge.getBoundingClientRect().bottom + 8) + 'px' : '56px');
    box.style.right = '16px';
    box.style.width = 'auto';
    box.style.padding = '6px 10px';
    box.style.fontSize = '13px';
    box.style.cursor = 'default';
    box.textContent = '当前章节: —';
    document.body.appendChild(box);

    // keep the box updated by polling getCurrent()
    let last = null;
    function refresh() {
      try {
        const cur = getCurrent();
        if (cur !== last) {
          last = cur;
          box.textContent = `当前章节: ${cur ? cur : '—'}`;
        }
      } catch (e) {
        // ignore
      }
    }
    // run immediately and then periodically
    refresh();
    const timer = setInterval(refresh, 300);
    // attempt to stop polling when element removed
    const mo = new MutationObserver(() => {
      if (!document.body.contains(box)) {
        clearInterval(timer);
        mo.disconnect();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  })();

  window.addEventListener('keydown', (e) => {
    if (isTypingTarget(e)) return;
    const key = e.key;
    if (!key) return;

    const cur = getCurrent(); // like "P12" or null
    let num = cur ? Number(String(cur).replace(/^P/, '')) : null;

    if (key === 'ArrowLeft') {
      if (num && num > 1) {
        emitSelect(`P${num - 1}`);
      }
    } else if (key === 'ArrowRight') {
      if (num && num < (totalChapters || Number.MAX_SAFE_INTEGER)) {
        emitSelect(`P${num + 1}`);
      }
    } else if (key === 'ArrowUp') {
      // go to first available (P1)
      emitSelect('P1');
    } else if (key === 'ArrowDown') {
      // go to latest available: prefer getLatest() if provided, otherwise fall back to totalChapters
      try {
        let latest = null;
        if (typeof getLatest === 'function') {
          latest = getLatest(); // expected like "P68" or numeric
        }
        if (latest == null && totalChapters && totalChapters > 0) latest = `P${totalChapters}`;
        if (typeof latest === 'number') latest = `P${latest}`;
        if (latest) emitSelect(String(latest));
      } catch (err) {
        // ignore
      }
    }
  });
}
