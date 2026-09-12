# Content — draft copy, ready to place

Source: `Verykokos_Vasilis_CV_EN.pdf`. This is the real copy for the build, written to
be scanned in 20 seconds and read in two minutes.

Anything in `[[ DOUBLE BRACKETS ]]` is a **blocker** — Vasilis must supply the value
before launch. The agent should leave the bracket visible in the source so it cannot
be shipped by accident, and add a build-time check that fails if any remain (see
BUILD_PLAN Phase 14).

---

## Hero

**Name:** Vasileios Verykokos

**Eyebrow:** `FULL-STACK DEVELOPER — JAVA · SPRING BOOT · REACT`

**Positioning line (h1 sub / lead):**
> First place, Huawei ICT Competition World Final 2026 — Shenzhen.

**Deck (2–3 lines, `--fs-lead`):**
> Applied Informatics graduate from the University of Macedonia. I build systems that
> model something real: wildfire spread over live terrain data, a multi-tenant
> accounting platform wired into Greek government APIs, and a market-signal engine
> that only speaks when something has actually changed.

**Status line (mono, `--muted`):**
> Larissa · Athens · Thessaloniki · open to remote — Military obligations fulfilled — Available `[[ AVAILABILITY DATE ]]`

**Actions (4 max):**
- Download CV (PDF)
- GitHub — `github.com/VasilisVerykokos`
- LinkedIn — `linkedin.com/in/vasilis-verykokos`
- Email — `verykokosvasileios@gmail.com`

> ⚠️ The GitHub link must not go live while every repo is private. See BUILD_PLAN
> Phase 0, blocker B1.

---

## Awards

Section eyebrow: `RECOGNITION`
Heading: **Competition results**

| Award | Context | Date |
|---|---|---|
| **1st place — Huawei ICT Competition, World Final** | Innovation Track. Shenzhen, China, with team AEGIS. `[[ 1st of N teams from M countries ]]` | June 2026 |
| **1st place — Huawei ICT Competition, European Final** | Innovation Track, with team AEGIS. `[[ N teams ]]` | May 2026 |
| **1st place — "Unboxed by PwC" AI Hackathon** | With team AEGIS. | December 2025 |
| **Exhibitor — Thessaloniki International Fair** | Showcased AEGIS with the team. | `[[ VERIFY DATE — the CV lists September 2026, out of sequence ]]` |
| **Scholarship — Municipality of Larissa** | For academic performance at secondary school and university. | 2021 — present |

Get the "1st of N teams from M countries" figures. *"First place"* is good. *"First of
340 teams from 80 countries"* is a different conversation.

---

## Work — three case studies

Each uses the same structure: number, title, one-line problem, "the hard part"
paragraph, spec sheet, links.

### 01 — AEGIS

**Crisis management platform** · 2025–2026 · Sole developer of the entire interface

**Problem**
> An operations centre for rescue teams, plus a companion app that lets citizens
> report incidents — built for the Huawei ICT Competition Innovation Track and taken
> to first place at both the European and World finals.

**The hard part**
> Predicting where a wildfire goes next, in a browser, with no server behind it. I
> implemented the Rothermel spread model with slope correction, feeding it 30-metre
> elevation data from ASTER and hourly wind forecasts from Open-Meteo, then used
> Turf.js to turn the model output into geometry the map could actually draw:
> four-hour prediction zones, directional fire rays, and downwind ember-spotting
> polygons. It runs entirely client-side, so the operations centre keeps working when
> connectivity doesn't.

**Also built**
- Tactical Leaflet map — drawing tools, route plotting, heatmaps, live satellite fire hotspots from NASA FIRMS
- Voice control in six languages via the Web Speech API
- Edited the demo videos presented at the European and World finals

**Spec sheet**
```
ROLE     Sole developer — full interface, both applications
STACK    React · Leaflet · Turf.js · Web Speech API
DATA     ASTER 30 m DEM · Open-Meteo · NASA FIRMS
MODEL    Rothermel spread with slope correction, 4-hour horizon
SCOPE    Operations centre + citizen companion app · 6 languages
RESULT   1st place — Huawei ICT World Final, Shenzhen
```

**Links:** demo video · `[[ REPO OR "private — available on request" ]]` · screenshots

---

### 02 — Accounting practice platform

**Multi-tenant CRM for Greek accounting firms** · 2025–2026 · Solo

> ⚠️ Rewrite note: the CV currently calls this *"a CRM developed for personal use that
> runs locally."* That undersells it by an order of magnitude and costs interviews.
> Describe what it actually is. Fix the CV to match.

**Problem**
> Greek accounting practices juggle client records, documents, recurring statutory
> deadlines, and half a dozen government portals. I built the system that holds all of
> it in one place — a multi-tenant platform where each firm's data, credentials, and
> users are strictly isolated.

**The hard part**
> Not the CRUD — it was that every firm on the platform stores other people's tax
> credentials. That forced encrypted credential storage with audited, just-in-time
> reveal; tenant scoping enforced on every query rather than trusted at the UI;
> role-based access down to individual fields; and an append-only audit trail. The
> schema moves through `[[ N ]]` forward-only migrations so a deploy never requires
> downtime, and `[[ N ]]` tests run on every change.

