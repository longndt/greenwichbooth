import QRCode from 'qrcode';
import './styles.css';

// Face detection removed — simplified accessory positioning (fixed positioning)

// ── Modern Lion mascot — gradient green + gold ────────────────────────────────
const LION = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#006b3f"/>
      <stop offset="100%" style="stop-color:#FFCB2F"/>
    </linearGradient>
  </defs>
  <polygon points="60,8 55,28 65,28" fill="#006b3f"/>
  <polygon points="42,16 32,36 52,32" fill="#006b3f"/>
  <polygon points="78,16 68,32 88,36" fill="#006b3f"/>
  <polygon points="30,28 18,45 38,44" fill="#006b3f"/>
  <polygon points="90,28 82,44 102,45" fill="#006b3f"/>
  <circle cx="60" cy="58" r="32" fill="url(#lg)"/>
  <path d="M 48 52 L 44 58 L 48 64 L 52 58 Z" fill="white" stroke="#006b3f" stroke-width="1"/>
  <circle cx="48" cy="58" r="3.5" fill="#002D72"/>
  <circle cx="48.5" cy="56.5" r="1.2" fill="white"/>
  <path d="M 72 52 L 68 58 L 72 64 L 76 58 Z" fill="white" stroke="#006b3f" stroke-width="1"/>
  <circle cx="72" cy="58" r="3.5" fill="#002D72"/>
  <circle cx="72.5" cy="56.5" r="1.2" fill="white"/>
  <path d="M 60 64 L 57 70 L 63 70 Z" fill="#FFCB2F" stroke="#006b3f" stroke-width="0.5"/>
  <path d="M 54 74 Q 60 77 66 74" stroke="#002D72" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="36" cy="38" r="7" fill="#006b3f" stroke="#FFCB2F" stroke-width="1.5"/>
  <circle cx="84" cy="38" r="7" fill="#006b3f" stroke="#FFCB2F" stroke-width="1.5"/>
  <circle cx="36" cy="38" r="4" fill="#FFCB2F" opacity="0.7"/>
  <circle cx="84" cy="38" r="4" fill="#FFCB2F" opacity="0.7"/>
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
const FILTERS = [
  { id: 'normal',  label: 'Bình thường', css: 'none' },
  { id: 'vivid',   label: 'Sống động',   css: 'saturate(1.9) contrast(1.15)' },
  { id: 'warm',    label: 'Ấm áp',       css: 'sepia(0.45) saturate(1.4) brightness(1.06)' },
  { id: 'cool',    label: 'Lạnh',        css: 'hue-rotate(195deg) saturate(1.25) brightness(1.08)' },
  { id: 'bw',      label: 'Đen Trắng',   css: 'grayscale(1) contrast(1.1)' },
  { id: 'vintage', label: 'Vintage',     css: 'sepia(0.55) saturate(0.85) brightness(0.94) contrast(1.08)' },
  { id: 'sepia-pro', label: 'Sepia+',    css: 'sepia(0.8) saturate(1.3) brightness(0.92) contrast(1.15)' },
  { id: 'blur',    label: 'Mờ',          css: 'blur(4px) brightness(1.05)' },
  { id: 'neon',    label: 'Neon',        css: 'saturate(2.5) contrast(1.8) brightness(1.1) hue-rotate(-15deg)' },
];

