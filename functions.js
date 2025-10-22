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
