# ziakis.com — measured audit

Everything below was pulled from the live site on 2026-09-12 (computed styles, CSS
custom properties, media queries, and emulated viewports at 320 / 375 / desktop).
These are measurements, not guesses. Use them as the reference point; the design we
build is *informed by* this site, not a clone of it.

---

## 1. Colour scheme (exact values, read from `:root`)

| Token | Value | Role |
|---|---|---|
| `--paper` | `#faf8f5` | Base background — warm off-white |
| `--paper2` | `#f3f0eb` | Secondary surface |
| `--ink` | `#1c1c1a` | Primary text — near-black, warm |
| `--ink2` | `#4a4a46` | Body / secondary text |
| `--muted` | `#9a9890` | Meta, dates, eyebrow labels |
| `--line` | `#e2ddd8` | Hairline rules and borders |
| `--blue` | `#2451a8` | Single accent — links, surname, active states |
| `--blue-lt` | `#eef2fb` | Accent wash background |
| `--max` | `960px` | Content container width |

**Per-section background tints** (this is the clever part — each section gets a
slightly different warm tone so the long scroll has rhythm without dividers):

```
hero      #faf8f5
about     #f7f3ed
research  #faf8f5
teaching  #f5f0e8
projects  #f8f5f0
contact   #f2ede4
```

The whole palette sits inside a ~6% band of warm off-whites plus one blue. That
restraint is why it reads as expensive. **Total hues used: 2** (warm neutral + blue).

---

## 2. Typography (measured)

| Element | Family | Size (desktop) | Size (mobile) | Weight | Line height | Tracking |
|---|---|---|---|---|---|---|
| `h1` | Lora | 43.2px | 38.4px | 400 | 49.68px (1.15) | −0.432px |
| `h2` | Lora | 27px | — | 500 | 35.1px (1.3) | normal |
| `h3` | Lora | 17.1–19.8px | — | 500 | ~1.75 | normal |
| body `p` | Lora | 18.9px | 16px | 400 | 34.02px (**1.8**) | normal |
| eyebrow / nav | Inter | ~13px | — | 400–500 | — | wide, uppercase |

- Families loaded: `Lora` (400, 500, italic 400/500) + `Inter` (300, 400, 500), from
  Google Fonts, one stylesheet request.
- **Headings are weight 400–500, never 700.** Light serif headings at large sizes is
  the core of the "considered, not templated" feel.
- Body line-height 1.8 is unusually generous and is doing a lot of the work.
- The surname in the hero is set in *italic serif + accent colour* on its own line.
  That one move carries the whole hero.

---

## 3. Layout

- **Single long-scroll page**, 5 anchors: `#about`, `#research`, `#teaching`,
  `#projects`, `#contact`. One `<main id="main-content">`.
- Container `max-width: 960px`, centred. No full-bleed content anywhere.
- Sticky header, **57px tall**, background `#f2ede4`, `0.8px solid #e2ddd8` bottom
  border, **no backdrop blur**.
- Hero is a 2-column grid (`336.8px` text column + portrait, `48px` gap) that
  collapses to one column on mobile with the portrait *below* the text.
- Grids in use: `thesis-grid` (2-col, 32px gap), `crux-dims` (2-col, 8px/32px),
  `proj-entry` (list rows, 3.2px gap).
- Transitions are minimal and consistent: `color .15s`, `border-color .15s`,
  `opacity .6s, transform .6s` for scroll reveals. **No keyframe animations at all.**
- Custom cursor elements exist (`#cursor-dot`, `#cursor-ring`) — desktop affectation.

---

## 4. Mobile behaviour (emulated at 375×812 and 320×720)

### What it gets right — copy this

- ✅ **Zero horizontal overflow at 320px.** `scrollWidth === innerWidth` at both 320
  and 375. No element wider than the viewport. This is the single most important
  mobile property and many portfolios fail it.
- ✅ Fluid heading scale — `h1` steps 43.2px → 38.4px without a hard break.
- ✅ Hero portrait reflows below the copy instead of shrinking into a thumbnail.
- ✅ Hamburger menu at `#burger` toggling `#mobile-menu` (279px tall panel).
- ✅ Sensible breakpoint ladder: `400`, `600`, `660`, `1024` — not a 6-tier mess.
- ✅ Viewport meta present: `width=device-width, initial-scale=1.0`.

### What it gets wrong — fix all of these in our build

| # | Finding | Measurement | Impact |
|---|---|---|---|
| M1 | **Touch targets far below minimum** | **31 of 40** links/buttons are under 44×44px; the hamburger itself is **32×32px** | Mis-taps on phones. WCAG 2.5.8 fail. Highest-priority fix. |
| M2 | **Content hidden until JS runs** | **34 of 34** `.reveal` elements were still in the hidden state; they start at `opacity:0` and are revealed by script | If JS fails, is blocked, or the user scrolls faster than the observer fires, the page renders **blank**. I hit exactly this twice while screenshotting — captured an empty viewport mid-scroll. |
| M3 | **Page is far too long on mobile** | **11,107px** at 375px wide; **12,372px** at 320px ≈ **17 screens** of scrolling | A recruiter on a phone will not reach the contact section. |
| M4 | **Oversized images, no responsive sources** | Portrait is **1000px natural, displayed at 180px** (5.5× too big); `srcset` absent; `loading="auto"` | Wasted mobile data and a slower LCP for no visual gain. |
| M5 | **Body text drops to 16px on mobile** | 18.9px → 16px | Bottom of the comfortable range for long serif prose on a phone. |
| M6 | **No safe-area handling** | viewport meta lacks `viewport-fit=cover`; no `env(safe-area-inset-*)` | Content can sit under the notch / home indicator in landscape on iPhone. |
| M7 | **Consent banner covers content** | Klaro overlay sits over the lower-right of the viewport on load | On a phone it eats a meaningful share of the first screen. |
| M8 | **Desktop-only cursor code ships to phones** | `#cursor-dot` / `#cursor-ring` present in the mobile DOM | Dead weight; must be behind `@media (hover:hover) and (pointer:fine)`. |

---

## 5. Verdict — steal / avoid

**Steal:**
1. The warm-paper + near-black + one-accent palette discipline.
2. Per-section background tints for scroll rhythm.
3. Light-weight serif headings (400/500, never bold) at generous sizes.
4. Body line-height 1.8.
5. Uppercase letter-spaced sans eyebrow labels above each section.
6. Numbered list treatment (`01`–`05`).
7. Role/type tags on list rows (`JOURNAL`, `BOOK CHAPTER`).
8. Hairline rules and whitespace instead of cards with shadows.
9. 960px container, single column, no full-bleed.
10. Sticky 57px header, no blur.
11. Plain-text email instead of a contact form.
12. Every claim links to the real artifact.

**Avoid:**
1. Reveal-on-scroll that hides content by default (M2). Ours must be visible without JS.
2. Sub-44px touch targets (M1).
3. A 17-screen mobile page (M3).
4. Unoptimised images (M4).
5. A consent banner (we won't need one — no third-party analytics).
6. Shipping desktop cursor effects to touch devices (M8).
