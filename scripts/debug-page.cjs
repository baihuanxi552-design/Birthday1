const {chromium} = require(process.env.MOTION_PLAYWRIGHT_MODULE);

(async () => {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage({viewport: {width: 1280, height: 900}});
  const logs = [];
  page.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  page.on('requestfailed', r => logs.push(`[reqfail] ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', r => { if (r.status() >= 400) logs.push(`[http ${r.status()}] ${r.url()}`); });
  await page.goto(process.env.BIRTHDAY_URL, {waitUntil: 'networkidle'});
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => ({
    rootHTML: document.getElementById('root')?.innerHTML.slice(0, 300),
    buttons: [...document.querySelectorAll('button')].map(b => b.textContent.trim()).slice(0, 8),
    base: window.__vite_base || null,
  }));
  console.log(JSON.stringify(info, null, 2));
  console.log(logs.join('\n'));
  await browser.close();
})();
