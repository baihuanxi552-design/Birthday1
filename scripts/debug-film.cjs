const {chromium} = require(process.env.MOTION_PLAYWRIGHT_MODULE);

(async () => {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
  const logs = [];
  page.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  page.on('requestfailed', r => logs.push(`[reqfail] ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', r => { if (r.status() >= 400) logs.push(`[http ${r.status()}] ${r.url()}`); });

  await page.goto(process.env.BIRTHDAY_URL || 'http://127.0.0.1:5180/', {waitUntil: 'networkidle'});
  await page.getByRole('button', {name: '静音打开', exact: true}).click();
  await page.locator('.player-frame').scrollIntoViewIfNeeded();
  await page.waitForTimeout(6000);
  const info = await page.evaluate(() => ({
    html: document.querySelector('.player-frame')?.outerHTML.slice(0, 3000),
    filmError: document.querySelector('.film-error')?.innerText || null,
    buttons: [...document.querySelectorAll('.player-frame button')].map(b => b.getAttribute('aria-label') || b.textContent).slice(0, 20),
    videos: [...document.querySelectorAll('.player-frame video')].map(v => ({src: v.currentSrc, dur: v.duration, rs: v.readyState, err: v.error && v.error.code})),
  }));
  console.log(JSON.stringify(info, null, 2));
  console.log('--- logs ---');
  console.log(logs.join('\n'));
  await page.locator('#film').screenshot({path: process.env.OUT_PNG || 'D:/Codex projects/项目1/birthday-510/verification/debug-film.png'});
  await browser.close();
})();
