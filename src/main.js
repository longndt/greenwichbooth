import QRCode from 'qrcode';
import mascotUrl from './assets/mascot.png';
import './styles.css';
import { POSTER_THEMES } from './concepts.js';

// Face detection removed — simplified accessory positioning (fixed positioning)

// ── State ─────────────────────────────────────────────────────────────────────
const isMobile = () => window.innerWidth <= 768;

const S = {
  mode: 'ready',
  interval: 3,
  eventName: localStorage.getItem('greenwichbooth.eventName') || '',
  studentName: localStorage.getItem('greenwichbooth.studentName') || '',
  photos: [],
  stream: null,
  posterUrl: null,
  themeIndex: Number(localStorage.getItem('greenwichbooth.themeIndex') || 0) || 0,
  layoutIndex: Number(localStorage.getItem('greenwichbooth.layoutIndex') || 0) || 0,
  lockedThemeIndex: null,
  lockedLayoutIndex: null,
  showPosterPreview: !isMobile(),
};

const THEME_OPTIONS = POSTER_THEMES.map(theme => ({ label: theme.name }));
const INTERVAL_OPTIONS = [3, 4, 5];
const LAYOUT_OPTIONS = [
  { label: 'Bố cục 1' },
  { label: 'Bố cục 2' },
  { label: 'Bố cục 3' },
];
const POSTER_LAYOUTS = [
  [
    { x: 64, y: 262, w: 952, h: 596, hero: true },
    { x: 64, y: 884, w: 300, h: 300 },
    { x: 390, y: 884, w: 300, h: 300 },
    { x: 716, y: 884, w: 300, h: 300 },
  ],
  [
    { x: 64, y: 262, w: 626, h: 922, hero: true },
    { x: 716, y: 262, w: 300, h: 296 },
    { x: 716, y: 575, w: 300, h: 296 },
    { x: 716, y: 888, w: 300, h: 296 },
  ],
  [
    { x: 64, y: 262, w: 464, h: 449 },
    { x: 552, y: 262, w: 464, h: 449 },
    { x: 64, y: 735, w: 464, h: 449 },
    { x: 552, y: 735, w: 464, h: 449 },
  ],
];

const q  = s => document.querySelector(s);
const qa = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const loadImage = url => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = url;
});

function syncThemePicker() {
  qa('.theme-chip[data-theme-index]').forEach(btn => {
    const index = Number(btn.dataset.themeIndex || 0);
    const active = index === S.themeIndex;
    const theme = POSTER_THEMES[index] || POSTER_THEMES[0];
    btn.style.setProperty('--chip-a', theme.photos.borderColor);
    btn.style.setProperty('--chip-b', theme.photos.cornerAccent.color);
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
    btn.disabled = S.mode !== 'ready';
  });
}

function syncLayoutPicker() {
  const layoutId = String(S.layoutIndex + 1);
  const grid = q('#photo-grid');
  if (grid) grid.dataset.layout = layoutId;
  qa('.layout-chip[data-layout-index]').forEach(btn => {
    const index = Number(btn.dataset.layoutIndex || 0);
    const active = index === S.layoutIndex;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
    btn.disabled = S.mode !== 'ready';
  });
}

function syncIntervalPicker() {
  qa('.time-chip').forEach(btn => {
    const seconds = Number(btn.dataset.interval || 3);
    const active = seconds === S.interval;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
    btn.disabled = S.mode !== 'ready';
  });
}

function syncPosterPreview() {
  const preview = q('#poster-preview');
  if (!preview) return;

  const theme = POSTER_THEMES[S.themeIndex] || POSTER_THEMES[0];

  preview.dataset.themeIndex = String(theme.id);
  preview.style.setProperty('--preview-shell-bg', `linear-gradient(180deg, ${theme.header.bg} 0%, ${theme.bg.color} 54%, ${theme.footer.bg} 100%)`);
  preview.style.setProperty('--preview-shell-border', theme.frame.outer);
  preview.style.setProperty('--preview-shell-glow', theme.photos.slotShadow);
  preview.style.setProperty('--preview-shell-accent', theme.photos.borderColor);
  preview.style.setProperty('--preview-shell-surface', theme.photos.slotBg);
  preview.style.setProperty('--preview-shell-badge', theme.header.topBar.color);
  preview.style.setProperty('--preview-slot-bg', theme.photos.slotBg);
  preview.style.setProperty('--preview-slot-border', theme.photos.borderColor);
  preview.style.setProperty('--preview-slot-accent', theme.photos.cornerAccent.color);
  preview.style.setProperty('--preview-badge-ink', theme.bg.color);
}

