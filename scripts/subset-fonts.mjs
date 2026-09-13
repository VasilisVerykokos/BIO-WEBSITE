/**
 * Subset the self-hosted fonts.
 *
 * Why this exists: Fontsource's "latin" cut of Newsreader is 57KB, and its
 * italic is 63KB — for a face that sets exactly one word, the surname in the
 * hero. Five faces came to 210KB against MOBILE_SPEC §9's 120KB budget.
 *
 * Two reductions, both lossless as far as this site is concerned:
 *
 *   1. Glyph subsetting. Keep the characters the site can actually render and
 *      drop the rest.
 *   2. Variable-axis clamping. Newsreader ships a 200-800 weight axis; the
 *      design uses 300-500 and DESIGN_SYSTEM §2.2 forbids headings at 600 or
 *      above. Narrowing the axis drops the variation data for weights that can
 *      never appear.
 *
 * Run by `npm run fonts`, and by `npm run build` via prebuild, so a fresh
 * clone cannot ship unsubsetted fonts by forgetting a step.
 *
 * The character sets are deliberately wider than today's copy. Subsetting to
 * exactly the current text would mean any future edit — a name with an accent,
 * a new symbol — silently renders in the fallback face. These cover all of
 * Latin-1 plus the punctuation this design uses.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)).join(
    '',
  );

/** Printable ASCII. */
const ASCII = range(0x20, 0x7e);

/** Latin-1 letters and symbols — accented names, ©, °, and so on. */
const LATIN1 = range(0x00a0, 0x00ff);

/** The typography this design actually uses. */
const PUNCT = [
  '‐‑‒–—―', // hyphens and dashes, incl. the em-dash
  '‘’‚“”„', // curly quotes
  '•·…', // bullet, interpunct (the spec-sheet separator), ellipsis
  '←↑→↓', // arrows — the expander chevron is one
  '€™®©−×', // currency, marks, true minus and times
  '   ', // no-break and thin spaces
].join('');

/** Greek, for ΑΑΔΕ / ΓΕΜΗ / ΕΡΓΑΝΗ. Mono only — Newsreader has no Greek cut. */
const GREEK = range(0x0386, 0x03ce);

const LATIN = ASCII + LATIN1 + PUNCT;

/**
 * The mono face never renders prose. It sets stack names, dates, file paths,
 * spec-sheet values and the three Greek acronyms — so it needs ASCII, the
 * punctuation this design uses, and Greek, but not Latin-1's accented letters.
 * Dropping them is 7KB across the two weights.
 */
const MONO = ASCII + PUNCT + GREEK;

/*
 * Only one mono weight is built. DESIGN_SYSTEM §2 lists 400 and 500, but 500
 * was used by exactly one rule — the 01/02/03 project markers — and cost
 * 16.8KB, 14% of the whole font budget, for six glyphs. Those markers are
 * already set in the accent colour, which is what carries the emphasis. The
 * weight went; the marker did not. Reversible: restore the face here and set
 * .project-number back to --fw-medium.
 */

const FACES = [
  {
    out: 'newsreader-normal.woff2',
    src: '@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2',
    text: LATIN,
    // Body 400, headings 400-500. 300 kept as headroom for a lighter display
    // weight without another build change.
    axes: { wght: { min: 300, max: 500 } },
  },
  {
    out: 'newsreader-italic.woff2',
    src: '@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2',
    // ASCII only. This face exists for the surname; it is never used for prose,
    // so Latin-1 would be 20KB of insurance against a case that cannot arise
    // without a code change that would also touch this file.
    text: ASCII,
    axes: { wght: { min: 400, max: 400 } },
  },
  {
    out: 'inter-normal.woff2',
    src: '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
    text: LATIN,
    // Nav, eyebrow labels and meta: 400, 500, 600.
    axes: { wght: { min: 400, max: 600 } },
  },
  {
    out: 'jetbrains-400.woff2',
    src: '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2',
    text: MONO,
  },
];

const OUT_DIR = path.join(process.cwd(), 'src', 'assets', 'fonts');

const kb = (n) => (n / 1024).toFixed(1).padStart(7);

const main = async () => {
  const { default: subsetFont } = await import('subset-font');
  await mkdir(OUT_DIR, { recursive: true });

  let before = 0;
  let after = 0;

  for (const face of FACES) {
    const srcPath = require.resolve(face.src);
    const original = await readFile(srcPath);

    const subset = await subsetFont(original, face.text, {
      targetFormat: 'woff2',
      ...(face.axes ? { variationAxes: face.axes } : {}),
    });

    await writeFile(path.join(OUT_DIR, face.out), subset);

    before += original.length;
    after += subset.length;
    const saved = (100 * (1 - subset.length / original.length)).toFixed(0);
    console.log(
      `  ${kb(original.length)} KB -> ${kb(subset.length)} KB  (-${saved}%)  ${face.out}`,
    );
  }

  console.log(`  ${'-'.repeat(52)}`);
  console.log(
    `  ${kb(before)} KB -> ${kb(after)} KB  (-${(100 * (1 - after / before)).toFixed(0)}%)  total`,
  );
  console.log(
    `  MOBILE_SPEC §9 budget: 120.0 KB  ${after <= 120 * 1024 ? 'PASS' : 'FAIL'}`,
  );

  if (after > 120 * 1024) {
    console.error('\n  Font budget exceeded. Narrow the character sets or the axes.');
    process.exitCode = 1;
  }
};

await main();
