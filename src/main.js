import QRCode from 'qrcode';
import logoUrl from './assets/greenwich-logo.png';
import mascotUrl from './assets/greenwich-lion-mascot.jpg';
import './styles.css';
import { POSTER_THEMES } from './concepts.js';

// Face detection removed — simplified accessory positioning (fixed positioning)

// ── State ─────────────────────────────────────────────────────────────────────
const isMobile = () => window.innerWidth <= 768;

const S = {
  mode: 'ready',
  interval: 3,
  studentName: localStorage.getItem('greenwichbooth.studentName') || '',
  photos: [],
  stream: null,
  posterUrl: null,
  themeIndex: Number(localStorage.getItem('greenwichbooth.themeIndex') || 0) || 0,
  lockedThemeIndex: null,
  showPosterPreview: !isMobile(),
};

const THEME_OPTIONS = [
  { label: 'Campus Glow' },
  { label: 'Festival Pulse' },
  { label: 'Share Spark' },
];
const INTERVAL_OPTIONS = [3, 4, 5];

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

function setThemeIndex(nextIndex) {
  if (S.mode !== 'ready') return;
  const index = Math.max(0, Math.min(POSTER_THEMES.length - 1, Number(nextIndex) || 0));
  S.themeIndex = index;
  localStorage.setItem('greenwichbooth.themeIndex', String(index));
  syncThemePicker();
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

function setStudentName(nextName) {
  if (S.mode !== 'ready') return;
  const name = String(nextName || '').replace(/\s+/g, ' ').slice(0, 32);
  S.studentName = name;
  localStorage.setItem('greenwichbooth.studentName', name);
  syncStudentNameField();
}

// ── Mount HTML ────────────────────────────────────────────────────────────────
q('#app').innerHTML = `
<div class="app">
  <header class="hdr">
    <div class="hdr-brand">
      <img class="hdr-lion" src="${logoUrl}" alt="" aria-hidden="true">
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
          </div>
          <div class="cnt-lbl" id="cnt-lbl">Ảnh 1 / 4</div>
          <div class="dot-strip">
            <span class="dot" id="d0"></span>
            <span class="dot" id="d1"></span>
            <span class="dot" id="d2"></span>
            <span class="dot" id="d3"></span>
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
            <span class="theme-chip-label">${seconds}s</span>
          </button>
        `).join('')}
      </div>

      <div class="name-field">
        <input
          id="student-name"
          class="name-input"
          type="text"
          inputmode="text"
          maxlength="32"
          placeholder="Enter name (optional)"
          aria-label="Enter student name for poster personalization"
        >
      </div>

      <section class="poster-shell" aria-label="Poster preview">
        <div class="photo-grid" id="photo-grid">
          <div class="pv-slot" id="pvs0"><img class="pv" id="pv0" alt="Ảnh 1 được chụp"/><span class="pv-badge">1</span></div>
          <div class="pv-slot" id="pvs1"><img class="pv" id="pv1" alt="Ảnh 2 được chụp"/><span class="pv-badge">2</span></div>
          <div class="pv-slot" id="pvs2"><img class="pv" id="pv2" alt="Ảnh 3 được chụp"/><span class="pv-badge">3</span></div>
          <div class="pv-slot" id="pvs3"><img class="pv" id="pv3" alt="Ảnh 4 được chụp"/><span class="pv-badge">4</span></div>
        </div>
      </section>

      <button class="shoot-btn" id="shoot-btn" aria-label="Chụp ảnh">
        <span class="s-text"><span>Chụp</span><span>ảnh</span></span>
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
    <img class="proc-img" id="proc-img" alt="Placeholder ảnh đang được xử lý" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1080 1440'%3E%3Cdefs%3E%3ClinearGradient id='pg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23006b3f;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%232DD77A;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1080' height='1440' fill='url(%23pg)'/%3E%3C/svg%3E"/>
    <div class="proc-spin"></div>
    <p class="proc-txt">Đang tạo poster...</p>
    <small class="proc-sub" id="proc-sub">Vui lòng chờ</small>
    <div class="proc-progress-wrap">
      <div class="proc-progress-bar" id="proc-progress"></div>
    </div>
    <span class="proc-percent" id="proc-percent">0%</span>
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
  syncIntervalPicker();
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
      q('#cnt-lbl').textContent = `Ảnh ${i + 1} / 4`;
      q('#cnt-n').dataset.tick = '1';
      await sleep(900);
      delete q('#cnt-n').dataset.tick;
      await sleep(80);
    }
    q('#cnt-n').textContent = '😊';
    q('#cnt-lbl').textContent = '';
    await sleep(280);

    S.photos.push(capFrame(cam));
    if (navigator.vibrate) navigator.vibrate([50]);

    q(`#pv${i}`).src = S.photos[i];
    q(`#pvs${i}`).classList.add('filled');

    q(`#d${i}`).classList.add('done');
    if (i < 3) await sleep(380);
  }

  q('#cov').classList.add('hidden');
  q('#shoot-btn').disabled = false;
  q('#proc-sub').textContent = 'Vui lòng chờ';
  q('#proc-ov').classList.remove('hidden');
  S.lockedThemeIndex = S.themeIndex;
  syncThemePicker();
  syncIntervalPicker();
  try {
    await buildPoster();
  } catch (err) {
    console.error('buildPoster failed:', err);
    q('#proc-sub').textContent = 'Không thể tạo poster, hãy chụp lại.';
    q('#proc-ov').classList.add('hidden');
    S.mode = 'ready';
    S.lockedThemeIndex = null;
    syncThemePicker();
    syncIntervalPicker();
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
    syncThemePicker();
    syncIntervalPicker();
    syncStudentNameField();
    return;
  }
  S.mode = 'done';
  syncStudentNameField();
  S.posterUrl = posterDataUrl;
  const uploadP = uploadPoster(uploadBlob);
  q('#proc-ov').classList.add('hidden');
  showResult(uploadP);
  S.lockedThemeIndex = null;
  syncThemePicker();
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

