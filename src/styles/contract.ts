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

/** Identity slots: the brand's flat tab/app-icon colour, read by
 * src/components/site/brand-favicon.tsx to paint the favicon.
 *
 * Theme-stable by contract — a brand's dark block must NEVER override
 * these, and must not bind them to a primitive it does override. The
 * mark is one flat colour per brand (assets README: "one flat colour
 * per instance"); the dark-mode accent lift exists to hold contrast on
 * a near-black canvas, which is not what a browser tab is.
 *
 * Not mapped in globals.css @theme: JS reads these, no utility uses
 * them, and a bg-brand-icon class would be dead surface area.
 *
 * The parity test asserts light and dark resolve identically. */
export const IDENTITY_TOKENS = ["brand-icon", "brand-icon-fg"] as const;

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
  { key: "luntian", attr: "luntian" },
] as const;
