# Build plan — Vasileios Verykokos bio site

**Audience: a Claude Code agent.** Execute phases in order. Do not skip ahead, do not
merge phases, and do not start a phase until the previous phase's acceptance criteria
all pass. Each phase is a commit.

**Read first, in this order:**
1. `MOBILE_SPEC.md` — the highest-priority constraints
2. `DESIGN_SYSTEM.md` — tokens; no raw values anywhere
3. `CONTENT.md` — the real copy
4. `ZIAKIS_AUDIT.md` — measured reference, with the steal/avoid list

**Production tier: T2** (public-facing site, real users, real reputational cost).
Gates 1, 5, 6, 7, 9, 10 of the production-ready skill apply in full; gates 2, 3, 4
(data layer, concurrency, tenancy) are N/A — this is a static site with no database,
no sessions, and no user input. Say so rather than inventing work for them.

---

## Goal

A single-page personal site that makes a recruiter or engineering lead want to
interview Vasilis. Clean, sleek, professional. **Nothing on it may feel sloppy** —
sloppiness in a developer's own site is read as sloppiness in their code.

The repository itself is part of the portfolio. Assume a senior engineer will open it.
Write the code you would want to be judged on.

---

## Stack decision (do not substitute)

| Choice | What | Why |
|---|---|---|
| Framework | **Astro 5** + TypeScript (`strict`) | Ships zero JS by default. The 30KB budget in MOBILE_SPEC §9 is trivially met, and islands are available if we need one. |
| Styling | **Plain CSS**, custom properties, `@layer`, one global stylesheet + scoped component styles | Smaller and cleaner than a utility framework at this size, and far more readable when a reviewer opens the repo. No Tailwind. |
| Content | Astro components + a typed content collection for projects | Copy lives in data, not JSX, so it can be edited without touching layout. |
| Images | `astro:assets` (`<Image>` / `<Picture>`) | Automatic AVIF/WebP, `srcset`, and intrinsic sizing — directly fixes audit finding M4. |
| Fonts | **Self-hosted woff2** via `@fontsource-variable` | No third-party request; ziakis.com's render-blocking Google Fonts call is a measured weakness. |
| Deploy | **Vercel** (Cloudflare Pages is an equally good alternative) | Zero-config Astro static output, free TLS, global CDN, preview deploys per branch. |
| CI | GitHub Actions | Build + Lighthouse CI + link check on every push. |

Node 20 LTS or newer. Package manager: npm (keep `package-lock.json` committed).

---

## Phase 0 — Prerequisites and blockers

**Do not write code yet.**

1. Read all four reference documents in this folder.
2. Open `CONTENT.md` and copy the blocker table (B1–B10) into a `TODO-VASILIS.md` at
   the repo root. These are human tasks, not agent tasks.
3. **Blockers that hard-stop launch (not the build):** B1 (a public repo must exist
   before the GitHub link goes live), B3 (the AEGIS demo video is the single highest-
   impact asset on the page), B8 (portrait or an explicit decision to omit it).
4. Build with realistic placeholder assets so layout work isn't blocked — but every
   placeholder must be obvious (a grey box labelled `PLACEHOLDER — B9`), never a stock
   photo that could survive to production.
5. Confirm with Vasilis: ember accent (`#A8431C`) or the deep-teal alternative. Do not
   guess — it sets the whole tone. Default to ember if there's no answer.

**Acceptance:** `TODO-VASILIS.md` exists; the accent is confirmed; no code written.

---

## Phase 1 — Scaffold and foundations

**Goal:** an empty site that already meets every performance and token rule.

1. `npm create astro@latest` — minimal template, TypeScript strict, no UI framework.
2. `astro.config.mjs`: `output: 'static'`, set `site` to the final domain (read from
   `process.env.SITE_URL` with the production domain as the documented default — **no
   hardcoded host**, Gate 1), enable `compressHTML`.
3. Install `@fontsource-variable/newsreader`, `@fontsource-variable/inter`,
   `@fontsource/jetbrains-mono`. Import only the weights and subsets named in
   DESIGN_SYSTEM §2 (latin, latin-ext, greek; mono latin only).