function setThemeIndex(nextIndex) {
  if (S.mode !== 'ready') return;
  const index = Math.max(0, Math.min(POSTER_THEMES.length - 1, Number(nextIndex) || 0));
  S.themeIndex = index;
  localStorage.setItem('greenwichbooth.themeIndex', String(index));
  syncThemePicker();
  syncPosterPreview();
}

function setLayoutIndex(nextIndex) {
  if (S.mode !== 'ready') return;
  const index = Math.max(0, Math.min(POSTER_LAYOUTS.length - 1, Number(nextIndex) || 0));
  S.layoutIndex = index;
  localStorage.setItem('greenwichbooth.layoutIndex', String(index));
  syncLayoutPicker();
}

function setIntervalSeconds(nextInterval) {
  if (S.mode !== 'ready') return;
  const seconds = Number(nextInterval) || 3;
  S.interval = INTERVAL_OPTIONS.includes(seconds) ? seconds : 3;
  syncIntervalPicker();
}

function syncStudentNameField() {
  const input = q('#student-name');
  if (!input) return;
  input.value = S.studentName;
  input.disabled = S.mode !== 'ready';
}

function syncEventNameField() {
  const input = q('#event-name');
  if (!input) return;
  input.value = S.eventName;
  input.disabled = S.mode !== 'ready';
}

function setStudentName(nextName) {
  if (S.mode !== 'ready') return;
  const name = String(nextName || '').replace(/\s+/g, ' ').slice(0, 32);
  S.studentName = name;
  localStorage.setItem('greenwichbooth.studentName', name);
  syncStudentNameField();
}

function setEventName(nextName) {
  if (S.mode !== 'ready') return;
  const name = String(nextName || '').replace(/\s+/g, ' ').slice(0, 44);
  S.eventName = name;
  localStorage.setItem('greenwichbooth.eventName', name);
  syncEventNameField();
}

