# sc1m

A multi-brand design system: React 19 components built on [Base UI](https://base-ui.com) and styled with Tailwind CSS v4 semantic tokens. The default brand is **Ledger**; additional brands ship as swappable CSS layers scoped under `data-brand` attributes.

Components are distributed through a [shadcn-compatible registry](https://ui.shadcn.com/docs/registry) — consumers copy source into their own codebase with the shadcn CLI. Component source is framework-agnostic (no `next/*` imports): it works in Next.js, Vite, or any React 19 + Tailwind v4 app.

## Installing components (consumers)

### 1. Prerequisites

- React 19, Tailwind CSS v4 wired into your build (e.g. `@tailwindcss/vite` or `@tailwindcss/postcss`), TypeScript.
- A `@/*` path alias pointing at your source root, in **both** places:
  - `tsconfig.json` → `"paths": { "@/*": ["./src/*"] }`
  - your bundler (Vite: `resolve: { alias: { "@": "/src" } }`; Next.js reads tsconfig paths automatically).

### 2. Map the `@sc1m` namespace

In your project's `components.json`, add the registry under the `registries` key:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "utils": "@/lib/cn",
    "hooks": "@/hooks"
  },
  "registries": {
    "@sc1m": "https://sc1m.vercel.app/r/{name}.json"
  }
}
```

Point `tailwind.css` at your global stylesheet (`src/index.css`, `app/globals.css`, …) — that's where the design tokens get merged. Set `rsc: true` in Next.js App Router projects.

### 3. Add components

```bash
npx shadcn@latest add @sc1m/switch
```

Every component declares the `tokens` and `cn` items as registry dependencies **by absolute URL**, so a single `add` also:

- merges the full token layer into your CSS file — the `@theme inline` contract, Ledger `:root` values, `.dark` overrides, the `dark` custom variant, and the `popup-motion` utility;
- installs `src/lib/cn.ts` and the npm deps (`@base-ui/react`, `clsx`, `tailwind-merge`).

You cannot install a component without its tokens, and bare names never resolve against shadcn's own registry by accident.

Browse what's available: every item is listed in [`registry.json`](./registry.json), served at `https://sc1m.vercel.app/r/registry.json`.

### 4. App-level setup (once)

- **Dark mode**: toggle the `.dark` class on `<html>` (next-themes compatible). Components consume semantic tokens, so no `dark:` utilities are needed in your code.
- **Stacking**: wrap app content in a container with `isolation: isolate` so Base UI's portalled popups always render above it.
- **iOS Safari 26+**: keep `position: relative` on `<body>` for correct Base UI backdrop behavior.
- **Brands**: additional brands define the same token contract scoped under `[data-brand="…"]`; activate one by setting that attribute on `<html>`. See `src/styles/brands/boilerplate-template.css` for the contract.

## Registry authoring (this repo)

- `registry.json` at the repo root is the manifest — one entry per component, plus `tokens` (`registry:theme`) and `cn` (`registry:lib`).
- `npm run registry:build` (`shadcn build`) generates `public/r/*.json`. It runs automatically before `next build` via the `prebuild` script, so every deploy regenerates the JSON — `public/r/` is gitignored and never committed, which makes stale registry output structurally impossible.
- CI (`.github/workflows/registry.yml`) builds the registry on every PR and push to main, then runs:
  - `scripts/check-registry.mjs` — validates file paths, build output, self-referencing registry-dependency URLs, `"use client"` directives, and the no-`next/*`-imports guarantee;
  - `scripts/check-tokens-parity.mjs` — fails when `src/app/globals.css` / `src/styles/brands/ledger.css` drift from the `tokens` item in `registry.json` (the token maps are duplicated deliberately, in the exact JSON shape the shadcn CLI can merge; structural blocks like `popup-motion` are maintained manually).

### Registry gotchas (learned the hard way)

The shadcn CLI's CSS merger (`shadcn@4.x`) is picky about the `css`/`cssVars` JSON encoding:

- `@theme` mappings must ship in `cssVars.theme` (emitted as `@theme inline`, preserving the load-bearing `inline`); a flat map under `css["@theme inline"]` crashes the merger.
- Parameterized statement at-rules go in the **key** with an empty object value: `"@custom-variant dark (&:where(.dark, .dark *))": {}`. A string value is parsed as a declaration body and crashes.
- Don't use `cssVars.light`/`cssVars.dark` for vars that already start with `--` — the CLI double-prefixes them (`var(----n-0)`).

## Development

```bash
npm run dev        # Next.js docs/registry host
npm run storybook  # component workbench (port 6006)
npm run registry:build && node scripts/check-registry.mjs && node scripts/check-tokens-parity.mjs
```
