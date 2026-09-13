/**
 * Build the 1200x630 Open Graph card.
 *
 * This is the highest-leverage image on the site: it is what a recruiter sees
 * when the link is pasted into Slack, LinkedIn or WhatsApp, and it is often
 * seen before the page itself.
 *
 * Run by hand with `npm run og`, NOT during the build. BUILD_PLAN Phase 13.2
 * is explicit that the card is committed as a static asset rather than
 * generated at runtime, and it changes about as often as the hero copy does.
 *
 * It is rendered in a real browser using the real subsetted fonts, so the card
 * is set in the same Newsreader, Inter and JetBrains Mono as the page, with
 * the same palette. An SVG rasteriser would have substituted system faces.
 *
 * Requires `npm run fonts` to have produced src/assets/fonts, and a local
 * Chrome or Edge. If the image needs rebuilding on a machine without one,
 * commit the PNG from a machine that has one.
 */
import { chromium } from 'playwright-core';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const fontDir = path.join(root, 'src', 'assets', 'fonts');

const dataUrl = async (file, mime = 'font/woff2') =>
  `data:${mime};base64,${(await readFile(path.join(fontDir, file))).toString('base64')}`;

const [serif, serifItalic, sans, mono] = await Promise.all([
  dataUrl('newsreader-normal.woff2'),
  dataUrl('newsreader-italic.woff2'),
  dataUrl('inter-normal.woff2'),
  dataUrl('jetbrains-400.woff2'),
]);

/* Palette lifted from tokens.css. Kept literal here because this file renders
   an image rather than a page, and nothing in it reaches the stylesheet. */
const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'N'; src: url('${serif}') format('woff2-variations'); font-weight: 300 500; }
  @font-face { font-family: 'N'; src: url('${serifItalic}') format('woff2-variations'); font-style: italic; font-weight: 400; }
  @font-face { font-family: 'I'; src: url('${sans}') format('woff2-variations'); font-weight: 400 600; }
  @font-face { font-family: 'M'; src: url('${mono}') format('woff2'); font-weight: 400; }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: #fbf9f6;
    padding: 76px 88px;
    display: flex; flex-direction: column; justify-content: space-between;
    /* The one flourish: a hairline rule down the left edge in the accent,
       echoing the numbered entries on the page. */
    border-left: 10px solid #a8431c;
  }
  .eyebrow {
    font-family: 'I'; font-size: 21px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase; color: #746a5e;
  }
  h1 { font-family: 'N'; font-weight: 400; font-size: 104px; line-height: 1.05;
       letter-spacing: -0.02em; color: #17171a; margin-top: 26px; }
  h1 em { display: block; font-style: italic; color: #a8431c; }
  .result { font-family: 'N'; font-size: 34px; line-height: 1.3; color: #17171a; max-width: 900px; }
  .foot { display: flex; justify-content: space-between; align-items: baseline;
          border-top: 1px solid #e3ddd5; padding-top: 22px; }
  .foot span { font-family: 'M'; font-size: 21px; letter-spacing: 0.01em; color: #45454c; }
  .foot .muted { color: #746a5e; }
</style></head>
<body>
  <div>
    <p class="eyebrow">Full-stack developer</p>
    <h1>Vasileios<em>Verykokos</em></h1>
  </div>

  <p class="result">First place, Huawei ICT Competition World Final 2026 &mdash; Shenzhen.</p>

  <div class="foot">
    <span>Java &middot; Spring Boot &middot; React</span>
    <span class="muted">University of Macedonia</span>
  </div>
</body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

const png = await page.screenshot({ type: 'png' });
await browser.close();

const out = path.join(root, 'public', 'og.png');
await writeFile(out, png);
console.log(`  wrote public/og.png — 1200x630, ${(png.length / 1024).toFixed(1)} KB`);
