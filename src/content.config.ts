import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// `z` re-exported from astro:content is deprecated and goes away in Astro 8.
// astro/zod is the supported path and pins the exact Zod the build already
// uses, so the schema cannot drift from Astro's own validator.
import { z } from 'astro/zod';

/**
 * The three case studies.
 *
 * They are the core asset of the site, so they are typed and validated rather
 * than hand-written into markup. A schema violation fails the build — BUILD_PLAN
 * Phase 5.1 — which means a missing "hard part" paragraph or a malformed spec
 * row cannot reach production quietly.
 *
 * JSON rather than Markdown: every field here is a discrete value the layout
 * positions itself. There is no free-form body to render, and Markdown
 * frontmatter this large is worse to edit than the object it is pretending not
 * to be.
 */
const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({
    /** Drives the 01/02/03 numbering and the render order. */
    order: z.number().int().positive(),

    title: z.string().min(1),
    subtitle: z.string().min(1),
    year: z.string().min(1),
    role: z.string().min(1),

    /** One line on what the thing is. */
    problem: z.string().min(1),

    /**
     * The most important paragraph on the site — the one that separates a
     * junior who has shipped from a junior who has followed a tutorial. The
     * minimum length is a real check, not decoration: a two-line "hard part"
     * is a sign the entry was filled in rather than written.
     */
    hardPart: z.string().min(200),

    alsoBuilt: z.array(z.string().min(1)).min(1),

    /**
     * An ordered list, not a record. DESIGN_SYSTEM §4.3 is a datasheet, and
     * ROLE before STACK before DATA is part of how it reads; an object would
     * leave that ordering to chance.
     */
    spec: z
      .array(
        z.object({
          label: z.string().min(1),
          value: z.string().min(1),
        }),
      )
      .min(1),

    /**
     * `href` is optional on purpose. Several of these point at things that do
     * not exist publicly yet (blockers B1, B9), or point at something that
     * will deliberately never go public — a private repository handling live
     * credentials, say. An entry without an href renders as plain text, never
     * as a dead link.
     */
    links: z.array(
      z.object({
        text: z.string().min(1),
        href: z.string().optional(),
      }),
    ),

    /**
     * Real images, once they exist. Paths are relative to
     * src/assets/projects/ — e.g. "aegis/map-view.jpg" resolves to
     * src/assets/projects/aegis/map-view.jpg. MediaStrip.astro resolves them
     * through import.meta.glob against every image under that folder, so
     * adding one is: drop the file there, add its path here. No component
     * touched, no import statement written by hand.
     *
     * A bare string gets a generic alt text ("<title> screenshot N") — fine
     * for an actual UI capture. Not every entry here is one: AEGIS's two are
     * event photos, and "AEGIS screenshot 1" would be a wrong description of
     * a photo of the team holding a medal. The object form's `alt` overrides
     * the generic text for exactly that case.
     *
     * Empty (the default) is not "no images" — it means the real files don't
     * exist yet, so the strip falls back to `screenshotCount` grey B9
     * placeholders instead. The two fields are mutually exclusive in
     * practice: once `screenshots` has entries, they render instead of
     * placeholders and `screenshotCount` is ignored. Capped at two on mobile
     * by MOBILE_SPEC §8, same as the count.
     */
    screenshots: z
      .array(
        z.union([
          z.string().min(1),
          z.object({ path: z.string().min(1), alt: z.string().min(1) }),
        ]),
      )
      .max(2)
      .default([]),

    /** Only consulted when `screenshots` is empty — see above. */
    screenshotCount: z.number().int().min(0).max(2).default(2),
  }),
});

export const collections = { projects };