4. Create `src/styles/`:
   - `tokens.css` — every custom property from DESIGN_SYSTEM §1–5, verbatim.
   - `reset.css` — modern reset: `box-sizing: border-box`, margin zero,
     `-webkit-text-size-adjust: 100%`, `text-wrap: pretty` on `p`, `text-wrap: balance`
     on headings, `img { display:block; max-width:100% }`, `overflow-x: clip` on
     `html`/`body`, `::selection` using `--selection-bg`,
     `-webkit-tap-highlight-color`, `touch-action: manipulation` on interactives.
   - `base.css` — element defaults, `:focus-visible`, `.visually-hidden`, the
     `prefers-reduced-motion` block, `scroll-behavior` gated behind
     `prefers-reduced-motion: no-preference`.
   - Use `@layer reset, tokens, base, components, utilities;` so cascade order is
     explicit and never fought with `!important`.
5. Add `.editorconfig`, `.prettierrc`, `eslint` with `astro` + `jsx-a11y` plugins.
   **Set the a11y rules to `error`, not `warn`.**
6. Add `npm scripts`: `dev`, `build`, `preview`, `check` (`astro check` + `tsc`),
   `lint`, `format`.
7. Commit `.gitignore` covering `node_modules`, `dist`, `.astro`, `.env*`.

**Acceptance:**
- `npm run build` succeeds; `npm run check` and `npm run lint` are clean.
- `dist/` contains **zero JS files**.
- No hex value, px literal, or font-family string exists outside `tokens.css`.
- Fonts resolve from `/_astro/`, not from a `fonts.googleapis.com` URL.

---

## Phase 2 — Layout shell

**Goal:** head, header, mobile nav, footer — correct before any content exists.

1. `src/layouts/BaseLayout.astro`:
   - `<html lang="en">`, viewport meta **exactly** as MOBILE_SPEC §6 (including
     `viewport-fit=cover`).
   - `<title>`, meta description, canonical, `theme-color`, `color-scheme: light`.
   - Open Graph + Twitter card tags (image wired in Phase 13).
   - Inline head script, one line: `document.documentElement.classList.add('js')`.
     This is the only blocking script on the page.
   - `<link rel="preload">` for the two above-the-fold font files only.
   - Skip link as the first focusable element → `#main`.
   - `<main id="main">` wrapper.
2. `src/components/SiteHeader.astro`:
   - Sticky, `--header-h: 3.5rem` (56px), `--paper-3`, 1px `--line` bottom border, no blur.
   - Wordmark left; on `≥ --bp-lg` inline nav right (Work / Skills / About / Contact).
   - Below `--bp-lg`: a **48×48** menu button, `aria-expanded`, `aria-controls`.
3. `src/components/MobileMenu.astro` + its script — implement every rule in
   MOBILE_SPEC §7: 48px rows, focus trap, `Escape`, outside tap, `inert` when closed,
   scroll lock with the `position: fixed` + restore-`scrollY` technique, closes on
   anchor tap, transform/opacity animation only.
4. `src/components/SiteFooter.astro` — name, one line, the four links, year,
   `padding-bottom: max(var(--sp-7), env(safe-area-inset-bottom))`.
5. Global `section { scroll-margin-top: calc(var(--header-h) + var(--sp-4)); }`.

**Acceptance:**
- Menu is fully operable by keyboard alone: Tab, Enter, Escape, focus returns to the button.
- With JS disabled, the header still renders and the nav links still work (they are
  anchors; at minimum the footer links must reach every section).
- Touch-target test from MOBILE_SPEC §2 returns `0` at 375px.
- Overflow test from MOBILE_SPEC §3 is `false` at 320px.
- Total JS after this phase: **< 3KB gzipped**.

---

## Phase 3 — Hero

Content from `CONTENT.md` § Hero.

1. Mobile (base): single column — eyebrow, name, positioning line, deck, status line,
   actions, then portrait *below*. Copy the reflow order ziakis.com gets right.
2. `≥ --bp-lg`: two-column grid, copy left, portrait right, `gap: var(--sp-8)`.
3. Name at `--fs-hero`, Newsreader 400, `--lh-tight`, `--tracking-hero`. **Surname on
   its own line in accent italic** — the one borrowed move from the reference site.
4. Status line in mono at `--fs-mono`, `--muted`, wrapping to two lines gracefully at
   320px.
5. Four action links in a wrap-friendly flex row, `gap: var(--sp-3)` minimum, each
   ≥44px tall. Primary (CV) gets the accent underline; the rest are quiet.
