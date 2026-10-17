const {chromium} = require(process.env.MOTION_PLAYWRIGHT_MODULE);

(async () => {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
  await page.emulateMedia({reducedMotion: 'no-preference'});
  const logs = [];
  page.on('console', m => { if (m.type() === 'error') logs.push(`[console.error] ${m.text()}`); });
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  page.on('requestfailed', r => logs.push(`[reqfail] ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', r => { if (r.status() >= 400) logs.push(`[http ${r.status()}] ${r.url()}`); });

  await page.goto(process.env.BIRTHDAY_URL || 'http://127.0.0.1:5180/', {waitUntil: 'networkidle'});
  await page.getByRole('button', {name: '静音打开', exact: true}).click();
  await page.locator('.player-frame').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  const before = await page.evaluate(() => ({
    buttons: [...document.querySelectorAll('.player-frame button')].map(b => b.getAttribute('aria-label')),
    videoCount: document.querySelectorAll('.player-frame video').length,
    canvasCount: document.querySelectorAll('.player-frame canvas').length,
  }));

  const playBtn = page.locator('.player-frame button[aria-label^="Play"]').first();
  await playBtn.click();
  await page.waitForTimeout(4000);
  const after = await page.evaluate(() => ({
    videos: [...document.querySelectorAll('.player-frame video')].map(v => ({
      src: v.currentSrc, t: +v.currentTime.toFixed(2), rs: v.readyState, paused: v.paused,
      err: v.error && v.error.code, w: v.videoWidth, h: v.videoHeight,
    })),
    buttons: [...document.querySelectorAll('.player-frame button')].map(b => b.getAttribute('aria-label')),
    frames: document.querySelector('.player-frame [style*="transform: scale"]')?.getAttribute('style')?.slice(0, 120),
  }));
  console.log(JSON.stringify({before, after, logs}, null, 2));
  await page.locator('#film').screenshot({path: process.env.OUT_PNG || 'D:/Codex projects/项目1/birthday-510/verification/debug-film2.png'});
  await browser.close();
})();
