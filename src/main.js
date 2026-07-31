import QRCode from 'qrcode';
import './styles.css';

// Greenwich logo SVG — sư tử rampant + shield
const LOGO_SVG = `
<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" width="80" height="106">
  <!-- Shield background -->
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="1" dy="2" stdDeviation="1" flood-opacity="0.3"/>
    </filter>
  </defs>
  <path d="M 60 10 L 100 30 L 100 80 Q 60 130 60 140 Q 60 130 20 80 L 20 30 Z"
        fill="#006b3f" stroke="#f7c948" stroke-width="2" filter="url(#shadow)"/>

  <!-- Lion head (simplified rampant pose) -->
  <g transform="translate(60, 75) scale(0.8)">
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="20" ry="28" fill="#f7c948"/>
    <!-- Head -->
    <circle cx="0" cy="-24" r="16" fill="#f7c948"/>
    <!-- Mane -->
    <circle cx="-14" cy="-20" r="9" fill="#f7c948"/>
    <circle cx="14" cy="-20" r="9" fill="#f7c948"/>
    <circle cx="-8" cy="-32" r="7" fill="#f7c948"/>
    <circle cx="8" cy="-32" r="7" fill="#f7c948"/>
    <!-- Eyes -->
    <circle cx="-6" cy="-26" r="2.5" fill="#006b3f"/>
    <circle cx="6" cy="-26" r="2.5" fill="#006b3f"/>
    <!-- Mouth -->
    <path d="M -4 -18 Q 0 -14 4 -18" stroke="#006b3f" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <!-- Front left leg (rampant) -->
    <rect x="-18" y="20" width="6" height="20" fill="#f7c948" rx="3"/>
    <!-- Front right leg (raised) -->
    <rect x="12" y="8" width="6" height="28" fill="#f7c948" rx="3" transform="rotate(-25 15 8)"/>
    <!-- Back legs -->
    <rect x="-12" y="24" width="5" height="16" fill="#f7c948" rx="2"/>
    <rect x="7" y="24" width="5" height="16" fill="#f7c948" rx="2"/>
    <!-- Tail -->
    <path d="M 20 0 Q 32 -8 28 -20" stroke="#f7c948" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>

  <!-- Text banner -->
  <text x="60" y="155" font-family="Arial, sans-serif" font-size="10" font-weight="bold"
        text-anchor="middle" fill="#f7c948" letter-spacing="1">GV</text>
</svg>
`.trim();