6. Portrait: `<Image>`, `widths={[180,240,360,480,600]}`, `sizes` reflecting the real
   slot (≤200px on mobile), `fetchpriority="high"`, `loading="eager"`, explicit
   dimensions, `border-radius: 50%`.
7. **No full-height hero.** The awards section must be partly visible at 812px so the
   page reads as having depth. If a full-height treatment is used anywhere, `100dvh`.

**Acceptance:**
- At 320px: nothing clipped, name wraps to at most 2 lines, no overflow.
- At 390px: name, positioning line, and at least one action are above the fold.
- Landscape phone (844×390): the name is visible without scrolling.
- Portrait LCP element loads from a source ≤600px wide on mobile.
- CLS contribution from the hero: **0**.

---

## Phase 4 — Awards

Content from `CONTENT.md` § Awards. Background `--paper-2`.

1. Five rows, hairline `--line` separators, no cards, no shadows.
2. **The Huawei World Final row is visually dominant** — larger title, and it may
   carry the only accent-tinted background wash on the page (`--accent-soft`), used
   once. Everything else is quiet. This is the page's single strongest credential;
   treat it like a headline, not a list item.
3. Desktop: title left, date right on a shared baseline, mono `--muted`.
4. **Mobile: the date moves above the title** as a small mono line. Do not let a date
   float right next to a wrapping title — that is where these layouts look cheap.
5. Wire in the scale figures (B2) when supplied.

**Acceptance:** at 320px no row exceeds 3 lines; dates never orphan; the section fits
in ≤2 phone screens.

---

## Phase 5 — Work (the core of the site)

Content from `CONTENT.md` § Work. Background `--paper`.

1. Typed content collection `src/content/projects/` — one entry per project with a Zod
   schema (`title`, `subtitle`, `year`, `role`, `problem`, `hardPart`, `alsoBuilt[]`,
   `spec` record, `links[]`). Schema validation failure must fail the build.
2. `ProjectEntry.astro` renders: `01` in accent mono → title → meta line → problem →
   **the hard part** (the most important paragraph on the site; give it `--fs-lead`) →
   "Also built" list → spec sheet → links.
3. **Spec sheet** per DESIGN_SYSTEM §4.3. Mobile: stacked label-over-value rows.
   Desktop (`≥ --bp-md`): two columns, labels right-aligned to a hairline.
   It must never require horizontal scrolling; long stack strings wrap on `·`.
4. **Mobile length control (MOBILE_SPEC §5):** "Also built" plus the spec sheet go
   inside a `<details>` expander below `--bp-lg`, summary reading
   `Technical detail ↓`, open by default at `≥ --bp-lg`. The summary is a ≥48px target.
   Use real `<details>`, not a JS accordion — it works without JS and is accessible by
   default.
5. Screenshots: max 2 per project on mobile, horizontal scroll-snap strip per
   MOBILE_SPEC §8. Never an auto-advancing carousel.
6. AEGIS demo video: poster image + ≥56px play button; the player loads only on tap.
   If it's a YouTube embed, use a facade — do not ship the iframe on first load.

**Acceptance:**
- Each project reads as a complete story in under 45 seconds on a phone.
- `document.body.scrollHeight` at 375px is still within the §5 budget after this phase.
- With JS disabled, every word of all three case studies is reachable (the `<details>`
  still opens).
- Zero horizontal scroll on any spec sheet at 320px.

### Phase 5b — One live element (optional, recommended, strictly budgeted)

The single highest-wow addition: a small interactive island proving he ships
interactive code. Pick **one**:
- a miniature fire-spread visual on a static terrain tile, or
- a live sparkline showing the Signal engine firing on a transition and staying quiet
  while the condition persists.

Hard constraints: **≤15KB JS gzipped**, `client:visible`, renders a static image
fallback with no JS, respects `prefers-reduced-motion`, no network calls at runtime
(bundle the sample data), and it must not push total JS past the 30KB budget.
**If it cannot meet all of those, skip it.** A missing flourish costs nothing; a
janky one costs the interview.

---

## Phase 6 — Skills

Content from `CONTENT.md` § Skills. Background `--paper-2`.

Five labelled groups. Label in Inter uppercase `--muted`; items in mono `--ink-2`,
separated by `·`. Mobile: label above items, items wrap freely. Desktop: label column
+ items column.

