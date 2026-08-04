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
  const themeLabels = await page.$$eval('.theme-chip .theme-chip-label', nodes => nodes.map(node => node.textContent.trim()));
  if (themeLabels.join('|') !== 'Open Day|Student Life|Graduation Day') {
    throw new Error(`Unexpected theme labels: ${themeLabels.join('|')}`);
  }

  await page.click('.theme-chip[data-theme-index="1"]');
  await page.waitForFunction(() => window.__t?.S?.themeIndex === 1);
  const activeTheme = await page.$eval('.theme-chip.is-active .theme-chip-label', el => el.textContent.trim());
  if (activeTheme !== 'Student Life') {
    throw new Error(`Expected Student Life theme active, got ${activeTheme}`);
  }
  const previewAccent = await page.$eval('#poster-preview', el => getComputedStyle(el).getPropertyValue('--preview-shell-accent').trim());
  if (!previewAccent.includes('D28A2E')) {
    throw new Error(`Expected preview accent to follow theme 2, got ${previewAccent}`);
  }
  const previewText = await page.$eval('#poster-preview', el => el.textContent.replace(/\s+/g, ' ').trim());
  if (previewText !== '1 2 3 4') {
    throw new Error(`Expected preview to contain only slot badges, got ${previewText}`);
  }

  const layoutCount = await page.$$eval('.layout-chip', nodes => nodes.length);
  if (layoutCount !== 3) {
    throw new Error(`Expected 3 layout chips, found ${layoutCount}`);
  }
  await page.click('.layout-chip[data-layout-index="1"]');
  await page.waitForFunction(() => window.__t?.S?.layoutIndex === 1);
  const activeLayout = await page.$eval('.layout-chip.is-active .theme-chip-label', el => el.textContent.trim());
  if (activeLayout !== 'Layout 2') {
    throw new Error(`Expected layout 2 active, got ${activeLayout}`);
  }
  const previewLayout = await page.$eval('#photo-grid', el => el.dataset.layout);
  if (previewLayout !== '2') {
    throw new Error(`Expected preview layout 2, got ${previewLayout}`);
  }
  const timerLabels = await page.$$eval('.time-chip .theme-chip-label', nodes => nodes.map(node => node.textContent.trim()));
  if (timerLabels.join('|') !== 'Countdown 3s|Countdown 4s|Countdown 5s') {
    throw new Error(`Unexpected timer labels: ${timerLabels.join('|')}`);
  }
  const countdownMascot = await page.$eval('#cnt-mascot', img => ({
    src: img.getAttribute('src') || '',
    hidden: img.classList.contains('is-visible'),
  }));
  if (!countdownMascot.src.includes('mascot')) {
    throw new Error(`Countdown mascot is not wired to the mascot asset: ${countdownMascot.src}`);
  }
  if (countdownMascot.hidden) {
    throw new Error('Countdown mascot should be hidden before shooting starts');
  }
  await page.click('.time-chip[data-interval="5"]');
  await page.waitForFunction(() => window.__t?.S?.interval === 5);
  const layoutRects = await page.evaluate(() => {
    const grid = document.querySelector('#photo-grid').getBoundingClientRect();
    const a = document.querySelector('#pvs0').getBoundingClientRect();
    const b = document.querySelector('#pvs1').getBoundingClientRect();
    return {
      grid: { width: grid.width, height: grid.height },
      a: { x: a.x, width: a.width, height: a.height },
      b: { x: b.x, width: b.width, height: b.height },
    };
  });
  if (!(layoutRects.a.height > layoutRects.b.height * 2 && layoutRects.a.x < layoutRects.b.x)) {
    throw new Error(`Preview layout 2 geometry is wrong: ${JSON.stringify(layoutRects)}`);
  }
  const close = (actual, expected) => Math.abs(actual - expected) < 0.08;
  if (!close(layoutRects.grid.width / layoutRects.grid.height, 952 / 922)) {
    throw new Error(`Preview grid aspect is wrong: ${JSON.stringify(layoutRects)}`);
  }
  if (!close(layoutRects.a.width / layoutRects.a.height, 626 / 922) || !close(layoutRects.b.width / layoutRects.b.height, 300 / 296)) {
    throw new Error(`Preview slot ratios do not match poster canvas: ${JSON.stringify(layoutRects)}`);
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

  for (let themeIndex = 0; themeIndex < 3; themeIndex += 1) {
    await page.evaluate(index => window.__t?.setThemeIndex?.(index), themeIndex);
    await page.waitForFunction(index => window.__t?.S?.themeIndex === index, {}, themeIndex);
    const previewThemeId = await page.$eval('#poster-preview', el => el.dataset.themeIndex);
    if (previewThemeId !== String(themeIndex + 1)) {
      throw new Error(`Preview theme id did not track theme ${themeIndex + 1}: got ${previewThemeId}`);
    }
    await page.evaluate(async () => {
      await window.__t.buildPoster();
    });
    const sloganRange = await page.$eval('#cvs', canvas => {
      const ctx = canvas.getContext('2d');
      const { data } = ctx.getImageData(160, 92, 220, 26);
      let min = 255;
      let max = 0;
      for (let i = 0; i < data.length; i += 4) {
        const luminance = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        min = Math.min(min, luminance);
        max = Math.max(max, luminance);
      }
      return max - min;
    });
    if (sloganRange < 30) {
      throw new Error(`Header slogan contrast is too low for theme ${themeIndex + 1}: ${sloganRange.toFixed(1)}`);
    }
  }

  await page.evaluate(async () => {
    window.__t.setThemeIndex(0);
    await window.__t.buildPoster();
  });
  const oldQrPixels = await page.evaluate(() => {
    const canvas = document.querySelector('#cvs');
    const ctx = canvas.getContext('2d');
    const { data } = ctx.getImageData(764, 1278, 112, 112);
    let white = 0;
    let dark = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 220 && data[i + 1] > 220 && data[i + 2] > 220 && data[i + 3] > 0) white += 1;
      if (data[i] < 80 && data[i + 1] < 80 && data[i + 2] < 80 && data[i + 3] > 0) dark += 1;
    }
    return { white, dark };
  });
  if (oldQrPixels.white > 900 && oldQrPixels.dark > 900) {
    throw new Error(`Final poster still appears to contain a QR block (${JSON.stringify(oldQrPixels)})`);
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