const frames = [
  // ─── Foundation: Core brand frames ───
  {
    id: 'brand-classic',
    label: 'Classic Green',
    accent: '#f7c948',
    ink: '#004b2d',
    title: 'GREENWICH',
    subtitle: 'Vietnam 2026',
    badge: 'Future Student',
    logoPos: 'top-left'
  },
  {
    id: 'brand-modern',
    label: 'Modern Gold',
    accent: '#f7c948',
    ink: '#006b3f',
    title: 'UK DEGREE',
    subtitle: 'Vietnam Price',
    badge: 'Global Vision',
    logoPos: 'top-right'
  },
  {
    id: 'tech-path',
    label: 'Tech Path',
    accent: '#b8ff5f',
    ink: '#004b2d',
    title: 'CODE YOUR',
    subtitle: 'FUTURE',
    badge: 'Tech Innovator',
    logoPos: 'top-left'
  },

  // ─── Campaign: Event-specific frames ───
  {
    id: 'openday-2026',
    label: 'Open Day 26',
    accent: '#f7c948',
    ink: '#051b13',
    title: 'OPEN DAY',
    subtitle: '2026',
    badge: 'Join Us Now',
    logoPos: 'top-right'
  },
  {
    id: 'welcome-gv',
    label: 'Welcome GV',
    accent: '#ff6b35',
    ink: '#004b2d',
    title: 'WELCOME',
    subtitle: 'TO GV',
    badge: 'Booth Visit',
    logoPos: 'top-left'
  },
  {
    id: 'campus-vibe',
    label: 'Campus Vibe',
    accent: '#1d9bf0',
    ink: '#006b3f',
    title: 'CAMPUS',
    subtitle: 'VIBE',
    badge: 'Life Here',
    logoPos: 'bottom-right'
  },

  // ─── Soft aesthetic: Gen Z friendly ───
  {
    id: 'dreamy-lime',
    label: 'Dreamy Lime',
    accent: '#b8ff5f',
    ink: '#06271b',
    title: 'DREAM BIG',
    subtitle: 'at Greenwich',
    badge: 'Believe',
    logoPos: 'top-left'
  },
  {
    id: 'sunset-gold',
    label: 'Sunset Gold',
    accent: '#ffa500',
    ink: '#004b2d',
    title: 'GOLDEN',
    subtitle: 'FUTURE',
    badge: 'Shine Bright',
    logoPos: 'center'
  },
  {
    id: 'midnight-cool',
    label: 'Midnight Cool',
    accent: '#00d9ff',
    ink: '#0a1f1a',
    title: 'FUTURE ME',
    subtitle: 'STARTS HERE',
    badge: 'Innovation',
    logoPos: 'top-right'
  },

  // ─── Premium: High contrast ───
  {
    id: 'bold-contrast',
    label: 'Bold Black',
    accent: '#f7c948',
    ink: '#000000',
    title: 'GREENWICH',
    subtitle: 'VIETNAM',
    badge: 'Excellence',
    logoPos: 'top-left'
  },
  {
    id: 'emerald-luxe',
    label: 'Emerald Luxe',
    accent: '#f7c948',
    ink: '#1a4d33',
    title: 'YOUR JOURNEY',
    subtitle: 'AWAITS',
    badge: 'Premium',
    logoPos: 'top-right'
  },
  {
    id: 'neon-edge',
    label: 'Neon Edge',
    accent: '#00ff88',
    ink: '#004b2d',
    title: 'LEVEL UP',
    subtitle: 'YOUR GAME',
    badge: 'GenZ',
    logoPos: 'bottom-left'
  }
];

const filters = [
  { id: 'clean', label: 'Clean', css: 'none', canvas: 'none' },
  { id: 'film', label: 'Campus Film', css: 'contrast(1.08) saturate(1.2) sepia(0.08)', canvas: 'contrast(1.08) saturate(1.2) sepia(0.08)' },
  { id: 'sunny', label: 'Golden Hour', css: 'brightness(1.08) saturate(1.25) sepia(0.16)', canvas: 'brightness(1.08) saturate(1.25) sepia(0.16)' },
  { id: 'pop', label: 'Gen Z Pop', css: 'contrast(1.15) saturate(1.55)', canvas: 'contrast(1.15) saturate(1.55)' },
  { id: 'mono', label: 'Scholar Mono', css: 'grayscale(1) contrast(1.14)', canvas: 'grayscale(1) contrast(1.14)' }
];

const stickers = [
  { id: 'none', label: 'None', text: '', x: 0, y: 0 },
  { id: 'g-ready', label: 'G-Ready', text: 'G-READY', x: 0.08, y: 0.18 },
  { id: 'future', label: 'Future me', text: 'FUTURE ME', x: 0.58, y: 0.16 },
  { id: 'campus', label: 'Campus vibe', text: 'CAMPUS VIBE', x: 0.09, y: 0.72 },
  { id: 'dream', label: 'Dream big', text: 'DREAM BIG', x: 0.54, y: 0.72 }
];

