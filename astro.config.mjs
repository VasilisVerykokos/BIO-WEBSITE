// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * The canonical origin.
 *
 * Gate 1: the same build artifact goes to every environment and only the
 * config differs, so no host is hardcoded. Nothing here is Vercel-specific
 * config living outside this file — it's still one rule, "read the origin
 * from the environment," just with a fallback chain instead of one variable.
 *
 * Precedence:
 *   1. SITE_URL, explicit — the eventual custom domain (B10) once it's
 *      bought, and what docker compose already passes as a build arg.
 *   2. VERCEL_PROJECT_PRODUCTION_URL, when this is a production build on
 *      Vercel — the stable project domain (right now bio-website-olive.
 *      vercel.app), not the per-deployment hash URL, so canonical links and
 *      the sitemap don't change on every push.
 *   3. VERCEL_URL, on any other Vercel build (a PR preview) — that preview's
 *      own URL, so a preview correctly describes itself rather than pointing
 *      at production.
 *   4. localhost, for local dev only. Never a guessed production domain —
 *      baking in a host nobody owns would put a dead URL into every Open
 *      Graph tag, the sitemap, and the JSON-LD.
 *
 * Both Vercel variables arrive as a bare hostname, no scheme.
 */
const SITE_URL =
  process.env.SITE_URL ??
  (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:4321');

if (
  !process.env.SITE_URL &&
  !process.env.VERCEL &&
  process.env.NODE_ENV === 'production'
) {
  console.warn(
    '\n  SITE_URL is not set and this is not a Vercel build. Absolute URLs\n' +
      `  (Open Graph, sitemap, JSON-LD) will point at ${SITE_URL}, which is wrong\n` +
      '  for a real deploy.\n',
  );
}

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

  // One page today, but the sitemap costs nothing and is the thing that makes
  // a new domain discoverable. robots.txt points at it, and both derive their
  // host from SITE_URL rather than hardcoding one.
  integrations: [sitemap()],

  // A static site. No adapter, no server runtime, nothing to keep alive.
  output: 'static',

  // Strips the whitespace Astro would otherwise leave between elements.
  // Worth a few percent on a page whose whole budget is 500KB.
  compressHTML: true,

  build: {
    // One stylesheet rather than a <style> block per component. The CSS here
    // is small enough that a single cached file beats repeated inlining, and
    // it keeps the Content-Security-Policy free of style hashes.
    inlineStylesheets: 'never',
  },
});