// ── 20 accessories — overlaid on each captured photo ──────────────────────────
// Organized by category: Face | Props | Seasonal
// top: vertical position (0=top, 1=bottom) as fraction of photo height
// fs:  emoji font size as fraction of photo height
const ACCESSORIES = [
  // None
  { id: 'none',    label: 'Không',   icon: '',   top: 0,    fs: 0,    cat: 'none' },
  // Face (6 items)
  { id: 'glasses', label: 'Kính 😎', icon: '😎', top: 0.44, fs: 0.22, cat: 'face' },
  { id: 'sunglasses', label: 'Mắt 🕶️', icon: '🕶️', top: 0.44, fs: 0.20, cat: 'face' },
  { id: 'monocle', label: 'Kính lúp 🧐', icon: '🧐', top: 0.42, fs: 0.18, cat: 'face' },
  { id: 'disguise',label: 'Râu 🥸', icon: '🥸', top: 0.38, fs: 0.26, cat: 'face' },
  { id: 'mask',    label: 'Mặt nạ 🎭', icon: '🎭', top: 0.40, fs: 0.24, cat: 'face' },
  { id: 'zany',    label: 'Điên rồ 🤪', icon: '🤪', top: 0.40, fs: 0.24, cat: 'face' },
  // Hats (5 items)
  { id: 'hat',     label: 'Mũ 🎩',  icon: '🎩', top: 0.03, fs: 0.28, cat: 'props' },
  { id: 'crown',   label: 'Vương 👑',icon: '👑', top: 0.03, fs: 0.22, cat: 'props' },
  { id: 'grad',    label: 'Cử nhân 🎓',icon:'🎓',top: 0.03, fs: 0.28, cat: 'props' },
  { id: 'party-hat', label: 'Bữa tiệc 🎉', icon: '🎉', top: 0.02, fs: 0.26, cat: 'props' },
  { id: 'flower-crown', label: 'Hoa 👑', icon: '👑', top: 0.02, fs: 0.24, cat: 'props' },
  // Props (4 items)
  { id: 'bow',     label: 'Nơ 🎀',  icon: '🎀', top: 0.05, fs: 0.20, cat: 'props' },
  { id: 'flower',  label: 'Hoa 🌸', icon: '🌸', top: 0.03, fs: 0.18, cat: 'props' },
  { id: 'rainbow', label: 'Cầu vồng 🌈',icon:'🌈',top:0.01,fs: 0.30, cat: 'props' },
  { id: 'horns',   label: 'Sừng 👿', icon: '👿', top: 0.02, fs: 0.22, cat: 'props' },
  // Seasonal (4 items)
  { id: 'santa',   label: 'Giáng sinh 🎄', icon: '🎄', top: 0.03, fs: 0.26, cat: 'season' },
  { id: 'pumpkin', label: 'Halloween 🎃', icon: '🎃', top: 0.03, fs: 0.24, cat: 'season' },
  { id: 'love',    label: 'Tình yêu 💝', icon: '💝', top: 0.03, fs: 0.20, cat: 'season' },
  { id: 'wings',   label: 'Cánh thiên thần 😇', icon: '😇', top: 0.01, fs: 0.26, cat: 'season' },
];

// ── 15 stickers (1 = none + 14 emoji) — drawn on top-bar right of poster ────────
const STICKERS = [
  { id: 'none',    label: 'Không',   icon: '' },
  // Mood (5)
  { id: 'sparkle', label: 'Vui ✨',  icon: '✨' },
  { id: 'star',    label: 'Sao ⭐',  icon: '⭐' },
  { id: 'fire',    label: 'Hot 🔥',  icon: '🔥' },
  { id: 'heart',   label: 'Tim 💜',  icon: '💜' },
  { id: 'moon',    label: 'Đêm 🌙',  icon: '🌙' },
  // Flowers & Ribbons (3)
  { id: 'sakura',  label: 'Hoa 🌸',  icon: '🌸' },
  { id: 'ribbon',  label: 'Nơ 🎀',   icon: '🎀' },
  { id: 'sunflower', label: 'Hướng dương 🌻', icon: '🌻' },
  // Celebration (4)
  { id: 'party',   label: 'Party 🎉', icon: '🎉' },
  { id: 'balloon', label: 'Bong bóng 🎈', icon: '🎈' },
  { id: 'gift',    label: 'Quà 🎁',  icon: '🎁' },
  { id: 'confetti', label: 'Pháo 🎊', icon: '🎊' },
  // Seasonal (2)
  { id: 'christmas', label: 'Giáng sinh 🎄', icon: '🎄' },
  { id: 'twinkle', label: 'Sáng ✨', icon: '✨' },
];

