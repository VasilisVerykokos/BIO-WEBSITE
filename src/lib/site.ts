/**
 * Site-wide constants.
 *
 * Copy lives in data rather than in markup so it can be edited without opening
 * a layout file. Project case studies get their own typed content collection in
 * Phase 5; this module holds only what the shell needs.
 */

export const site = {
  title: 'Vasileios Verykokos — Full-Stack Developer',
  name: 'Vasileios Verykokos',
  description:
    'Full-stack developer — Java, Spring Boot, React. First place at the Huawei ICT World Final 2026. Applied Informatics, University of Macedonia.',
  lang: 'en',

  /**
   * Mirrors --paper-3 in tokens.css.
   *
   * This is the one value on the site that has to exist in two places. A
   * <meta name="theme-color"> cannot read a custom property, so the hex must
   * be literal somewhere. It is here, named and commented, rather than inline
   * in the layout — and tokens.css carries a note pointing back at it. If
   * --paper-3 ever changes, both change together.
   */
  themeColor: '#f1ece4',
} as const;

/** Header and mobile-sheet navigation. Order matches the page order. */
export const navItems = [
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
] as const;

/**
 * The four hero/footer actions, from CONTENT.md § Hero.
 *
 * The GitHub entry is live in the markup but must not ship while every
 * repository is private — that is blocker B1, tracked in TODO-VASILIS.md, and
 * it gates launch rather than the build.
 */
export const profileLinks = [
  { href: '/cv.pdf', label: 'Download CV', text: 'CV (PDF)' },
  {
    href: 'https://github.com/VasilisVerykokos',
    label: 'GitHub profile',
    text: 'github.com/VasilisVerykokos',
  },
  {
    href: 'https://linkedin.com/in/vasilis-verykokos',
    label: 'LinkedIn profile',
    text: 'linkedin.com/in/vasilis-verykokos',
  },
  {
    href: 'mailto:verykokosvasileios@gmail.com',
    label: 'Email Vasileios Verykokos',
    text: 'verykokosvasileios@gmail.com',
  },
] as const;

/**
 * Hero copy, from CONTENT.md § Hero.
 *
 * `[[ AVAILABILITY DATE ]]` is blocker B7 and is left in the string on purpose.
 * CONTENT.md asks for the brackets to stay visible in the source so the value
 * cannot ship by accident, and the Phase 14 build guard greps dist/ for `[[`
 * and fails the build if any survive. Do not replace it with a guess.
 */
export const hero = {
  eyebrow: 'Full-stack developer — Java · Spring Boot · React',
  givenName: 'Vasileios',
  familyName: 'Verykokos',
  positioning: 'First place, Huawei ICT Competition World Final 2026 — Shenzhen.',
  /**
   * Split at the sentence boundary so phones can show the second sentence
   * alone. Not a rewrite — both halves are CONTENT.md's words, unedited. The
   * lead sentence is the one that repeats in About and Education, which is why
   * it is the half that gives way when vertical space is short.
   */
  deck: {
    lead: 'Applied Informatics graduate from the University of Macedonia.',
    body: 'I build systems that model something real: wildfire spread over live terrain data, a multi-tenant accounting platform wired into Greek government APIs, and a market-signal engine that only speaks when something has actually changed.',
  },
  status: [
    'Larissa · Athens · Thessaloniki · open to remote',
    'Military obligations fulfilled',
    'Available [[ AVAILABILITY DATE ]]',
  ],
} as const;

/**
 * The four hero actions. Short labels here; the footer carries the full URLs.
 * Exactly one is primary — the CV — and it is the only one that takes the
 * accent underline, which is accent role 2 of the three permitted.
 */
export const heroActions = [
  { href: '/cv.pdf', text: 'Download CV', primary: true, label: 'Download CV as PDF' },
  {
    href: 'https://github.com/VasilisVerykokos',
    text: 'GitHub',
    primary: false,
    label: 'GitHub profile',
  },
  {
    href: 'https://linkedin.com/in/vasilis-verykokos',
    text: 'LinkedIn',
    primary: false,
    label: 'LinkedIn profile',
  },
  {
    href: 'mailto:verykokosvasileios@gmail.com',
    text: 'Email',
    primary: false,
    label: 'Email Vasileios Verykokos',
  },
] as const;

/**
 * Awards, from CONTENT.md § Awards.
 *
 * Bracketed strings are blockers and stay visible in the source and on the
 * page so they cannot ship unnoticed — the Phase 14 guard greps dist/ for `[[`.
 * They are shortened from CONTENT.md's wording, which is written as an
 * instruction to Vasilis rather than as display copy: the full note for each
 * one lives in TODO-VASILIS.md. Nothing is invented, and each keeps its
 * blocker id so the two files stay traceable to each other.
 *
 * `featured` marks the single strongest credential on the page. It is the only
 * place --accent-soft is used anywhere on the site.
 */
export const awards = [
  {
    title: '1st place — Huawei ICT Competition, World Final',
    context:
      'Innovation Track. Shenzhen, China, with team AEGIS. [[ B2 — 1st of N teams from M countries ]]',
    date: 'June 2026',
    featured: true,
  },
  {
    title: '1st place — Huawei ICT Competition, European Final',
    context: 'Innovation Track, with team AEGIS. [[ B2 — N teams ]]',
    date: 'May 2026',
    featured: false,
  },
  {
    title: '1st place — "Unboxed by PwC" AI Hackathon',
    context: 'With team AEGIS.',
    date: 'December 2025',
    featured: false,
  },
  {
    title: 'Exhibitor — Thessaloniki International Fair',
    context: 'Showcased AEGIS with the team.',
    date: '[[ B4 — DATE UNVERIFIED ]]',
    featured: false,
  },
  {
    title: 'Scholarship — Municipality of Larissa',
    context: 'For academic performance at secondary school and university.',
    date: '2021 — present',
    featured: false,
  },
] as const;
