# Mobile specification — the highest-priority document

**Read this before writing a single line of CSS.**

## Why this document outranks the others

More than half the people who open this site will do so on a phone: a recruiter
opening a LinkedIn message between meetings, an engineering lead tapping a link in
Slack on the train, a hiring manager checking it on a couch at 21:00. Desktop is the
*secondary* surface.

The audit of ziakis.com found that its mobile experience — while free of horizontal
overflow, which is the hard part — fails on **touch targets (31 of 40 elements),
content-hidden-until-JS (34 of 34 elements), and page length (12,372px ≈ 17 screens
at 320px)**. Those three failures are exactly the ones that cost you a callback.

**Every rule below is a hard requirement. None are aspirational.**

---

## 1. Mobile-first is a build rule, not a slogan

```css
/* CORRECT — base styles are the phone; enhance upward */
.hero { display: grid; gap: var(--sp-6); }

@media (min-width: 64rem) {
  .hero { grid-template-columns: 1fr auto; gap: var(--sp-8); }
}
```

```css
/* WRONG — never do this in this project */
.hero { grid-template-columns: 1fr auto; }
@media (max-width: 767px) { .hero { grid-template-columns: 1fr; } }
```

- **`min-width` queries only.** A `max-width` query in the codebase is a defect —
  with one exception: `@media (hover: none)` / `(pointer: coarse)` feature queries.
- The unstyled, no-media-query rendering must already be a correct phone layout.
- Reviewer check: comment out every `@media (min-width: …)` block. The site must
  still be fully usable at 375px.

### Breakpoint ladder (only these four)

```css
--bp-sm:  30rem;   /*  480px — large phone */
--bp-md:  48rem;   /*  768px — tablet portrait */
--bp-lg:  64rem;   /* 1024px — desktop */
--bp-xl:  80rem;   /* 1280px — wide */
```

Base design width is **320px**. If a layout needs a fifth breakpoint, the layout is
wrong — use `clamp()` or an intrinsic grid instead.

---

## 2. Touch targets — the #1 fix

ziakis.com fails this 31 times out of 40. We fail it zero times.

- **Every interactive element has a minimum hit area of 44×44 CSS px.** Nav links,
  the menu button, footer links, email, social links, expanders, skip link.
- The *visual* element may be smaller than 44px. Expand the hit area with padding, or
  invisibly:

```css
.target-expand { position: relative; }
.target-expand::after {
  content: "";
  position: absolute;
  inset: 50% 50%;
  width: max(100%, 44px);
  height: max(100%, 44px);
  transform: translate(-50%, -50%);
}
```

- **Minimum 8px of clear space between adjacent targets.** Inline links in a row of
  meta links need `gap: var(--sp-3)` minimum.
- The mobile menu button is **48×48**, not 32×32.
- Inline links inside a paragraph are exempt from the 44px rule (WCAG allows the
  inline exception), but must have `padding-block: 2px` and a visible underline.

**Acceptance test** — run in the console at 375px, must return `0`:

```js
[...document.querySelectorAll('a,button,summary,[role="button"],input,select')]
  .filter(el => {
    if (el.closest('p, li.prose-item')) return false;  // inline-link exception
    const r = el.getBoundingClientRect();
    return r.width > 0 && (r.height < 44 || r.width < 44);
  }).length
```

---

## 3. No horizontal overflow, ever

ziakis.com passes this — match it.

```css
html { overflow-x: clip; }
body { overflow-x: clip; max-width: 100%; }
img, svg, video, canvas, iframe, table { max-width: 100%; }
pre, code { overflow-x: auto; -webkit-overflow-scrolling: touch; }
```

- Any wide element (spec sheet, code block, table) scrolls **inside its own
  container**, never the page body.
- Long unbroken strings (URLs, `github.com/VasilisVerykokos`) get `overflow-wrap:
  anywhere`.
- **Never** use `overflow-x: hidden` on `body` as the fix — it breaks
  `position: sticky` on some browsers. Use `clip`.

**Acceptance test** — at 320, 360, 375, 390, 414, 768, must be `false` at every width:

```js
document.documentElement.scrollWidth > window.innerWidth
```

Plus, find the offender if it ever returns true:

```js
[...document.querySelectorAll('*')]
  .filter(e => e.getBoundingClientRect().right > window.innerWidth + 1)
  .map(e => e.tagName + '.' + e.className)
```

---

## 4. Content must never depend on JavaScript

This is the failure that produced a **blank screenshot** twice while auditing
ziakis.com. 34 of its 34 `.reveal` elements start at `opacity: 0`.