// ── Mount HTML ────────────────────────────────────────────────────────────────
q('#app').innerHTML = `
<div class="app">
  <header class="hdr">
    <div class="hdr-brand">
      <img class="hdr-lion" src="${mascotUrl}" alt="" aria-hidden="true">
      <div class="hdr-text">
        <span class="hdr-name">Greenwich Photobooth</span>
      </div>
    </div>
  </header>

  <div class="main">
    <!-- Camera -->
    <div class="cam-col">
      <div class="cam-box">
        <video id="cam" autoplay muted playsinline></video>
        <div class="frame-ov" id="fov"></div>

        <div class="cnt-ov hidden" id="cov">
          <div class="cnt-num-wrap">
            <div class="cnt-n" id="cnt-n">3</div>
            <img class="cnt-mascot" id="cnt-mascot" src="${mascotUrl}" alt="" aria-hidden="true">
          </div>
        </div>

        <div class="cam-err hidden" id="cerr">
          <span class="cam-err-icon">📷</span>
          <p>Không thể dùng camera.<br/>Kiểm tra quyền truy cập.</p>
          <button id="retry-cam" class="btn-outline" aria-label="Thử kết nối camera lại">Thử lại</button>
        </div>

      </div>
    </div>

    <!-- Controls -->
    <div class="ctrl-col">
      <div class="theme-picker" aria-label="Chọn phong cách poster">
        ${THEME_OPTIONS.map((theme, index) => `
          <button
            class="theme-chip"
            type="button"
            data-theme-index="${index}"
            aria-pressed="${index === S.themeIndex}"
            aria-label="Chọn phong cách ${theme.label}"
          >
            <span class="theme-chip-dot" aria-hidden="true"></span>
            <span class="theme-chip-text">
              <span class="theme-chip-label">${theme.label}</span>
            </span>
          </button>
        `).join('')}
      </div>
      <div class="layout-picker" aria-label="Chọn bố cục poster">
        ${LAYOUT_OPTIONS.map((layout, index) => `
          <button
            class="layout-chip"
            type="button"
            data-layout-index="${index}"
            aria-pressed="${index === S.layoutIndex}"
            aria-label="Chọn ${layout.label}"
          >
            <span class="theme-chip-label">Layout ${index + 1}</span>
          </button>
        `).join('')}
      </div>
      <div class="time-picker" aria-label="Chọn thời gian đếm ngược">
        ${INTERVAL_OPTIONS.map(seconds => `
          <button
            class="time-chip"
            type="button"
            data-interval="${seconds}"
            aria-pressed="${seconds === S.interval}"
            aria-label="Chọn ${seconds} giây"
          >
            <span class="theme-chip-dot" aria-hidden="true"></span>
            <span class="theme-chip-label">Countdown ${seconds}s</span>
          </button>
        `).join('')}
      </div>

      <div class="name-field">
        <input
          id="event-name"
          class="name-input"
          type="text"
          inputmode="text"
          maxlength="44"
          placeholder="Tên sự kiện"
          aria-label="Tên sự kiện để hiển thị trên poster"
        >
      </div>

      <div class="name-field">
        <input
          id="student-name"
          class="name-input"
          type="text"
          inputmode="text"
          maxlength="32"
          placeholder="Tên địa điểm"
          aria-label="Tên địa điểm để hiển thị trên poster"
        >
      </div>

      <section class="poster-shell" id="poster-preview" aria-label="Poster preview">
        <div class="photo-grid" id="photo-grid" data-layout="${S.layoutIndex + 1}">
          <div class="pv-slot" id="pvs0"><img class="pv" id="pv0" alt="Ảnh 1 được chụp"/><span class="pv-badge">1</span></div>
          <div class="pv-slot" id="pvs1"><img class="pv" id="pv1" alt="Ảnh 2 được chụp"/><span class="pv-badge">2</span></div>
          <div class="pv-slot" id="pvs2"><img class="pv" id="pv2" alt="Ảnh 3 được chụp"/><span class="pv-badge">3</span></div>
          <div class="pv-slot" id="pvs3"><img class="pv" id="pv3" alt="Ảnh 4 được chụp"/><span class="pv-badge">4</span></div>
        </div>
      </section>

      <button class="shoot-btn" id="shoot-btn" aria-label="Chụp">
        <span class="s-text">Chụp</span>
      </button>
    </div>
  </div>
</div>

<!-- Result overlay -->
<div class="result-ov hidden" id="rov">
  <div class="result-card">
    <img class="poster-img" id="poster-img" alt="Bộ poster 4 ảnh được ghép lại"/>
    <div class="dl-row">
      <div class="qr-wrap">
        <img id="qr-img" alt="Mã QR để quét và tải ảnh"/>
      </div>
      <div class="dl-info">
        <a id="dl-link" class="btn-primary" download="greenwichbooth.jpg" aria-label="Tải ảnh về máy">
          <span class="btn-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true">
              <path d="M12 3.5v9.2l3.2-3.2 1.8 1.8-6 6-6-6 1.8-1.8 3.2 3.2V3.5h2z"></path>
              <path d="M5 19.5h14v2H5z"></path>
            </svg>
          </span>
          <span>Tải ảnh</span>
        </a>
        <button id="print-btn" class="btn-primary" type="button" aria-label="In poster ra máy in">
          <span class="btn-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true">
              <path d="M7 7V3.5h10V7H7z"></path>
              <path d="M7 17.5h10V21H7z"></path>
              <path d="M6 9h12a3 3 0 0 1 3 3v4h-3v-3H6v3H3v-4a3 3 0 0 1 3-3zm1.5 2.2h9v1.8h-9z"></path>
            </svg>
          </span>
          <span>In ảnh</span>
        </button>
      </div>
    </div>
    <button id="retake-btn" class="btn-sec btn-full" aria-label="Chụp lại bộ ảnh mới">↩ Chụp lại</button>
  </div>
</div>


<div class="proc-ov hidden" id="proc-ov">
  <div class="proc-card">
    <img class="proc-img" id="proc-img" alt="Placeholder ảnh đang được xử lý" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1080 1440'%3E%3Cdefs%3E%3ClinearGradient id='pg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23005F73;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%230A9396;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1080' height='1440' fill='url(%23pg)'/%3E%3C/svg%3E"/>
    <div class="proc-spin"></div>
    <p class="proc-txt">Đang tạo poster...</p>
    <small class="proc-sub" id="proc-sub">Vui lòng chờ</small>
    <div class="proc-progress-wrap">
      <div class="proc-progress-bar" id="proc-progress"></div>
    </div>
  </div>
</div>

<canvas id="cvs" width="1080" height="1440" style="display:none"></canvas>
`;

