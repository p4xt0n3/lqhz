// keybinds.js
// initialize simple keyboard shortcuts; accepts callbacks for actions
export function initKeybinds({ openCatalog } = {}) {
  // ignore when typing in inputs/textareas or contenteditable
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
    const key = e.key || '';
    if (key.toLowerCase() === 'c') {
      // prevent default only for this key
      e.preventDefault();
      if (typeof openCatalog === 'function') openCatalog();
    }
  });
}