const state = {
  frame: frames[0],
  filter: filters[0],
  sticker: stickers[1],
  photoUrl: '',
  stream: null
};

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="shell">
    <section class="stage">
      <div class="brand-line">
        <span>Greenwich Booth</span>
        <small>Photo frame studio for future Greenwich Vietnam students</small>
      </div>

      <div class="booth" aria-label="Camera preview">
        <video id="camera" autoplay muted playsinline></video>
        <img id="uploaded" alt="" />
        <div id="previewOverlay" class="overlay"></div>
        <div id="cameraEmpty" class="camera-empty">
          <strong>Start camera</strong>
          <span>or upload a portrait to try Greenwich Vietnam frames.</span>
        </div>
      </div>

      <div class="capture-row">
        <button id="startCamera" class="primary">Start camera</button>
        <label class="secondary">
          Upload photo
          <input id="photoInput" type="file" accept="image/*" />
        </label>
        <button id="capture" class="primary">Capture</button>
      </div>
    </section>

    <aside class="controls" aria-label="Booth controls">
      <div class="panel">
        <h1>Pick your Greenwich look</h1>
        <p>Choose a frame, add a playful mark, then download or share the PNG.</p>
      </div>

      <section class="panel">
        <h2>Frames</h2>
        <div id="frameOptions" class="option-grid"></div>
      </section>

      <section class="panel">
        <h2>Filters</h2>
        <div id="filterOptions" class="option-grid"></div>
      </section>

      <section class="panel">
        <h2>Stickers</h2>
        <div id="stickerOptions" class="option-grid"></div>
      </section>

      <section class="panel result-panel">
        <h2>Your photo</h2>
        <img id="result" alt="Captured Greenwich Booth photo" />
        <div class="result-actions">
          <a id="download" class="primary disabled" download="greenwichbooth.png">Download PNG</a>
          <button id="share" class="secondary" disabled>Share</button>
        </div>
        <p class="fine-print">QR on the photo opens this booth page. Exact cross-device photo download needs hosted storage later.</p>
      </section>
    </aside>
  </main>
  <canvas id="canvas" width="1080" height="1350"></canvas>