**Forbidden:** progress bars, percentages, star ratings, logo grids, "years of
experience" counters.

**Acceptance:** whole section ≤1.5 phone screens; no item string causes overflow at 320px.

---

## Phase 7 — About and Education

Content from `CONTENT.md`. About on `--paper`, Education on `--paper-2`.

- About: prose capped at `--measure`, `--lh-body`. Under 120 words.
- Education: a definition-list style block, mono for dates, serif for institutions.
  Four lines. Do not inflate the water-park job — it sits here as seasonal work.

**Acceptance:** no paragraph exceeds 68ch at any width; dates align cleanly at 320px.

---

## Phase 8 — Contact and footer

Content from `CONTENT.md` § Contact. Background `--paper-3`.

- One short line, then plain-text links. **No form.**
- Email as a real `mailto:` link, ≥44px target, `overflow-wrap: anywhere`.
- Phone only if B6 comes back yes.
- CV link points at `/cv.pdf` — a stable path that must never change, because it will
  live in sent applications for years.

**Acceptance:** email is tappable and copyable on a phone; the CV link returns 200.

---

## Phase 9 — Motion layer

Implement exactly MOBILE_SPEC §4 and DESIGN_SYSTEM §5.

1. `.reveal` **defaults to visible**; only `.js .reveal` hides. This is the single most
   important line in the phase — it is the failure that made ziakis.com render blank.
2. IntersectionObserver, `rootMargin: '0px 0px -10% 0px'`, `threshold: 0.01`,
   `unobserve` after reveal.
3. A 1500ms safety timeout reveals everything unconditionally.
4. `prefers-reduced-motion: reduce` disables all of it, with nothing left hidden.
5. Any desktop-only flourish gated behind `@media (hover:hover) and (pointer:fine)`
   **and** excluded from the mobile bundle.

**Acceptance:**
- Flick-scroll from top to bottom in one gesture on a phone — no blank regions.
- `document.querySelectorAll('.reveal:not(.is-visible)').length` is `0` after 1.6s.
- With JS disabled, everything is visible.
- Motion adds **< 2KB** gzipped.

---

## Phase 10 — Mobile hardening pass

**A dedicated phase. Do not fold it into other work.** Run the entire QA matrix in
MOBILE_SPEC §11 and fix everything found.

1. Every width: 320, 360, 375, 390, 414, 768, 1024, 1440.
2. Landscape phone (844×390).
3. Run the three console tests (touch targets, overflow, page height) at each width
   and record results in `MOBILE-QA.md` at the repo root.
4. JS disabled. `prefers-reduced-motion`. 200% zoom. Root font-size 24px.
5. Slow 4G throttle on a mid-tier device profile.
6. **Deploy a preview and open it on a real phone.** Emulation misses momentum
   scrolling, sticky-header repaint, tap latency, and font rendering.
7. Paste the preview URL into LinkedIn and WhatsApp; confirm the OG preview renders.

**Acceptance:** `MOBILE-QA.md` shows every matrix cell passing, with the measured page
height at 320px and 375px recorded against the §5 budget.

---

## Phase 11 — Accessibility pass

1. Heading order is strictly sequential — one `h1`, then `h2` per section, `h3` within.
2. Every image has meaningful `alt`; decorative images get `alt=""`.
3. Landmarks: `header`, `nav`, `main`, `footer`, each `section` labelled via
   `aria-labelledby` pointing at its heading.
4. Verify every contrast pair in DESIGN_SYSTEM §1.3 with a checker. `--muted` must not
   be used for body copy anywhere.
5. Keyboard: full traversal, visible focus on every stop, no traps except the
   intentional one in the open menu, logical order.
6. Screen reader: VoiceOver on iOS and NVDA or Narrator on desktop. The menu button
   must announce its expanded state.
7. `axe-core` in dev, plus `@axe-core/cli` against the built preview in CI.

**Acceptance:** zero axe violations; Lighthouse Accessibility **100** on mobile and
desktop; full keyboard operation verified manually.

---

## Phase 12 — Performance pass

Enforce every number in MOBILE_SPEC §9.

1. `npm run build`, then measure `dist/` — total transferred bytes for a first visit.
2. Fonts: confirm woff2, subsetted, `font-display: swap`, `size-adjust` fallback
   metrics tuned so CLS stays at 0. Preload only above-the-fold faces.
