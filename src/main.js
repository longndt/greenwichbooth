import QRCode from 'qrcode';
import './styles.css';

// Face detection removed — simplified accessory positioning (fixed positioning)

// ── Flat Cartoon Lion — Orange mane, smart glasses, navy shirt ────────────────
const LION = `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="mantleGrad" cx="50%" cy="40%">
      <stop offset="0%" style="stop-color:#FFA500;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
    </radialGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#003366;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#002244;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="70" r="65" fill="url(#mantleGrad)" />
  <circle cx="80" cy="45" r="25" fill="#FFB700" opacity="0.6" />
  <circle cx="120" cy="50" r="20" fill="#FFB700" opacity="0.5" />
  <circle cx="100" cy="95" r="45" fill="#FFD700" />
  <circle cx="55" cy="60" r="18" fill="#FFA500" />
  <circle cx="55" cy="65" r="10" fill="#FFD700" />
  <circle cx="145" cy="60" r="18" fill="#FFA500" />
  <circle cx="145" cy="65" r="10" fill="#FFD700" />
  <circle cx="75" cy="85" r="16" fill="none" stroke="#333" stroke-width="3" />
  <circle cx="125" cy="85" r="16" fill="none" stroke="#333" stroke-width="3" />
  <line x1="91" y1="85" x2="109" y2="85" stroke="#333" stroke-width="3" />
  <circle cx="75" cy="85" r="8" fill="#333" />
  <circle cx="77" cy="81" r="3" fill="white" />
  <circle cx="125" cy="85" r="8" fill="#333" />
  <circle cx="127" cy="81" r="3" fill="white" />
  <ellipse cx="100" cy="110" rx="6" ry="8" fill="#FF9800" />
  <path d="M 95 120 Q 100 128 105 120" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round" />
  <line x1="60" y1="105" x2="40" y2="103" stroke="#333" stroke-width="1.5" stroke-linecap="round" />
  <line x1="60" y1="115" x2="40" y2="118" stroke="#333" stroke-width="1.5" stroke-linecap="round" />
  <line x1="140" y1="105" x2="160" y2="103" stroke="#333" stroke-width="1.5" stroke-linecap="round" />
  <line x1="140" y1="115" x2="160" y2="118" stroke="#333" stroke-width="1.5" stroke-linecap="round" />
  <rect x="45" y="145" width="110" height="80" rx="15" fill="url(#bodyGrad)" />
  <rect x="20" y="160" width="30" height="35" rx="15" fill="#FFD700" />
  <rect x="150" y="160" width="30" height="35" rx="15" fill="#FFD700" />
  <rect x="80" y="165" width="40" height="25" rx="3" fill="#FFA500" />
  <text x="100" y="182" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#003366">GW</text>
</svg>`;

// ── 5 poster base themes — background + bar color applied to whole poster ─────
const POSTER_THEMES = [
  { bg: '#0B1912', barBg: '#0D2318', accent: '#FFCB2F', textCol: '#F0F5F2' },
  { bg: '#080808', barBg: '#111111', accent: '#FFCB2F', textCol: '#F0F5F2' },
  { bg: '#0B1220', barBg: '#0E1A2E', accent: '#FFCB2F', textCol: '#F0F5F2' },
  { bg: '#1A0800', barBg: '#220F00', accent: '#FF7A2E', textCol: '#F0F5F2' },
  { bg: '#100B1A', barBg: '#170E24', accent: '#A78BFA', textCol: '#F0F5F2' },
];

