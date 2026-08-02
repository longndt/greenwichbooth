import QRCode from 'qrcode';
import lionUrl from './assets/lion-new.svg';
import './styles.css';

// Face detection removed — simplified accessory positioning (fixed positioning)

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
      <img class="hdr-lion" src="${lionUrl}" alt="" aria-hidden="true">
      <div class="hdr-text">
        <span class="hdr-name">Greenwich Vietnam Booth</span>
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
    return;
  }
  S.posterUrl = posterDataUrl;
  const uploadP = uploadPoster(uploadBlob);
  q('#proc-ov').classList.add('hidden');
  showResult(uploadP);
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

// ── Poster composition (1080×1440) — Future Student Pass
async function buildPoster() {
  await document.fonts.ready;

  const cvs = q('#cvs');
  cvs.width = 1080; cvs.height = 1440;
  const ctx = cvs.getContext('2d');
  const W = 1080, H = 1440;
  const PAD = 54;
  const GAP = 22;
  const PH = 446;
  const headerH = 188;
  const footerY = 1174;
  const footerH = 188;
  const pos = [
    [PAD,            228],
    [PAD + PH + GAP, 228],
    [PAD,            228 + PH + GAP],
    [PAD + PH + GAP, 228 + PH + GAP],
  ];

  ctx.fillStyle = '#f8f2e4';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(0, 107, 63, 0.045)';
  for (let x = 0; x < W; x += 34) ctx.fillRect(x, 0, 1, H);
  for (let y = 0; y < H; y += 34) ctx.fillRect(0, y, W, 1);

  const header = ctx.createLinearGradient(0, 0, W, 0);
  header.addColorStop(0, '#004a32');
  header.addColorStop(0.45, '#006b3f');
  header.addColorStop(1, '#09764a');
  ctx.fillStyle = header;
  ctx.fillRect(0, 0, W, headerH);
  ctx.fillStyle = '#ffcb2f';
  ctx.fillRect(0, headerH - 10, W, 10);
  ctx.fillStyle = '#17211c';
  ctx.fillRect(0, 0, W, 12);

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  // Logo circle + image
  roundRect(ctx, 32, 24, 126, 126, 63);
  ctx.fillStyle = '#ffcb2f';
  ctx.fill();
  ctx.strokeStyle = '#f8f2e4';
  ctx.lineWidth = 4;
  ctx.stroke();
  await drawImg(ctx, lionUrl, 43, 35, 104, 104);

  // Main title + subtitle
  ctx.fillStyle = '#ffcb2f';
  ctx.font = '900 52px Sora, Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('GREENWICH VIETNAM', 175, 55);

  ctx.fillStyle = 'rgba(248,242,228,0.95)';
  ctx.font = '700 20px "Space Grotesk", Arial, sans-serif';
  ctx.fillText('FUTURE STUDENT PASS', 175, 95);

  // Badge: OFFICIAL BOOTH (top right)
  ctx.fillStyle = 'rgba(248,242,228,0.18)';
  roundRect(ctx, 800, 30, 230, 70, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(248,242,228,0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(248,242,228,0.85)';
  ctx.font = '700 16px "Space Grotesk", Arial, sans-serif';
  ctx.fillText('OFFICIAL', 915, 50);
  ctx.fillStyle = '#ffcb2f';
  ctx.font = '900 28px Sora, Arial, sans-serif';
  ctx.fillText('BOOTH', 915, 80);

  pos.forEach(([x, y], i) => {
    ctx.save();
    ctx.shadowColor = 'rgba(23, 33, 28, 0.24)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#17211c';
    roundRect(ctx, x - 7, y - 7, PH + 14, PH + 14, 24);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#f1e7d3';
    roundRect(ctx, x, y, PH, PH, 18);
    ctx.fill();
  });

  const photos = S.photos;
  await Promise.all(photos.map((p, i) => drawPhoto(ctx, p, pos[i][0] + 10, pos[i][1] + 10, PH - 20, PH - 20, 14)));

  pos.forEach(([x, y], i) => {
    ctx.strokeStyle = '#17211c';
    ctx.lineWidth = 4;
    roundRect(ctx, x, y, PH, PH, 18);
    ctx.stroke();
    ctx.strokeStyle = '#ffcb2f';
    ctx.lineWidth = 2;
    roundRect(ctx, x + 10, y + 10, PH - 20, PH - 20, 14);
    ctx.stroke();
    ctx.fillStyle = '#ffcb2f';
    roundRect(ctx, x + 16, y + 16, 40, 40, 20);
    ctx.fill();
    ctx.fillStyle = '#17211c';
    ctx.font = '900 20px Sora, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${i + 1}`, x + 36, y + 25);
    ctx.textAlign = 'left';
  });

  ctx.save();
  ctx.globalAlpha = 0.06;
  await drawImg(ctx, lionUrl, 746, 1110, 230, 230);
  ctx.restore();

  roundRect(ctx, 52, footerY, 976, footerH, 28);
  ctx.fillStyle = '#f5eddc';
  ctx.fill();
  ctx.strokeStyle = '#17211c';
  ctx.lineWidth = 4;
  roundRect(ctx, 52, footerY, 976, footerH, 28);
  ctx.stroke();

  ctx.fillStyle = '#006b3f';
  ctx.font = '800 18px "Space Grotesk", Arial, sans-serif';
  ctx.fillText('greenwich.edu.vn', 76, footerY + 36);
  ctx.fillStyle = '#17211c';
  ctx.font = '700 18px "Space Grotesk", Arial, sans-serif';
  ctx.fillText('#GreenwichVietnam', 76, footerY + 64);

  roundRect(ctx, 702, footerY + 22, 286, 118, 22);
  ctx.fillStyle = '#fffaf0';
  ctx.fill();
  ctx.strokeStyle = '#17211c';
  ctx.lineWidth = 4;
  roundRect(ctx, 702, footerY + 22, 286, 118, 22);
  ctx.stroke();
  await drawImg(ctx, lionUrl, 724, footerY + 36, 82, 82);
  ctx.fillStyle = '#006b3f';
  ctx.font = '900 22px Sora, Arial, sans-serif';
  ctx.fillText('GREENWICH', 818, footerY + 42);
  ctx.fillStyle = '#17211c';
  ctx.font = '700 17px "Space Grotesk", Arial, sans-serif';
  ctx.fillText('Official student booth', 818, footerY + 74);

  ctx.strokeStyle = '#17211c';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, W - 40, H - 40);
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

// ── Mobile orientation ───────────────────────────────────────────────────────
window.addEventListener('orientationchange', () => {
  if (S.mode === 'ready') startCam();
});

// ── Init ──────────────────────────────────────────────────────────────────────
startCam();
if (import.meta.env.DEV) window.__t = { S, buildPoster };
