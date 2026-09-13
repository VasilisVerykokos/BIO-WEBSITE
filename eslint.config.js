import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

/**
 * Flat config.
 *
 * The accessibility rules are errors, not warnings. BUILD_PLAN Phase 1.5 is
 * explicit about this, and Phase 11 has to reach Lighthouse Accessibility 100
 * — a warning nobody reads will not get us there.
 *
 * Note on eslint-plugin-jsx-a11y: eslint-plugin-astro depends on it and
 * requires ESLint >= 10, while jsx-a11y has not yet widened its own peer range
 * past ESLint 9. package.json pins it with an `overrides` entry rather than
 * installing with --legacy-peer-deps, so the reason is recorded in the repo
 * instead of living in someone's shell history.
 */
export default defineConfig(
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Astro components, plus the jsx-a11y rules the plugin wires up for them.
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],

  {
    files: ['**/*.{js,mjs,ts,astro}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      /**
       * role="list" on a <ul> is redundant on paper and necessary in practice:
       * Safari and iOS VoiceOver drop list semantics from any list styled with
       * `list-style: none`, so a navigation list stops announcing "list, 4
       * items". reset.css pairs the two deliberately (`ul[role='list']`), which
       * is why the role is allowed here rather than the rule being switched off.
       *
       * Narrowed to exactly this element/role pair. Every other redundant role
       * is still an error.
       */
      'astro/jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],

      /**
       * A horizontally scrollable region must be reachable by keyboard, or
       * someone who cannot swipe cannot see the second screenshot. axe enforces
       * exactly that (scrollable-region-focusable); this rule flags the
       * tabindex that satisfies it. Allowing it only on a labelled region or
       * group — a bare div with tabindex is still an error.
       */
      'astro/jsx-a11y/no-noninteractive-tabindex': [
        'error',
        { tags: [], roles: ['tabpanel', 'region', 'group'], allowExpressionValues: true },
      ],
    },
  },

  // Config files run in Node and legitimately read process.env.
  {
    files: ['*.config.{js,mjs}', 'scripts/**/*.{js,mjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
);