// ── Camera ────────────────────────────────────────────────────────────────────
async function startCam() {
  try {
    S.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', aspectRatio: 4 / 3, width: { ideal: 1920 }, height: { ideal: 1440 } },
      audio: false,
    });
    const cam = q('#cam');
    cam.srcObject = S.stream;
    await new Promise(res => cam.addEventListener('loadedmetadata', res, { once: true }));
    q('#cerr').classList.add('hidden');
  } catch {
    q('#cerr').classList.remove('hidden');
  }
}

// ── Shoot sequence ────────────────────────────────────────────────────────────
async function shoot() {
  if (S.mode !== 'ready') return;
  if (!S.stream) { await startCam(); await sleep(600); }
  const cam = q('#cam');
  if (!cam.srcObject || cam.videoWidth === 0) return;

  S.mode = 'shooting';
  S.showPosterPreview = true;
  q('#shoot-btn').disabled = true;
  syncThemePicker();
  syncLayoutPicker();
  syncIntervalPicker();
  syncEventNameField();
  syncStudentNameField();
  S.photos = [];
  qa('.pv-slot').forEach(s => s.classList.remove('filled'));
  qa('.pv').forEach(p => { p.src = ''; });
  q('.ctrl-col').classList.remove('hide-preview');
  q('.ctrl-col').classList.add('shooting');
  q('#cov').classList.remove('hidden');

  for (let i = 0; i < 4; i++) {
    for (let c = S.interval; c > 0; c--) {
      q('#cnt-n').textContent = c;
      q('#cnt-n').dataset.tick = '1';
      await sleep(900);
      delete q('#cnt-n').dataset.tick;
      await sleep(80);
    }
    q('#cnt-n').textContent = '';
    q('#cnt-mascot').classList.add('is-visible');
    await sleep(280);
    q('#cnt-mascot').classList.remove('is-visible');

    S.photos.push(capFrame(cam));
    if (navigator.vibrate) navigator.vibrate([50]);

    q(`#pv${i}`).src = S.photos[i];
    q(`#pvs${i}`).classList.add('filled');

    q(`#d${i}`)?.classList.add('done');
    if (i < 3) await sleep(380);
  }

  q('#cov').classList.add('hidden');
  q('#shoot-btn').disabled = false;
  q('#proc-sub').textContent = 'Vui lòng chờ';
  q('#proc-ov').classList.remove('hidden');
  S.lockedThemeIndex = S.themeIndex;
  S.lockedLayoutIndex = S.layoutIndex;
  syncThemePicker();
  syncLayoutPicker();
  syncIntervalPicker();
  try {
    await buildPoster();
  } catch (err) {
    console.error('buildPoster failed:', err);
    q('#proc-sub').textContent = 'Không thể tạo poster, hãy chụp lại.';
    q('#proc-ov').classList.add('hidden');
    S.mode = 'ready';
    S.lockedThemeIndex = null;
    S.lockedLayoutIndex = null;
    syncThemePicker();
    syncLayoutPicker();
    syncIntervalPicker();
    syncEventNameField();
    syncStudentNameField();
    return;
  }
  let posterDataUrl;
  let uploadBlob;
  try {
    posterDataUrl = q('#cvs').toDataURL('image/jpeg', 0.88);
    uploadBlob = await canvasToBlob(q('#cvs'), 0.76);
  } catch (err) {
    // ponytail: canvas taint (SVG/CORS) → degrade gracefully
    console.error('toDataURL failed:', err);
    q('#proc-sub').textContent = 'Không thể xuất ảnh, hãy chụp lại.';
    q('#proc-ov').classList.add('hidden');
    S.mode = 'ready';
    S.lockedThemeIndex = null;
    S.lockedLayoutIndex = null;
    syncThemePicker();
    syncLayoutPicker();
    syncIntervalPicker();
    syncEventNameField();
    syncStudentNameField();
    return;
  }
  S.mode = 'done';
  syncEventNameField();
  syncStudentNameField();
  S.posterUrl = posterDataUrl;
  const uploadP = uploadPoster(uploadBlob);
  q('#proc-ov').classList.add('hidden');
  showResult(uploadP);
  S.lockedThemeIndex = null;
  S.lockedLayoutIndex = null;
  syncThemePicker();
  syncLayoutPicker();
  syncIntervalPicker();
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('toBlob failed')), 'image/jpeg', quality);
  });
}

