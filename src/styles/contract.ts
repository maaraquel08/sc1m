/**
 * The design-token contract, as data.
 *
 * Mirrors the @theme block in src/app/globals.css and the slots in
 * src/styles/brands/boilerplate-template.css. The token parity test
 * (tokens.stories.tsx) iterates this to verify every registered brand
 * resolves every token in both themes — keeping the contract's four
 * copies (theme map, brand files, template) honest.
 *
 * Adding a token: add it to globals.css @theme, the template, the
 * default brand, and this list.
 */

/** Bare semantic color names brand files assign (mapped to --color-*). */
export const COLOR_TOKENS = [
  "bg",
  "surface",
  "surface-raised",
  "fg",
  "fg-muted",
  "fg-subtle",
  "line",
  "line-strong",
  "accent",
  "accent-hover",
  "accent-fg",
  "highlight",
  "highlight-fg",
  "success",
  "danger",
  "danger-fg",
  "info",
  "warning",
  "ring",
] as const;

/** Required non-color brand slots. */
export const SHAPE_TOKENS = [
  "brand-radius-sm",
  "brand-radius-md",
  "brand-radius-lg",
  "brand-radius-xl",
  "brand-font-sans",
  "brand-font-mono",
] as const;

/** Registered brands: data-brand attribute value, or null for the
 * default brand (owns :root, needs no attribute). Keep in sync with
 * the @import list in globals.css and the Storybook Brand toolbar. */
export const BRANDS = [
  { key: "sc1m", attr: null },
  { key: "ledger", attr: "ledger" },
] as const;
