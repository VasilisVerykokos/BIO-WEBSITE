# Bio site — plan package

Everything needed to build a personal site for **Vasileios Verykokos**, junior
full-stack developer, aimed at winning interviews.

## Start here

Read in this order:

| # | File | What it is |
|---|---|---|
| 1 | **[MOBILE_SPEC.md](MOBILE_SPEC.md)** | The highest-priority document. Mobile-first rules, touch targets, page-length budget, performance budget, and the full QA matrix. Read before writing any CSS. |
| 2 | **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** | Colour, type, spacing, components, motion. Every value is a token; nothing raw goes in a component. |
| 3 | **[CONTENT.md](CONTENT.md)** | The real copy, drafted from the CV. `[[ BRACKETS ]]` mark values Vasilis must supply. |
| 4 | **[ZIAKIS_AUDIT.md](ZIAKIS_AUDIT.md)** | Measured audit of ziakis.com — exact palette, type scale, layout, and its eight mobile failures, with a steal/avoid list. |
| 5 | **[BUILD_PLAN.md](BUILD_PLAN.md)** | The step-by-step build. 15 phases, each with acceptance criteria. Execute in order. |

## To run the build

Point a Claude Code agent at this folder with:

> Read every file in this folder, then execute BUILD_PLAN.md starting at Phase 0.
> Stop at the end of each phase and report the acceptance results before continuing.

## The short version

- **Stack:** Astro 5 + TypeScript + plain CSS, self-hosted fonts, deployed to Vercel. Zero JS by default, under 30KB when finished.
- **Look:** warm paper (`#FBF9F6`), near-black ink, one ember accent (`#A8431C`) used in exactly three roles. Light-weight serif headings, sans for labels, mono for anything technical. No shadows, no cards, no gradients.
- **Structure:** one long page — Hero → Awards → Work (3 case studies) → Skills → About → Education → Contact.
- **The core asset:** three case studies, each with a "the hard part" paragraph and a technical spec sheet. That paragraph is what separates Vasilis from every other junior applicant.
- **Mobile:** treated as the primary surface, not an adaptation. Every interactive element ≥44px, no content hidden behind JavaScript, page under 7,000px at 375px, Lighthouse mobile ≥95.

## What makes this win

The headline is **1st place at the Huawei ICT World Final in Shenzhen** — almost no
junior applicant has a global competition win. The site's job is to put that in front
of someone in the first two seconds, then back it up with three pieces of work that
prove real engineering: a Rothermel wildfire model running in a browser, a multi-tenant
platform handling other people's credentials, and a signal engine built as a state
machine so it doesn't cry wolf.

## Before it can launch

See the blocker table at the end of `CONTENT.md` (B1–B10). The three that matter most:
make one repo public, get the AEGIS demo video hostable, and find out how many teams
and countries were at those Huawei finals.