function drawStudentNameBadge(ctx, name, x, y, w, h, theme) {
  const text = String(name || '').trim();
  ctx.save();
  ctx.shadowColor = text ? 'rgba(0, 31, 20, 0.55)' : 'rgba(0, 31, 20, 0.20)';
  ctx.shadowBlur = text ? 24 : 12;
  ctx.fillStyle = text ? 'rgba(0, 31, 20, 0.74)' : 'rgba(255,255,255,0.06)';
  roundRect(ctx, x, y, w, h, 24);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = text ? theme.photos.cornerAccent.color : 'rgba(255,255,255,0.10)';
  ctx.lineWidth = text ? 3 : 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + 32, y + h / 2, 8, 0, Math.PI * 2);
  ctx.fillStyle = text ? theme.photos.cornerAccent.color : 'rgba(255,255,255,0.14)';
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  if (text) {
    const maxWidth = w - 84;
    let fontSize = 34;
    do {
      ctx.font = `900 ${fontSize}px "Be Vietnam Pro", Arial, sans-serif`;
      fontSize -= 2;
    } while (ctx.measureText(text).width > maxWidth && fontSize >= 24);

    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    ctx.shadowColor = 'rgba(214,178,65,0.34)';
    ctx.shadowBlur = 10;
    ctx.fillText(text, x + 52, y + h / 2 + 1, maxWidth);
  } else {
    ctx.font = '700 18px "Be Vietnam Pro", Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.46)';
    ctx.fillText('TÊN SINH VIÊN', x + 52, y + h / 2 + 1, w - 84);
  }
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
  const pos = [
    { x: 64, y: 262, w: 952, h: 596, hero: true },
    { x: 64, y: 884, w: 300, h: 300 },
    { x: 390, y: 884, w: 300, h: 300 },
    { x: 716, y: 884, w: 300, h: 300 },
  ];

  // ── Background + texture ──
  ctx.fillStyle = theme.bg.color;
  ctx.fillRect(0, 0, W, H);

  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, 'rgba(0, 200, 117, 0.12)');
  bgGrad.addColorStop(0.45, 'rgba(0, 31, 20, 0)');
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
  ctx.font = '800 30px "Space Grotesk", Arial, sans-serif';
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = theme.subtitle.color;
  ctx.fillText('GREENWICH VIETNAM', 168, 70);
  ctx.font = '700 16px "Space Grotesk", Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('CHANGE STARTS HERE', 168, 104);

  ctx.save();
  ctx.beginPath();
  ctx.arc(102, 88, 42, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,203,47,0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.clip();
  ctx.drawImage(mascot, 68, 54, 68, 68);
  ctx.restore();

  // ── Date badge ──
  ctx.shadowColor = 'transparent';
  const d = new Date();
  const today = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  roundRect(ctx, 804, 54, 204, 72, 16);
  ctx.fill();
  ctx.strokeStyle = theme.photos.borderColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.date.color;
  ctx.font = '900 26px "Space Grotesk", Arial, sans-serif';
  ctx.fillText(today, 906, 96);

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = theme.title.color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(770, 24);
  ctx.lineTo(770, headerH - 24);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(770, headerH / 2, 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

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

  drawStudentNameBadge(ctx, S.studentName, 656, 154, 360, 50, theme);

  // ── Footer statement ──
  ctx.fillStyle = theme.footer.bg;
  roundRect(ctx, 64, 1240, 952, 126, 22);
  ctx.fill();
  ctx.strokeStyle = theme.footer.borderColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  const footerGlow = ctx.createRadialGradient(540, 1294, 40, 540, 1294, 280);
  footerGlow.addColorStop(0, 'rgba(214,178,65,0.18)');
  footerGlow.addColorStop(1, 'rgba(214,178,65,0)');
  ctx.fillStyle = footerGlow;
  roundRect(ctx, 210, 1256, 660, 84, 20);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.footer.hashtag.color;
  ctx.shadowColor = 'rgba(214,178,65,0.34)';
  ctx.shadowBlur = 14;
  ctx.font = '900 32px "Be Vietnam Pro", Arial, sans-serif';
  ctx.fillText(theme.footer.hashtag.text, 540, 1290);
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 10;
  ctx.font = '900 34px "Be Vietnam Pro", Arial, sans-serif';
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'rgba(0,0,0,0.38)';
  ctx.strokeText(theme.footer.url.text, 540, 1336);
  ctx.fillStyle = theme.footer.url.color;
  ctx.fillText(theme.footer.url.text, 540, 1336);
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
    QRCode.toDataURL(displayUrl, { margin: 1, width: 240, color: { dark: '#006b3f', light: '#fff' } })
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
  S.mode = 'ready'; S.photos = []; S.posterUrl = null; S.lockedThemeIndex = null;
  q('#rov').classList.add('hidden');
  q('#qr-img').src = '';
  q('#shoot-btn').disabled = false;
  qa('.dot').forEach(d => d.classList.remove('done'));
  qa('.pv-slot').forEach(s => s.classList.remove('filled'));
  qa('.pv').forEach(p => { p.src = ''; });
  q('#cov').classList.add('hidden');
  q('.ctrl-col').classList.remove('shooting');
  S.showPosterPreview = !isMobile();
  if (!S.showPosterPreview) q('.ctrl-col').classList.add('hide-preview');
  syncThemePicker();
  syncIntervalPicker();
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
q('#student-name').value = S.studentName;
q('#student-name').addEventListener('input', e => setStudentName(e.target.value));
qa('.theme-chip[data-theme-index]').forEach(btn => {
  btn.addEventListener('click', () => setThemeIndex(btn.dataset.themeIndex));
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
syncIntervalPicker();
syncStudentNameField();
startCam();
if (import.meta.env.DEV) window.__t = { S, buildPoster, setThemeIndex, setIntervalSeconds, setStudentName };
