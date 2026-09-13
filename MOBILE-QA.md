# Mobile QA record

Phase 10 hardening pass. Every number below was measured, not estimated.

| | |
|---|---|
| Date | 2026-09-13 |
| Build | `npm run build` → `astro preview`, gzip on |
| Browser | Chrome (stable channel), driven by Playwright |
| Machine | Windows 11, also running unrelated Docker containers — see the timing caveat |

**This record does not show every cell passing.** Page height fails at 320px and
375px. The reason is measured and set out at the bottom; it needs a content
decision, not more CSS.

---

## 1. The three console tests, at every width

`touch` is MOBILE_SPEC §2 (must be 0) · `overflow` is §3 (must be false) ·
`height` is §5.

| Viewport | Touch < 44px | Horizontal overflow | Page height | Budget |
|---|---|---|---|---|
| 320 × 568 | **0** | **false** | 8497px | ≤ 8000 — **FAIL by 497** |
| 360 × 800 | **0** | **false** | 7936px | — |
| 375 × 812 | **0** | **false** | 7797px | ≤ 7000 — **FAIL by 797** |
| 390 × 844 | **0** | **false** | 7638px | — |
| 414 × 896 | **0** | **false** | 7519px | — |
| 768 × 1024 | **0** | **false** | 6267px | — |
| 1024 × 768 | **0** | **false** | 8746px | — |
| 1440 × 900 | **0** | **false** | 9095px | — |
| 844 × 390 landscape | **0** | **false** | 6259px | — |

Touch targets and horizontal overflow pass everywhere, including the 320px hard
case and landscape.

MOBILE_SPEC §5 also caps scroll at **8.5 screens at 375px**, which is 6902px —
98px stricter than the pixel budget. We are at 9.6 screens.

---

## 2. Conditions

All at 375 × 812 unless noted.

| Condition | Touch | Overflow | Height | Result |
|---|---|---|---|---|
| JavaScript disabled | 0 | false | 7853px | **PASS** — 0 hidden elements, 5766 characters rendered |
| `prefers-reduced-motion: reduce` | 0 | false | 7797px | **PASS** — 0 hidden, 0 transitioning |
| Root `font-size: 24px` | 0 | false | 15180px | **PASS** — layout holds, no overflow |
| 200% browser zoom (188px viewport) | 0 | false | 13669px | **PASS** — 0 elements genuinely clipped |
| 400% zoom (94px viewport) | 0 | false | — | 24 elements clipped. Not a required criterion: WCAG 1.4.10 reflow is defined at 320 CSS px, which passes. |

On the 200% zoom check: a first pass reported 15 clipped elements. All fifteen
were the second screenshot in each scroll-snap strip — inside a horizontally
scrollable container and inside a closed `<details>`. MOBILE_SPEC §3 explicitly
allows a wide element to scroll inside its own container, and the content is
reachable. The detector was wrong, not the page; it now excludes scrollable
ancestors and collapsed disclosures. Genuinely clipped: **0**.

---

## 3. Performance snapshot

Slow 4G (1.6 Mbps down, 150ms RTT) with 4× CPU throttling.

| Measure | Value |
|---|---|
| First Contentful Paint | **800ms / 2000ms / 3568ms across three runs** |
| CSS fully downloaded | 522–544ms |
| DOMContentLoaded | 208–544ms, with 5740 characters of text already present |
| Total resource transfer | 218 KB |

**These numbers are too noisy to conclude from.** A 4.5× spread across identical
runs is the machine, not the site — it was serving from a local dev server while
also running unrelated containers. Two things are solid: the CSS is off the
critical path by ~540ms, and the text is in the DOM at DOMContentLoaded, so the
page is readable long before it is finished.

Blocking the fonts entirely moved FCP by under 200ms, so the two preloaded faces
are **not** what gates first paint.

Phase 12 owns the real numbers: Lighthouse mobile, three runs, median, against a
deployed build.

---

## 4. Not tested here

Stated plainly rather than marked as passing.

| Item | Why |
|---|---|
| Real device — open the deployed URL on an actual phone | Nothing is deployed yet. Vercel is Phase 14. Emulation misses momentum scrolling, sticky-header repaint, tap latency and font rendering, so this stays genuinely unverified. |
| LinkedIn / WhatsApp paste, OG preview renders | Needs a public URL *and* the share card, which is Phase 13. |
| VoiceOver (iOS) / TalkBack | Needs real hardware. Phase 11 covers the automated and desktop-screen-reader half. |
| Lighthouse mobile ≥ 95 | Phase 12. |
| Dark-mode OS setting | The page declares `color-scheme: light` and defines no dark palette, so there is nothing to verify beyond that declaration. |

---

## 5. The height failure

Page height is the one matrix cell that fails. It is not a spacing oversight —
this pass already removed 765px.

What was cut in this pass:

| Change | Saved |
|---|---|
| `--section-y` phone end, ~58px → 40px (desktop ceiling untouched) | 255px |
| `.project` block padding `--sp-7` → `--sp-5` | 144px |
| `.award` row padding `--sp-5` → `--sp-3` | 120px |
| Twelve smaller margin reductions across every section | ~246px |

Result: 8562px → **7797px** at 375px.

How much further the page can go, measured by progressively stripping it:

| | Height at 375px |
|---|---|
| As built | 7797px |
| All section padding removed | 7317px |
| …and the hero portrait removed | 7122px |
| …and the AEGIS video facade removed | 6857px |
| …and **every** block margin zeroed | 5685px |

So 7000px is reachable only by deleting the portrait and the video and most of
the remaining internal spacing — which removes the quiet, generous typography
the design system is built on, and contradicts ZIAKIS_AUDIT, which specifically
praises the reference site for *not* shrinking its portrait.

The honest read: **MOBILE_SPEC §5's 7000px budget was set against shorter copy
than CONTENT.md actually contains.** The three "hard part" paragraphs are
450–500 characters each and are the single most valuable thing on the page. They
are not the place to save pixels.

### Options, with measured costs

| | Change | Gets 375px to |
|---|---|---|
| **A** | Accept 7797px (9.6 screens) | — |
| **B** | Move the AEGIS video facade into the expander | **7532px** (measured) |
| **C** | B, plus drop the hero portrait on phones | **7337px** (measured) |
| **D** | Shorten the three "hard part" paragraphs by about a third | ~7000px (estimate — depends on the rewrite) |
| **E** | Two case studies instead of three | ~6800px (estimate) — contradicts MOBILE_SPEC §5 |

**Recommendation: A or B.** The budget exists to stop a recruiter giving up
before reaching Contact. At 7797px Contact is roughly six flicks away, which is
what §5's "≤ 6 flick gestures" actually asks for — and it is reached by a page
whose case studies still say something. D trades the site's strongest asset for
a number, and E trades a whole project for it.
