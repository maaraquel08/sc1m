#!/usr/bin/env node
// Verifies every inline glyph in src/components/ui matches Phosphor's own
// source path, byte for byte.
//
// The design system adopts Phosphor as its icon set but does NOT import the
// package inside registry components — an installed component has to stay
// dependency-free, and the icon package ships its React icons as client
// components, which would drag server-safe components into the client bundle.
// The cost of inlining is drift: a hand-tweaked path silently stops being
// Phosphor. This check is what makes inlining safe.
//
// A glyph opts in by carrying a provenance marker directly above its <svg>:
//
//   {/* phosphor: caret-down regular */}
//   <svg viewBox="0 0 256 256" ...><path d="…" /></svg>
//
// or, where the path lives in a lookup table:
//
//   /* phosphor: info fill */
//   info: "M128,24A104…",
//
// Both forms are matched against node_modules/@phosphor-icons/core/assets.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UI = join(root, "src/components/ui");
const ASSETS = join(root, "node_modules/@phosphor-icons/core/assets");

if (!existsSync(ASSETS)) {
  console.error(
    "check-icon-parity: @phosphor-icons/core is not installed — run npm install",
  );
  process.exit(1);
}

/** Phosphor names its regular-weight files bare and every other weight suffixed. */
function assetPath(name, weight) {
  return join(ASSETS, weight, weight === "regular" ? `${name}.svg` : `${name}-${weight}.svg`);
}

function phosphorPath(name, weight) {
  const file = assetPath(name, weight);
  if (!existsSync(file)) return null;
  const svg = readFileSync(file, "utf8");
  const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
  return paths.length === 1 ? paths[0] : paths;
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const sources = walk(UI).filter(
  (f) => f.endsWith(".tsx") && !/\.(stories|story|demo)\.tsx$/.test(f),
);

const failures = [];
let checked = 0;

for (const file of sources) {
  const src = readFileSync(file, "utf8");
  const rel = file.slice(root.length + 1);

  // Each marker owns everything up to the next marker, so the `d="…"` or
  // "M…" string that follows it is unambiguously the glyph it names.
  const markers = [...src.matchAll(/phosphor:\s*([a-z0-9-]+)\s+([a-z]+)\s*\*\//g)];

  for (const [i, marker] of markers.entries()) {
    const [, name, weight] = marker;
    const from = marker.index + marker[0].length;
    const to = i + 1 < markers.length ? markers[i + 1].index : src.length;
    const region = src.slice(from, to);
    checked++;

    const expected = phosphorPath(name, weight);
    if (expected === null) {
      failures.push(`${rel}: no Phosphor asset for "${name}" at weight "${weight}"`);
      continue;
    }
    if (Array.isArray(expected)) {
      failures.push(
        `${rel}: Phosphor "${name}/${weight}" has ${expected.length} paths; this check only handles single-path glyphs`,
      );
      continue;
    }

    // JSX attribute form, then table form.
    const found =
      region.match(/\sd="([^"]+)"/)?.[1] ??
      region.match(/"(M[^"]+Z)"/)?.[1] ??
      null;

    if (found === null) {
      failures.push(`${rel}: marker "phosphor: ${name} ${weight}" has no path data after it`);
    } else if (found !== expected) {
      failures.push(
        `${rel}: "${name}/${weight}" does not match Phosphor's source\n` +
          `      inline:   ${found.slice(0, 72)}…\n` +
          `      phosphor: ${expected.slice(0, 72)}…`,
      );
    }
  }
}

if (failures.length) {
  console.error(`check-icon-parity: ${failures.length} failure(s):\n`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `check-icon-parity: OK — ${checked} inline glyph(s) across ${sources.length} component files match @phosphor-icons/core.`,
);
