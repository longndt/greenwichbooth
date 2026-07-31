import QRCode from 'qrcode';
import './styles.css';

// ── Lion Captain mascot (cute cartoon, Greenwich Vietnam brand) ───────────────
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
  <circle cx="50" cy="6" r="11" fill="#C96010"/>
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

// ── Frame designs ─────────────────────────────────────────────────────────────
const FRAMES = [
  { id: 'classic', label: 'Classic',    bg: '#006b3f', accent: '#F7C948', title: 'GREENWICH VIETNAM', sub: 'greenwich.edu.vn' },
  { id: 'openday', label: 'Open Day',   bg: '#002D72', accent: '#F7C948', title: 'OPEN DAY 2026',     sub: 'Hà Nội · HCM'   },
  { id: 'captain', label: '🦁 Captain', bg: '#1a1010', accent: '#F7C948', title: 'LION CAPTAIN',      sub: '#GreenwichVN'   },
];

// ── App state ─────────────────────────────────────────────────────────────────
const S = {
  mode: 'ready',
  frameIdx: 0,
  interval: 3,
  photos: [],
  stream: null,
  posterUrl: null,
};

const q  = s => document.querySelector(s);
const qa = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Build HTML ────────────────────────────────────────────────────────────────
q('#app').innerHTML = `
<div class="app">
  <header class="hdr">
    <div class="hdr-brand">
      <div class="hdr-lion">${LION}</div>
      <span class="hdr-name">Greenwich Booth</span>
    </div>
    <span class="hdr-tag">Photo Studio</span>
  </header>

  <div class="main">
    <div class="cam-col">
      <div class="cam-box">
        <video id="cam" autoplay muted playsinline></video>
        <div class="frame-ov" id="fov"></div>

        <div class="cnt-ov hidden" id="cov">
          <div class="cnt-ring">
            <div class="cnt-n" id="cnt-n">3</div>
          </div>
          <div class="cnt-lbl" id="cnt-lbl">Ảnh 1/4</div>
          <div class="dot-strip">
            <span class="dot" id="d0"></span>
            <span class="dot" id="d1"></span>
            <span class="dot" id="d2"></span>
            <span class="dot" id="d3"></span>
          </div>
        </div>

        <div class="cam-err hidden" id="cerr">
          <div style="font-size:44px">📷</div>
          <p>Không thể dùng camera.<br/>Kiểm tra quyền truy cập.</p>
          <button id="retry-cam" class="btn-outline">Thử lại</button>
        </div>
      </div>
    </div>

    <div class="ctrl-col">
      <div class="ctrl-sec">
        <div class="ctrl-lbl">Chọn frame</div>
        <div class="chips" id="chips">
          ${FRAMES.map((f, i) => `
            <button class="chip${i === 0 ? ' active' : ''}"
                    style="--c:${f.bg};--a:${f.accent}"
                    data-i="${i}">${f.label}</button>
          `).join('')}
        </div>
      </div>

      <div class="ctrl-sec">
        <div class="ctrl-lbl">Delay giữa ảnh: <strong id="ival-v">3</strong>s</div>
        <input type="range" id="ival" min="2" max="6" value="3" step="1"/>
      </div>

      <button class="shoot-btn" id="shoot-btn">
        <span class="s-icon">📷</span>
        <span class="s-text">CHỤP NGAY</span>
        <small class="s-hint">4 ảnh · delay <span id="ival-h">3</span>s</small>
      </button>
    </div>
  </div>
</div>

<div class="result-ov hidden" id="rov">
  <div class="result-card">
    <div class="result-title">🎉 Ảnh của bạn!</div>
    <img class="poster-img" id="poster-img" alt="Your photo"/>
    <div class="qr-blk hidden" id="qr-blk">
      <img id="qr-img" alt="QR code"/>
      <span>Quét để tải về điện thoại</span>
    </div>
    <div class="result-btns">
      <a id="dl-link" class="btn-primary" download="greenwichbooth.jpg">⬇ Tải về</a>
      <button id="retake-btn" class="btn-sec">↩ Chụp lại</button>
    </div>
  </div>
</div>

<div class="flash" id="flash"></div>
<canvas id="cvs" width="1080" height="1080" style="display:none"></canvas>
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

// ── Frame preview overlay on camera ──────────────────────────────────────────
function updatePreview() {
  const f = FRAMES[S.frameIdx];
  q('#fov').innerHTML = `
    <div class="fp" style="--a:${f.accent};--bg2:${f.bg}">
      <div class="fp-top">
        <span class="fp-title">${f.title}</span>
        <div class="fp-lion">${LION}</div>
      </div>
      <div class="fp-bot">
        <span>${f.sub}</span>
        <span>#GreenwichVN</span>
      </div>
    </div>
  `;
}

// ── Shoot sequence ────────────────────────────────────────────────────────────
async function shoot() {
  if (S.mode === 'shooting') return;
  if (!S.stream) {
    await startCam();
    await sleep(600);
  }
  const cam = q('#cam');
  if (!cam.srcObject || cam.videoWidth === 0) return;

  S.mode = 'shooting';
  S.photos = [];
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
    await sleep(300);

    S.photos.push(capFrame(cam));

    const fl = q('#flash');
    fl.style.opacity = '1';
    setTimeout(() => { fl.style.opacity = '0'; }, 200);

    q(`#d${i}`).classList.add('done');
    if (i < 3) await sleep(400);
  }

  q('#cov').classList.add('hidden');
  q('#shoot-btn').disabled = false;

  await buildPoster();
  showResult();
  S.mode = 'done';
}