3. Confirm every image emits AVIF + WebP with correct `srcset`/`sizes`, and that the
   portrait's mobile candidate is ≤600px.
4. Confirm zero third-party requests. No analytics, no tag manager, no consent banner.
5. Lighthouse mobile, throttled, **three runs**; record the median.
6. Add `lighthouse-ci` to GitHub Actions with the budget as a **hard failure
   threshold**, not a warning.

**Acceptance (median of 3, mobile):** Performance ≥95, Accessibility 100, Best
Practices 100, SEO 100. LCP <1.8s. CLS <0.05. JS <30KB gz. Page <500KB.

---

## Phase 13 — SEO, metadata, and the share card

1. `<title>` and meta description from `CONTENT.md` § Meta.
2. Open Graph + Twitter `summary_large_image`. **The OG image is high-leverage** — it
   is what a recruiter sees when the link is pasted into Slack or LinkedIn. Generate a
   1200×630 PNG using the site's own type and palette: name, one line, the Shenzhen
   result. Commit it as a static asset; do not generate it at runtime.
3. `Person` JSON-LD: `name`, `jobTitle`, `url`, `sameAs` (GitHub, LinkedIn),
   `alumniOf` (University of Macedonia), `award` (the three first places).
4. `sitemap.xml` via `@astrojs/sitemap`, plus `robots.txt` allowing everything.
5. `favicon.svg` + `apple-touch-icon.png` (180×180) + `site.webmanifest` with
   `theme-color` matching `--paper-3`.
6. Place `cv.pdf` in `public/` at the stable `/cv.pdf` path.

**Acceptance:** validate the OG card in a real LinkedIn/WhatsApp paste and in the
Facebook sharing debugger; JSON-LD passes Google's Rich Results test; all four icon
sizes render.

---

## Phase 14 — Deploy

1. GitHub repo, `main` protected. **This repo is public and part of the portfolio** —
   README with a screenshot, the stack, a run command, and a one-paragraph rationale.
2. Vercel project, framework preset Astro, `SITE_URL` set as an environment variable
   per environment (Gate 1: same artifact everywhere, only config differs).
3. Custom domain + automatic TLS. Force HTTPS; redirect `www` → apex (or the reverse —
   pick one and be consistent).
4. Security headers via `vercel.json`: `Strict-Transport-Security`,
   `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
   `X-Frame-Options: DENY`, and a `Content-Security-Policy` — with no third-party
   assets, `default-src 'self'` is achievable. Allow only the one inline head script
   via a hash, not `'unsafe-inline'`.
5. Cache headers: hashed assets `max-age=31536000, immutable`; HTML `must-revalidate`.
6. **Build-time guard:** a script that greps `dist/` for `[[` and fails the build if
   any `CONTENT.md` placeholder survived. Wire it into CI.
7. GitHub Actions: build → `astro check` → lint → axe → Lighthouse CI → link check.
   Any failure blocks the merge.

**Acceptance:** production URL live over HTTPS; headers verified; CI green; the
placeholder guard proven to fail on a deliberately reintroduced `[[`.

---

## Phase 15 — Post-launch

1. Add the URL to the LinkedIn headline and contact panel, the GitHub profile README,
   and the CV header.
2. Re-run Lighthouse against production (CDN behaviour differs from local preview).
3. Ask three people to open it on their phones cold and report what they remember
   30 seconds later. If "Huawei world final" isn't one of the answers, the hierarchy
   needs another pass.
4. Optional, only after everything above is green: a dark theme. It doubles the QA
   surface and is the most common source of a sloppy-looking portfolio — a good light
   site beats a half-finished pair. If built: `prefers-color-scheme` plus a manual
   toggle, re-verify every contrast pair, and re-run the full §11 matrix in both themes.

---

## Standing rules for the whole build

1. **Mobile-first. `min-width` queries only.**
2. No raw hex, px, or font names outside `tokens.css`.
3. No content depends on JavaScript.
4. Every interactive element ≥44×44px.
5. No third-party requests, ever.
6. One accent, used in three roles.
7. No shadows except the mobile menu sheet.
8. Every phase ends with the touch-target, overflow, and page-height tests re-run.
9. Commit per phase, with the acceptance results in the commit body.
10. If a decision isn't covered by these documents, choose the quieter option.
