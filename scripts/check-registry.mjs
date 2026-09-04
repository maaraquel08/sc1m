#!/usr/bin/env node
// Post-build validation for registry.json / public/r output.
// Run AFTER `npm run registry:build` — see .github/workflows/registry.yml.
//
// Checks:
//   (a) every item's files[].path exists on disk
//   (b) public/r/<name>.json exists for every item
//   (c) every registryDependencies URL matches the sc1m registry shape and
//       resolves to a real item (catches typos / bare-name shadcn fallbacks)
//   (d) every registry:ui item depends on both tokens and cn
//   (e) every registry:ui file's built content starts with "use client"
//       (except the intentionally server-safe ones — see the exempt set)
//   (f) no file content references Next.js-specific APIs (framework-agnostic
//       guarantee for a shadcn-style registry)

import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const registryPath = resolve(root, "registry.json");
const publicRDir = resolve(root, "public/r");

const DEP_URL_RE = /^https:\/\/sc1m\.vercel\.app\/r\/(.+)\.json$/;
const FORBIDDEN_IMPORTS = [
  "next/link",
  "next/image",
  "next/navigation",
  "next/font",
  "next/headers",
];
// Components with no hooks, state, or event handlers render on the server;
// marking them "use client" would ship JS for static markup.
const CLIENT_DIRECTIVE_EXEMPT = new Set(["button", "banner", "badge"]);

const failures = [];

function fail(msg) {
  failures.push(msg);
}

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const items = registry.items ?? [];
const itemNames = new Set(items.map((i) => i.name));

for (const item of items) {
  // (a) files[].path exists on disk
  for (const file of item.files ?? []) {
    const abs = resolve(root, file.path);
    if (!existsSync(abs)) {
      fail(`[${item.name}] source file missing: ${file.path}`);
    }
  }

  // (b) public/r/<name>.json exists
  const builtPath = resolve(publicRDir, `${item.name}.json`);
  if (!existsSync(builtPath)) {
    fail(`[${item.name}] built output missing: public/r/${item.name}.json`);
    continue;
  }

  // (c) registryDependencies shape + resolution
  for (const dep of item.registryDependencies ?? []) {
    const match = DEP_URL_RE.exec(dep);
    if (!match) {
      fail(
        `[${item.name}] registryDependencies entry does not match https://sc1m.vercel.app/r/<name>.json: "${dep}"`
      );
      continue;
    }
    const depName = match[1];
    if (!itemNames.has(depName)) {
      fail(
        `[${item.name}] registryDependencies references unknown item "${depName}" (from "${dep}")`
      );
    }
  }

  if (item.type === "registry:ui") {
    // (d) must depend on both tokens and cn
    const deps = item.registryDependencies ?? [];
    if (!deps.includes("https://sc1m.vercel.app/r/tokens.json")) {
      fail(`[${item.name}] missing tokens in registryDependencies`);
    }
    if (!deps.includes("https://sc1m.vercel.app/r/cn.json")) {
      fail(`[${item.name}] missing cn in registryDependencies`);
    }

    // (e) & (f) inspect built file content
    let built;
    try {
      built = JSON.parse(readFileSync(builtPath, "utf8"));
    } catch (err) {
      fail(`[${item.name}] could not parse public/r/${item.name}.json: ${err.message}`);
      continue;
    }

    for (const file of built.files ?? []) {
      const content = file.content ?? "";

      if (!CLIENT_DIRECTIVE_EXEMPT.has(item.name)) {
        if (!content.startsWith('"use client"')) {
          fail(
            `[${item.name}] ${file.path}: built content does not start with "use client"`
          );
        }
      }

      for (const forbidden of FORBIDDEN_IMPORTS) {
        if (content.includes(forbidden)) {
          fail(
            `[${item.name}] ${file.path}: content references forbidden import "${forbidden}"`
          );
        }
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`check-registry: ${failures.length} failure(s):\n`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `check-registry: OK — ${items.length} items validated (files exist, public/r built, registryDependencies resolve, tokens/cn wired, client directives and framework-agnostic imports clean).`
);