```css
/* Default state: VISIBLE. Always. */
.reveal { opacity: 1; transform: none; }

/* Only once JS has proven it is running do we opt into hiding. */
.js .reveal { opacity: 0; transform: translateY(12px); }
.js .reveal.is-visible { opacity: 1; transform: none;
  transition: opacity var(--dur-slow) var(--ease),
              transform var(--dur-slow) var(--ease); }

@media (prefers-reduced-motion: reduce) {
  .js .reveal { opacity: 1; transform: none; transition: none; }
}
```

The `js` class is added to `<html>` by an inline head script. If JS is blocked, slow,
or errors, **every word on the page is still readable.**

Additional rules:
- The IntersectionObserver uses `rootMargin: '0px 0px -10% 0px'` and
  `threshold: 0.01` — content reveals early, not after it is already past.
- A safety timeout reveals everything unconditionally after 1500ms.
- Fast scrolling must never outrun the observer. Test by flicking from top to bottom
  in one gesture — no blank regions may appear.

---

## 5. Page length budget

| Metric | ziakis.com | **Our hard limit** |
|---|---|---|
| Page height @ 375px | 11,107px | **≤ 7,000px** |
| Page height @ 320px | 12,372px | **≤ 8,000px** |
| Screens of scroll @ 375px | ~13.7 | **≤ 8.5** |
| Time to reach Contact | too long | ≤ 6 flick gestures |

How we stay under it:
- Three case studies, not six.
- Each case study shows **problem + one "hard part" paragraph + spec sheet** by
  default. Deeper engineering detail goes inside a `<details>` expander (closed on
  mobile, open on desktop ≥1024px).
- Skills is a compact grouped list, not a grid of logo cards.
- Education is four lines.
- No section may exceed ~2.5 phone screens.

Measure it after every phase: `document.body.scrollHeight` at 375px.

---

## 6. Viewport, safe areas, and iOS specifics

```html
<meta name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover">
```

- **`viewport-fit=cover` is required** (ziakis.com omits it) — then respect the insets:

```css
body {
  padding-left:  max(var(--gutter), env(safe-area-inset-left));
  padding-right: max(var(--gutter), env(safe-area-inset-right));
}
.site-footer { padding-bottom: max(var(--sp-7), env(safe-area-inset-bottom)); }
.site-header { padding-top: env(safe-area-inset-top); }
```

- **Never** `user-scalable=no` or `maximum-scale=1` — pinch-zoom must work (WCAG 1.4.4).
- `-webkit-text-size-adjust: 100%` on `html` to stop iOS auto-inflating text in landscape.
- Any `<input>` must be ≥16px font-size or iOS Safari zooms on focus.
- Use `100dvh`, never `100vh`, for any full-height element — `vh` is wrong while the
  mobile URL bar is visible. Provide `min-height: 100vh` as the fallback line first.
- `-webkit-tap-highlight-color: rgb(168 67 28 / 0.12)` — a deliberate ember tap flash,
  not the default blue box.
- `scroll-behavior: smooth` only inside `@media (prefers-reduced-motion: no-preference)`.

---

## 7. Mobile navigation

- Header is **sticky, ≤ 56px tall**, `--paper-3` background, 1px `--line` bottom
  border, no backdrop blur (blur costs paint time on mid-range Android).
- Below `--bp-lg`: a **48×48** menu button toggling a sheet panel.
- The sheet:
  - Links at **≥ 48px row height**, full width, generous `--sp-4` padding.
  - Closes on: link tap, `Escape`, tap outside, and browser back.
  - **Focus is trapped** while open; focus returns to the button on close.
  - Locks body scroll without the iOS jump — record `scrollY`, apply
    `position: fixed; top: -${y}px; width: 100%`, restore on close.
  - `aria-expanded` on the button, `aria-hidden` on the panel, `inert` when closed.
  - Animates with `transform`/`opacity` only, ≤ 300ms.
- All anchor targets need `scroll-margin-top: calc(var(--header-h) + var(--sp-4))` so
  the sticky header never covers the section heading after a jump.

---

## 8. Images and media

ziakis.com serves a **1000px portrait into a 180px slot with no `srcset`** — 5.5×
wasted bytes on mobile data. We do the opposite.

- Use Astro's `<Image>` / `<Picture>` (`astro:assets`) for every raster image.
- `formats={['avif','webp']}`, with a JPEG fallback.
- Explicit `width` and `height` on every image — **CLS from images must be 0**.
- `widths={[320, 480, 640, 960, 1280]}` and a correct `sizes` attribute reflecting
  the real layout slot.