function capFrame(cam) {
  const vw = cam.videoWidth, vh = cam.videoHeight;
  const sz = Math.min(vw, vh);

  const raw = document.createElement('canvas');
  raw.width = sz; raw.height = sz;
  const rx = raw.getContext('2d');
  rx.imageSmoothingEnabled = true;
  rx.imageSmoothingQuality = 'high';
  rx.translate(sz, 0); rx.scale(-1, 1);
  rx.drawImage(cam, (vw - sz) / 2, (vh - sz) / 2, sz, sz, 0, 0, sz, sz);

  return raw.toDataURL('image/jpeg', 0.98);
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawCornerAccents(ctx, x, y, w, h, color, size = 28, lw = 3) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';
  // TL
  ctx.beginPath(); ctx.moveTo(x + size, y); ctx.lineTo(x, y); ctx.lineTo(x, y + size); ctx.stroke();
  // TR
  ctx.beginPath(); ctx.moveTo(x + w - size, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + size); ctx.stroke();
  // BL
  ctx.beginPath(); ctx.moveTo(x, y + h - size); ctx.lineTo(x, y + h); ctx.lineTo(x + size, y + h); ctx.stroke();
  // BR
  ctx.beginPath(); ctx.moveTo(x + w - size, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - size); ctx.stroke();
  ctx.restore();
}

function drawHeaderBadge(ctx, name, fallback, x, y, maxW, h, theme, anchor = 'left') {
  const text = String(name || '').trim();
  const display = text || fallback;
  if (!display) return;

  ctx.save();
  const padX = 22;
  let fontSize = text ? 28 : 22;
  do {
    ctx.font = `900 ${fontSize}px "Be Vietnam Pro", Arial, sans-serif`;
    if (ctx.measureText(display).width <= maxW - padX * 2) break;
    fontSize -= 2;
  } while (fontSize >= 18);

  const textW = Math.min(ctx.measureText(display).width, maxW - padX * 2);
  const badgeW = Math.min(maxW, Math.max(128, Math.ceil(textW + padX * 2)));
  const badgeX = anchor === 'right' ? x + maxW - badgeW : x;

  ctx.shadowColor = text ? 'rgba(0, 31, 20, 0.50)' : 'rgba(0, 31, 20, 0.10)';
  ctx.shadowBlur = text ? 24 : 12;
  ctx.fillStyle = text ? 'rgba(0, 31, 20, 0.70)' : 'rgba(255,255,255,0.34)';
  roundRect(ctx, badgeX, y, badgeW, h, 24);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = theme.photos.borderColor;
  ctx.lineWidth = text ? 3 : 2;
  ctx.stroke();

  ctx.textAlign = anchor === 'right' ? 'center' : 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = text ? 'rgba(255,255,255,0.96)' : theme.title.color;
  ctx.fillText(
    display,
    anchor === 'right' ? badgeX + badgeW / 2 : badgeX + padX,
    y + h / 2 + 1,
    badgeW - padX * 2,
  );
  ctx.restore();
}

function drawStudentNameBadge(ctx, name, x, y, w, h, theme) {
  drawHeaderBadge(ctx, name, '', x, y, w, h, theme, 'right');
}

