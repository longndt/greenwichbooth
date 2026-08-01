import QRCode from 'qrcode';
import { removeBackground } from '@imgly/background-removal';
import './styles.css';

async function removeBg(dataUrl) {
  try {
    const blob = await removeBackground(dataUrl, { publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/dist/' });
    return URL.createObjectURL(blob);
  } catch {
    return dataUrl; // fallback: giữ ảnh gốc nếu xóa nền thất bại
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

// ── 12 frame templates ────────────────────────────────────────────────────────
// light:true  → bars are light-colored, text must be dark
// bgEnd       → gradient bar (bg → bgEnd)
// borderDash  → [dash, gap] for dashed border
// borderDouble→ thin inner border inside the main border
// pattern     → 'dots' | 'lines' subtle overlay on bars
const FRAMES = [
  {
    id: 'fotolab', label: '🖼️ Fotolab Classic', emoji: '📸',
    bg: '#6B1E24',  bgEnd: '#4A1620',        accent: '#F0E4C3',
    title: '',   sub: '',
    borderW: 7,     borderDouble: true,      decorStyle: 'cornerFrames',
  },
  {
    id: 'magic-hanoi', label: '✨ Magic Hanoi',   emoji: '🌟',
    bg: '#5A1C24',  bgEnd: '#3B1118',        accent: '#E8D5C4',
    title: '',   sub: '',
    borderW: 6,     decorStyle: 'emojiTop',
    topEmoji: ['✨', '🎉', '✨', '🎉'],
  },
  {
    id: 'studio-gold', label: '💎 Studio Gold',  emoji: '✨',
    bg: '#3D2817',  bgEnd: '#2B1B0E',        accent: '#D4AF37',
    title: '',    sub: '',
    borderW: 8,     borderDouble: true,      decorStyle: 'goldDots',
  },
  {
    id: 'burgundy', label: 'Burgundy Luxe',  emoji: '🎬',
    bg: '#5A1C24',  bgEnd: '#3B1118',        accent: '#E8E8E8',
    title: '',           sub: '',
    borderW: 7,
  },
  {
    id: 'classic',  label: 'Classic',        emoji: '🌿',
    bg: '#006b3f',  accent: '#FFCB2F',
    title: '',   sub: '',
  },
  {
    id: 'navy',     label: 'Navy Royal',     emoji: '🎓',
    bg: '#001B5E',  bgEnd: '#002D72',        accent: '#FFCB2F',
    title: '',        sub: '',
  },
  {
    id: 'captain',  label: 'Lion Captain',   emoji: '🦁',
    bg: '#1A0800',  bgEnd: '#2D1500',        accent: '#FF7A2E',
    title: '',        sub: '',
    borderDouble: true,
  },
  {
    id: 'neon',     label: 'Neon Night',     emoji: '⚡',
    bg: '#040D06',  accent: '#2DD77A',
    title: '',     sub: '',
    pattern: 'dots',
  },
  {
    id: 'sakura',   label: 'Sakura',         emoji: '🌸',
    bg: '#FCE4EC',  accent: '#E8698A',
    textColor: '#7B1B3A',         subColor: '#AD4060',
    title: '',   sub: '',
    light: true,    borderW: 5,
  },
  {
    id: 'emerald',  label: 'Emerald Luxe',   emoji: '💎',
    bg: '#003820',  bgEnd: '#006b3f',        accent: '#FFCB2F',
    title: '',   sub: '',
    pattern: 'lines', borderDouble: true,
  },
  {
    id: 'retro',    label: 'Retro Film',     emoji: '📽️',
    bg: '#2B1D0E',  bgEnd: '#1E1208',        accent: '#C9963A',
    title: '',  sub: '',
    borderDash: [14, 8], borderW: 5,
  },
  {
    id: 'black',    label: 'Bold Black',     emoji: '🖤',
    bg: '#080808',  accent: '#FFCB2F',
    title: '',           sub: '',
    borderW: 8,     borderDouble: true,
  },
  {
    id: 'sunset',   label: 'Sunset',         emoji: '🌅',
    bg: '#7C1D06',  bgEnd: '#C2410C',        accent: '#FCD34D',
    title: '',     sub: '',
  },
  {
    id: 'mint',     label: 'Mint Fresh',     emoji: '🍃',
    bg: '#D1FAE5',  accent: '#059669',
    textColor: '#064E3B',         subColor: '#047857',
    title: '',   sub: '',
    light: true,    borderW: 4,
  },
  {
    id: 'purple',   label: 'Purple Dream',   emoji: '💜',
    bg: '#1A0B35',  bgEnd: '#2D1A52',        accent: '#A78BFA',
    title: '',   sub: '',
    pattern: 'dots',
  },
  {
    id: 'white',    label: 'Clean White',    emoji: '🤍',
    bg: '#F9FAFB',  accent: '#006b3f',
    textColor: '#003D24',         subColor: '#006b3f',
    title: 'GREENWICH VIETNAM',   sub: 'greenwich.edu.vn',
    light: true,    borderW: 4,
  },
];

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
  frameIdx: 0,
  filterIdx: 0,
  stickerIdx: 0,
  interval: 3,
  photos: [],
  stream: null,
  posterUrl: null,
};

const q  = s => document.querySelector(s);
const qa = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Frame card thumbnail HTML ─────────────────────────────────────────────────
function makeFcard(f, i) {
  const midBg  = f.light ? 'rgba(0,0,0,0.06)' : '#0f1e14';
  const spanBg = f.light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.18)';
  const topBg  = f.bgEnd
    ? `linear-gradient(90deg,${f.bg},${f.bgEnd})`
    : f.bg;
  return `
    <button class="fcard${i === 0 ? ' active' : ''}" data-i="${i}"
            style="--facc:${f.accent}" title="${f.label}">
      <div class="fcard-thumb">
        <div class="fct-top" style="background:${topBg}"></div>
        <div class="fct-mid" style="background:${midBg}">
          <span style="background:${spanBg}"></span>
          <span style="background:${spanBg}"></span>
          <span style="background:${spanBg}"></span>
          <span style="background:${spanBg}"></span>
        </div>
        <div class="fct-bot" style="background:${f.bg}"></div>
      </div>
      <span class="fcard-lbl">${f.emoji} ${f.label}</span>
    </button>`;
}

// ── Mount HTML ────────────────────────────────────────────────────────────────
q('#app').innerHTML = `
<div class="app">
  <header class="hdr">
    <div class="hdr-brand">
      <div class="hdr-lion">${LION}</div>
      <div class="hdr-text">
        <span class="hdr-name">Greenwich Booth</span>
        <span class="hdr-sub">Studio ảnh nghệ thuật</span>
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
        <button class="tab active" data-tab="frame">🖼 Anh</button>
        <button class="tab" data-tab="filter">🎨 Lọc</button>
        <button class="tab" data-tab="sticker">✨ Sticker</button>
      </div>

      <div class="tab-pane" id="tab-frame">
        <div class="ctrl-sec">
          <div class="frame-grid" id="frame-grid">
            ${FRAMES.map((f, i) => makeFcard(f, i)).join('')}
          </div>
        </div>
      </div>

      <div class="tab-pane hidden" id="tab-filter">
        <div class="ctrl-lbl" style="padding:0 2px 4px">Bộ lọc màu</div>
        <div id="filter-grid" class="filter-grid"></div>
      </div>

      <div class="tab-pane hidden" id="tab-sticker">
        <div class="ctrl-lbl" style="padding:0 2px 4px">Sticker</div>
        <div id="sticker-grid" class="sticker-grid"></div>
      </div>

      <div class="ival-bar">
        <div class="ctrl-lbl">Thời gian: <strong id="ival-v">3</strong>s</div>
        <input type="range" id="ival" min="2" max="4" value="3" step="1"/>
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
        <small class="s-hint">4 ảnh · <span id="ival-h">3</span>s mỗi ảnh</small>
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
          <span>Sắp xong, chờ chút</span>
        </div>
        <a id="dl-link" class="btn-primary" download="greenwichbooth.jpg">⬇ Tải về máy</a>
      </div>
    </div>
    <button id="retake-btn" class="btn-sec btn-full">↩ Chụp lại</button>
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

// ── Frame preview on camera ───────────────────────────────────────────────────
function updatePreview() {
  const f = FRAMES[S.frameIdx];
  const topBg    = f.bgEnd ? `linear-gradient(90deg,${f.bg},${f.bgEnd})` : f.bg;
  const titleCol = f.textColor || '#ffffff';
  const subCol   = f.subColor  || 'rgba(255,255,255,0.72)';

  q('#fov').innerHTML = `
    <div class="fp" style="--acc:${f.accent}">
      <div class="fp-top" style="background:${topBg}">
        <span class="fp-title" style="color:${titleCol}">${f.title}</span>
        <div class="fp-lion">${LION}</div>
      </div>
      <div class="fp-bot" style="background:${f.bg}">
        <span style="color:${subCol}">${f.sub}</span>
        <span style="color:${subCol}">#GreenwichVN</span>
      </div>
    </div>`;
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
    q('#cnt-lbl').textContent = 'Cười lên nào!';
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
  S.mode = 'done';
  try {
    await Promise.race([buildPoster(), sleep(40000)]);
  } catch (err) {
    console.error('buildPoster failed:', err);
  }
  showResult();
}

function capFrame(cam) {
  const vw = cam.videoWidth, vh = cam.videoHeight;
  const sz = Math.min(vw, vh);

  // Step 1: capture raw mirrored frame
  const raw = document.createElement('canvas');
  raw.width = sz; raw.height = sz;
  const rx = raw.getContext('2d');
  rx.translate(sz, 0); rx.scale(-1, 1);
  rx.drawImage(cam, (vw - sz) / 2, (vh - sz) / 2, sz, sz, 0, 0, sz, sz);

  // Step 2: apply CSS filter via a separate canvas (avoids video-taint risk)
  const fCss = FILTERS[S.filterIdx].css;
  if (fCss === 'none') return raw.toDataURL('image/jpeg', 0.9);

  const out = document.createElement('canvas');
  out.width = sz; out.height = sz;
  const ox = out.getContext('2d');
  ox.filter = fCss;
  ox.drawImage(raw, 0, 0);
  return out.toDataURL('image/jpeg', 0.9);
}

// ── Poster composition (1080×1440) — 2×2 square grid ────────────────────────────
async function buildPoster() {
  await document.fonts.ready;

  const cvs = q('#cvs');
  cvs.width = 1080; cvs.height = 1440;
  const ctx = cvs.getContext('2d');
  const W = 1080, H = 1440, BAR = 140, HPAD = 20, VPAD = 30, GAP = 20;
  const f = FRAMES[S.frameIdx];

  // Square photo size: 2 columns fit exactly
  const PH = Math.floor((W - 2 * HPAD - GAP) / 2); // 510px

  // 2×2 grid: [x, y] for each photo slot
  const pos = [
    [HPAD,            BAR + VPAD],
    [HPAD + PH + GAP, BAR + VPAD],
    [HPAD,            BAR + VPAD + PH + GAP],
    [HPAD + PH + GAP, BAR + VPAD + PH + GAP],
  ];

  // Base fill
  ctx.fillStyle = f.bg;
  ctx.fillRect(0, 0, W, H);

  // Xóa nền 4 ảnh song song, fallback về ảnh gốc nếu lỗi
  const photos = await Promise.all(S.photos.map(removeBg));

  // Draw 4 square photos (đã xóa nền)
  await Promise.all(photos.map((url, i) => drawPhoto(ctx, url, pos[i][0], pos[i][1], PH, PH)));

  // Giải phóng object URLs tạm
  photos.forEach(url => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });

  // Dashed border around each photo
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 5]);
  for (const [px, py] of pos) ctx.strokeRect(px + 3, py + 3, PH - 6, PH - 6);
  ctx.setLineDash([]);

  // Cross separators: horizontal dots + vertical dots
  const sepX = Math.round(HPAD + PH + GAP / 2);
  const sepY = Math.round(BAR + VPAD + PH + GAP / 2);
  ctx.fillStyle = f.accent + 'CC';
  // horizontal row
  for (let x = HPAD; x <= W - HPAD; x += 12) {
    ctx.beginPath(); ctx.arc(x, sepY, 2.5, 0, Math.PI * 2); ctx.fill();
  }
  // vertical column
  for (let y = BAR + VPAD; y <= BAR + VPAD + PH * 2 + GAP; y += 12) {
    ctx.beginPath(); ctx.arc(sepX, y, 2.5, 0, Math.PI * 2); ctx.fill();
  }

  // Bars
  drawBar(ctx, f, 0, 0, W, BAR);
  drawBar(ctx, f, 0, H - BAR, W, BAR);

  // Outer border
  drawBorder(ctx, f, W, H);

  // Decorative dot border inside main border (for borderDouble/burgundy frames)
  if (f.borderDouble || f.id === 'burgundy') {
    const margin = (f.borderW || 6) + 12;
    const step = 16, r = 2;
    ctx.fillStyle = f.accent + '88';
    for (let x = margin; x <= W - margin; x += step) {
      ctx.beginPath(); ctx.arc(x, margin, r, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x, H - margin, r, 0, Math.PI * 2); ctx.fill();
    }
    for (let y = margin + step; y < H - margin; y += step) {
      ctx.beginPath(); ctx.arc(margin, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(W - margin, y, r, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Top-bar: Lion mascot + text
  await drawSvg(ctx, LION, 14, (BAR - 110) / 2, 110, 110);

  const titleX    = 142;
  const titleCol  = f.textColor || '#FFFFFF';
  const subCol    = f.subColor  || 'rgba(255,255,255,0.72)';
  const titleSize = f.title.length > 20 ? 40 : 50;

  ctx.textBaseline = 'top';
  ctx.fillStyle = titleCol;
  ctx.font = `900 ${titleSize}px "Arial Black", Arial, sans-serif`;
  ctx.fillText(f.title, titleX, 22);

  ctx.fillStyle = subCol;
  ctx.font = '600 28px Arial, sans-serif';
  ctx.fillText(f.sub, titleX, 88);

  // Bottom-bar: centered branding
  const btmY   = H - BAR;
  const btmCol = f.light ? (f.textColor || '#1a1a1a') : titleCol;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = btmCol;
  ctx.font = '900 32px "Arial Black", Arial, sans-serif';
  ctx.fillText('GREENWICH VIETNAM', W / 2, btmY + BAR * 0.36);
  ctx.fillStyle = subCol;
  ctx.font = '500 20px Arial, sans-serif';
  if (f.photoLocation) {
    ctx.fillText(f.photoLocation, W / 2, btmY + BAR * 0.65);
    ctx.font = '400 14px Arial, sans-serif';
    ctx.fillText('greenwich.edu.vn', W / 2, btmY + BAR * 0.85);
  } else {
    ctx.fillText('greenwich.edu.vn  ·  #GreenwichVN', W / 2, btmY + BAR * 0.72);
  }
  ctx.textAlign = 'left';

  // Decorative elements
  if (f.decorStyle) {
    drawDecorations(ctx, f, W, H);
  }

  // Sticker — top-bar right side (doesn't cover faces)
  if (S.stickerIdx > 0) {
    ctx.font = '78px serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.fillText(STICKERS[S.stickerIdx].icon, W - 14, BAR / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }
}

function drawDecorations(ctx, f, W, H) {
  if (f.decorStyle === 'diamonds') {
    // Diamond pattern along borders
    const sz = 20, sp = 28;
    ctx.fillStyle = f.accent + '44';
    for (let x = 30; x < W - 30; x += sp) {
      drawDiamond(ctx, x, 20, sz);
      drawDiamond(ctx, x, H - 20, sz);
    }
    for (let y = 50; y < H - 50; y += sp) {
      drawDiamond(ctx, 20, y, sz);
      drawDiamond(ctx, W - 20, y, sz);
    }
  } else if (f.decorStyle === 'filmstrip') {
    // Film strip holes along left & right edges
    const r = 10, sp = 50;
    ctx.fillStyle = '#1a1a1a';
    for (let y = 60; y < H - 60; y += sp) {
      ctx.beginPath(); ctx.arc(22, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(W - 22, y, r, 0, Math.PI * 2); ctx.fill();
    }
  } else if (f.decorStyle === 'squares') {
    // Square grid pattern inside border
    const sz = 18, sp = 32;
    ctx.strokeStyle = f.accent + '33';
    ctx.lineWidth = 1.5;
    for (let x = 25; x < W - 25; x += sp) {
      for (let y = 25; y < H - 25; y += sp) {
        ctx.strokeRect(x, y, sz, sz);
      }
    }
  } else if (f.decorStyle === 'cornerFrames') {
    // Small frame decorations at corners (Fotolab style)
    const r = 15, offset = 25;
    ctx.strokeStyle = f.accent + '66';
    ctx.lineWidth = 2;
    // Top-left, top-right, bottom-left, bottom-right
    [[offset, offset], [W - offset, offset], [offset, H - offset], [W - offset, H - offset]].forEach(([x, y]) => {
      ctx.strokeRect(x - r, y - r, r * 2, r * 2);
    });
  } else if (f.decorStyle === 'emojiTop') {
    // Emoji decorations on top bar (Magic Hanoi style)
    if (f.topEmoji) {
      ctx.font = '40px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const positions = [100, 350, 730, 980];
      f.topEmoji.forEach((emoji, i) => {
        ctx.fillText(emoji, positions[i], 70);
      });
    }
  } else if (f.decorStyle === 'goldDots') {
    // Gold dot pattern (Studio Gold style)
    const r = 3, sp = 30;
    ctx.fillStyle = f.accent + '55';
    for (let x = 50; x < W - 50; x += sp) {
      for (let y = 50; y < H - 50; y += sp) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawDiamond(ctx, cx, cy, sz) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - sz);
  ctx.lineTo(cx + sz, cy);
  ctx.lineTo(cx, cy + sz);
  ctx.lineTo(cx - sz, cy);
  ctx.closePath();
  ctx.fill();
}

function drawBar(ctx, f, x, y, w, h) {
  if (f.bgEnd) {
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, f.bg);
    g.addColorStop(1, f.bgEnd);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = f.bg;
  }
  ctx.fillRect(x, y, w, h);

  if (f.pattern === 'dots') {
    ctx.fillStyle = 'rgba(255,255,255,0.055)';
    for (let px = 0; px < w; px += 24) {
      for (let py = y + 4; py < y + h - 4; py += 20) {
        ctx.beginPath();
        ctx.arc(x + px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (f.pattern === 'lines') {
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    for (let px = x; px < x + w; px += 28) {
      ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px, y + h); ctx.stroke();
    }
  }
}

function drawBorder(ctx, f, W, H) {
  const bw   = f.borderW || 6;
  const half = bw / 2;
  ctx.strokeStyle = f.accent;
  ctx.lineWidth   = bw;
  ctx.setLineDash(f.borderDash || []);
  ctx.strokeRect(half, half, W - bw, H - bw);
  ctx.setLineDash([]);
  if (f.borderDouble) {
    const off = bw + 5;
    ctx.lineWidth = 2;
    ctx.strokeRect(off, off, W - off * 2, H - off * 2);
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
function showResult() {
  S.posterUrl = q('#cvs').toDataURL('image/jpeg', 0.92);
  q('#poster-img').src = S.posterUrl;
  q('#dl-link').href   = S.posterUrl;
  q('#qr-img').src     = '';
  q('.qr-wrap').classList.add('qr-loading');
  q('#qr-title').textContent = 'Đang tạo link...';
  q('#rov').classList.remove('hidden');

  uploadPoster(S.posterUrl).then(dlUrl => {
    q('.qr-wrap').classList.remove('qr-loading');
    if (!dlUrl) {
      q('#qr-title').textContent = 'Không tạo được link';
      return;
    }
    QRCode.toDataURL(dlUrl, { margin: 1, width: 240, color: { dark: '#006b3f', light: '#fff' } })
      .then(qr => {
        q('#qr-img').src = qr;
        q('#qr-title').textContent = '📱 Quét để tải về';
      });
  });
}

async function uploadPoster(dataUrl) {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl }),
    });
    if (!res.ok) return null;
    const { url } = await res.json();
    return url;
  } catch { return null; }
}

function retake() {
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

q('#frame-grid').addEventListener('click', e => {
  const card = e.target.closest('.fcard');
  if (!card) return;
  S.frameIdx = +card.dataset.i;
  qa('.fcard').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  updatePreview();
});

q('#ival').addEventListener('input', e => {
  S.interval = +e.target.value;
  q('#ival-v').textContent = S.interval;
  q('#ival-h').textContent = S.interval;
});

q('#sticker-grid').addEventListener('click', e => {
  const btn = e.target.closest('.stkr');
  if (!btn) return;
  S.stickerIdx = +btn.dataset.si;
  qa('.stkr').forEach(b => b.classList.remove('active'));
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

// ── Init ──────────────────────────────────────────────────────────────────────
q('#filter-grid').innerHTML  = FILTERS.map((f, i) => makeFlt(f, i)).join('');
q('#sticker-grid').innerHTML = STICKERS.map((s, i) => makeStkr(s, i)).join('');
updatePreview();
startCam();
