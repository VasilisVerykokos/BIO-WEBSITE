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