function drawEventNameBadge(ctx, name, x, y, w, h, theme) {
  const text = String(name || '').trim();
  const display = text || 'GREENWICH PHOTOBOOTH';

  ctx.save();
  const padX = 22;
  let fontSize = text ? 28 : 22;
  do {
    ctx.font = `900 ${fontSize}px "Be Vietnam Pro", Arial, sans-serif`;
    if (ctx.measureText(display).width <= w - padX * 2 - 10) break;
    fontSize -= 2;
  } while (fontSize >= 18);

  ctx.shadowColor = text ? 'rgba(0, 31, 20, 0.38)' : 'rgba(0, 31, 20, 0.10)';
  ctx.shadowBlur = text ? 18 : 10;
  ctx.fillStyle = text ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.22)';
  roundRect(ctx, x, y, w, h, 12);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = theme.header.topBar.color;
  roundRect(ctx, x, y, 8, h, 6);
  ctx.fill();
  ctx.strokeStyle = theme.header.topBar.color;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = text ? 'rgba(255,255,255,0.96)' : theme.title.color;
  ctx.fillText(display, x + padX, y + h / 2 + 1, w - padX * 2);
  ctx.restore();
}

// ── Poster composition (1080×1440) — Selected concept + rendering
async function buildPoster() {
  await document.fonts.ready;
  const mascot = await loadImage(mascotUrl);

  const cvs = q('#cvs');
  cvs.width = 1080; cvs.height = 1440;
  const ctx = cvs.getContext('2d');
  const W = 1080, H = 1440;

  const theme = POSTER_THEMES[S.lockedThemeIndex ?? S.themeIndex] || POSTER_THEMES[0];

  const headerH = 230;
  const pos = POSTER_LAYOUTS[S.lockedLayoutIndex ?? S.layoutIndex] || POSTER_LAYOUTS[0];

  // ── Background + texture ──
  ctx.fillStyle = theme.bg.color;
  ctx.fillRect(0, 0, W, H);

  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, 'rgba(10, 147, 150, 0.12)');
  bgGrad.addColorStop(0.45, 'rgba(0, 40, 58, 0)');
  bgGrad.addColorStop(1, 'rgba(214, 178, 65, 0.09)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  if (theme.bg.texture.type === 'grid') {
    ctx.fillStyle = theme.bg.texture.color;
    for (let x = 0; x < W; x += theme.bg.texture.step) ctx.fillRect(x, 0, 1, H);
    for (let y = 0; y < H; y += theme.bg.texture.step) ctx.fillRect(0, y, W, 1);
  } else if (theme.bg.texture.type === 'dots') {
    ctx.fillStyle = theme.bg.texture.color;
    const s = theme.bg.texture.step;
    for (let x = 0; x < W; x += s) for (let y = 0; y < H; y += s) ctx.fillRect(x, y, 2, 2);
  }

  // ── Header background ──
  ctx.fillStyle = theme.header.bg;
  ctx.fillRect(0, 0, W, headerH);
  ctx.fillStyle = theme.title.color;
  ctx.globalAlpha = 0.08;
  ctx.beginPath();
  ctx.moveTo(705, 0);
  ctx.lineTo(W, 0);
  ctx.lineTo(W, headerH);
  ctx.lineTo(610, headerH);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // ── Header top bar ──
  ctx.fillStyle = theme.header.topBar.color;
  ctx.fillRect(0, 0, W, theme.header.topBar.height);

  // ── Header bottom bar ──
  if (theme.header.bottomBar) {
    const grad = ctx.createLinearGradient(0, headerH - theme.header.bottomBar.height, 0, headerH);
    grad.addColorStop(0, theme.header.bottomBar.colors[0]);
    grad.addColorStop(1, theme.header.bottomBar.colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, headerH - theme.header.bottomBar.height, W, theme.header.bottomBar.height);
  }

  // ── Brand + slogan ──
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const brandX = 160;
  const badgeLeftX = 64;
  const badgeLeftW = 500;
  const badgeRightX = 760;
  const badgeRightW = 256;
  const badgeRowY = 154;
  const dateBadgeX = 760;
  const dateBadgeW = 256;
  ctx.font = '800 30px "Space Grotesk", Arial, sans-serif';
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = theme.title.color;
  ctx.fillText('GREENWICH VIETNAM', brandX, 70);
  ctx.font = '700 16px "Space Grotesk", Arial, sans-serif';
  ctx.fillStyle = theme.subtitle.color;
  ctx.fillText('CHANGE STARTS HERE', brandX, 104);

  ctx.save();
  ctx.beginPath();
  ctx.arc(96, 88, 40, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,203,47,0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.clip();
  ctx.drawImage(mascot, 64, 50, 64, 64);
  ctx.restore();

  // ── Date badge ──
  const d = new Date();
  const today = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  drawHeaderBadge(ctx, today, '', dateBadgeX, 62, dateBadgeW, 50, theme, 'right');

  // ── Photo slot shadows ──
  pos.forEach(({ x, y, w, h, hero }) => {
    ctx.save();
    ctx.shadowColor = theme.photos.slotShadow;
    ctx.shadowBlur = hero ? 34 : 22;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = theme.photos.slotBg;
    roundRect(ctx, x - 8, y - 8, w + 16, h + 16, theme.photos.radius + 2);
    ctx.fill();
    ctx.restore();
  });

  // ── Photo backgrounds ──
  pos.forEach(({ x, y, w, h }) => {
    ctx.fillStyle = theme.photos.slotBg;
    roundRect(ctx, x, y, w, h, theme.photos.radius);
    ctx.fill();
  });

  // ── Draw photos ──
  const photos = S.photos;
  await Promise.all(photos.map((p, i) => {
    const slot = pos[i];
    return drawPhoto(ctx, p, slot.x + 8, slot.y + 8, slot.w - 16, slot.h - 16, theme.photos.radius - 4);
  }));

  pos.forEach(({ x, y, w, h }) => {
    ctx.save();
    roundRect(ctx, x + 8, y + 8, w - 16, h - 16, theme.photos.radius - 4);
    ctx.clip();
    ctx.fillStyle = 'rgba(0,31,20,0.09)';
    ctx.fillRect(x + 8, y + 8, w - 16, h - 16);
    ctx.restore();
  });

  // ── Photo borders + corner accents ──
  pos.forEach(({ x, y, w, h, hero }) => {
    ctx.strokeStyle = theme.photos.borderColor;
    ctx.lineWidth = hero ? theme.photos.borderWidth + 1 : theme.photos.borderWidth;
    roundRect(ctx, x, y, w, h, theme.photos.radius);
    ctx.stroke();
    drawCornerAccents(ctx, x, y, w, h, theme.photos.cornerAccent.color, theme.photos.cornerAccent.size, theme.photos.cornerAccent.lw);
  });

  drawEventNameBadge(ctx, S.eventName, badgeLeftX, badgeRowY, badgeLeftW, 50, theme);
  drawStudentNameBadge(ctx, S.studentName, badgeRightX, badgeRowY, badgeRightW, 50, theme);

  // ── Footer statement ──
  const footerW = 520;
  const footerX = (W - footerW) / 2;
  ctx.fillStyle = theme.footer.bg;
  roundRect(ctx, footerX, 1304, footerW, 46, 14);
  ctx.fill();
  ctx.strokeStyle = theme.footer.borderColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.footer.hashtag.color;
  ctx.shadowColor = 'rgba(214,178,65,0.22)';
  ctx.shadowBlur = 5;
  ctx.font = '900 24px "Be Vietnam Pro", Arial, sans-serif';
  ctx.fillText(theme.footer.hashtag.text, 540, 1327);
  ctx.shadowColor = 'transparent';

  // ── Outer frame borders ──
  ctx.strokeStyle = theme.frame.outer;
  ctx.lineWidth = theme.frame.outerW;
  ctx.strokeRect(20, 20, W - 40, H - 40);
  ctx.strokeStyle = theme.frame.inner;
  ctx.lineWidth = theme.frame.innerW;
  ctx.strokeRect(32, 32, W - 64, H - 64);
}

