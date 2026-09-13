// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * The canonical origin.
 *
 * Gate 1: the same build artifact goes to every environment and only the
 * config differs, so no host is hardcoded. Production, preview, and the
 * container build all supply SITE_URL; nothing else has to change.
 *
 * The fallback is localhost, deliberately — NOT a guessed production domain.
 * The real domain is blocker B10 and has not been bought yet. Baking in a
 * host nobody owns would put a dead URL into every Open Graph tag, the
 * sitemap, and the JSON-LD. Once B10 lands, set SITE_URL in the Vercel
 * project and in docker compose; this file does not change.
 */
const SITE_URL = process.env.SITE_URL ?? 'http://localhost:4321';

if (!process.env.SITE_URL && process.env.NODE_ENV === 'production') {
  console.warn(
    '\n  SITE_URL is not set. Absolute URLs (Open Graph, sitemap, JSON-LD) will\n' +
      `  point at ${SITE_URL}, which is wrong for a real deploy. See blocker B10.\n`,
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