// ── 8 curated photo frame styles — Greenwich Vietnam identity ──────────────────
// Reduced from 17 to 8 best designs (53% reduction in cognitive load)
// Styles: classic, modern, playful, formal — all maintaining brand colors
const PHOTO_FRAMES = [
  // 01 — GW Floral (signature): green border + vine+flower corners
  {
    id: 'gw-floral',
    border: { color: '#006b3f', width: 5 },
    inner:  { color: '#FFCB2F', width: 1.5, offset: 9 },
    corner: { style: 'vine', size: 40, color: '#2D8B4E', flower: '#FF8FAB', lw: 1.5 },
  },
  // 02 — GW Classic: thick green + gold inner + gold L-corners
  {
    id: 'gw-classic',
    border: { color: '#006b3f', width: 8 },
    inner:  { color: '#FFCB2F', width: 2, offset: 12 },
    corner: { style: 'bracket', size: 28, color: '#FFCB2F', lw: 3 },
  },
  // 03 — GW Emerald Glow: neon green glow border (modern)
  {
    id: 'gw-emerald',
    border: { color: '#2DD77A', width: 4 },
    inner:  { color: '#006b3f', width: 2, offset: 8 },
    glow:   { color: '#2DD77A', blur: 18 },
  },
  // 04 — GW Minimalist: ultra-thin gold line, clean (portraits)
  {
    id: 'gw-minimal',
    border: { color: '#FFCB2F', width: 2 },
    corner: { style: 'bracket', size: 18, color: '#FFCB2F', lw: 2 },
  },
  // 05 — GW Celebration: bright green + playful pink corners (fun)
  {
    id: 'gw-celebration',
    border: { color: '#2DD77A', width: 5 },
    inner:  { color: '#FF6BA8', width: 1, offset: 8 },
    corner: { style: 'circle', size: 10, color: '#FF6BA8', lw: 1 },
  },
  // 06 — GW Neon: thin border + bright glow (ultra-modern)
  {
    id: 'gw-neon',
    border: { color: '#00FF88', width: 2 },
    glow:   { color: '#00FF88', blur: 24 },
  },
  // 07 — GW Royal: deep green + gold diamond corners (formal/sophisticated)
  {
    id: 'gw-royal',
    border: { color: '#003820', width: 8 },
    inner:  { color: '#FFCB2F', width: 2, offset: 12 },
    corner: { style: 'diamond', size: 12, color: '#FFCB2F', lw: 1 },
    glow:   { color: '#FFCB2F', blur: 8 },
  },
  // 08 — GW Modern Vine: thin border + subtle vine (classic+modern balance)
  {
    id: 'gw-modern-vine',
    border: { color: '#006b3f', width: 3 },
    corner: { style: 'vine', size: 32, color: '#2DD77A', flower: '#FFCB2F', lw: 1 },
  },
];

// Pick N unique frames randomly (no duplicates within same poster)
function pickFrames(n) {
  const pool = [...PHOTO_FRAMES].sort(() => Math.random() - 0.5);
  return Array.from({ length: n }, (_, i) => pool[i % pool.length]);
}