function drawPhoto(ctx, url, x, y, w, h, radius = 0) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.max(w / img.width, h / img.height);
        const dw = img.width * scale, dh = img.height * scale;
        ctx.save();
        if (radius > 0) {
          roundRect(ctx, x, y, w, h, radius);
        } else {
          ctx.beginPath();
          ctx.rect(x, y, w, h);
        }
        ctx.clip();
        ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
        ctx.restore();
        res();
      } catch (e) { rej(e); }
    };
    img.onerror = rej;
    img.src = url;
  });
}

// ── Result screen ─────────────────────────────────────────────────────────────
function showResult(uploadP) {
  q('#poster-img').src = S.posterUrl;
  q('#dl-link').href   = S.posterUrl;
  q('#qr-img').src     = '';
  q('.qr-wrap').classList.add('qr-loading');
  q('#rov').classList.remove('hidden');

  uploadP.then(dlUrl => {
    q('.qr-wrap').classList.remove('qr-loading');
    if (!dlUrl) {
      return;
    }
    // Wrap image URL in display page with download button
    const displayUrl = `${window.location.origin}/api/display?url=${encodeURIComponent(dlUrl)}`;
    QRCode.toDataURL(displayUrl, { margin: 1, width: 240, color: { dark: '#005F73', light: '#fff' } })
      .then(qr => {
        q('#qr-img').src = qr;
      });
  });
}

