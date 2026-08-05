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
  photoCount: Number(localStorage.getItem('greenwichbooth.photoCount') || 3) || 3,
  layoutIndex: Number(localStorage.getItem('greenwichbooth.layoutIndex') || 0) || 0,
  lockedThemeIndex: null,
  lockedLayoutIndex: null,
  showPosterPreview: !isMobile(),
};

const THEME_OPTIONS = POSTER_THEMES.map(theme => ({ label: theme.name }));
const INTERVAL_OPTIONS = [3, 5];
const PHOTO_COUNT_OPTIONS = [3, 4];
const LAYOUT_OPTIONS = [
  { label: 'Layout 1' },
  { label: 'Layout 2' },
];
const POSTER_WIDTH = 1080;
const POSTER_HEIGHT = 1350;
const POSTER_EXPORT_SCALE = 2;
const POSTER_LAYOUTS = {
  2: [
    [
      { x: 64, y: 262, w: 464, h: 922, hero: true },
      { x: 552, y: 262, w: 464, h: 922, hero: true },
    ],
    [
      { x: 64, y: 262, w: 684, h: 922, hero: true },
      { x: 776, y: 262, w: 240, h: 922 },
    ],
  ],
  3: [
    [
      { x: 64, y: 262, w: 952, h: 596, hero: true },
      { x: 64, y: 884, w: 464, h: 300 },
      { x: 552, y: 884, w: 464, h: 300 },
    ],
    [
      { x: 64, y: 262, w: 626, h: 922, hero: true },
      { x: 716, y: 262, w: 300, h: 449 },
      { x: 716, y: 735, w: 300, h: 449 },
    ],
  ],
  4: [
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
  ],
  5: [
    [
      { x: 64, y: 262, w: 626, h: 596, hero: true },
      { x: 716, y: 262, w: 300, h: 286 },
      { x: 716, y: 572, w: 300, h: 286 },
      { x: 64, y: 884, w: 464, h: 300 },
      { x: 552, y: 884, w: 464, h: 300 },
    ],
    [
      { x: 64, y: 262, w: 626, h: 449, hero: true },
      { x: 64, y: 735, w: 626, h: 449, hero: true },
      { x: 716, y: 262, w: 300, h: 296 },
      { x: 716, y: 575, w: 300, h: 296 },
      { x: 716, y: 888, w: 300, h: 296 },
    ],
  ],
};

const q  = s => document.querySelector(s);
const qa = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const nextFrame = () => new Promise(r => requestAnimationFrame(r));
const fadeOutProcessing = async () => {
  const cov = q('#cov');
  cov.classList.add('is-hiding');
  await sleep(260);
  cov.classList.remove('is-processing', 'is-hiding');
  cov.classList.add('hidden');
};
const getLayouts = () => POSTER_LAYOUTS[S.photoCount] || POSTER_LAYOUTS[3];
const getLayout = () => getLayouts()[S.layoutIndex] || getLayouts()[0];
if (!PHOTO_COUNT_OPTIONS.includes(S.photoCount)) S.photoCount = 3;
S.layoutIndex = Math.max(0, Math.min(getLayouts().length - 1, S.layoutIndex));
const loadImage = url => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = url;
});

function getPreviewSlots() {
  const layout = getLayout();
  return layout.map(slot => ({
    x: (slot.x / POSTER_WIDTH) * 100,
    y: (slot.y / POSTER_HEIGHT) * 100,
    w: (slot.w / POSTER_WIDTH) * 100,
    h: (slot.h / POSTER_HEIGHT) * 100,
    hero: !!slot.hero,
  }));
}

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
  if (grid) {
    grid.dataset.layout = layoutId;
    grid.dataset.photoCount = String(S.photoCount);
    const slots = getPreviewSlots();
    const html = Array.from({ length: S.photoCount }, (_, i) => `<div class="pv-slot" id="pvs${i}"><img class="pv" id="pv${i}" alt="Ảnh ${i + 1} được chụp"/><span class="pv-badge">${i + 1}</span></div>`).join('');
    if (grid.innerHTML !== html) grid.innerHTML = html;
    slots.forEach((slot, i) => {
      const el = q(`#pvs${i}`);
      if (!el) return;
      el.style.left = `${slot.x}%`;
      el.style.top = `${slot.y}%`;
      el.style.width = `${slot.w}%`;
      el.style.height = `${slot.h}%`;
    });
  }
  const locked = S.photoCount === 1;
  const picker = q('.layout-picker');
  if (picker) picker.classList.toggle('is-locked', locked);
  qa('.layout-chip[data-layout-index]').forEach(btn => {
    const index = Number(btn.dataset.layoutIndex || 0);
    const active = index === S.layoutIndex;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
    btn.disabled = S.mode !== 'ready' || locked;
  });
}