function capFrame(cam) {
  const vw = cam.videoWidth, vh = cam.videoHeight;
  const sz = Math.min(vw, vh);
  const c = document.createElement('canvas');
  c.width = sz; c.height = sz;
  const cx = c.getContext('2d');
  cx.save();
  cx.translate(sz, 0);
  cx.scale(-1, 1); // mirror for selfie feel
  cx.drawImage(cam, (vw - sz) / 2, (vh - sz) / 2, sz, sz, 0, 0, sz, sz);
  cx.restore();
  return c.toDataURL('image/jpeg', 0.9);
}

// ── Compose 1080×1080 poster ──────────────────────────────────────────────────
async function buildPoster() {
  const cvs = q('#cvs');
  const ctx = cvs.getContext('2d');
  const W = 1080, H = 1080;
  const f = FRAMES[S.frameIdx];
  const BAR = 108, GAP = 8;

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, W, H);

  // 2×2 photo grid
  const cw = (W - GAP * 3) / 2;
  const ch = (H - BAR * 2 - GAP * 3) / 2;
  const pos = [
    [GAP,          BAR + GAP],
    [GAP * 2 + cw, BAR + GAP],
    [GAP,          BAR + GAP * 2 + ch],
    [GAP * 2 + cw, BAR + GAP * 2 + ch],
  ];

  await Promise.all(S.photos.map((url, i) => drawPhoto(ctx, url, ...pos[i], cw, ch)));

  // Bars
  ctx.fillStyle = f.bg;
  ctx.fillRect(0, 0, W, BAR);
  ctx.fillRect(0, H - BAR, W, BAR);

  // Top bar text
  ctx.textBaseline = 'top';
  ctx.fillStyle = f.accent;
  ctx.font = '900 52px "Arial Black", Arial, sans-serif';
  ctx.fillText(f.title, 116, 18);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '600 26px Arial, sans-serif';
  ctx.fillText(f.sub, 118, 70);

  // Bottom bar text
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '700 28px Arial, sans-serif';
  ctx.fillText('#GreenwichVietnam', 20, H - BAR / 2);
  ctx.textAlign = 'right';
  ctx.fillText('greenwich.edu.vn', W - 140, H - BAR / 2);
  ctx.textAlign = 'left';

  // Lion mascot top-left
  await drawSvg(ctx, LION, 8, 6, 98, 96);

  // QR in bottom-right
  const qrDataUrl = await QRCode.toDataURL(window.location.href, {
    margin: 1, width: 120,
    color: { dark: f.bg, light: '#ffffff' },
  });
  await drawImg(ctx, qrDataUrl, W - 128, H - BAR + (BAR - 92) / 2, 92, 92);
}

function drawPhoto(ctx, url, x, y, w, h) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
      ctx.restore();
      res();
    };
    img.src = url;
  });
}

function drawImg(ctx, url, x, y, w, h) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, x, y, w, h); res(); };
    img.src = url;
  });
}

function drawSvg(ctx, svg, x, y, w, h) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  return drawImg(ctx, url, x, y, w, h).then(() => URL.revokeObjectURL(url));
}

// ── Result & QR ───────────────────────────────────────────────────────────────
function showResult() {
  S.posterUrl = q('#cvs').toDataURL('image/jpeg', 0.92);
  q('#poster-img').src = S.posterUrl;
  q('#dl-link').href = S.posterUrl;
  q('#rov').classList.remove('hidden');

  uploadPoster(S.posterUrl).then(dlUrl => {
    if (!dlUrl) return;
    QRCode.toDataURL(dlUrl, {
      margin: 1, width: 160,
      color: { dark: '#006b3f', light: '#fff' },
    }).then(qrDataUrl => {
      q('#qr-img').src = qrDataUrl;
      q('#qr-blk').classList.remove('hidden');
    });
  });
}

async function uploadPoster(dataUrl) {
  try {
    const res = await fetch('/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl }),
    });
    if (!res.ok) return null;
    const { url } = await res.json();
    return `${window.location.origin}${url}`;
  } catch { return null; }
}

function retake() {
  S.mode = 'ready';
  S.photos = [];
  S.posterUrl = null;
  q('#rov').classList.add('hidden');
  q('#qr-blk').classList.add('hidden');
  qa('.dot').forEach(d => d.classList.remove('done'));
}

// ── Events ────────────────────────────────────────────────────────────────────
q('#shoot-btn').addEventListener('click', shoot);
q('#retry-cam').addEventListener('click', startCam);
q('#retake-btn').addEventListener('click', retake);

q('#chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  S.frameIdx = +chip.dataset.i;
  qa('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  updatePreview();
});

q('#ival').addEventListener('input', e => {
  S.interval = +e.target.value;
  q('#ival-v').textContent = S.interval;
  q('#ival-h').textContent = S.interval;
});

// ── Init ──────────────────────────────────────────────────────────────────────
updatePreview();
startCam();