async function uploadPoster(blob) {
  const TIMEOUT_MS = 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'image/jpeg' },
      body: blob,
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const { url } = await res.json();
    return url;
  } catch (err) {
    console.error('Upload error:', err.message);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function retake() {
  S.mode = 'ready'; S.photos = []; S.posterUrl = null; S.lockedThemeIndex = null; S.lockedLayoutIndex = null;
  q('#rov').classList.add('hidden');
  q('#qr-img').src = '';
  q('#shoot-btn').disabled = false;
  qa('.pv-slot').forEach(s => s.classList.remove('filled'));
  qa('.pv').forEach(p => { p.src = ''; });
  q('#cov').classList.add('hidden');
  q('.ctrl-col').classList.remove('shooting');
  S.showPosterPreview = !isMobile();
  if (!S.showPosterPreview) q('.ctrl-col').classList.add('hide-preview');
  syncThemePicker();
  syncPosterPreview();
  syncLayoutPicker();
  syncIntervalPicker();
  syncEventNameField();
  syncStudentNameField();
}

function printPoster() {
  if (!S.posterUrl) return;
  const printWindow = window.open('', '_blank', 'width=900,height=1200');
  if (!printWindow) return;
  printWindow.document.write(`<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>In Greenwich Booth</title>
  <style>
    @page { margin: 0; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #fff; }
    img { width: 100%; max-width: 1080px; height: auto; display: block; }
  </style>
</head>
<body>
  <img src="${S.posterUrl}" alt="Greenwich Booth poster" onload="window.focus(); window.print();">
</body>
</html>`);
  printWindow.document.close();
}

// ── Events ────────────────────────────────────────────────────────────────────
q('#shoot-btn').addEventListener('click', shoot);
q('#retry-cam').addEventListener('click', startCam);
q('#retake-btn').addEventListener('click', retake);
q('#print-btn').addEventListener('click', printPoster);
q('#event-name').value = S.eventName;
q('#event-name').addEventListener('input', e => setEventName(e.target.value));
q('#student-name').value = S.studentName;
q('#student-name').addEventListener('input', e => setStudentName(e.target.value));
qa('.theme-chip[data-theme-index]').forEach(btn => {
  btn.addEventListener('click', () => setThemeIndex(btn.dataset.themeIndex));
});
qa('.layout-chip[data-layout-index]').forEach(btn => {
  btn.addEventListener('click', () => setLayoutIndex(btn.dataset.layoutIndex));
});
qa('.time-chip').forEach(btn => {
  btn.addEventListener('click', () => setIntervalSeconds(btn.dataset.interval));
});

// ── Mobile orientation ───────────────────────────────────────────────────────
window.addEventListener('orientationchange', () => {
  if (S.mode === 'ready') startCam();
});

// ── Init ──────────────────────────────────────────────────────────────────────
if (!S.showPosterPreview) q('.ctrl-col').classList.add('hide-preview');
syncThemePicker();
syncPosterPreview();
syncLayoutPicker();
syncIntervalPicker();
syncEventNameField();
syncStudentNameField();
startCam();
if (import.meta.env.DEV) window.__t = { S, buildPoster, setThemeIndex, setLayoutIndex, setIntervalSeconds, setEventName, setStudentName };
