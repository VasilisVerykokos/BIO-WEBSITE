# Design system — Vasileios Verykokos, bio site

The visual contract. Every value here is a token. **No raw hex, px, or font name may
appear anywhere in a component file** — if you need a value that isn't here, add it
here first, then use the token.

Design intent in one line: *warm paper, quiet typography, one ember accent, and a
technical datasheet voice for anything that is code.*

---

## 1. Colour

Warm-paper family inherited from the ziakis.com study, re-tuned so it is distinctly
ours, with a **single ember accent** instead of blue. Ember is deliberate: it is rare
in developer portfolios (everyone uses blue or neon green), it reads warm and
confident rather than corporate, and it ties to the AEGIS wildfire work.

```css
:root {
  color-scheme: light;

  /* Surfaces — a 6% band of warm neutrals */
  --paper:        #FBF9F6;  /* base background */
  --paper-2:      #F6F2EC;  /* alternating section tint */
  --paper-3:      #F1ECE4;  /* header, footer, deepest tint */
  --paper-sunken: #EFEAE2;  /* inset blocks, code chips */

  /* Ink */
  --ink:          #17171A;  /* headings, primary text */
  --ink-2:        #45454C;  /* body copy */
  --ink-3:        #6B6A66;  /* secondary meta */
  --muted:        #8C8A84;  /* eyebrow labels, dates, captions */

  /* Structure */
  --line:         #E3DDD5;  /* hairline rules */
  --line-strong:  #CFC7BC;  /* emphasised divider, focus outline base */

  /* Accent — used in exactly three roles, see §1.1 */
  --accent:       #A8431C;  /* ember */
  --accent-hover: #8A3514;
  --accent-soft:  #FBEFE8;  /* wash background */

  /* Semantic */
  --focus:        #A8431C;
  --selection-bg: #FBEFE8;
}
```

### 1.1 Accent discipline — the anti-sloppiness rule

The accent appears in **exactly three roles** and nowhere else:

1. The surname in the hero (serif italic, like Ziakis does with blue).
2. Link underlines and their hover state.
3. The section number / active nav marker.

It never becomes a button fill, a background block, a border on everything, or a
second heading colour. **Restraint is what reads as expensive.** A reviewer should be
able to count the accent occurrences on a screen on one hand.

### 1.2 Section tints

Alternate down the page so the scroll has rhythm without visible dividers:

| Section | Background |
|---|---|
| Header | `--paper-3` |
| Hero | `--paper` |
| Awards | `--paper-2` |
| Work | `--paper` |
| Skills | `--paper-2` |
| About | `--paper` |
| Education | `--paper-2` |
| Contact | `--paper-3` |
| Footer | `--paper-3` |

### 1.3 Contrast — non-negotiable

All of these must be verified with a contrast checker during the a11y phase:

| Pair | Ratio | Requirement |
|---|---|---|
| `--ink` on `--paper` | ~16.9:1 | AAA |
| `--ink-2` on `--paper` | ~9.2:1 | AAA |
| `--ink-3` on `--paper` | ~5.3:1 | AA normal text |
| `--muted` on `--paper` | ~3.4:1 | **AA large/UI text only** — never for body copy |
| `--accent` on `--paper` | ~5.4:1 | AA normal text |

`--muted` is for uppercase eyebrow labels at ≥14px/600 and for dates. Never a paragraph.

---

## 2. Typography

Three families. Each has one job. Self-hosted (see BUILD_PLAN Phase 1) — no external
font requests.

| Family | Role | Weights | Subsets |
|---|---|---|---|
| **Newsreader** (variable serif) | Hero, all headings, long prose | 300–500 + italic | latin, latin-ext, **greek** |
| **Inter** (variable sans) | Nav, eyebrow labels, meta, UI, tags | 400, 500, 600 | latin, latin-ext, greek |
| **JetBrains Mono** | Stack tags, metrics, spec-sheet values, code | 400, 500 | latin only |

Greek subsets are required — project names include ΑΑΔΕ / ΓΕΜΗ / ΕΡΓΑΝΗ.

The mono face is the **developer signature**: it is what makes this read as an
engineer's site rather than an academic's. Use it only for things that are literally
technical (stack names, numbers, metrics, file paths), never for prose.

### 2.1 Fluid type scale

Every size is `clamp()`. No fixed heading sizes anywhere — this is how the mobile
layout stays right at 320px without a pile of media queries.

```css
:root {
  --fs-hero:    clamp(2.75rem, 1.6rem + 5.6vw, 5.25rem);  /*  44 →  84px */
  --fs-h2:      clamp(1.75rem, 1.4rem + 1.6vw, 2.5rem);   /*  28 →  40px */
  --fs-h3:      clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem);   /*  20 →  24px */
  --fs-lead:    clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem);/* 18 →  22px */
  --fs-body:    clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);/* 17 →  19px */
  --fs-small:   0.9375rem;  /* 15px */
  --fs-label:   0.8125rem;  /* 13px — uppercase eyebrows */
  --fs-mono:    0.875rem;   /* 14px */
}
```

**Body text never goes below 17px.** (ziakis.com drops to 16px; we do not — long
serif prose on a phone needs the extra point, and 17px keeps tap-to-read comfortable.)

### 2.2 Type rules

```css
--lh-tight:  1.12;   /* hero */
--lh-head:   1.25;   /* h2, h3 */
--lh-body:   1.75;   /* paragraphs — generous, per the audit */
--lh-ui:     1.4;    /* nav, labels, tags */

--tracking-hero:  -0.02em;
--tracking-label:  0.12em;  /* uppercase eyebrows */
--tracking-mono:   0.01em;
```

