/**
 * Two build-time guards. Both run after every build via the `postbuild` npm
 * lifecycle hook, so they fire on every Vercel deploy with no separate CI
 * step required — but they don't carry equal weight, and this script fails
 * the build for only one of them by default.
 *
 * 1. THE CSP HASH GUARD — always a hard failure, in every mode.
 *
 *    vercel.json hard-codes the sha256 hash of every inline script, because
 *    the Content-Security-Policy deliberately has no 'unsafe-inline'. Those
 *    hashes are only correct for the exact bytes Astro emitted the day they
 *    were computed — any change to BaseLayout.astro's inline script or to
 *    MobileMenu.astro / the reveal script (which Astro also inlines) shifts
 *    the minified output and silently invalidates them. A stale hash doesn't
 *    break the build on its own; the browser just refuses to run that script
 *    and nothing prints to any terminal. There is never a legitimate reason
 *    to ship a mismatch, so this always blocks the deploy.
 *
 * 2. THE PLACEHOLDER GUARD — a hard failure only with --strict.
 *
 *    CONTENT.md's bracketed blockers ([[ B1 — ... ]] and friends) stay
 *    visibly broken in the source until Vasilis resolves them. Left
 *    unwired, that guarantees nothing; this greps the built output for `[[`.
 *
 *    But those blockers are open CONTENT decisions (team counts, whether a
 *    video is hosted yet, whether a repo is public), not engineering bugs —
 *    and right now, several genuinely are still open. Wiring this as a hard
 *    failure in `postbuild` would fail Vercel's build on every push until
 *    every last one is resolved, which means taking the entire live site
 *    offline over a decision that has nothing to do with whether the site
 *    works. That is a worse outcome than a visible placeholder.
 *
 *    So: `npm run build` (what Vercel actually runs) reports placeholders
 *    loudly but exits 0 — the deploy proceeds with the placeholder still
 *    visible on the page, exactly as CONTENT.md intends. `--strict` (what CI
 *    runs, via `npm run verify:strict`) fails on the same findings, so there
 *    is still a hard, visible, impossible-to-miss signal that something is
 *    outstanding — it just doesn't hold the public site hostage to it.
 */
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const strict = process.argv.includes('--strict');

const DIST_DIR = path.join(process.cwd(), 'dist');
const VERCEL_JSON = path.join(process.cwd(), 'vercel.json');

let hardFailed = false;
let placeholdersFound = false;

const hardFail = (msg) => {
  console.error(`\n  ✗ ${msg}`);
  hardFailed = true;
};

// ---------------------------------------------------------------- guard 1 --

const html = await readFile(path.join(DIST_DIR, 'index.html'), 'utf8');

const placeholderMatches = html.match(/\[\[[^\]]*\]\]/g) ?? [];
if (placeholderMatches.length > 0) {
  placeholdersFound = true;
  const label = strict ? '✗' : '⚠';
  console[strict ? 'error' : 'warn'](
    `\n  ${label} ${placeholderMatches.length} unresolved CONTENT.md placeholder(s) in dist/index.html:`,
  );
  for (const m of new Set(placeholderMatches)) console.log(`      ${m}`);
  if (strict) hardFailed = true;
} else {
  console.log('  ✓ no [[ placeholders in the built output');
}

// ---------------------------------------------------------------- guard 2 --

// Every inline <script>...</script> except application/ld+json, which CSP
// script-src does not govern — it's a data island, not executable script.
const scriptRe =
  /<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g;
const actualHashes = [];
let m;
while ((m = scriptRe.exec(html))) {
  actualHashes.push(createHash('sha256').update(m[1], 'utf8').digest('base64'));
}

const vercelConfig = JSON.parse(await readFile(VERCEL_JSON, 'utf8'));
const cspHeader = vercelConfig.headers
  ?.flatMap((rule) => rule.headers)
  ?.find((h) => h.key === 'Content-Security-Policy')?.value;

if (!cspHeader) {
  hardFail('vercel.json has no Content-Security-Policy header to check hashes against.');
} else {
  const shippedHashes = [...cspHeader.matchAll(/'sha256-([^']+)'/g)].map((mm) => mm[1]);

  const missing = actualHashes.filter((h) => !shippedHashes.includes(h));
  const stale = shippedHashes.filter((h) => !actualHashes.includes(h));

  if (missing.length > 0 || stale.length > 0) {
    hardFail(
      `vercel.json's CSP script-src hashes do not match dist/index.html's ${actualHashes.length} inline script(s).`,
    );
    if (missing.length > 0) {
      console.error(
        '      Missing from vercel.json (script actually shipped, hash not allowed):',
      );
      for (const h of missing) console.error(`        'sha256-${h}'`);
    }
    if (stale.length > 0) {
      console.error('      In vercel.json but no longer shipped (safe to remove):');
      for (const h of stale) console.error(`        'sha256-${h}'`);
    }
    console.error('\n      Full corrected list, in build order:');
    console.error('      ' + actualHashes.map((h) => `'sha256-${h}'`).join(' '));
  } else {
    console.log(
      `  ✓ CSP script-src hashes match all ${actualHashes.length} inline scripts`,
    );
  }
}

// -----------------------------------------------------------------------

if (hardFailed) {
  console.error(
    `\n  Build verification failed${strict ? ' (--strict)' : ''}. See above.\n`,
  );
  process.exitCode = 1;
} else if (placeholdersFound) {
  console.warn(
    '\n  Build verification passed, with open placeholders (see warnings above).\n' +
      '  This does not block the deploy — see the comment at the top of this file\n' +
      '  for why. Run `npm run verify:strict` for a hard failure on the same list.\n',
  );
} else {
  console.log('\n  Build verification passed.\n');
}
