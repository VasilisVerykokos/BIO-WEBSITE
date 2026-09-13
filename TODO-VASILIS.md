# TODO — Vasilis

**These are human tasks, not agent tasks.** The build proceeds around them using
visibly-labelled placeholders. Nothing here blocks *building*; the starred items block
*launching*.

Source: the blocker table at the end of [CONTENT.md](CONTENT.md), copied verbatim,
plus the exact placeholder strings each one has to replace.

---

## Blocker table (B1–B10)

| ID | Item | Owner |
|---|---|---|
| B1 | Make the Signal repo public with a real README | Vasilis |
| B2 | Huawei finals scale — teams and countries, both finals | Vasilis |
| B3 | AEGIS demo video — hostable file or unlisted link | Vasilis |
| B4 | Verify the TIF exhibition date (CV shows September 2026, out of order) | Vasilis |
| B5 | CRM migration count and test count | Vasilis |
| B6 | Decide: publish phone number, yes or no | Vasilis |
| B7 | Availability date for the hero status line | Vasilis |
| B8 | Portrait photo — 800px square minimum, or decide to omit | Vasilis |
| B9 | 2–3 clean screenshots per project, real data, no browser chrome | Vasilis |
| B10 | Domain purchase — `verykokos.dev` or similar | Vasilis |

---

## ★ The three that hard-stop launch

Per BUILD_PLAN Phase 0.3. The build does not stop for these; the deploy does.

- **★ B1 — a public repo must exist before the GitHub link goes live.**
  Right now every repo is private, so a GitHub link in the hero sends a reviewer to an
  empty profile. That is worse than no link. Signal is the one to open first: it has no
  secrets in it. The accounting platform must stay private — it handles live
  credentials, and saying so publicly is a *stronger* signal than a public repo.
- **★ B3 — the AEGIS demo video is the single highest-impact asset on the page.**
  A hostable file or an unlisted link. Without it, the strongest case study has nothing
  to show.
- **★ B8 — portrait photo, or an explicit decision to omit it.**
  800px square minimum. "Omit" is a legitimate answer; "not decided" is not, because the
  hero layout differs between the two.

---

## Where each value lands in the build

Every string below is live in the source as a visible `[[ ... ]]` placeholder. The
Phase 14 build guard greps `dist/` for `[[` and fails the build if any survive, so none
of these can ship by accident.

| ID | Placeholder in source | Section | Phase |
|---|---|---|---|
| B7 | `[[ AVAILABILITY DATE ]]` | Hero status line | 3 |
| B2 | `[[ B2 — 1st of N teams from M countries ]]` | Awards — Huawei World Final | 4 |
| B2 | `[[ B2 — N teams ]]` | Awards — Huawei European Final | 4 |
| B4 | `[[ B4 — DATE UNVERIFIED ]]` | Awards — Thessaloniki International Fair | 4 |
| B1 | `[[ REPO OR "private — available on request" ]]` | Work 01 — AEGIS links | 5 |
| B5 | `[[ N ]]` forward-only migrations | Work 02 — the hard part | 5 |
| B5 | `[[ N ]]` tests | Work 02 — the hard part | 5 |
| B11 | `[[ CONFIRM WHICH TO NAME PUBLICLY ]]` | Work 02 — government integrations | 5 |
| B6 | *(no placeholder — the number is simply omitted)* | Contact — phone number | 8 |

The three Awards strings are shortened from CONTENT.md's wording, which reads as
an instruction to you rather than as display copy — these render on the page, so
they carry the blocker id and the short form. The full note for B4 is: the CV
lists September 2026, which is out of sequence. Nothing was invented and nothing
was dropped.

**B11 is not in the original table** — it is a tenth `[[ ]]` found in CONTENT.md line 125.
Decide whether ΑΑΔΕ (myDATA), ΓΕΜΗ, and ΕΡΓΑΝΗ can all be named publicly, or only some.

---

## Placeholder assets used while these are open

Per BUILD_PLAN Phase 0.4 — every placeholder is an obvious grey box with a visible
label, never a stock photo that could survive to production.

| Asset | Placeholder | Clears on |
|---|---|---|
| Portrait | grey circle, label `PLACEHOLDER — B8` | B8 |
| Project screenshots | grey 16:10 boxes, label `PLACEHOLDER — B9` | B9 |
| AEGIS video poster | grey box, label `PLACEHOLDER — B3` | B3 |
| `cv.pdf` | one-page PDF reading `PLACEHOLDER — This is not the CV` at `/cv.pdf` | — |
| OG share card | generated from real type/palette, but carries the live copy | B2, B7 |

---

## Decisions made, not assumed

| Question | Decision | Where it is recorded |
|---|---|---|
| Accent colour | **Ember `#A8431C`** — confirmed 2026-09-13 | DESIGN_SYSTEM §1 |
| Phone number on site | **Omitted** — BUILD_PLAN Phase 8 publishes it only on a yes to B6, and B6 is open. Reversible: add a row to `contact.rows`. | Phase 8 |
| Open-source the accounting platform | **No** — handles live credentials | CONTENT.md § Work 02 |
| Contact form | **No** — plain-text `mailto:` | CONTENT.md § Contact |
| Dark theme | **Not in scope** — Phase 15 optional, only after everything else is green | BUILD_PLAN Phase 15.4 |

---

## Not blockers, but worth doing

- **Fix the CV** to match the rewritten description of the accounting platform. The CV
  currently calls it *"a CRM developed for personal use that runs locally."* That
  undersells it by an order of magnitude and costs interviews.
- The CV lists **Git twice** in the skills section. Fixed in CONTENT.md; fix it in the PDF too.
