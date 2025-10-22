// music.js
// draggable music widget with play/pause, progress, menu to choose track, loop, and left/right keyboard change

const tracks = [
  { file: 'istheresomeoneelse.mp3', title: 'Is there someone else? — The Weeknd' },
  { file: 'tekit.mp3', title: 'Tek it — Cafuné' },
  { file: 'iloveyouso.mp3', title: 'I Love You So — The Walters' }
];

function createElem(html) {
  const div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstChild;
}

function initMusicWidget() {
  if (document.getElementById('__music_widget__')) return;
  const root = document.createElement('div');
  root.id = '__music_widget__';
  root.className = 'music-widget';
  root.innerHTML = `
    <div class="music-top">
      <button class="music-menu" aria-label="菜单">≡</button>
      <div class="music-title">Music</div>
      <button class="music-loop" title="循环: 关闭">⟳</button>
    </div>
    <div class="music-controls">
      <button class="music-btn" data-action="prev" title="上一首">◀</button>
      <button class="music-btn" data-action="play" title="播放/暂停">▶</button>
      <button class="music-btn" data-action="next" title="下一首">▶▶</button>
    </div>
    <div class="music-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
      <div class="music-bar"></div>
    </div>
    <div class="music-list-panel" aria-hidden="true"></div>
  `;
  document.body.appendChild(root);

  const menuBtn = root.querySelector('.music-menu');
  const listPanel = root.querySelector('.music-list-panel');
  const playBtn = root.querySelector('[data-action="play"]');
  const prevBtn = root.querySelector('[data-action="prev"]');
  const nextBtn = root.querySelector('[data-action="next"]');
  const bar = root.querySelector('.music-bar');
  const progress = root.querySelector('.music-progress');
  const titleEl = root.querySelector('.music-title');
  const loopBtn = root.querySelector('.music-loop');

  // build list
  tracks.forEach((t, idx) => {
    const it = document.createElement('div');
    it.className = 'music-item';
    it.textContent = t.title;
    it.dataset.idx = idx;
    it.addEventListener('click', () => {
      loadTrack(idx);
      play();
      hideList();
    });
    listPanel.appendChild(it);
  });

  let audio = new Audio();
  audio.preload = 'auto';
  let current = 0;
  let playing = false;
  let loop = false;
  function setTitle() { titleEl.textContent = tracks[current].title; }
  function loadTrack(idx) {
    current = (idx + tracks.length) % tracks.length;
    audio.src = tracks[current].file;
    setTitle();
    highlightList();
  }
  function highlightList() {
    listPanel.querySelectorAll('.music-item').forEach(el => {
      el.style.opacity = el.dataset.idx == current ? '1' : '0.7';
      el.style.fontWeight = el.dataset.idx == current ? '800' : '600';
    });
  }
  function play() {
    audio.play().then(()=>{}).catch(()=>{});
    playing = true; playBtn.textContent = '⏸';
  }
  function pause() {
    audio.pause();
    playing = false; playBtn.textContent = '▶';
  }
  function togglePlay() { playing ? pause() : play(); }

  // prev/next
  function prev() { loadTrack(current - 1); play(); }
  function next() { loadTrack(current + 1); play(); }

  // loop toggle
  function toggleLoop() {
    loop = !loop;
    audio.loop = loop;
    loopBtn.title = `循环: ${loop ? '开启' : '关闭'}`;
    loopBtn.style.opacity = loop ? '1' : '0.7';
  }

  // events
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  loopBtn.addEventListener('click', toggleLoop);

  // menu
  function showList() { listPanel.classList.add('show'); listPanel.setAttribute('aria-hidden','false'); }
  function hideList() { listPanel.classList.remove('show'); listPanel.setAttribute('aria-hidden','true'); }
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (listPanel.classList.contains('show')) hideList(); else showList();
  });
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) hideList();
  });

  // progress updates
  audio.addEventListener('timeupdate', () => {
    const pct = audio.duration ? Math.round((audio.currentTime / audio.duration) * 100) : 0;
    bar.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', pct);
  });
  audio.addEventListener('ended', () => {
    if (!audio.loop) next();
  });

  // click to seek
  progress.addEventListener('click', (e) => {
    const r = progress.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    if (audio.duration) audio.currentTime = audio.duration * x;
  });

  // keyboard left/right for track change
  // window.addEventListener('keydown', (e) => {
  //   const tag = (e.target && e.target.tagName) || '';
  //   if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
  //   if (e.key === 'ArrowLeft') prev();
  //   if (e.key === 'ArrowRight') next();
  // });

  // opacity when pointer away -> dim
  let hover = false;
  root.addEventListener('pointerenter', () => { hover = true; root.classList.remove('dim'); });
  root.addEventListener('pointerleave', () => { hover = false; setTimeout(()=>{ if(!hover) root.classList.add('dim'); }, 220); });
  // start dimmed
  root.classList.add('dim');

  // draggable (pointer events)
  let dragging = false;
  let startX = 0, startY = 0, startLeft = 0, startTop = 0;
  root.style.left = localStorage.getItem('music_left') || '8px';
  root.style.top = localStorage.getItem('music_top') || '40%';
  root.addEventListener('pointerdown', (e) => {
    // allow drag only when clicking empty area or top area (not buttons/inputs)
    if (e.target.closest('button') || e.target.closest('.music-list-panel')) return;
    dragging = true;
    root.setPointerCapture(e.pointerId);
    const rect = root.getBoundingClientRect();
    startX = e.clientX; startY = e.clientY;
    startLeft = rect.left; startTop = rect.top;
    e.preventDefault();
  });
  root.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newLeft = Math.max(6, Math.min(window.innerWidth - root.offsetWidth - 6, startLeft + dx));
    const newTop = Math.max(6, Math.min(window.innerHeight - root.offsetHeight - 6, startTop + dy));
    root.style.left = newLeft + 'px';
    root.style.top = newTop + 'px';
  });
  root.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    try { root.releasePointerCapture(e.pointerId); } catch(e){}
    // persist
    localStorage.setItem('music_left', root.style.left);
    localStorage.setItem('music_top', root.style.top);
  });

  // initialize first track and highlight
  loadTrack(0);
  pause();
}

// initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMusicWidget);
} else initMusicWidget();
