import QRCode from 'qrcode';
import './styles.css';

// ponytail: face detection optional, load on-demand khi enable
// Models served from /models/ (same domain) — CDN weights không có trên jsDelivr
async function loadFaceApi() {
  if (!window.faceapi) {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  if (!window.faceapi) throw new Error('face-api script not loaded');
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models/'),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models/'),
    ]);
    console.log('✓ Face AI models loaded');
  } catch (err) {
    console.error('✗ Face AI model load failed:', err);
    throw err;
  }
}

async function detectFaceInImage(imgEl) {
  if (!S.faceAiEnabled || !window.faceapi) return null;
  try {
    const detection = await faceapi.detectSingleFace(imgEl, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);
    if (detection?.detection?.box) return detection.detection.box;
    console.warn('Face detection: no face found in image');
    return null;
  } catch (err) {
    console.error('Face detection error:', err);
    return null;
  }
}

// ── Lion Captain mascot SVG ───────────────────────────────────────────────────
const LION = `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 58 Q16 82 24 112 L76 112 Q84 82 68 58 Z" fill="#FF6B1A"/>
  <path d="M28 57 L72 57 L74 90 Q74 96 50 96 Q26 96 26 90 Z" fill="#002D72"/>
  <rect x="36" y="66" width="28" height="18" rx="4" fill="#F7C948"/>
  <text x="50" y="79" font-family="Arial" font-size="9" font-weight="900" fill="#002D72" text-anchor="middle">GV</text>
  <ellipse cx="18" cy="72" rx="12" ry="7" fill="#FFB347" transform="rotate(-20 18 72)"/>
  <ellipse cx="82" cy="65" rx="12" ry="7" fill="#FFB347" transform="rotate(35 82 65)"/>
  <circle cx="50" cy="35" r="32" fill="#C96010"/>
  <circle cx="24" cy="20" r="12" fill="#C96010"/>
  <circle cx="76" cy="20" r="12" fill="#C96010"/>
  <circle cx="50" cy="6"  r="11" fill="#C96010"/>
  <circle cx="50" cy="36" r="24" fill="#F59B30"/>
  <ellipse cx="50" cy="38" rx="18" ry="17" fill="#FFB347"/>
  <circle cx="24" cy="20" r="6" fill="#FFB347"/>
  <circle cx="76" cy="20" r="6" fill="#FFB347"/>
  <circle cx="38" cy="36" r="9" fill="white" stroke="#002D72" stroke-width="2.5"/>
  <circle cx="62" cy="36" r="9" fill="white" stroke="#002D72" stroke-width="2.5"/>
  <path d="M47 36 L53 36" stroke="#002D72" stroke-width="2" fill="none"/>
  <path d="M29 33 L22 30" stroke="#002D72" stroke-width="2" fill="none"/>
  <path d="M71 33 L78 30" stroke="#002D72" stroke-width="2" fill="none"/>
  <circle cx="38" cy="36" r="5" fill="#1a1a40"/>
  <circle cx="62" cy="36" r="5" fill="#1a1a40"/>
  <circle cx="40" cy="34" r="2" fill="white"/>
  <circle cx="64" cy="34" r="2" fill="white"/>
  <ellipse cx="50" cy="46" rx="5" ry="4" fill="#C97020"/>
  <path d="M40 51 Q50 59 60 51" stroke="#8B4513" stroke-width="2" fill="none" stroke-linecap="round"/>
  <line x1="10" y1="44" x2="35" y2="46" stroke="#8B4513" stroke-width="1" opacity="0.4"/>
  <line x1="10" y1="49" x2="35" y2="49" stroke="#8B4513" stroke-width="1" opacity="0.4"/>
  <line x1="65" y1="46" x2="90" y2="44" stroke="#8B4513" stroke-width="1" opacity="0.4"/>
  <line x1="65" y1="49" x2="90" y2="49" stroke="#8B4513" stroke-width="1" opacity="0.4"/>
</svg>`;

