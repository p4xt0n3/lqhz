// ol.js
// Polls a JSON 'database' hosted on GitHub (raw file URL) to display current online count.
// Configure DB_URL to point to a GitHub raw JSON file that looks like: { "online": 12 }

const DB_URL = 'https://raw.githubusercontent.com/p4xt0n3/lqhz/main/online.json';
// polling interval (ms)
const POLL_INTERVAL = 10_000;

const badgeId = 'onlineBadge';

function safeGetBadge() {
  let b = document.getElementById(badgeId);
  if (!b) {
    b = document.createElement('div');
    b.id = badgeId;
    b.className = 'online-badge';
    b.setAttribute('aria-live', 'polite');
    b.textContent = '在线: —';
    document.body.appendChild(b);
  }
  return b;
}

async function fetchOnlineCount() {
  try {
    const res = await fetch(DB_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('网络错误');
    const data = await res.json();
    // expect data.online to be number
    if (typeof data.online !== 'number') throw new Error('无效数据');
    return data.online;
  } catch (e) {
    console.warn('ol.js fetchOnlineCount error', e);
    return null;
  }
}

async function updateLoop() {
  const badge = safeGetBadge();
  const n = await fetchOnlineCount();
  if (n === null) {
    badge.textContent = '在线: —';
    badge.classList.remove('pulse');
  } else {
    badge.textContent = `在线: ${n}`;
    // small pulse to attract attention when count changes
    badge.classList.add('pulse');
    setTimeout(() => badge.classList.remove('pulse'), 350);
  }
  setTimeout(updateLoop, POLL_INTERVAL);
}

// start after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateLoop, { once: true });
} else {
  updateLoop();
}
