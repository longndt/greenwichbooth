import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5173';

async function main() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    pageErrors.push(err.message);
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.__t?.buildPoster);

  const themeCount = await page.$$eval('.theme-chip', nodes => nodes.length);
  if (themeCount !== 3) {
    throw new Error(`Expected 3 theme chips, found ${themeCount}`);
  }

  await page.click('.theme-chip[data-theme-index="1"]');
  await page.waitForFunction(() => window.__t?.S?.themeIndex === 1);
  const activeTheme = await page.$eval('.theme-chip.is-active .theme-chip-label', el => el.textContent.trim());
  if (activeTheme !== 'Trẻ trung') {
    throw new Error(`Expected Trẻ trung theme active, got ${activeTheme}`);
  }

  const layoutCount = await page.$$eval('.layout-chip', nodes => nodes.length);
  if (layoutCount !== 3) {
    throw new Error(`Expected 3 layout chips, found ${layoutCount}`);
  }
  await page.click('.layout-chip[data-layout-index="1"]');
  await page.waitForFunction(() => window.__t?.S?.layoutIndex === 1);
  const activeLayout = await page.$eval('.layout-chip.is-active .theme-chip-label', el => el.textContent.trim());
  if (activeLayout !== '2') {
    throw new Error(`Expected layout 2 active, got ${activeLayout}`);
  }
  const previewLayout = await page.$eval('#photo-grid', el => el.dataset.layout);
  if (previewLayout !== '2') {
    throw new Error(`Expected preview layout 2, got ${previewLayout}`);
  }
  const layoutRects = await page.evaluate(() => {
    const a = document.querySelector('#pvs0').getBoundingClientRect();
    const b = document.querySelector('#pvs1').getBoundingClientRect();
    return { a: { x: a.x, width: a.width, height: a.height }, b: { x: b.x, width: b.width, height: b.height } };
  });
  if (!(layoutRects.a.height > layoutRects.b.height * 2 && layoutRects.a.x < layoutRects.b.x)) {
    throw new Error(`Preview layout 2 geometry is wrong: ${JSON.stringify(layoutRects)}`);
  }

  const placeholders = await page.$$eval('.name-input', nodes => nodes.map(node => node.placeholder));
  if (placeholders.join('|') !== 'Tên sự kiện|Tên địa điểm') {
    throw new Error(`Unexpected input placeholders: ${placeholders.join('|')}`);
  }

  await page.evaluate(() => window.__t?.setEventName?.('Open Day 2026'));
  await page.waitForFunction(() => window.__t?.S?.eventName === 'Open Day 2026');
  await page.evaluate(() => window.__t?.setStudentName?.('Nguyen '));
  await page.waitForFunction(() => window.__t?.S?.studentName === 'Nguyen ');
  await page.evaluate(() => window.__t?.setStudentName?.('Nguyen Van A'));
  await page.waitForFunction(() => window.__t?.S?.studentName === 'Nguyen Van A');

  await page.evaluate(() => {
    const makeShot = index => {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');
      const bg = ctx.createLinearGradient(0, 0, 900, 900);
      const top = ['#eef0ed', '#e0e8e1', '#e9eee9', '#d6e0db'][index];
      const bottom = ['#17241d', '#21372b', '#24352b', '#1b2d23'][index];
      bg.addColorStop(0, top);
      bg.addColorStop(1, bottom);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 900, 900);
      ctx.fillStyle = '#252525';
      ctx.beginPath();
      ctx.arc(450, 310, 92, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.fillRect(304, 410, 292, 340);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 54px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`SHOT ${index + 1}`, 450, 600);
      return canvas.toDataURL('image/jpeg', 0.95);
    };

    window.__t.S.photos = [0, 1, 2, 3].map(makeShot);
  });
  await page.evaluate(async () => {
    await window.__t.buildPoster();
  });

  const metrics = await page.$eval('#cvs', canvas => ({
    width: canvas.width,
    height: canvas.height,
    pngLength: canvas.toDataURL('image/png').length,
  }));
  if (metrics.width !== 1080 || metrics.height !== 1440) {
    throw new Error(`Unexpected canvas size ${metrics.width}x${metrics.height}`);
  }
  if (metrics.pngLength < 20000) {
    throw new Error(`Poster PNG too small (${metrics.pngLength})`);
  }

  const oldQrWhitePixels = await page.evaluate(() => {
    const canvas = document.querySelector('#cvs');
    const ctx = canvas.getContext('2d');
    const { data } = ctx.getImageData(764, 1278, 112, 112);
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 220 && data[i + 1] > 220 && data[i + 2] > 220 && data[i + 3] > 0) count += 1;
    }
    return count;
  });
  if (oldQrWhitePixels > 900) {
    throw new Error(`Final poster still appears to contain a QR block (${oldQrWhitePixels} white pixels)`);
  }

  if (consoleErrors.length || pageErrors.length) {
    throw new Error(`Browser errors: ${[...consoleErrors, ...pageErrors].join(' | ')}`);
  }

  await browser.close();
}

main().catch(async err => {
  console.error(err);
  process.exitCode = 1;
});