**Also built**
- Integrations with Greek government services — ΑΑΔΕ (myDATA), ΓΕΜΗ, ΕΡΓΑΝΗ `[[ CONFIRM WHICH TO NAME PUBLICLY ]]`
- Server-side PDF generation with per-tenant branding
- Excel import wizard with per-row partial success and validation feedback
- Real-time status updates over WebSocket
- Keyboard-accessible UI — focus-trapped dialogs, skip navigation, automated a11y checks in development

**Spec sheet**
```
ROLE     Solo — backend, two frontends, schema, deployment
BACKEND  Java 21 · Spring Boot · REST · JWT · JUnit · Maven
FRONTEND React 19 · TypeScript · Vite
DATA     PostgreSQL · Flyway migrations · Supabase storage
INFRA    Docker Compose · reverse proxy
SCALE    Multi-tenant · role-based access · append-only audit log
```

**Links:** architecture write-up · screenshots · *source private — handles live credentials*

> **Do not open-source this repository.** It contains credential-handling code and
> government-portal integration. Publish an architecture write-up and screenshots
> instead. That is a *stronger* signal than a public repo, not a weaker one — it shows
> judgement about what belongs in public.

---

### 03 — Signal

**Stock technical-analysis dashboard** · 2026 · Solo

**Problem**
> A dashboard that watches a watchlist of symbols and tells you when something
> actually changed — not one that repeats the same alert every day.

**The hard part**
> A naive indicator dashboard says "RSI is overbought" every day until it isn't, which
> trains you to ignore it. I built the signal engine as a state machine over the
> indicator series: it fires on *transitions* — a moving-average crossover, a MACD
> cross, the moment price crosses into an overbought band — and stays silent while a
> condition merely persists. All 14 indicators are implemented from scratch rather
> than pulled from a library, which is the only way I'd trust the transition
> boundaries.

**Also built**
- 14 indicators from scratch — RSI, MACD, Bollinger Bands, Stochastic, and others
- Live prices from the Twelve Data API with a CSV path for offline use
- Symbol comparison, watchlist, date filtering, chart export

**Spec sheet**
```
ROLE     Solo
STACK    React · TypeScript · Recharts
DATA     Twelve Data API · CSV fallback
CORE     14 indicators implemented from scratch
DESIGN   Transition-triggered signal engine — no repeat alerts
```

**Links:** live demo · **public repo** ← make this one public first (no secrets in it)

---

## Skills

Section eyebrow: `TOOLS`
Heading: **What I work with**

```
LANGUAGES   Java · Python · TypeScript · JavaScript · SQL · C
BACKEND     Spring Boot · REST APIs · JWT · JUnit · Maven
FRONTEND    React · Vite · Tailwind CSS · Leaflet · Recharts
DATA        PostgreSQL · Supabase · Pandas · NumPy
TOOLS       Git · Docker · Linux · BPMN · DMN
```

Plain grouped text. **No proficiency bars, no percentages, no star ratings, no logo
grid.** (The CV lists Git twice — fixed here.)

---

## About

Section eyebrow: `ABOUT`

> I finished Applied Informatics at the University of Macedonia in 2026 with a GPA of
> 8.23, specialising in information systems. Most of what I've learned came from
> building things that had to work in front of judges or in front of a real user, on
> a deadline — a wildfire model that had to render in seconds, a platform that had to
> keep one firm's data away from another's.
>
> I'm drawn to problems where the software has to model something real and be honest
> about uncertainty. I'm equally happy in a Spring Boot service or a React interface,
> and I'm actively working toward AI/ML.
>
> Outside work: music, team sports, travel, and the friends who put up with me talking
> about fire-spread models.

*(Trim to taste — keep it under 120 words. Specific beats polished.)*

---

## Education & background

```
2022 — 2026   University of Macedonia, Thessaloniki
              BSc Applied Informatics — Information Systems · GPA 8.23

2022 — 2023   Seasonal summer employment, water park — tourism entertainment company

              English — C2, Certificate of Proficiency
              Military obligations — fulfilled
```

---

## Contact

Section eyebrow: `CONTACT`
Heading: **Get in touch**

> I'm looking for a junior role in frontend, backend, or AI/ML — in Larissa, Athens,
> Thessaloniki, or remote. The fastest way to reach me is email.

```
EMAIL      verykokosvasileios@gmail.com
PHONE      +30 698 487 5674        [[ CONFIRM: publish publicly or email-only? ]]
LINKEDIN   linkedin.com/in/vasilis-verykokos
GITHUB     github.com/VasilisVerykokos
CV         /cv.pdf
```

Plain text links, as on ziakis.com. **No contact form.**

> Publishing a phone number invites recruiter spam and cannot be undone once indexed.
> Recommendation: email and LinkedIn on the site; keep the phone number on the CV PDF
> only. Vasilis decides.

---

## Meta / SEO copy

- **`<title>`:** `Vasileios Verykokos — Full-Stack Developer`
- **Meta description (155 chars):**
  `Full-stack developer — Java, Spring Boot, React. First place at the Huawei ICT World Final 2026. Applied Informatics, University of Macedonia.`
- **OG image:** 1200×630, name + one line + the Shenzhen result, built from the same
  type and palette as the site.
- **`lang="en"`**

---

## Blockers to resolve before launch

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
