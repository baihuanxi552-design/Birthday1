const {chromium} = require(process.env.MOTION_PLAYWRIGHT_MODULE);

(async () => {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage({viewport: {width: 1280, height: 900}});
  await page.emulateMedia({reducedMotion: 'no-preference'});
  const logs = [];
  page.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  await page.goto(process.env.BIRTHDAY_URL || 'http://127.0.0.1:5180/', {waitUntil: 'networkidle'});
  const media = await page.evaluate(() => ({
    reduceMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    noPref: matchMedia('(prefers-reduced-motion: no-preference)').matches,
  }));
  const probe = await page.evaluate(() => new Promise(resolve => {
    const v = document.createElement('video');
    v.src = '/assets/motion-v2.mp4';
    v.muted = true;
    v.preload = 'auto';
    const out = {events: []};
    const push = e => out.events.push(e.type + (v.error ? ':' + v.error.code : ''));
    ['loadstart', 'loadedmetadata', 'canplay', 'playing', 'error', 'stalled', 'suspend'].forEach(e => v.addEventListener(e, () => push(e)));
    document.body.appendChild(v);
    v.play().then(() => out.events.push('play() resolved')).catch(err => out.events.push('play() rejected: ' + err.name + ' ' + err.message));
    setTimeout(() => {
      out.duration = v.duration; out.readyState = v.readyState; out.currentTime = v.currentTime;
      out.error = v.error && {code: v.error.code, message: v.error.message};
      resolve(out);
    }, 5000);
  }));
  console.log(JSON.stringify({media, probe, logs}, null, 2));
  await browser.close();
})();