- Portrait: `fetchpriority="high"`, `loading="eager"`, `decoding="async"`.
  Everything below the fold: `loading="lazy"`.
- The portrait's rendered size on mobile must be ≤ 200px — so the largest source it
  can pull at 3× DPR is 600px, not 1000px.
- Project screenshots: max 2 per project on mobile, in a horizontally scrollable strip
  with `scroll-snap-type: x mandatory` and visible scroll affordance. Never a carousel
  with auto-advance.
- **Video** (the AEGIS demo): never autoplay on mobile. Render a poster image with a
  real play button (≥ 56px) and load the player only on tap. If YouTube-hosted, use a
  facade — do not ship the iframe on first load; it costs ~1MB.

---

## 9. Mobile performance budget

Enforced, not aspirational. Measured on **Moto G Power, Slow 4G throttling** in
Lighthouse mobile.

| Metric | Budget |
|---|---|
| Lighthouse Performance (mobile) | **≥ 95** |
| Lighthouse Accessibility | **100** |
| Lighthouse Best Practices | **100** |
| Lighthouse SEO | **100** |
| LCP | **< 1.8s** |
| CLS | **< 0.05** |
| INP | **< 150ms** |
| Total JS shipped (gzipped) | **< 30KB** |
| Total first-load page weight | **< 500KB** |
| Font files | **< 120KB total, woff2, subsetted** |
| Third-party requests | **0** |

Enforcement:
- Self-host fonts. No `fonts.googleapis.com` request (ziakis.com makes one — it is a
  render-blocking third-party round trip).
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the two faces
  used above the fold only.
- `font-display: swap` plus a metric-matched fallback via `size-adjust` to keep CLS at 0.
- No analytics, no tag manager, no consent banner, no chat widget, no icon font.
- Astro ships zero JS by default — any `client:*` directive must be justified in the
  PR description and stay inside the 30KB budget.

---

## 10. Touch, pointer, and input rules

```css
/* Desktop-only flourishes must be gated — ziakis.com ships its cursor code to phones */
@media (hover: hover) and (pointer: fine) {
  .custom-cursor { display: block; }
  .card:hover { … }
}
```

- **No information may be hover-only.** Anything revealed on hover must also be
  visible or reachable by tap on touch devices.
- No `:hover` state that changes layout (it causes sticky-hover artifacts on touch).
- Horizontal scroll strips get `overscroll-behavior-x: contain` so they don't trigger
  browser back-swipe.
- `touch-action: manipulation` on interactive elements to remove the 300ms tap delay.

---

## 11. Mobile QA matrix — run before every deploy

**Widths** (DevTools responsive mode, each one checked):

| Width | Device class | What to check |
|---|---|---|
| **320px** | iPhone SE 1 / small Android | The hard case. No overflow, no clipped headings, spec sheet stacks. |
| 360px | Galaxy A-series (very common in Greece) | Nav, awards row, tags wrap |
| 375px | iPhone SE 2/3, mini | Primary reference width |
| 390px | iPhone 14/15/16 | Primary reference width |
| 414px | Plus/Max sizes | Line lengths don't get too long |
| 768px | iPad portrait | Two-column transition doesn't look half-empty |
| 1024px | iPad landscape / small laptop | Desktop nav appears cleanly |
| 1440px | Laptop | Container caps at 980px, no stretched lines |

**Orientations:** portrait *and* **landscape phone (e.g. 844×390)** — the most-skipped
case. In landscape the sticky header plus safe areas must not eat the viewport, and
the hero must not require scrolling to reach the name.

**Conditions to test:**
- [ ] Slow 4G throttle — is anything readable before 2s?
- [ ] JavaScript disabled — is the entire page still readable and navigable?
- [ ] `prefers-reduced-motion: reduce` — all motion gone, nothing hidden
- [ ] 200% browser zoom at 375px — no overflow, no overlap (WCAG 1.4.4)
- [ ] Text-only zoom / `font-size: 24px` root — layout holds
- [ ] Dark-mode OS setting — page stays legible (we declare `color-scheme: light`)
- [ ] VoiceOver (iOS) or TalkBack — heading order reads sensibly, menu announces state
- [ ] Real device: open the deployed URL on an actual phone and read the whole page
- [ ] Paste the URL into a LinkedIn DM and a WhatsApp message — the OG preview renders
- [ ] Rotate mid-scroll — no layout break, no lost scroll position
- [ ] Tap every single link with a thumb, not a mouse

**Final gate:** hand your phone to someone who has never seen the site and ask them to
find your Huawei award and your email. If it takes more than 15 seconds, the page is
too long or the hierarchy is wrong.