`;

const camera = document.querySelector('#camera');
const uploaded = document.querySelector('#uploaded');
const cameraEmpty = document.querySelector('#cameraEmpty');
const overlay = document.querySelector('#previewOverlay');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const result = document.querySelector('#result');
const download = document.querySelector('#download');
const share = document.querySelector('#share');

function renderOptions() {
  renderGroup('#frameOptions', frames, state.frame.id, (item) => {
    state.frame = item;
    updatePreview();
  });
  renderGroup('#filterOptions', filters, state.filter.id, (item) => {
    state.filter = item;
    updatePreview();
  });
  renderGroup('#stickerOptions', stickers, state.sticker.id, (item) => {
    state.sticker = item;
    updatePreview();
  });
}

function renderGroup(selector, items, activeId, onSelect) {
  const node = document.querySelector(selector);
  node.innerHTML = '';
  items.forEach((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `choice ${item.id === activeId ? 'active' : ''}`;
    button.textContent = item.label;
    button.addEventListener('click', () => {
      onSelect(item);
      renderOptions();
    });
    node.appendChild(button);
  });
}

function updatePreview() {
  camera.style.filter = state.filter.css;
  uploaded.style.filter = state.filter.css;
  const logoPos = state.frame.logoPos || 'top-left';
  overlay.innerHTML = `
    <div class="frame-border" style="--accent:${state.frame.accent};--ink:${state.frame.ink}">
      <div class="top-ribbon">
        <b>${state.frame.title}</b>
        <span>${state.frame.subtitle}</span>
      </div>
      <div class="corner-badge">${state.frame.badge}</div>
      <div class="logo-container logo-${logoPos}">
        ${LOGO_SVG}
      </div>
      ${state.sticker.text ? `<div class="sticker" style="left:${state.sticker.x * 100}%;top:${state.sticker.y * 100}%">${state.sticker.text}</div>` : ''}
      <div class="bottom-bar">
        <span>#GreenwichVietnam</span>
        <span>greenwich.edu.vn</span>
      </div>
    </div>
  `;
}

async function startCamera() {
  try {
    state.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1600 } },
      audio: false
    });
    camera.srcObject = state.stream;
    camera.hidden = false;
    uploaded.hidden = true;
    cameraEmpty.hidden = true;
  } catch (error) {
    cameraEmpty.innerHTML = '<strong>Camera blocked</strong><span>Upload a photo instead.</span>';
  }
}

function loadUpload(file) {
  if (!file) return;
  uploaded.src = URL.createObjectURL(file);
  uploaded.hidden = false;
  camera.hidden = true;
  cameraEmpty.hidden = true;
}

async function capturePhoto() {
  const source = uploaded.hidden ? camera : uploaded;
  if ((source === camera && !camera.srcObject) || (source === uploaded && !uploaded.src)) return;

  const qrUrl = await QRCode.toDataURL(window.location.href, {
    margin: 1,
    width: 180,
    color: { dark: '#053b2c', light: '#ffffff' }
  });

  await drawPoster(source, qrUrl);
  state.photoUrl = canvas.toDataURL('image/png');
  result.src = state.photoUrl;
  download.href = state.photoUrl;
  download.classList.remove('disabled');
  share.disabled = false;
}

async function drawPoster(source, qrUrl) {
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.filter = state.filter.canvas;
  coverDraw(source, 0, 0, width, height);
  ctx.restore();

  drawFrame(width, height);
  await drawLogo(width, height);
  drawSticker(width, height);
  await drawQr(qrUrl, width, height);
}

function coverDraw(source, x, y, width, height) {
  const sourceWidth = source.videoWidth || source.naturalWidth;
  const sourceHeight = source.videoHeight || source.naturalHeight;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  ctx.drawImage(source, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawFrame(width, height) {
  const { accent, ink, title, subtitle, badge } = state.frame;
  ctx.lineWidth = 42;
  ctx.strokeStyle = accent;
  ctx.strokeRect(21, 21, width - 42, height - 42);

  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, width, 164);
  ctx.fillRect(0, height - 146, width, 146);

  ctx.fillStyle = accent;
  ctx.font = '900 58px Arial';
  ctx.fillText(title, 56, 78);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 34px Arial';
  ctx.fillText(subtitle, 58, 128);

  ctx.fillStyle = accent;
  roundedRect(width - 356, 54, 296, 68, 34);
  ctx.fill();
  ctx.fillStyle = ink;
  ctx.font = '900 30px Arial';
  ctx.fillText(badge.toUpperCase(), width - 326, 98);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 34px Arial';
  ctx.fillText('#GreenwichVietnam', 58, height - 58);
  ctx.textAlign = 'right';
  ctx.fillText('greenwich.edu.vn', width - 58, height - 58);
  ctx.textAlign = 'left';
}

function drawSticker(width, height) {
  if (!state.sticker.text) return;
  const x = state.sticker.x * width;
  const y = state.sticker.y * height;
  ctx.save();
  ctx.rotate(-0.09);
  ctx.fillStyle = '#ffffff';
  roundedRect(x, y, 280, 76, 24);
  ctx.fill();
  ctx.strokeStyle = state.frame.accent;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.fillStyle = state.frame.ink;
  ctx.font = '900 32px Arial';
  ctx.fillText(state.sticker.text, x + 28, y + 49);
  ctx.restore();
}

async function drawLogo(width, height) {
  const logoPos = state.frame.logoPos || 'top-left';
  const logoSize = 90;
  const padding = 24;

  let x = padding, y = padding;

  if (logoPos === 'top-right') x = width - logoSize - padding;
  else if (logoPos === 'center') x = (width - logoSize) / 2, y = (height - logoSize) / 2 - 60;
  else if (logoPos === 'bottom-left') y = height - logoSize - padding;
  else if (logoPos === 'bottom-right') x = width - logoSize - padding, y = height - logoSize - padding;

  const svgBlob = new Blob([LOGO_SVG], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, x, y, logoSize, logoSize);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.src = url;
  });
}

function drawQr(qrUrl, width, height) {
  const image = new Image();
  const ready = new Promise((resolve) => {
    image.onload = resolve;
  });
  image.src = qrUrl;
  return ready.then(() => {
    ctx.fillStyle = '#ffffff';
    roundedRect(width - 246, height - 354, 174, 212, 20);
    ctx.fill();
    ctx.drawImage(image, width - 224, height - 334, 130, 130);
    ctx.fillStyle = '#053b2c';
    ctx.font = '800 18px Arial';
    ctx.fillText('SCAN BOOTH', width - 218, height - 178);
  });
}

function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

async function sharePhoto() {
  if (!state.photoUrl || !navigator.share) return;
  const blob = await (await fetch(state.photoUrl)).blob();
  const file = new File([blob], 'greenwichbooth.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: 'Greenwich Booth',
      text: 'My Greenwich Vietnam booth photo',
      files: [file]
    });
  }
}

document.querySelector('#startCamera').addEventListener('click', startCamera);
document.querySelector('#capture').addEventListener('click', capturePhoto);
document.querySelector('#photoInput').addEventListener('change', (event) => loadUpload(event.target.files[0]));
share.addEventListener('click', sharePhoto);

camera.hidden = true;
uploaded.hidden = true;
renderOptions();
updatePreview();