- Headings are **weight 400–500. Never 600+.** Light serif at size is the whole look.
- Eyebrow labels: Inter, 13px, uppercase, `letter-spacing: 0.12em`, `--muted`.
- Prose measure capped at `--measure: 68ch`. Never let a paragraph run the full 960px.
- Never centre a paragraph longer than two lines.
- Hyphenation off; `text-wrap: pretty` on paragraphs, `text-wrap: balance` on headings.

---

## 3. Spacing

One 4px-based scale. Nothing outside it.

```css
--sp-1:  0.25rem;  /*  4px */
--sp-2:  0.5rem;   /*  8px */
--sp-3:  0.75rem;  /* 12px */
--sp-4:  1rem;     /* 16px */
--sp-5:  1.5rem;   /* 24px */
--sp-6:  2rem;     /* 32px */
--sp-7:  3rem;     /* 48px */
--sp-8:  4rem;     /* 64px */
--sp-9:  6rem;     /* 96px */
--sp-10: 8rem;     /* 128px */

/* Fluid section rhythm — tighter on phones, airy on desktop */
--section-y: clamp(3.5rem, 2rem + 7vw, 7rem);
--gutter:    clamp(1.25rem, 0.75rem + 2.5vw, 2.5rem);
--max:       61.25rem;  /* 980px container */
--measure:   68ch;      /* prose line length cap */
```

Vertical rhythm inside a section: eyebrow → `--sp-3` → heading → `--sp-5` → body →
`--sp-7` → next block.

---

## 4. Components

### 4.1 Section shell
Eyebrow label, heading, optional one-line deck, then content. Every section gets
`scroll-margin-top: calc(var(--header-h) + var(--sp-4))` so anchor jumps clear the
sticky header.

### 4.2 Link
Body links: `--ink` text, 1px underline in `--line-strong`, `text-underline-offset:
0.2em`. On hover/focus the text and underline go `--accent`. Transition `color .15s,
border-color .15s` — matching the restraint measured on ziakis.com. No animated
underline slides.

### 4.3 Spec sheet (the signature component)
Each case study carries a datasheet block — hairline-ruled rows, label in Inter
uppercase `--muted`, value in JetBrains Mono `--ink`:

```
ROLE     Sole developer — full interface
STACK    React · Leaflet · Turf.js · Web Speech API
DATA     ASTER 30 m DEM · Open-Meteo · NASA FIRMS
SCOPE    4-hour spread prediction · 6 languages
```

This is what makes the page read as engineering. On mobile it becomes stacked
label-over-value rows, **not** a squeezed two-column grid.

### 4.4 Tag
Mono, 13px, `--paper-sunken` background, `--ink-2` text, 4px radius, `--sp-1 --sp-2`
padding. No borders. Used for stack items only.

### 4.5 Award row
Three parts: title (serif, `--fs-h3`), one-line context (`--ink-2`), date (mono,
`--muted`). Desktop: title left, date right on the same baseline. Mobile: date moves
above the title as a small mono line — never let the date wrap under a truncated title.

### 4.6 Numbered entry
`01`–`03` in mono, `--accent`, aligned to the heading's first baseline — directly
adapted from the `01`–`05` treatment on ziakis.com.

### 4.7 Elevation
**There are no shadows on this site.** Separation comes from the tint ladder and
hairline rules. One exception: the mobile menu sheet may use a single soft shadow
(`0 8px 32px rgb(23 23 26 / 0.12)`) because it overlays content. One shadow, one place.

### 4.8 Radius
`--radius: 4px` for chips and inputs, `--radius-lg: 8px` for media, `50%` for the
portrait. Nothing else.

### 4.9 Focus
```css
:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 3px;
  border-radius: 2px;
}
```
Never `outline: none` without a visible replacement.

---

## 5. Motion

```css
--dur-fast:  150ms;   /* colour, border */
--dur-base:  300ms;   /* menu, small transforms */
--dur-slow:  600ms;   /* scroll reveals */
--ease:      cubic-bezier(0.22, 0.61, 0.36, 1);
```

Rules:
1. Motion is **decoration only**. No content may depend on it (see ZIAKIS_AUDIT M2).
2. Reveals: `opacity` + `translateY(12px)` only. No scale, rotate, blur, or stagger
   longer than 60ms per item.
3. `@media (prefers-reduced-motion: reduce)` sets every duration to `0.01ms` and
   removes transforms. Mandatory.
4. No parallax, no scroll-jacking, no cursor followers on touch devices, no
   marquees, no typewriter effects, no particle backgrounds.

---

## 6. Anti-sloppiness checklist

A reviewer should be unable to find any of these:

- [ ] More than one accent hue on the page
- [ ] A shadow anywhere except the mobile menu sheet
- [ ] A heading at weight 600 or above
- [ ] More than 3 distinct font sizes visible in one section
- [ ] A hard-coded hex, px, or font-family in a component file
- [ ] A paragraph wider than `--measure`
- [ ] Centred body copy longer than two lines
- [ ] Inconsistent vertical gaps between sections
- [ ] A skill percentage bar or star rating
- [ ] Mixed date formats (pick `June 2026` and use it everywhere)
- [ ] Mixed dash characters (use `—` for em-dash, never a raw hyphen as a separator)
- [ ] An icon set with mismatched stroke weights (prefer no icons at all)
- [ ] Placeholder or lorem text in a shipped build
