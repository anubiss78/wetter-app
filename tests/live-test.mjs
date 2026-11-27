import { chromium, devices } from 'playwright';
const out = { console: [], failed: [], range: {} };
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['Pixel 7'], locale: 'de-DE', timezoneId: 'Europe/Berlin' });
const page = await ctx.newPage();
page.on('console', m => { if (['error', 'warning'].includes(m.type())) out.console.push(m.type() + ': ' + m.text()); });
page.on('pageerror', e => out.console.push('pageerror: ' + e.message));
page.on('response', r => { if (r.status() >= 400) out.failed.push(r.status() + ' ' + r.url().slice(0, 200)); });
await page.goto('http://localhost:8000/', { waitUntil: 'load' });
await page.waitForTimeout(6000);
out.start = await page.evaluate(() => ({ ts: document.getElementById('ts').textContent, kind: document.getElementById('kind').textContent, pressed: document.querySelector('#range [aria-pressed=true]')?.textContent, max: document.getElementById('sl').max }));
for (const h of ['2', '6', '12', '24', '48']) {
  await page.click(`#range button[data-h="${h}"]`);
  await page.waitForTimeout(6000);
  const r = await page.evaluate(() => {
    const sl = document.getElementById('sl'); const res = { max: +sl.max, frames: [] };
    document.getElementById('play').click(); // anhalten
    for (let i = 0; i <= +sl.max; i++) { sl.value = i; sl.dispatchEvent(new Event('input')); res.frames.push(document.getElementById('ts').textContent + ' [' + document.getElementById('kind').textContent + ']'); }
    res.modelTiles = [...document.querySelectorAll('img.leaflet-tile-loaded')].filter(i => i.src.includes('TOTPREC01H')).length;
    res.lgM = !document.getElementById('lgM').hidden;
    return res;
  });
  out.range[h] = r;
}
// Modellbild anzeigen und Radarbereich fotografieren
await page.evaluate(() => { const sl = document.getElementById('sl'); sl.value = Math.round(sl.max * 0.6); sl.dispatchEvent(new Event('input')); });
await page.waitForTimeout(4000);
await page.locator('.radar').screenshot({ path: 'shots/radar-modell.png' });
await page.evaluate(() => { const sl = document.getElementById('sl'); sl.value = 3; sl.dispatchEvent(new Event('input')); });
await page.waitForTimeout(3000);
await page.locator('.radar').screenshot({ path: 'shots/radar-jetzt.png' });
await browser.close();
console.log(JSON.stringify(out, null, 1));
