#!/usr/bin/env node
// Drift detection between the source CSS files and the hand-encoded
// `tokens` item in registry.json. The tokens item duplicates CSS from:
//   - the `@theme inline { ... }` block in src/app/globals.css
//   - the `:root { ... }` block in src/styles/brands/ledger.css, merged
//     with the *motion* `:root { ... }` block in globals.css (the one
//     after @theme — accordion/popup vars) — the built tokens item
//     folds both into one :root
//   - the `.dark { ... }` block in src/styles/brands/ledger.css
//
// Scope: flat custom-property maps only. Structural CSS (the
// popup-motion @utility, @keyframes, @custom-variant, @media blocks) is
// maintained by hand in registry.json and is intentionally NOT checked
// here.
//
// Paths are overridable via env vars (or CLI flags) so this can be run
// against a scratch copy to prove it catches drift without touching the
// real source files:
//   GLOBALS_CSS, LEDGER_CSS, REGISTRY_JSON env vars, or
//   --globals=<path> --ledger=<path> --registry=<path>

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function argOrEnv(flag, envVar, fallback) {
  const prefix = `--${flag}=`;
  const argv = process.argv.find((a) => a.startsWith(prefix));
  if (argv) return argv.slice(prefix.length);
  if (process.env[envVar]) return process.env[envVar];
  return fallback;
}

const globalsPath = resolve(
  root,
  argOrEnv("globals", "GLOBALS_CSS", "src/app/globals.css")
);
const ledgerPath = resolve(
  root,
  argOrEnv("ledger", "LEDGER_CSS", "src/styles/brands/ledger.css")
);
const registryPath = resolve(
  root,
  argOrEnv("registry", "REGISTRY_JSON", "registry.json")
);

/**
 * Extract the contents of a top-level `<selector> { ... }` block by
 * brace-matching from the first occurrence of `<selector> {`.
 * Returns the inner text (without the outer braces), or null if not found.
 */
function extractBlock(css, selectorRe, fromIndex = 0) {
  const re = new RegExp(selectorRe, "g");
  re.lastIndex = fromIndex;
  const m = re.exec(css);
  if (!m) return null;
  const openBrace = css.indexOf("{", m.index);
  if (openBrace === -1) return null;
  let depth = 0;
  for (let i = openBrace; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) {
        return { content: css.slice(openBrace + 1, i), endIndex: i };
      }
    }
  }
  return null;
}

/**
 * Parse a flat `--name: value;` declaration map from block text.
 * Handles multi-line values (declaration continues until the terminating
 * semicolon) and strips trailing `/* ... *\/` line comments.
 */
function parseDeclarations(blockText) {
  // Strip comments first (they never contain semicolons in this codebase's
  // usage, but strip defensively across the whole block).
  const noComments = blockText.replace(/\/\*[\s\S]*?\*\//g, "");

  const map = new Map();
  // Match `--name : <value up to the next unescaped semicolon>;`
  // Value may itself contain balanced parens with commas/newlines.
  const declRe = /(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = declRe.exec(noComments)) !== null) {
    const name = m[1];
    const value = normalizeWhitespace(m[2]);
    map.set(name, value);
  }
  return map;
}

function normalizeWhitespace(s) {
  return s
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();
}

function diffMaps(label, expected, actual) {
  const diffs = [];
  const expectedKeys = new Set(expected.keys());
  const actualKeys = new Set(actual.keys());

  for (const key of expectedKeys) {
    if (!actualKeys.has(key)) {
      diffs.push(`  - MISSING in registry ${label}: ${key} (source value: "${expected.get(key)}")`);
    } else if (expected.get(key) !== actual.get(key)) {
      diffs.push(
        `  - DIFFERS in registry ${label}: ${key}\n      source:   "${expected.get(key)}"\n      registry: "${actual.get(key)}"`
      );
    }
  }
  for (const key of actualKeys) {
    if (!expectedKeys.has(key)) {
      diffs.push(`  - EXTRA in registry ${label}: ${key} (registry value: "${actual.get(key)}")`);
    }
  }
  return diffs;
}

// --- load sources ---------------------------------------------------

const globalsCss = readFileSync(globalsPath, "utf8");
const ledgerCss = readFileSync(ledgerPath, "utf8");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));

const tokensItem = (registry.items ?? []).find((i) => i.name === "tokens");
if (!tokensItem) {
  console.error("check-tokens-parity: no `tokens` item found in registry.json");
  process.exit(1);
}

// --- 1. @theme inline block in globals.css vs tokens cssVars.theme --

const themeBlock = extractBlock(globalsCss, "@theme\\s+inline\\s*");
if (!themeBlock) {
  console.error("check-tokens-parity: could not find `@theme inline { ... }` block in globals.css");
  process.exit(1);
}
const themeExpected = parseDeclarations(themeBlock.content);
const themeActual = new Map(
  Object.entries(tokensItem.cssVars?.theme ?? {})
);

// --- 2. :root blocks -------------------------------------------------

// ledger.css :root (the first, and only, :root block in that file)
const ledgerRootBlock = extractBlock(ledgerCss, ":root\\s*");
if (!ledgerRootBlock) {
  console.error("check-tokens-parity: could not find `:root { ... }` block in ledger.css");
  process.exit(1);
}
const ledgerRoot = parseDeclarations(ledgerRootBlock.content);

// globals.css :root (the motion block, AFTER the @theme block)
const globalsRootBlock = extractBlock(
  globalsCss,
  ":root\\s*",
  themeBlock.endIndex
);
if (!globalsRootBlock) {
  console.error(
    "check-tokens-parity: could not find the motion `:root { ... }` block in globals.css (expected after @theme inline)"
  );
  process.exit(1);
}
const globalsMotionRoot = parseDeclarations(globalsRootBlock.content);

// expected merged :root = ledger :root + globals motion :root
const rootExpected = new Map([...ledgerRoot, ...globalsMotionRoot]);
const rootActual = new Map(Object.entries(tokensItem.css?.[":root"] ?? {}));

// --- 3. .dark block ----------------------------------------------------

const ledgerDarkBlock = extractBlock(ledgerCss, "\\.dark\\s*");
if (!ledgerDarkBlock) {
  console.error("check-tokens-parity: could not find `.dark { ... }` block in ledger.css");
  process.exit(1);
}
const darkExpected = parseDeclarations(ledgerDarkBlock.content);
const darkActual = new Map(Object.entries(tokensItem.css?.[".dark"] ?? {}));

// --- compare -----------------------------------------------------------

const allDiffs = [
  ...diffMaps("cssVars.theme (vs globals.css @theme inline)", themeExpected, themeActual),
  ...diffMaps(
    "css[\":root\"] (vs ledger.css :root + globals.css motion :root)",
    rootExpected,
    rootActual
  ),
  ...diffMaps("css[\".dark\"] (vs ledger.css .dark)", darkExpected, darkActual),
];

console.log(
  "check-tokens-parity: scope is the three flat var maps above. Structural CSS " +
    "(the popup-motion @utility, @keyframes toast-nudge, @custom-variant dark, " +
    "reduced-motion @media blocks) is maintained by hand in registry.json and is " +
    "not covered by this check."
);

if (allDiffs.length > 0) {
  console.error(`\ncheck-tokens-parity: ${allDiffs.length} diff(s) found:\n`);
  for (const d of allDiffs) console.error(d);
  process.exit(1);
}

console.log(
  `check-tokens-parity: OK — ${themeExpected.size} theme vars, ${rootExpected.size} :root vars, ${darkExpected.size} .dark vars all match.`
);