// ── State ─────────────────────────────────────────────────────────────────────
const S = {
  mode: 'ready',
  filterIdx: 0,
  stickerIdx: 0,
  accessoryIdx: 0,
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
          <button id="retry-cam" class="btn-outline" aria-label="Thử kết nối camera lại">Thử lại</button>
        </div>

        <div class="empty-state" id="empty-state">
          <div class="empty-state-content">
            <div class="empty-state-icon">🚀</div>
            <h2 class="empty-state-title">Bắt đầu ngay!</h2>
            <div class="empty-state-steps">
              <div class="step-item"><span class="step-num">1</span> Chọn khung</div>
              <div class="step-item"><span class="step-num">2</span> Chụp 4 ảnh</div>
              <div class="step-item"><span class="step-num">3</span> Tải về</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="ctrl-col">
      <div class="tab-bar" id="tab-bar">
        <button class="tab active" data-tab="filter" aria-label="Tab bộ lọc màu">🎨 Lọc</button>
        <button class="tab" data-tab="sticker" aria-label="Tab hiệu ứng và sticker">🎭 Hiệu ứng</button>
      </div>

      <div class="tab-pane" id="tab-filter">
        <div class="ctrl-lbl" style="padding:0 2px 4px">Bộ lọc màu</div>
        <div id="filter-grid" class="filter-grid"></div>
      </div>

      <div class="tab-pane hidden" id="tab-sticker">
        <div class="ctrl-lbl" style="padding:0 2px 8px">Đeo lên ảnh</div>
        <div id="acc-grid" class="sticker-grid"></div>
        <div class="ctrl-lbl" style="padding:8px 2px 4px">Sticker poster</div>
        <div id="sticker-grid" class="sticker-grid"></div>
      </div>

      <div class="photo-grid" id="photo-grid">
        <div class="pv-slot" id="pvs0"><img class="pv" id="pv0" alt="Ảnh 1 được chụp"/><span class="pv-badge">1</span></div>
        <div class="pv-slot" id="pvs1"><img class="pv" id="pv1" alt="Ảnh 2 được chụp"/><span class="pv-badge">2</span></div>
        <div class="pv-slot" id="pvs2"><img class="pv" id="pv2" alt="Ảnh 3 được chụp"/><span class="pv-badge">3</span></div>
        <div class="pv-slot" id="pvs3"><img class="pv" id="pv3" alt="Ảnh 4 được chụp"/><span class="pv-badge">4</span></div>
      </div>

      <button class="shoot-btn" id="shoot-btn" aria-label="Chụp 4 ảnh liên tiếp, mỗi ảnh cách 3 giây">
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
    <img class="poster-img" id="poster-img" alt="Bộ poster 4 ảnh được ghép lại"/>
    <div class="dl-row">
      <div class="qr-wrap">
        <img id="qr-img" alt="Mã QR để quét và tải ảnh"/>
      </div>
      <div class="dl-info">
        <div class="qr-hint">
          <strong id="qr-title">Đang tạo link...</strong>
          <span id="qr-sub">Sắp xong, chờ chút</span>
        </div>
        <a id="dl-link" class="btn-primary" download="greenwichbooth.jpg" aria-label="Tải poster về máy">⬇ Tải về máy</a>
      </div>
    </div>
    <button id="retake-btn" class="btn-sec btn-full" aria-label="Chụp lại bộ ảnh mới">↩ Chụp lại</button>
  </div>
</div>


<div class="proc-ov hidden" id="proc-ov">
  <div class="proc-card">
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
    q('#empty-state').classList.add('hidden');
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
      await sleep(80);
      delete q('#cnt-n').dataset.tick;
      await sleep(920);
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

  const out = document.createElement('canvas');
  out.width = sz; out.height = sz;
  const ox = out.getContext('2d');
  const fCss = FILTERS[S.filterIdx].css;
  if (fCss !== 'none') ox.filter = fCss;
  ox.drawImage(raw, 0, 0);
  ox.filter = 'none';

  // Draw accessory on captured photo (fixed positioning)
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

  // Draw all 4 photos in parallel
  await Promise.all(photos.map((p, i) => drawPhoto(ctx, p, pos[i][0], pos[i][1], PH, PH)));

  // Per-photo mini-frames
  frames.forEach((frame, i) => drawPhotoFrame(ctx, frame, pos[i][0], pos[i][1], PH, PH));

  // Draw accessories on poster (fixed positioning)
  if (S.accessoryIdx > 0) {
    const acc = ACCESSORIES[S.accessoryIdx];
    for (let i = 0; i < 4; i++) {
      ctx.font = `${Math.round(PH * acc.fs)}px serif`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.fillText(acc.icon, pos[i][0] + PH / 2, pos[i][1] + Math.round(PH * acc.top));
    }
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
  q('.ctrl-col').classList.remove('shooting');
}

// ── Sticker button HTML ───────────────────────────────────────────────────────
function makeStkr(s, i, isSticker = false) {
  const isHidden = i > 3 ? 'hidden' : ''; // Hide stickers 4+ initially
  const dataAttr = isSticker ? 'data-si' : 'data-si';
  return `
    <button class="stkr${i === 0 ? ' active' : ''}${isHidden ? ' sticker-hidden' : ''}" ${dataAttr}="${i}" title="${s.label}" ${isHidden ? 'style="display:none"' : ''}>
      <div class="stkr-icon">${i === 0 ? '✕' : s.icon}</div>
      <span class="stkr-lbl">${s.label}</span>
    </button>`;
}

function makeStickerGrid() {
  const heroStkr = STICKERS.slice(0, 4).map((s, i) => makeStkr(s, i, true)).join('');
  const toggleBtn = `<button class="sticker-toggle" id="sticker-toggle">+ Xem thêm</button>`;
  const hiddenStkr = STICKERS.slice(4).map((s, i) => makeStkr(s, i + 4, true)).join('');
  return `${heroStkr}${toggleBtn}<div id="sticker-hidden" class="sticker-hidden-group" style="display:none">${hiddenStkr}</div>`;
}

function updateStickerOv() {
  const sov = q('#sov');
  if (S.stickerIdx === 0) { sov.classList.add('hidden'); return; }
  sov.textContent = STICKERS[S.stickerIdx].icon;
  sov.classList.remove('hidden');
}

function makeAcc(a, i) {
  const isHidden = i > 3 ? 'hidden' : ''; // Hide accessories 4+ initially
  return `
    <button class="stkr${i === 0 ? ' active' : ''}${isHidden ? ' acc-hidden' : ''}" data-ai="${i}" title="${a.label}" ${isHidden ? 'style="display:none"' : ''}>
      <div class="stkr-icon">${i === 0 ? '✕' : a.icon}</div>
      <span class="stkr-lbl">${a.label.split(' ')[0]}</span>
    </button>`;
}

function makeAccGrid() {
  const heroAcc = ACCESSORIES.slice(0, 4).map((a, i) => makeAcc(a, i)).join('');
  const toggleBtn = `<button class="acc-toggle" id="acc-toggle">+ Xem thêm</button>`;
  const hiddenAcc = ACCESSORIES.slice(4).map((a, i) => makeAcc(a, i + 4)).join('');
  return `${heroAcc}${toggleBtn}<div id="acc-hidden" class="acc-hidden-group" style="display:none">${hiddenAcc}</div>`;
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
  const isHidden = i > 3 ? 'hidden' : ''; // Hide filters 4-8 initially
  return `
    <button class="flt${i === 0 ? ' active' : ''}${isHidden ? ' filter-hidden' : ''}" data-fi="${i}" ${isHidden ? 'style="display:none"' : ''}>
      <div class="flt-prev" style="background:${SWATCH_BASE};${previewFilter}"></div>
      <span class="flt-lbl">${f.label}</span>
    </button>`;
}

function makeFilterGrid() {
  const heroFilters = FILTERS.slice(0, 4).map((f, i) => makeFlt(f, i)).join('');
  const toggleBtn = `<button class="flt-toggle" id="filter-toggle">+ Xem thêm</button>`;
  const hiddenFilters = FILTERS.slice(4).map((f, i) => makeFlt(f, i + 4)).join('');
  return `${heroFilters}${toggleBtn}<div id="filter-hidden" class="filter-hidden-group" style="display:none">${hiddenFilters}</div>`;
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

q('#filter-grid').addEventListener('click', e => {
  const btn = e.target.closest('.flt');
  if (!btn) return;
  S.filterIdx = +btn.dataset.fi;
  qa('.flt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilter();
});

// ── Mobile orientation ───────────────────────────────────────────────────────
window.addEventListener('orientationchange', () => {
  if (S.mode === 'ready') startCam();
});

// ── Init ──────────────────────────────────────────────────────────────────────
q('#filter-grid').innerHTML  = makeFilterGrid();
q('#acc-grid').innerHTML     = makeAccGrid();
q('#sticker-grid').innerHTML = makeStickerGrid();

// Toggle handlers
[
  { id: 'filter-toggle', hidden: '#filter-hidden' },
  { id: 'acc-toggle', hidden: '#acc-hidden' },
  { id: 'sticker-toggle', hidden: '#sticker-hidden' }
].forEach(({ id, hidden }) => {
  const btn = q(`#${id}`);
  if (btn) {
    btn.addEventListener('click', () => {
      const div = q(hidden);
      if (div.style.display === 'none') {
        div.style.display = '';
        btn.textContent = '- Ẩn bớt';
      } else {
        div.style.display = 'none';
        btn.textContent = '+ Xem thêm';
      }
    });
  }
});

startCam();
if (import.meta.env.DEV) window.__t = { S, buildPoster, ACCESSORIES, STICKERS, FILTERS };
