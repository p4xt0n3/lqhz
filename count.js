export function initCount(mapping = {}) {
  const total = Object.values(mapping).reduce((s, v) => s + (Number(v) || 0), 0);
  let el = document.getElementById('__count_badge__');
  if (!el) {
    el = document.createElement('div');
    el.id = '__count_badge__';
    el.className = 'count-badge';
    document.body.appendChild(el);
  }
  el.textContent = `总图数: ${total}`;
  return el;
}