// Draw a per-photo mini-frame around one slot
function drawPhotoFrame(ctx, frame, x, y, w, h) {
  ctx.save();

  if (frame.glow) {
    ctx.shadowColor = frame.glow.color;
    ctx.shadowBlur  = frame.glow.blur;
  }

  // Outer border
  const bw   = frame.border.width;
  const half = bw / 2;
  ctx.strokeStyle = frame.border.color;
  ctx.lineWidth   = bw;
  ctx.setLineDash(frame.border.dash || []);
  ctx.strokeRect(x + half, y + half, w - bw, h - bw);
  ctx.setLineDash([]);
  ctx.shadowBlur  = 0;
  ctx.shadowColor = 'transparent';

  // Inner border
  if (frame.inner) {
    const off = frame.inner.offset;
    ctx.strokeStyle = frame.inner.color;
    ctx.lineWidth   = frame.inner.width;
    ctx.strokeRect(x + off, y + off, w - off * 2, h - off * 2);
  }

  // Corner decorations
  if (frame.corner) {
    const c  = frame.corner;
    const cs = c.size;
    // [corner_x, corner_y, dir_x, dir_y]
    const corners = [
      [x,     y,     1,  1],
      [x + w, y,    -1,  1],
      [x,     y + h, 1, -1],
      [x + w, y + h,-1, -1],
    ];
    ctx.strokeStyle = c.color;
    ctx.fillStyle   = c.color;
    ctx.lineWidth   = c.lw || 2;
    ctx.setLineDash([]);

    corners.forEach(([cx, cy, dx, dy]) => {
      if (c.style === 'bracket') {
        ctx.beginPath();
        ctx.moveTo(cx + dx * cs, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy * cs);
        ctx.stroke();
      } else if (c.style === 'cross') {
        const h2 = cs / 2;
        ctx.beginPath();
        ctx.moveTo(cx - h2, cy); ctx.lineTo(cx + h2, cy);
        ctx.moveTo(cx, cy - h2); ctx.lineTo(cx, cy + h2);
        ctx.stroke();
      } else if (c.style === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(cx,      cy - cs);
        ctx.lineTo(cx + cs, cy);
        ctx.lineTo(cx,      cy + cs);
        ctx.lineTo(cx - cs, cy);
        ctx.closePath();
        ctx.fill();
      } else if (c.style === 'circle') {
        ctx.beginPath();
        ctx.arc(cx, cy, cs, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.style === 'cluster') {
        [[dx * cs * 2, 0], [0, dy * cs * 2], [dx * cs * 1.3, dy * cs * 1.3]]
          .forEach(([ox, oy]) => {
            ctx.beginPath();
            ctx.arc(cx + ox, cy + oy, cs, 0, Math.PI * 2);
            ctx.fill();
          });
      } else if (c.style === 'vine') {
        // dây leo + hoa ở góc
        ctx.strokeStyle = c.color;
        ctx.fillStyle = c.flower || c.color;
        const stemLen = cs * 1.2;
        const leafSize = cs * 0.25;
        // Vẽ dây leo từ góc
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cx + dx * stemLen * 0.6, cy + dy * stemLen * 0.3, cx + dx * stemLen, cy + dy * stemLen);
        ctx.stroke();
        // Lá
        [[dx * stemLen * 0.3, dy * stemLen * 0.15], [dx * stemLen * 0.7, dy * stemLen * 0.5]].forEach(([ox, oy]) => {
          ctx.beginPath();
          ctx.ellipse(cx + ox, cy + oy, leafSize * 1.2, leafSize * 0.8, dx * 0.3, 0, Math.PI * 2);
          ctx.fill();
        });
        // Hoa ở đầu
        ctx.fillStyle = c.flower || '#FF8FAB';
        ctx.beginPath();
        ctx.arc(cx + dx * stemLen, cy + dy * stemLen, cs * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  ctx.restore();
}

// ── 9 color filters ───────────────────────────────────────────────────────────
// css applied to <video> live + ctx.filter on capFrame canvas

// ── 20 accessories — overlaid on each captured photo ──────────────────────────
// Organized by category: Face | Props | Seasonal

// ── State ─────────────────────────────────────────────────────────────────────
const S = {
  mode: 'ready',
  interval: 3,
  photos: [],
  stream: null,
  posterUrl: null,
};

const q  = s => document.querySelector(s);
const qa = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Mount HTML ────────────────────────────────────────────────────────────────
q('#app').innerHTML = `
<div class="app">
  <header class="hdr">
    <div class="hdr-brand">
      <div class="hdr-lion">${LION}</div>
      <div class="hdr-text">
        <span class="hdr-name">Greenwich Booth</span>
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
        <strong id="qr-title">Đang tạo link...</strong>
        <span id="qr-sub">Chờ khoảng 8 giây...</span>
        <a id="dl-link" class="btn-primary" download="greenwichbooth.jpg" aria-label="Tải poster về máy">⬇ Tải về máy</a>
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
      video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
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
  q('#shoot-btn').disabled = true;
  S.photos = [];
  qa('.pv-slot').forEach(s => s.classList.remove('filled'));
  qa('.pv').forEach(p => { p.src = ''; });
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
  q('#proc-sub').textContent = 'Đang tạo poster...';
  q('#proc-ov').classList.remove('hidden');
  try {
    await buildPoster();
  } catch (err) {
    console.error('buildPoster failed:', err);
    q('#proc-sub').textContent = 'Không thể tạo poster, hãy chụp lại.';
    q('#proc-ov').classList.add('hidden');
    S.mode = 'ready';
    return;
  }
  S.mode = 'done';
  let posterDataUrl;
  try {
    posterDataUrl = q('#cvs').toDataURL('image/jpeg', 0.88);
  } catch (err) {
    // ponytail: canvas taint (SVG/CORS) → degrade gracefully
    console.error('toDataURL failed:', err);
    q('#proc-sub').textContent = 'Không thể xuất ảnh, hãy chụp lại.';
    q('#proc-ov').classList.add('hidden');
    S.mode = 'ready';
    return;
  }
  S.posterUrl = posterDataUrl;
  const uploadP = uploadPoster(S.posterUrl);
  q('#proc-ov').classList.add('hidden');
  showResult(uploadP);
}

function capFrame(cam) {
  const vw = cam.videoWidth, vh = cam.videoHeight;
  const sz = Math.min(vw, vh);

  const raw = document.createElement('canvas');
  raw.width = sz; raw.height = sz;
  const rx = raw.getContext('2d');
  rx.translate(sz, 0); rx.scale(-1, 1);
  rx.drawImage(cam, (vw - sz) / 2, (vh - sz) / 2, sz, sz, 0, 0, sz, sz);

  return raw.toDataURL('image/jpeg', 0.9);
}

// ── Poster composition (1080×1440) — 2×2 grid, randomized theme + per-photo frames
async function buildPoster() {
  await document.fonts.ready;

  const cvs = q('#cvs');
  cvs.width = 1080; cvs.height = 1440;
  const ctx = cvs.getContext('2d');
  const W = 1080, H = 1440, BAR = 140, HPAD = 20, VPAD = 30, GAP = 20;
  const theme  = POSTER_THEMES[Math.floor(Math.random() * POSTER_THEMES.length)];
  const frames = pickFrames(4);
  const PH = Math.floor((W - 2 * HPAD - GAP) / 2); // 510px
  const pos = [
    [HPAD,            BAR + VPAD],
    [HPAD + PH + GAP, BAR + VPAD],
    [HPAD,            BAR + VPAD + PH + GAP],
    [HPAD + PH + GAP, BAR + VPAD + PH + GAP],
  ];

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, W, H);

  const photos = S.photos;

  // Draw all 4 photos in parallel
  await Promise.all(photos.map((p, i) => drawPhoto(ctx, p, pos[i][0], pos[i][1], PH, PH)));

  // Per-photo mini-frames
  frames.forEach((frame, i) => drawPhotoFrame(ctx, frame, pos[i][0], pos[i][1], PH, PH));

  // Separator dots
  const sepX = Math.round(HPAD + PH + GAP / 2);
  const sepY = Math.round(BAR + VPAD + PH + GAP / 2);
  ctx.fillStyle = theme.accent + 'CC';
  for (let x = HPAD; x <= W - HPAD; x += 12) {
    ctx.beginPath(); ctx.arc(x, sepY, 2.5, 0, Math.PI * 2); ctx.fill();
  }
  for (let y = BAR + VPAD; y <= BAR + VPAD + PH * 2 + GAP; y += 12) {
    ctx.beginPath(); ctx.arc(sepX, y, 2.5, 0, Math.PI * 2); ctx.fill();
  }

  // Top + bottom bars
  ctx.fillStyle = theme.barBg;
  ctx.fillRect(0, 0, W, BAR);
  ctx.fillRect(0, H - BAR, W, BAR);

  // Outer border
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 4;
  ctx.setLineDash([]);
  ctx.strokeRect(2, 2, W - 4, H - 4);

  // Top-bar: Lion + text
  await drawSvg(ctx, LION, 14, (BAR - 110) / 2, 110, 110);
  ctx.textBaseline = 'top';
  ctx.fillStyle = theme.textCol;
  ctx.font = '900 50px "Arial Black", Arial, sans-serif';
  ctx.fillText('GREENWICH BOOTH', 142, 22);
  ctx.fillStyle = theme.accent;
  ctx.font = '600 26px Arial, sans-serif';
  ctx.fillText('greenwich.edu.vn', 142, 88);

  // Bottom-bar: branding
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.textCol;
  ctx.font = '900 32px "Arial Black", Arial, sans-serif';
  ctx.fillText('GREENWICH VIETNAM', W / 2, (H - BAR) + BAR * 0.36);
  ctx.fillStyle = 'rgba(240,245,242,0.72)';
  ctx.font = '500 20px Arial, sans-serif';
  ctx.fillText('greenwich.edu.vn  ·  #GreenwichVN', W / 2, (H - BAR) + BAR * 0.72);
  ctx.textAlign = 'left';
}

function drawPhoto(ctx, url, x, y, w, h) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.max(w / img.width, h / img.height);
        const dw = img.width * scale, dh = img.height * scale;
        ctx.save();
        ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
        ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
        ctx.restore();
        res();
      } catch (e) { rej(e); }
    };
    img.onerror = rej;
    img.src = url;
  });
}

function drawImg(ctx, url, x, y, w, h) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      try { ctx.drawImage(img, x, y, w, h); res(); }
      catch (e) { rej(e); }
    };
    img.onerror = rej;
    img.src = url;
  });
}

function drawSvg(ctx, svg, x, y, w, h) {
  // ponytail: data URL avoids Blob URL canvas-taint in Firefox/Safari
  return drawImg(ctx, 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), x, y, w, h);
}

// ── Result screen ─────────────────────────────────────────────────────────────
function showResult(uploadP) {
  q('#poster-img').src = S.posterUrl;
  q('#dl-link').href   = S.posterUrl;
  q('#qr-img').src     = '';
  q('.qr-wrap').classList.add('qr-loading');
  q('#qr-title').textContent = 'Đang tạo link...';
  q('#qr-sub').textContent = 'Chờ khoảng 8 giây...';
  q('#rov').classList.remove('hidden');

  uploadP.then(dlUrl => {
    q('.qr-wrap').classList.remove('qr-loading');
    if (!dlUrl) {
      q('#qr-title').textContent = 'Không tạo được link';
      q('#qr-sub').textContent = 'Vui lòng tải về máy thay thế (nút dưới)';
      return;
    }
    // Wrap image URL in display page with download button
    const displayUrl = `${window.location.origin}/api/display?url=${encodeURIComponent(dlUrl)}`;
    QRCode.toDataURL(displayUrl, { margin: 1, width: 240, color: { dark: '#006b3f', light: '#fff' } })
      .then(qr => {
        q('#qr-img').src = qr;
        q('#qr-title').textContent = '✓ Sẵn sàng · 📱 Quét để tải về';
        q('#qr-sub').textContent = 'Dùng camera điện thoại để quét';
      });
  });
}

async function uploadPoster(dataUrl) {
  const TIMEOUT_MS = 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl }),
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
  if (!confirm('Chụp lại sẽ xoá 4 ảnh vừa chụp. Bạn chắc không?')) return;
  S.mode = 'ready'; S.photos = []; S.posterUrl = null;
  q('#rov').classList.add('hidden');
  q('#qr-img').src = '';
  q('#shoot-btn').disabled = false;
  qa('.dot').forEach(d => d.classList.remove('done'));
  qa('.pv-slot').forEach(s => s.classList.remove('filled'));
  qa('.pv').forEach(p => { p.src = ''; });
  q('#cov').classList.add('hidden');
}

// ── Events ────────────────────────────────────────────────────────────────────
q('#shoot-btn').addEventListener('click', shoot);
q('#retry-cam').addEventListener('click', startCam);
q('#retake-btn').addEventListener('click', retake);

// ── Mobile orientation ───────────────────────────────────────────────────────
window.addEventListener('orientationchange', () => {
  if (S.mode === 'ready') startCam();
});

// ── Init ──────────────────────────────────────────────────────────────────────
startCam();
if (import.meta.env.DEV) window.__t = { S, buildPoster };