function syncPhotoCountPicker() {
  qa('.count-chip').forEach(btn => {
    const count = Number(btn.dataset.photoCount || 4);
    const active = count === S.photoCount;
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

function syncReadyCountdown() {
  if (S.mode !== 'ready') return;
  q('#cov')?.classList.remove('hidden');
  q('#cnt-mascot')?.classList.remove('is-visible');
  const n = q('#cnt-n');
  if (n) n.textContent = `${S.interval}s`;
}

function syncPosterPreview() {
  const preview = q('#poster-preview');
  if (!preview) return;

  const theme = POSTER_THEMES[S.themeIndex] || POSTER_THEMES[0];
  const d = new Date();
  const today = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;

  preview.dataset.themeIndex = String(theme.id);
  preview.style.setProperty('--preview-shell-bg', theme.bg.color);
  preview.style.setProperty('--preview-header-bg', theme.header.bg);
  preview.style.setProperty('--preview-footer-bg', theme.footer.bg);
  preview.style.setProperty('--preview-shell-border', theme.frame.outer);
  preview.style.setProperty('--preview-frame-inner', theme.frame.inner);
  preview.style.setProperty('--preview-shell-glow', theme.photos.slotShadow);
  preview.style.setProperty('--preview-shell-accent', theme.photos.borderColor);
  preview.style.setProperty('--preview-shell-surface', theme.photos.slotBg);
  preview.style.setProperty('--preview-shell-badge', theme.header.topBar.color);
  preview.style.setProperty('--preview-title', theme.title.color);
  preview.style.setProperty('--preview-subtitle', theme.subtitle.color);
  preview.style.setProperty('--preview-date', theme.date.color);
  preview.style.setProperty('--preview-footer-text', theme.footer.hashtag.color);
  preview.style.setProperty('--preview-footer-border', theme.footer.borderColor);
  preview.style.setProperty('--preview-slot-bg', theme.photos.slotBg);
  preview.style.setProperty('--preview-slot-border', theme.photos.borderColor);
  preview.style.setProperty('--preview-slot-accent', theme.photos.cornerAccent.color);
  preview.style.setProperty('--preview-badge-ink', theme.bg.color);
  q('#preview-event').textContent = S.eventName;
  q('#preview-date').textContent = today;
  q('#preview-place').textContent = S.studentName;
  q('#preview-hashtag').textContent = theme.footer.hashtag.text;
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
  if (S.photoCount === 1) return;
  const index = Math.max(0, Math.min(getLayouts().length - 1, Number(nextIndex) || 0));
  S.layoutIndex = index;
  localStorage.setItem('greenwichbooth.layoutIndex', String(index));
  syncLayoutPicker();
}

function setPhotoCount(nextCount) {
  if (S.mode !== 'ready') return;
  const count = Number(nextCount) || 3;
  S.photoCount = PHOTO_COUNT_OPTIONS.includes(count) ? count : 3;
  if (S.photoCount === 1) S.layoutIndex = 0;
  S.layoutIndex = Math.min(S.layoutIndex, getLayouts().length - 1);
  localStorage.setItem('greenwichbooth.photoCount', String(S.photoCount));
  localStorage.setItem('greenwichbooth.layoutIndex', String(S.layoutIndex));
  syncPhotoCountPicker();
  syncLayoutPicker();
}

function setIntervalSeconds(nextInterval) {
  if (S.mode !== 'ready') return;
  const seconds = Number(nextInterval) || 3;
  S.interval = INTERVAL_OPTIONS.includes(seconds) ? seconds : 3;
  syncIntervalPicker();
  syncReadyCountdown();
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
  syncPosterPreview();
}

function setEventName(nextName) {
  if (S.mode !== 'ready') return;
  const name = String(nextName || '').replace(/\s+/g, ' ').slice(0, 44);
  S.eventName = name;
  localStorage.setItem('greenwichbooth.eventName', name);
  syncEventNameField();
  syncPosterPreview();
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

        <div class="cnt-ov" id="cov">
          <div class="cnt-num-wrap">
            <div class="cnt-n" id="cnt-n">${S.interval}s</div>
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
      <div class="ctrl-grid" aria-label="Tùy chọn chụp">
        <div class="ctrl-col-group">
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

          <div class="count-picker" aria-label="Chọn số lượng ảnh">
            ${PHOTO_COUNT_OPTIONS.map(count => `
              <button
                class="count-chip"
                type="button"
                data-photo-count="${count}"
                aria-pressed="${count === S.photoCount}"
                aria-label="Chọn ${count} ảnh"
              >
                <span class="theme-chip-label">${count} ảnh</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="ctrl-col-group">
          <div class="layout-picker" aria-label="Chọn bố cục poster">
            ${LAYOUT_OPTIONS.map((layout, index) => `
              <button
                class="layout-chip"
                type="button"
                data-layout-index="${index}"
                aria-pressed="${index === S.layoutIndex}"
                aria-label="Chọn ${layout.label}"
              >
                <span class="theme-chip-label">${layout.label}</span>
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
                <span class="theme-chip-label">${seconds} giây</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="name-grid">
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
      </div>

      <section class="poster-shell" id="poster-preview" aria-label="Poster preview">
        <div class="preview-brand">
          <img class="preview-mascot" src="${mascotUrl}" alt="" aria-hidden="true">
          <div>
            <div class="preview-title">GREENWICH VIETNAM</div>
            <div class="preview-tagline">Change Starts Here</div>
          </div>
        </div>
        <div class="preview-meta">
          <div id="preview-date"></div>
          <div id="preview-place"></div>
        </div>
        <div class="preview-event" id="preview-event"></div>
        <div class="photo-grid" id="photo-grid" data-layout="${S.layoutIndex + 1}" data-photo-count="${S.photoCount}"></div>
        <div class="preview-footer" id="preview-hashtag"></div>
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
    <img class="poster-img" id="poster-img" alt="Poster được ghép lại"/>
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


<canvas id="cvs" width="${POSTER_WIDTH}" height="${POSTER_HEIGHT}" style="display:none"></canvas>
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
  syncPhotoCountPicker();
  syncIntervalPicker();
  syncEventNameField();
  syncStudentNameField();
  S.photos = [];
  qa('.pv-slot').forEach(s => s.classList.remove('filled'));
  qa('.pv').forEach(p => { p.src = ''; });
  q('.ctrl-col').classList.remove('hide-preview');
  q('.ctrl-col').classList.add('shooting');
  q('#cov').classList.remove('hidden');

  for (let i = 0; i < S.photoCount; i++) {
    for (let c = S.interval; c > 0; c--) {
      q('#cnt-n').textContent = String(c);
      q('#cnt-n').dataset.tick = '1';
      await sleep(650);
      delete q('#cnt-n').dataset.tick;
      await sleep(40);
    }
    q('#cnt-n').textContent = '';
    q('#cnt-mascot').classList.add('is-visible');
    await sleep(180);
    q('#cnt-mascot').classList.remove('is-visible');

    S.photos.push(capFrame(cam));
    if (navigator.vibrate) navigator.vibrate([50]);

    q(`#pv${i}`).src = S.photos[i];
    q(`#pvs${i}`).classList.add('filled');

    q(`#d${i}`)?.classList.add('done');
    if (i < S.photoCount - 1) await sleep(220);
  }

  await nextFrame();
  await sleep(1000);
  q('#cov').classList.add('is-processing');
  q('#cnt-n').textContent = 'Đang tạo poster...';
  q('#shoot-btn').disabled = false;
  S.lockedThemeIndex = S.themeIndex;
  S.lockedLayoutIndex = S.layoutIndex;
  syncThemePicker();
  syncLayoutPicker();
  syncIntervalPicker();
  await nextFrame();
  try {
    await buildPoster();
  } catch (err) {
    console.error('buildPoster failed:', err);
    q('#cov').classList.remove('is-processing');
    q('#cov').classList.add('hidden');
    alert('Không thể tạo poster, hãy chụp lại.');
    S.mode = 'ready';
    S.lockedThemeIndex = null;
    S.lockedLayoutIndex = null;
    syncThemePicker();
    syncLayoutPicker();
    syncPhotoCountPicker();
    syncIntervalPicker();
    syncReadyCountdown();
    syncEventNameField();
    syncStudentNameField();
    return;
  }
  let posterDataUrl;
  let uploadBlob;
  try {
    posterDataUrl = await exportPosterImage(q('#cvs'));
    uploadBlob = await canvasToBlob(q('#cvs'), 0.94);
  } catch (err) {
    // ponytail: canvas taint (SVG/CORS) → degrade gracefully
    console.error('toDataURL failed:', err);
    q('#cov').classList.remove('is-processing');
    q('#cov').classList.add('hidden');
    alert('Không thể xuất ảnh, hãy chụp lại.');
    S.mode = 'ready';
    S.lockedThemeIndex = null;
    S.lockedLayoutIndex = null;
    syncThemePicker();
    syncLayoutPicker();
    syncPhotoCountPicker();
    syncIntervalPicker();
    syncReadyCountdown();
    syncEventNameField();
    syncStudentNameField();
    return;
  }
  S.mode = 'done';
  syncEventNameField();
  syncStudentNameField();
  S.posterUrl = posterDataUrl;
  const dlUrl = await uploadPoster(uploadBlob);
  if (dlUrl) {
    const displayUrl = `${window.location.origin}/api/display?url=${encodeURIComponent(dlUrl)}`;
    try {
      q('#qr-img').src = await QRCode.toDataURL(displayUrl, { margin: 1, width: 240, color: { dark: '#005F73', light: '#fff' } });
    } catch (err) {
      console.error('QR generation failed:', err);
    }
  }
  await fadeOutProcessing();
  showResult();
  S.lockedThemeIndex = null;
  S.lockedLayoutIndex = null;
  syncThemePicker();
  syncLayoutPicker();
  syncPhotoCountPicker();
  syncIntervalPicker();
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('toBlob failed')), 'image/jpeg', quality);
  });
}

async function exportPosterImage(canvas) {
  const scale = POSTER_EXPORT_SCALE;
  const out = document.createElement('canvas');
  out.width = canvas.width * scale;
  out.height = canvas.height * scale;
  const ctx = out.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(canvas, 0, 0, out.width, out.height);
  return out.toDataURL('image/jpeg', 0.97);
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
  if (size <= 0 || lw <= 0) return;
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

function drawGlowOrb(ctx, x, y, radius, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHeaderText(ctx, text, x, y, maxW, fontWeight, fontSize, minSize, family, color, align = 'left') {
  const display = String(text || '').trim();
  if (!display) return;

  ctx.save();
  let size = fontSize;
  do {
    ctx.font = `${fontWeight} ${size}px "${family}", Arial, sans-serif`;
    if (ctx.measureText(display).width <= maxW) break;
    size -= 2;
  } while (size >= minSize);

  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(display, x, y, maxW);
  ctx.restore();
}

// ── Poster composition (4:5) — Selected concept + rendering
async function buildPoster() {
  await document.fonts.ready;
  const mascot = await loadImage(mascotUrl);

  const cvs = q('#cvs');
  cvs.width = POSTER_WIDTH; cvs.height = POSTER_HEIGHT;
  const ctx = cvs.getContext('2d');
  const W = POSTER_WIDTH, H = POSTER_HEIGHT;

  const theme = POSTER_THEMES[S.lockedThemeIndex ?? S.themeIndex] || POSTER_THEMES[0];

  const headerH = 230;
  const layouts = POSTER_LAYOUTS[S.photoCount] || POSTER_LAYOUTS[4];
  const pos = layouts[S.lockedLayoutIndex ?? S.layoutIndex] || layouts[0];

  // ── Background + texture ──
  ctx.fillStyle = theme.bg.color;
  ctx.fillRect(0, 0, W, H);

  drawGlowOrb(ctx, 160, 140, 260, theme.frame.outer, 0.18);
  drawGlowOrb(ctx, 920, 220, 280, theme.photos.cornerAccent.color, 0.12);
  drawGlowOrb(ctx, 760, 1180, 320, theme.footer.glow || theme.footer.borderColor, 0.18);
  drawGlowOrb(ctx, 540, 760, 420, 'rgba(255,255,255,0.18)', 0.08);

  if (theme.bg.texture.type === 'grid') {
    ctx.fillStyle = theme.bg.texture.color;
    for (let x = 0; x < W; x += theme.bg.texture.step) ctx.fillRect(x, 0, 1, H);
    for (let y = 0; y < H; y += theme.bg.texture.step) ctx.fillRect(0, y, W, 1);
  } else if (theme.bg.texture.type === 'dots') {
    ctx.fillStyle = theme.bg.texture.color;
    const s = theme.bg.texture.step;
    for (let x = 0; x < W; x += s) for (let y = 0; y < H; y += s) ctx.fillRect(x, y, 2, 2);
  }

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

  // ── Brand + metadata ──
  const brandX = 160;
  ctx.shadowColor = 'transparent';
  drawHeaderText(ctx, 'GREENWICH VIETNAM', brandX, 64, 520, 800, 30, 24, 'Space Grotesk', theme.title.color);
  drawHeaderText(ctx, 'Change Starts Here', brandX, 104, 420, 700, 18, 14, 'Be Vietnam Pro', theme.date.color);
  drawHeaderText(ctx, S.eventName || 'Greenwich Open Day', 64, 166, 650, 900, 54, 34, 'Be Vietnam Pro', theme.subtitle.color);

  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  roundRect(ctx, 52, 34, 628, 148, 30);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(96, 88, 48, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,203,47,0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.clip();
  ctx.drawImage(mascot, 56, 42, 80, 80);
  ctx.restore();

  // ── Date + location metadata ──
  const d = new Date();
  const today = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  const metaX = 1016;
  drawHeaderText(ctx, today, metaX, 82, 260, 800, 34, 24, 'Space Grotesk', theme.date.color, 'right');
  drawHeaderText(ctx, S.studentName || 'FPT Tower', metaX, 130, 260, 800, 24, 18, 'Be Vietnam Pro', theme.title.color, 'right');

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

  pos.forEach(({ x, y, w, h, hero }, i) => {
    ctx.save();
    ctx.clip();
    const accent = i === 0 ? theme.frame.outer : theme.photos.cornerAccent.color;
    drawGlowOrb(ctx, x + w * 0.18, y + h * 0.18, hero ? 160 : 120, accent, 0.08);
    drawGlowOrb(ctx, x + w * 0.86, y + h * 0.82, hero ? 130 : 90, theme.footer.borderColor, 0.06);
    ctx.restore();
  });

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
    ctx.lineWidth = hero ? theme.photos.borderWidth + 2 : theme.photos.borderWidth;
    roundRect(ctx, x, y, w, h, theme.photos.radius);
    ctx.stroke();
    drawCornerAccents(ctx, x, y, w, h, theme.photos.cornerAccent.color, theme.photos.cornerAccent.size, theme.photos.cornerAccent.lw);
  });

  // ── Footer statement ──
  const footerTextColor = theme.footer.hashtag.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.save();
  ctx.shadowColor = theme.footer.glow || 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 18;
  ctx.fillStyle = theme.footer.bg;
  roundRect(ctx, 196, 1232, 688, 82, 22);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = theme.footer.borderColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.shadowColor = 'rgba(0,0,0,0.42)';
  ctx.shadowBlur = 10;
  ctx.font = '900 48px "Space Grotesk", "Be Vietnam Pro", Arial, sans-serif';
  ctx.fillStyle = footerTextColor;
  ctx.fillText(theme.footer.hashtag.text, 540, 1268);

  // ── Outer frame borders ──
  ctx.strokeStyle = theme.frame.outer;
  ctx.lineWidth = theme.frame.outerW;
  ctx.strokeRect(20, 20, W - 40, H - 40);
  ctx.strokeStyle = theme.frame.inner;
  ctx.lineWidth = theme.frame.innerW;
  if (theme.frame.innerW > 0) ctx.strokeRect(32, 32, W - 64, H - 64);
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
function showResult() {
  q('#poster-img').src = S.posterUrl;
  q('#dl-link').href   = S.posterUrl;
  q('.qr-wrap').classList.toggle('qr-loading', !q('#qr-img').src);
  q('#rov').classList.remove('hidden');
  q('#rov').classList.remove('is-ready');
  requestAnimationFrame(() => q('#rov').classList.add('is-ready'));
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
  q('#cov').classList.remove('is-processing');
  q('#shoot-btn').disabled = false;
  qa('.pv-slot').forEach(s => s.classList.remove('filled'));
  qa('.pv').forEach(p => { p.src = ''; });
  q('#cov').classList.remove('hidden');
  q('.ctrl-col').classList.remove('shooting');
  q('#rov').classList.remove('is-ready');
  S.showPosterPreview = !isMobile();
  if (!S.showPosterPreview) q('.ctrl-col').classList.add('hide-preview');
  syncThemePicker();
  syncPosterPreview();
  syncLayoutPicker();
  syncPhotoCountPicker();
  syncIntervalPicker();
  syncReadyCountdown();
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
qa('.count-chip[data-photo-count]').forEach(btn => {
  btn.addEventListener('click', () => setPhotoCount(btn.dataset.photoCount));
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
syncPhotoCountPicker();
syncIntervalPicker();
syncReadyCountdown();
syncEventNameField();
syncStudentNameField();
startCam();
if (import.meta.env.DEV) window.__t = { S, buildPoster, showResult, setThemeIndex, setLayoutIndex, setPhotoCount, setIntervalSeconds, setEventName, setStudentName };
