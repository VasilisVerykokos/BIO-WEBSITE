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
 * Hero copy, from CONTENT.md § Hero.
 *
 * `status` was three fragments joined with em-dashes: two cities plus
 * Thessaloniki, military status, and an availability date that was still an
 * open blocker (`[[ AVAILABILITY DATE ]]`). Per Vasilis: drop Thessaloniki and
 * drop availability entirely, and clean up what's left. Thessaloniki already
 * appears in Contact's own line, and the unresolved bracket read as an
 * obviously-unfinished page in a screenshot. A single string now, one
 * separator style throughout instead of interpunct-then-em-dash.
 */
export const hero = {
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
  status: 'Larissa · Athens · open to remote · Military obligations fulfilled',
} as const;

/**
 * The three hero actions. Short labels here; Contact carries the full
 * addresses, including the email as its actual, clickable text — see
 * `contact` below. Exactly one is primary — the CV — and it is the only one
 * that takes the accent underline, which is accent role 2 of the three
 * permitted.
 *
 * Email used to be a fourth action here, a bare "Email" label with no address
 * visible until tapped. Per Vasilis: he wanted his address as text, not
 * hidden behind a vague link — but a plain non-clickable word sitting next to
 * three real buttons would read as a broken button, and the full address is
 * too long to sit comfortably in this short-label row. Dropped instead; the
 * address is one scroll away in Contact, spelled out and still tappable.
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
] as const;

/**
 * Awards, from CONTENT.md § Awards.
 *
 * Bracketed strings are unresolved blockers and stay visible in the source
 * and on the page so they cannot ship unnoticed — the Phase 14 guard greps
 * dist/ for `[[`. They are shortened from CONTENT.md's wording, which is
 * written as an instruction to Vasilis rather than as display copy. Nothing
 * is invented, and each keeps its blocker id.
 *
 * B4 (the Thessaloniki International Fair date) is resolved: Vasilis
 * confirmed September 2026 as written, not a typo. It stays fourth in this
 * list, after two events that happened earlier in the same year — the order
 * here is importance, not chronology, which is also why the World Final leads
 * despite being neither the earliest nor (now) the most recent date. See
 * `featured` below.
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
    date: 'September 2026',
    featured: false,
  },
  {
    title: 'Scholarship — Municipality of Larissa',
    context: 'For academic performance at secondary school and university.',
    date: '2021 — present',
    featured: false,
  },
] as const;

/**
 * Skills, from CONTENT.md § Skills.
 *
 * Plain grouped text. No proficiency bars, no percentages, no star ratings, no
 * logo grid, no years-of-experience counters — BUILD_PLAN Phase 6 forbids all
 * of them, and they are the fastest way to make a portfolio look junior.
 *
 * (The CV lists Git twice. It appears once here.)
 */
export const skillGroups = [
  {
    label: 'Languages',
    items: ['Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'C'],
  },
  {
    label: 'Backend',
    items: ['Spring Boot', 'REST APIs', 'JWT', 'JUnit', 'Maven'],
  },
  {
    label: 'Frontend',
    items: ['React', 'Vite', 'Tailwind CSS', 'Leaflet', 'Recharts'],
  },
  {
    label: 'Data',
    items: ['PostgreSQL', 'Supabase', 'Pandas', 'NumPy'],
  },
  {
    label: 'Tools',
    items: ['Git', 'Docker', 'Linux', 'BPMN', 'DMN'],
  },
] as const;

/**
 * About, from CONTENT.md § About, verbatim.
 *
 * CONTENT.md suggests keeping this under 120 words. As written it is slightly
 * over; the words are Vasilis's and trimming them is an editorial call that
 * belongs to him, so it ships whole and the exact count is in the Phase 7
 * report.
 */
export const about = [
  "I finished Applied Informatics at the University of Macedonia in 2026 with a GPA of 8.23, specialising in information systems. Most of what I've learned came from building things that had to work in front of judges or in front of a real user, on a deadline — a wildfire model that had to render in seconds, a platform that had to keep one firm's data away from another's.",
  "I'm drawn to problems where the software has to model something real and be honest about uncertainty. I'm equally happy in a Spring Boot service or a React interface, and I'm actively working toward AI/ML.",
  'Outside work: music, team sports, travel, and the friends who put up with me talking about fire-spread models.',
] as const;

/**
 * Education and background, from CONTENT.md.
 *
 * Four rows. The water-park job sits here as seasonal work and is not
 * inflated — BUILD_PLAN Phase 7 is explicit about that, and padding it would
 * be the kind of thing a reviewer notices.
 *
 * `date` is optional: the last two rows are standing facts rather than dated
 * periods, and giving them an invented date range would be a lie for the sake
 * of a tidy column.
 */
export const education = [
  {
    date: '2022 — 2026',
    lines: [
      'University of Macedonia, Thessaloniki',
      'BSc Applied Informatics — Information Systems · GPA 8.23',
    ],
  },
  {
    date: '2022 — 2023',
    lines: ['Seasonal summer employment, water park — tourism entertainment company'],
  },
  { date: null, lines: ['English — C2, Certificate of Proficiency'] },
  { date: null, lines: ['Military obligations — fulfilled'] },
] as const;

/**
 * Contact, from CONTENT.md § Contact.
 *
 * No form, by design. A plain mailto: is one tap, works offline, needs no
 * backend, and cannot silently drop a message the way a form on a static host
 * can.
 *
 * The phone number is deliberately absent. BUILD_PLAN Phase 8 says to publish
 * it only if B6 comes back yes, and it has not. CONTENT.md's own
 * recommendation is email and LinkedIn on the site with the number kept to the
 * CV PDF: publishing it invites recruiter spam and cannot be undone once
 * indexed. Nothing is rendered in its place — an omitted number is not a
 * missing value, it is a decision that has not been taken yet, and it is
 * tracked as B6 in TODO-VASILIS.md.
 */
export const contact = {
  line: "I'm looking for a junior role in frontend, backend, or AI/ML — in Larissa, Athens, Thessaloniki, or remote. The fastest way to reach me is email.",
  rows: [
    {
      label: 'Email',
      href: 'mailto:verykokosvasileios@gmail.com',
      text: 'verykokosvasileios@gmail.com',
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/vasilis-verykokos',
      text: 'linkedin.com/in/vasilis-verykokos',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/VasilisVerykokos',
      text: 'github.com/VasilisVerykokos',
    },
    { label: 'CV', href: '/cv.pdf', text: '/cv.pdf' },
  ],
} as const;