// ── 5 poster base themes — background + bar color applied to whole poster ─────
const POSTER_THEMES = [
  { bg: '#0B1912', barBg: '#0D2318', accent: '#FFCB2F', textCol: '#F0F5F2' },
  { bg: '#080808', barBg: '#111111', accent: '#FFCB2F', textCol: '#F0F5F2' },
  { bg: '#0B1220', barBg: '#0E1A2E', accent: '#FFCB2F', textCol: '#F0F5F2' },
  { bg: '#1A0800', barBg: '#220F00', accent: '#FF7A2E', textCol: '#F0F5F2' },
  { bg: '#100B1A', barBg: '#170E24', accent: '#A78BFA', textCol: '#F0F5F2' },
];

// ── 8 per-photo mini-frame styles — Greenwich Vietnam identity ────────────────
// border.dash → [dash, gap] for dashed stroke
// inner       → second border drawn inset from the main border
// corner      → decorative marks at each corner (vine = dây leo + hoa)
// glow        → shadow blur painted behind the border
const PHOTO_FRAMES = [
  // 01 — GW Floral (signature): green border + vine+flower corners
  {
    id: 'gw-floral',
    border: { color: '#006b3f', width: 5 },
    inner:  { color: '#FFCB2F', width: 1.5, offset: 9 },
    corner: { style: 'vine', size: 40, color: '#2D8B4E', flower: '#FF8FAB', lw: 1.5 },
  },
  // 02 — GW Floral Gold: gold border + green vine corners
  {
    id: 'gw-floral-gold',
    border: { color: '#FFCB2F', width: 5 },
    inner:  { color: '#006b3f', width: 1.5, offset: 9 },
    corner: { style: 'vine', size: 40, color: '#3DAB60', flower: '#FF6BA8', lw: 1.5 },
  },
  // 03 — GW Classic: thick green + gold inner + gold L-corners
  {
    id: 'gw-classic',
    border: { color: '#006b3f', width: 8 },
    inner:  { color: '#FFCB2F', width: 2, offset: 12 },
    corner: { style: 'bracket', size: 28, color: '#FFCB2F', lw: 3 },
  },
  // 04 — GW Academic: navy + gold (tốt nghiệp)
  {
    id: 'gw-academic',
    border: { color: '#001B5E', width: 7 },
    inner:  { color: '#FFCB2F', width: 2, offset: 11 },
    corner: { style: 'bracket', size: 26, color: '#FFCB2F', lw: 3 },
    glow:   { color: '#001B5E', blur: 10 },
  },
  // 05 — GW Emerald Glow: neon green glow border
  {
    id: 'gw-emerald',
    border: { color: '#2DD77A', width: 4 },
    inner:  { color: '#006b3f', width: 2, offset: 8 },
    glow:   { color: '#2DD77A', blur: 18 },
  },
  // 06 — GW Royal: deep green + gold diamond corners
  {
    id: 'gw-royal',
    border: { color: '#003820', width: 8 },
    inner:  { color: '#FFCB2F', width: 2, offset: 12 },
    corner: { style: 'diamond', size: 12, color: '#FFCB2F', lw: 1 },
    glow:   { color: '#FFCB2F', blur: 8 },
  },
  // 07 — GW Dashed: dashed green + gold L-corners
  {
    id: 'gw-dashed',
    border: { color: '#006b3f', width: 5, dash: [12, 6] },
    corner: { style: 'bracket', size: 22, color: '#FFCB2F', lw: 3 },
  },
  // 08 — GW Mint Floral: soft mint + orange-gold vine corners
  {
    id: 'gw-mint',
    border: { color: '#5DBF8A', width: 5 },
    inner:  { color: 'rgba(255,203,47,0.5)', width: 1.5, offset: 9 },
    corner: { style: 'vine', size: 36, color: '#3A9E6A', flower: '#FFB347', lw: 1.5 },
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

// ── 6 color filters ───────────────────────────────────────────────────────────
// css applied to <video> live + ctx.filter on capFrame canvas
const FILTERS = [
  { id: 'normal',  label: 'Bình thường', css: 'none' },
  { id: 'vivid',   label: 'Sống động',   css: 'saturate(1.9) contrast(1.15)' },
  { id: 'warm',    label: 'Ấm áp',       css: 'sepia(0.45) saturate(1.4) brightness(1.06)' },
  { id: 'cool',    label: 'Lạnh',        css: 'hue-rotate(195deg) saturate(1.25) brightness(1.08)' },
  { id: 'bw',      label: 'Đen Trắng',   css: 'grayscale(1) contrast(1.1)' },
  { id: 'vintage', label: 'Vintage',     css: 'sepia(0.55) saturate(0.85) brightness(0.94) contrast(1.08)' },
];

// ── 9 accessories — overlaid on each captured photo ──────────────────────────
// top: vertical position (0=top, 1=bottom) as fraction of photo height
// fs:  emoji font size as fraction of photo height
const ACCESSORIES = [
  { id: 'none',    label: 'Không',   icon: '',   top: 0,    fs: 0 },
  { id: 'glasses', label: 'Kính 😎', icon: '😎', top: 0.44, fs: 0.22 },
  { id: 'hat',     label: 'Mũ 🎩',  icon: '🎩', top: 0.03, fs: 0.28 },
  { id: 'bow',     label: 'Nơ 🎀',  icon: '🎀', top: 0.05, fs: 0.20 },
  { id: 'crown',   label: 'Vương 👑',icon: '👑', top: 0.03, fs: 0.22 },
  { id: 'grad',    label: 'Cử nhân 🎓',icon:'🎓',top: 0.03, fs: 0.28 },
  { id: 'disguise',label: 'Râu 🥸', icon: '🥸', top: 0.38, fs: 0.26 },
  { id: 'flower',  label: 'Hoa 🌸', icon: '🌸', top: 0.03, fs: 0.18 },
  { id: 'rainbow', label: 'Cầu vồng 🌈',icon:'🌈',top:0.01,fs: 0.30 },
];

// ── 9 stickers (1 = none + 8 emoji) — drawn on top-bar right of poster ────────
const STICKERS = [
  { id: 'none',    label: 'Không',   icon: '' },
  { id: 'sparkle', label: 'Vui ✨',  icon: '✨' },
  { id: 'sakura',  label: 'Hoa 🌸',  icon: '🌸' },
  { id: 'star',    label: 'Sao ⭐',  icon: '⭐' },
  { id: 'fire',    label: 'Hot 🔥',  icon: '🔥' },
  { id: 'heart',   label: 'Tim 💜',  icon: '💜' },
  { id: 'ribbon',  label: 'Nơ 🎀',   icon: '🎀' },
  { id: 'moon',    label: 'Đêm 🌙',  icon: '🌙' },
  { id: 'party',   label: 'Party 🎉', icon: '🎉' },
];

// ── State ─────────────────────────────────────────────────────────────────────
const S = {
  mode: 'ready',
  filterIdx: 0,
  stickerIdx: 0,
  accessoryIdx: 0,
  faceAiEnabled: false,
  interval: 3,
  photos: [],
  stream: null,
  posterUrl: null,
  detectedFaces: [],
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
    <div class="hdr-live">
      <span class="hdr-dot"></span>
      <span>Sẵn sàng</span>
    </div>
  </header>

  <div class="main">
    <!-- Camera -->
    <div class="cam-col">
      <div class="cam-box">
        <video id="cam" autoplay muted playsinline></video>
        <div class="frame-ov" id="fov"></div>
        <div class="sticker-ov hidden" id="sov"></div>
        <div class="acc-ov hidden" id="acc-ov"></div>

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
          <button id="retry-cam" class="btn-outline">Thử lại</button>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="ctrl-col">
      <div class="tab-bar" id="tab-bar">
        <button class="tab active" data-tab="filter">🎨 Lọc</button>
        <button class="tab" data-tab="sticker">🎭 Hiệu ứng</button>
      </div>

      <div class="tab-pane" id="tab-filter">
        <div class="ctrl-lbl" style="padding:0 2px 4px">Bộ lọc màu</div>
        <div id="filter-grid" class="filter-grid"></div>
      </div>

      <div class="tab-pane hidden" id="tab-sticker">
        <div class="ctrl-lbl" style="padding:0 2px 8px">Đeo lên ảnh</div>
        <div id="acc-grid" class="sticker-grid"></div>
        <button id="face-ai-toggle" class="face-ai-toggle">
          <span class="face-ai-icon">🤖</span>
          <span class="face-ai-lbl">Face AI · TẮT</span>
          <small class="face-ai-hint">Tự động định vị lên mặt</small>
        </button>
        <div class="ctrl-lbl" style="padding:8px 2px 4px">Sticker poster</div>
        <div id="sticker-grid" class="sticker-grid"></div>
      </div>

      <div class="photo-grid" id="photo-grid">
        <div class="pv-slot" id="pvs0"><img class="pv" id="pv0" alt=""/><span class="pv-badge">1</span></div>
        <div class="pv-slot" id="pvs1"><img class="pv" id="pv1" alt=""/><span class="pv-badge">2</span></div>
        <div class="pv-slot" id="pvs2"><img class="pv" id="pv2" alt=""/><span class="pv-badge">3</span></div>
        <div class="pv-slot" id="pvs3"><img class="pv" id="pv3" alt=""/><span class="pv-badge">4</span></div>
      </div>

      <button class="shoot-btn" id="shoot-btn">
        <span class="s-icon">📷</span>
        <span class="s-text">CHỤP NGAY</span>
        <small class="s-hint">4 ảnh · 3s mỗi ảnh</small>
      </button>
    </div>
  </div>
</div>

<!-- Result overlay -->
<div class="result-ov hidden" id="rov">
  <div class="result-card">
    <p class="result-title">🎉 Xong rồi!</p>
    <img class="poster-img" id="poster-img" alt="Your photo"/>
    <div class="dl-row">
      <div class="qr-wrap">
        <img id="qr-img" alt="QR"/>
      </div>
      <div class="dl-info">
        <div class="qr-hint">
          <strong id="qr-title">Đang tạo link...</strong>
          <span id="qr-sub">Sắp xong, chờ chút</span>
        </div>
        <a id="dl-link" class="btn-primary" download="greenwichbooth.jpg">⬇ Tải về máy</a>
      </div>
    </div>
    <button id="retake-btn" class="btn-sec btn-full">↩ Chụp lại</button>
  </div>
</div>


<div class="proc-ov hidden" id="proc-ov">
  <div class="proc-card">
    <div class="proc-spin"></div>
    <p class="proc-txt">Đang tạo poster...</p>
    <small class="proc-sub" id="proc-sub">Vui lòng chờ</small>
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
  S.photos = [];
  qa('.pv-slot').forEach(s => s.classList.remove('filled'));
  qa('.pv').forEach(p => { p.src = ''; });
  q('.ctrl-col').classList.add('shooting');
  q('#shoot-btn').disabled = true;
  q('#cov').classList.remove('hidden');

  for (let i = 0; i < 4; i++) {
    for (let c = S.interval; c > 0; c--) {
      q('#cnt-n').textContent = c;
      q('#cnt-lbl').textContent = `Ảnh ${i + 1} / 4`;
      q('#cnt-n').dataset.tick = '1';
      await sleep(80);
      delete q('#cnt-n').dataset.tick;
      await sleep(920);
    }
    q('#cnt-n').textContent = '😊';
    q('#cnt-lbl').textContent = '';
    await sleep(280);

    S.photos.push(capFrame(cam));

    q(`#pv${i}`).src = S.photos[i];
    q(`#pvs${i}`).classList.add('filled');

    q(`#d${i}`).classList.add('done');
    if (i < 3) await sleep(380);
  }

  q('#cov').classList.add('hidden');
  q('.ctrl-col').classList.remove('shooting');
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
  // Tính posterUrl và bắt đầu upload ngay — không chờ showResult setup DOM
  S.posterUrl = q('#cvs').toDataURL('image/jpeg', 0.88);
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

  const out = document.createElement('canvas');
  out.width = sz; out.height = sz;
  const ox = out.getContext('2d');
  const fCss = FILTERS[S.filterIdx].css;
  if (fCss !== 'none') ox.filter = fCss;
  ox.drawImage(raw, 0, 0);
  ox.filter = 'none';

  if (S.accessoryIdx > 0) {
    const acc = ACCESSORIES[S.accessoryIdx];
    ox.font = `${Math.round(sz * acc.fs)}px serif`;
    ox.textBaseline = 'top';
    ox.textAlign = 'center';
    ox.fillText(acc.icon, sz / 2, Math.round(sz * acc.top));
  }

  return out.toDataURL('image/jpeg', 0.9);
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
  S.detectedFaces = [];

  // Draw photos + detect faces if Face AI enabled
  for (let i = 0; i < photos.length; i++) {
    await drawPhoto(ctx, photos[i], pos[i][0], pos[i][1], PH, PH);
    if (S.faceAiEnabled && window.faceapi) {
      const img = new Image();
      img.src = photos[i];
      await new Promise(r => img.onload = r);
      const face = await detectFaceInImage(img);
      S.detectedFaces[i] = face ? { x: face.x * (PH / img.width) + pos[i][0], y: face.y * (PH / img.height) + pos[i][1], w: face.width * (PH / img.width), h: face.height * (PH / img.height) } : null;
    }
  }

  // Per-photo mini-frames + accessories (Face AI positioned if detected)
  frames.forEach((frame, i) => drawPhotoFrame(ctx, frame, pos[i][0], pos[i][1], PH, PH));
  if (S.accessoryIdx > 0 && S.faceAiEnabled) {
    S.detectedFaces.forEach((face, i) => {
      if (!face) return;
      const acc = ACCESSORIES[S.accessoryIdx];
      ctx.font = `${Math.round(PH * acc.fs)}px serif`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      // Position based on face bounds
      let accY;
      if (acc.id === 'glasses' || acc.id === 'disguise') accY = face.y + face.h * 0.35;
      else if (acc.id === 'hat' || acc.id === 'crown' || acc.id === 'grad') accY = face.y - PH * 0.05;
      else if (acc.id === 'bow') accY = face.y + face.h * 0.85;
      else accY = face.y + face.h * acc.top;
      ctx.fillText(acc.icon, face.x + face.w / 2, accY);
    });
  }

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

  if (S.stickerIdx > 0) {
    ctx.font = '78px serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.fillText(STICKERS[S.stickerIdx].icon, W - 14, BAR / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }
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
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  return drawImg(ctx, url, x, y, w, h).then(() => URL.revokeObjectURL(url));
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
        q('#qr-title').textContent = '📱 Quét để tải về';
        q('#qr-sub').textContent = 'Dùng camera điện thoại quét mã';
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
  qa('.dot').forEach(d => d.classList.remove('done'));
  qa('.pv-slot').forEach(s => s.classList.remove('filled'));
  qa('.pv').forEach(p => { p.src = ''; });
  q('.ctrl-col').classList.remove('shooting');
}

// ── Sticker button HTML ───────────────────────────────────────────────────────
function makeStkr(s, i) {
  return `
    <button class="stkr${i === 0 ? ' active' : ''}" data-si="${i}" title="${s.label}">
      <div class="stkr-icon">${i === 0 ? '✕' : s.icon}</div>
      <span class="stkr-lbl">${s.label}</span>
    </button>`;
}

function updateStickerOv() {
  const sov = q('#sov');
  if (S.stickerIdx === 0) { sov.classList.add('hidden'); return; }
  sov.textContent = STICKERS[S.stickerIdx].icon;
  sov.classList.remove('hidden');
}

function makeAcc(a, i) {
  return `
    <button class="stkr${i === 0 ? ' active' : ''}" data-ai="${i}" title="${a.label}">
      <div class="stkr-icon">${i === 0 ? '✕' : a.icon}</div>
      <span class="stkr-lbl">${a.label.split(' ')[0]}</span>
    </button>`;
}

function updateAccOv() {
  const aov = q('#acc-ov');
  if (S.accessoryIdx === 0) { aov.classList.add('hidden'); return; }
  const acc = ACCESSORIES[S.accessoryIdx];
  aov.style.top = `${acc.top * 100}%`;
  aov.style.fontSize = `${Math.round(acc.fs * 100)}vmin`;
  aov.textContent = acc.icon;
  aov.classList.remove('hidden');
}

// ── Filter swatch card HTML ───────────────────────────────────────────────────
// Uses a fixed colorful gradient then applies the CSS filter — shows real effect
const SWATCH_BASE = 'linear-gradient(135deg,#f4a,#ffd,#4cf)';
function makeFlt(f, i) {
  const previewFilter = f.css === 'none' ? '' : `filter:${f.css}`;
  return `
    <button class="flt${i === 0 ? ' active' : ''}" data-fi="${i}">
      <div class="flt-prev" style="background:${SWATCH_BASE};${previewFilter}"></div>
      <span class="flt-lbl">${f.label}</span>
    </button>`;
}

function applyFilter() {
  const css = FILTERS[S.filterIdx].css;
  q('#cam').style.filter = css === 'none' ? '' : css;
}

// ── Tab switching ─────────────────────────────────────────────────────────────
q('#tab-bar').addEventListener('click', e => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  qa('.tab').forEach(t => t.classList.remove('active'));
  qa('.tab-pane').forEach(p => p.classList.add('hidden'));
  tab.classList.add('active');
  q(`#tab-${tab.dataset.tab}`).classList.remove('hidden');
});

// ── Events ────────────────────────────────────────────────────────────────────
q('#shoot-btn').addEventListener('click', shoot);
q('#retry-cam').addEventListener('click', startCam);
q('#retake-btn').addEventListener('click', retake);

q('#acc-grid').addEventListener('click', e => {
  const btn = e.target.closest('.stkr');
  if (!btn) return;
  S.accessoryIdx = +btn.dataset.ai;
  q('#acc-grid').querySelectorAll('.stkr').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateAccOv();
});

q('#sticker-grid').addEventListener('click', e => {
  const btn = e.target.closest('.stkr');
  if (!btn) return;
  S.stickerIdx = +btn.dataset.si;
  q('#sticker-grid').querySelectorAll('.stkr').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateStickerOv();
});

q('#face-ai-toggle').addEventListener('click', async () => {
  if (S.faceAiEnabled) {
    S.faceAiEnabled = false;
    q('#face-ai-toggle').classList.remove('active');
    q('#face-ai-toggle').querySelector('.face-ai-lbl').textContent = 'Face AI · TẮT';
  } else {
    q('#face-ai-toggle').disabled = true;
    q('#face-ai-toggle').querySelector('.face-ai-lbl').textContent = 'Đang tải model...';
    try {
      await loadFaceApi();
      S.faceAiEnabled = true;
      q('#face-ai-toggle').classList.add('active');
      q('#face-ai-toggle').querySelector('.face-ai-lbl').textContent = 'Face AI · BẬT';
    } catch (e) {
      q('#face-ai-toggle').querySelector('.face-ai-lbl').textContent = 'Lỗi tải model';
      console.error(e);
    } finally {
      q('#face-ai-toggle').disabled = false;
    }
  }
});

q('#filter-grid').addEventListener('click', e => {
  const btn = e.target.closest('.flt');
  if (!btn) return;
  S.filterIdx = +btn.dataset.fi;
  qa('.flt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilter();
});

// ── Init ──────────────────────────────────────────────────────────────────────
q('#filter-grid').innerHTML  = FILTERS.map((f, i) => makeFlt(f, i)).join('');
q('#acc-grid').innerHTML     = ACCESSORIES.map((a, i) => makeAcc(a, i)).join('');
q('#sticker-grid').innerHTML = STICKERS.map((s, i) => makeStkr(s, i)).join('');
startCam();
