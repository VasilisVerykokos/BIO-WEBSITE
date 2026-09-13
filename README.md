# Personal site — Vasileios Verykokos

![Vasileios Verykokos — full-stack developer. First place, Huawei ICT Competition World Final 2026, Shenzhen.](docs/preview.png)

A single-page site for **Vasileios Verykokos**, full-stack developer.

---

## What it is for

This site has one job: get me an interview.

A recruiter gives a portfolio somewhere between ten and thirty seconds before
deciding whether to keep reading. More than half of them open it on a phone,
between meetings or on a train. So the site is built to answer three questions in
that window — what has he actually done, can he actually build things, and how do
I reach him — and to answer them on a 320px screen with no JavaScript.

The headline is first place at the **Huawei ICT Competition World Final 2026** in
Shenzhen. Behind it sit three case studies, each written around one paragraph
called *the hard part*: not what the project was, but the specific engineering
problem I had to solve and how I solved it. A wildfire spread model running
client-side in a browser. A multi-tenant platform that stores other firms' tax
credentials. A signal engine built as a state machine so it fires on transitions
instead of crying wolf every day.

**The repository is part of the portfolio.** If you are evaluating me as an
engineer, the code here is meant to be read — that is why the commit history is
one commit per phase, why every acceptance number below was measured rather than
estimated, and why the trade-offs section exists.

## The numbers

Measured, not aspirational. Lighthouse mobile, median of three runs, against the
production build.

| | | Budget |
|---|---|---|
| Lighthouse Performance | **100** | ≥ 95 |
| Lighthouse Accessibility | **100** | 100 |
| Lighthouse Best Practices | **100** | 100 |
| Lighthouse SEO | **100** | 100 |
| Cumulative Layout Shift | **0.000** | < 0.05 |
| JavaScript shipped | **981 B** gzipped | < 30 KB |
| First visit, total | **121 KB** over 8 requests | < 500 KB |
| Self-hosted fonts | **102 KB** on disk, subsetted from 210 KB | < 120 KB |
| Third-party requests | **0** | 0 |
| axe-core violations | **0** | 0 |
| Touch targets below 44px | **0** at every width from 320px to 1440px | 0 |
| Horizontal overflow | **none** at any width, portrait or landscape | none |

The whole page is 121 KB, and 104 KB of that is the three typefaces. A single
unoptimised hero photograph on an average portfolio is usually larger than the
entire site.

## How it is built

| Choice | Why |
|---|---|
| **Astro 7**, static output | Ships zero JavaScript by default. Every byte of script on the page had to be argued for; 981 of them survived. |
| **TypeScript**, strict | `astro check` and `tsc --noEmit` run clean on every commit. |
| **Plain CSS**, cascade layers | 30 KB for the entire site, 5.8 KB over the wire. No utility framework, no `!important`, no specificity fights — `@layer` makes the cascade order explicit and it is never overridden. |
| **Design tokens** | Every colour, size, space and duration is a custom property in one file. No raw hex, pixel value or font name appears in any component. It is greppable, and the grep returns nothing. |
| **Self-hosted fonts**, subsetted | Three families, glyph-subsetted and with their variable weight axes clamped to the weights actually used. 210 KB → 102 KB. Zero requests to Google. |
| **`astro:assets`** | Every image emits AVIF, WebP and a JPEG fallback with a correct `srcset` and explicit dimensions — which is why CLS is 0.000. |
| **Docker**, multi-stage | Node builds, unprivileged nginx serves. The runtime image contains no Node, no npm and no source. Read-only root filesystem, all capabilities dropped, runs as UID 101. |

## Accessibility is a requirement, not a checkbox

- **Zero axe-core violations** across four states: mobile, mobile with the menu
  open, mobile with every disclosure expanded, and desktop.
- **The page works with JavaScript disabled.** Not degraded — every word of all
  three case studies is reachable, the navigation works, and nothing is hidden.
  The scroll-reveal animation defaults to *visible* and only opts into hiding
  once a script has proven it is running.
- **Full keyboard operation**, verified: 22 tab stops, a visible focus ring on
  every one, a focus trap in the open menu and nowhere else, and focus returning
  to the button on close.
- **Contrast verified against the real palette**, which caught a genuine failure:
  the specified muted grey was 3.28:1 where WCAG AA needs 4.5:1, on 31 elements.
  It was darkened until it passed on every surface it appears on.
- `prefers-reduced-motion` removes all motion and leaves nothing hidden.

## Running it

```bash
npm install
npm run dev          # http://localhost:4321
```

```bash
npm run build        # subsets the fonts, then builds to dist/
npm run check        # astro check + tsc --noEmit
npm run lint         # eslint, with the a11y rules set to error
npm run a11y:ci      # build, serve, axe-core, stop
npm run lhci         # Lighthouse CI against the performance budgets
```

Or without a Node toolchain at all:

```bash
docker compose up --build          # production image → http://localhost:8081
docker compose --profile dev up    # dev server with hot reload
```

## Trade-offs, stated plainly

Every project has them. These are mine, with the measurements that produced them.

- **The page is 7797px tall on a 375px screen, against a 7000px budget I set
  myself.** I measured what it would take to close the gap: deleting the portrait,
  deleting the demo video, and stripping most of the remaining spacing. That buys
  a number at the cost of the typography and one of the strongest artifacts on the
  page. I kept the content and missed the budget, and I would rather show the
  measurement than quietly move the target.
- **Largest Contentful Paint is 1.81s against a 1.8s budget** under Lighthouse's
  simulated throttling. Under real emulated Slow 4G with 4× CPU throttling the
  same element paints at 1.24s. I tried inlining the stylesheet (worse: 1.96s) and
  dropping the font preloads (no gain, and it broke CLS). Both experiments are in
  the commit history rather than deleted.
- **No dark theme.** A good light site beats a half-finished pair, and a second
  theme doubles the QA surface for every one of the numbers above.
- **The accounting platform's source is private, deliberately.** It handles live
  credentials and government-portal integration. There is an architecture
  write-up instead. Knowing what not to open-source is the point.

## Structure

```
src/
  components/     one component per section, each owning its own scoped CSS
  content/        the three case studies, as typed and validated data
  layouts/        the document shell — head, header, footer, skip link
  lib/            copy and site constants, kept out of the markup
  styles/         tokens, reset, base, components — four cascade layers
scripts/          font subsetting, Open Graph card generation
docker/           multi-stage build and the nginx config
```

Case studies live in a typed content collection with a Zod schema. A missing
field or a "hard part" paragraph under 200 characters **fails the build** — the
core asset of the site cannot be quietly half-written.

---

Built by Vasileios Verykokos · [verykokosvasileios@gmail.com](mailto:verykokosvasileios@gmail.com)
