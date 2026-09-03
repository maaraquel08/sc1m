#!/usr/bin/env node
/**
 * Generates the per-component docs pages from two sources that already
 * exist, so nothing has to be kept in sync by hand:
 *
 *   registry.json                    → title, description, npm dependencies
 *   src/components/ui/<n>/<n>.stories.tsx → the live preview
 *
 * Every component already ships a Storybook `Default` story, and that story
 * is exactly the demo the docs want. Rather than re-authoring 39 previews we
 * lift them: a story whose first export is `render: () => (<jsx/>)` becomes a
 * `Demo` component; one that is plain `args` becomes a story with real,
 * auto-generated prop controls.
 *
 * Output (a file is only written when absent — hand edits always survive):
 *   content/docs/components/<name>.mdx
 *   src/components/ui/<name>/<name>.story.tsx   defineStory() — server module
 *   src/components/ui/<name>/<name>.demo.tsx    "use client" — the preview
 *
 * The split is required by React Server Components. `defineStory()` returns a
 * plain object, so its module must NOT be "use client" — marking it so turns
 * the export into a client reference proxy and `story.WithControl` comes back
 * undefined. What has to be a client component is the thing being previewed,
 * which is why the composition lives in its own `.demo.tsx`.
 *
 * Re-run with --force to overwrite, or `node scripts/gen-component-docs.mjs
 * --check` to fail when a registry component has no page.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = new Set(process.argv.slice(2));
const FORCE = argv.has("--force");
const CHECK = argv.has("--check");

const GITHUB = "https://github.com/maaraquel08/sc1m/blob/main";
const DOCS_DIR = path.join(root, "content/docs/components");

/* ---------------------------------------------------------------- utils */

/** Scan forward from `start` (which must sit on `open`) to the matching close. */
function matchDelim(src, start, open, close) {
  let depth = 0;
  let inStr = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    const prev = src[i - 1];
    if (inStr) {
      if (c === inStr && prev !== "\\") inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function dedent(text) {
  const lines = text.split("\n");
  const indents = lines
    .filter((l) => l.trim())
    .map((l) => l.match(/^\s*/)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min)).join("\n").trim();
}

/* --------------------------------------------------- stories.tsx parsing */

/**
 * Pull the pieces of a Storybook file the docs preview needs: the component
 * imports, any module-level fixture data, and the first story's body.
 */
function parseStories(src) {
  const imports = [];
  const importRe = /^import\s[\s\S]*?from\s+['"](.+?)['"];?$/gm;
  let m;
  while ((m = importRe.exec(src))) {
    const from = m[1];
    // Storybook's own machinery has no place in a docs preview.
    if (from.startsWith("@storybook/") || from === "storybook/test") continue;
    imports.push(m[0]);
  }

  // Module-level declarations a render() closes over: fixture data
  // (`const fruits = [...]`) and helper components (`function ToastList()`).
  const fixtures = [];
  const fixtureRe = /^(?:const|let|var)\s+([A-Za-z0-9_]+)\s*[:=][\s\S]*?;$/gm;
  while ((m = fixtureRe.exec(src))) {
    if (m[1] === "meta") continue;
    fixtures.push(m[0]);
  }
  const fnRe = /^function\s+[A-Za-z0-9_]+\s*\(/gm;
  while ((m = fnRe.exec(src))) {
    const open = src.indexOf("{", m.index + m[0].length - 1);
    const end = matchDelim(src, open, "{", "}");
    if (end !== -1) fixtures.push(src.slice(m.index, end + 1));
  }

  // `component: Foo` in the meta block names the primary export.
  const primary = src.match(/component:\s*([A-Za-z0-9_]+)/)?.[1] ?? null;

  // First story export wins — by convention that is the representative one.
  const storyStart = src.search(/^export const\s+\w+\s*:\s*Story\s*=\s*\{/m);
  if (storyStart === -1) return { imports, fixtures, primary, story: null };

  const braceAt = src.indexOf("{", storyStart);
  const braceEnd = matchDelim(src, braceAt, "{", "}");
  const body = src.slice(braceAt + 1, braceEnd);

  return { imports, fixtures, primary, story: extractStory(body) };
}

/**
 * Turn the attributes of a single JSX element into an object literal.
 * `<Switch aria-label="Toggle" defaultChecked {...args} />` becomes
 * `{ "aria-label": "Toggle", defaultChecked: true }`. Returns null for
 * anything with children or more than one root element — those are
 * compositions, not prop sets.
 */
function jsxToArgs(jsx, primary) {
  const trimmed = jsx.trim();
  const m = trimmed.match(/^<([A-Za-z0-9_.]+)([\s\S]*)\/>$/);
  if (!m || m[1] !== primary) return null;

  let rest = m[2];
  const entries = [];
  const attrRe = /([A-Za-z_][A-Za-z0-9_:-]*)\s*(=)?/g;
  let i = 0;
  while (i < rest.length) {
    if (/\s/.test(rest[i])) {
      i++;
      continue;
    }
    if (rest.startsWith("{...", i)) {
      const end = matchDelim(rest, i, "{", "}");
      if (end === -1) return null;
      i = end + 1;
      continue;
    }
    attrRe.lastIndex = i;
    const a = attrRe.exec(rest);
    if (!a || a.index !== i) return null;
    const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(a[1]) ? a[1] : JSON.stringify(a[1]);
    i = attrRe.lastIndex;
    if (!a[2]) {
      entries.push(`${key}: true`);
      continue;
    }
    while (/\s/.test(rest[i])) i++;
    if (rest[i] === "{") {
      const end = matchDelim(rest, i, "{", "}");
      if (end === -1) return null;
      entries.push(`${key}: ${rest.slice(i + 1, end).trim()}`);
      i = end + 1;
    } else if (rest[i] === '"' || rest[i] === "'") {
      const q = rest[i];
      const end = rest.indexOf(q, i + 1);
      if (end === -1) return null;
      entries.push(`${key}: ${JSON.stringify(rest.slice(i + 1, end))}`);
      i = end + 1;
    } else return null;
  }

  return entries.length ? `{\n      ${entries.join(",\n      ")},\n    }` : "{}";
}

/** A story body is either a `render` (JSX preview) or bare `args` (controls). */
function extractStory(body) {
  const renderMatch = body.match(/\brender:\s*\(([^)]*)\)\s*=>/);
  const renderAt = renderMatch ? body.indexOf(renderMatch[0]) : -1;
  // `render: (args) => <Foo {...args} />` is a controls story wearing a
  // render's clothes — remember the param so it can be unwrapped later.
  const takesArgs = Boolean(renderMatch?.[1].trim());
  if (renderAt !== -1) {
    const arrow = body.indexOf("=>", renderAt) + 2;
    let i = arrow;
    while (/\s/.test(body[i])) i++;

    let jsx = null;
    if (body[i] === "(") {
      const end = matchDelim(body, i, "(", ")");
      jsx = dedent(body.slice(i + 1, end));
    } else if (body[i] === "{") {
      // Block body — a render with hooks/state. Keep it whole.
      const end = matchDelim(body, i, "{", "}");
      return { kind: "renderBlock", block: dedent(body.slice(i + 1, end)) };
    } else if (body[i] === "<") {
      const end = body.indexOf("\n", i);
      jsx = body.slice(i, end === -1 ? undefined : end).replace(/,\s*$/, "");
    }

    if (jsx !== null) return { kind: "render", jsx, takesArgs, args: readArgs(body) };
  }

  const args = readArgs(body);
  if (args) return { kind: "args", args };

  return null;
}

/** The story's `args: { … }` object literal, verbatim, or null. */
function readArgs(body) {
  const at = body.search(/\bargs:\s*\{/);
  if (at === -1) return null;
  const open = body.indexOf("{", at);
  const end = matchDelim(body, open, "{", "}");
  return dedent(body.slice(open, end + 1));
}

/* ----------------------------------------------------------- generation */

/**
 * Drop imports and fixtures the emitted body never mentions.
 *
 * A stories file's imports and helpers serve *all* its stories; we lift only
 * the first, so whatever the rest needed would land here unused and trip
 * no-unused-vars.
 */
function prune(imports, fixtures, body) {
  const used = (name, haystack) =>
    new RegExp(`\\b${name.replace(/[$]/g, "\\$&")}\\b`).test(haystack);

  // Fixpoint: a fixture stays if the body references it, or if another
  // surviving fixture does (toast's `stackCount` is only read by a helper
  // component, which is itself only reachable from the body).
  const nameOf = (f) =>
    f.match(/^(?:const|let|var|function)\s+([A-Za-z0-9_]+)/)?.[1] ?? null;

  let keptFixtures = fixtures;
  for (;;) {
    const next = keptFixtures.filter((f) => {
      const name = nameOf(f);
      if (!name) return true;
      const others = keptFixtures.filter((o) => o !== f).join("\n");
      return used(name, body) || used(name, others);
    });
    if (next.length === keptFixtures.length) break;
    keptFixtures = next;
  }

  const scope = body + "\n" + keptFixtures.join("\n");
  const usedInScope = (name) => used(name, scope);

  const keptImports = [];
  for (const stmt of imports) {
    const named = stmt.match(/\{([\s\S]*?)\}/);
    if (!named) {
      // default or namespace import — keep if its binding is referenced
      const binding = stmt.match(/^import\s+(?:\*\s+as\s+)?([A-Za-z0-9_$]+)/)?.[1];
      if (!binding || usedInScope(binding)) keptImports.push(stmt);
      continue;
    }
    const kept = named[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((spec) => usedInScope(spec.split(/\s+as\s+/).pop().trim()));
    if (!kept.length) continue;
    keptImports.push(stmt.replace(/\{[\s\S]*?\}/, `{ ${kept.join(", ")} }`));
  }

  return { imports: keptImports, fixtures: keptFixtures };
}


/**
 * A YAML double-quoted scalar. Quoting is not optional: registry descriptions
 * contain colons ("AI Summary (AS1): a wash …"), which YAML would otherwise
 * read as a nested mapping. Non-ASCII stays literal so the source is readable.
 */
function yaml(value) {
  return JSON.stringify(value).replace(
    /[\u0080-\uffff]/g,
    (c) => JSON.parse(`"${c}"`),
  );
}

/**
 * Build the story module and, where one is needed, the client demo module
 * it previews. Returns { story, demo, hasControls }.
 */
function storyFilesFor(name, parsed, { isClientComponent }) {
  const s = parsed.story;
  const banner = (from) =>
    `// Generated by scripts/gen-component-docs.mjs from ${from}.\n` +
    `// Safe to edit — the generator never overwrites an existing file.\n`;

  const storyModule = (imports, component, args) =>
    `${banner(`${name}.stories.tsx`)}
import { defineStory } from "@/lib/story";
${imports}

export const story = defineStory({
  Component: ${component},
  args: {
    initial: ${args},
  },
});
`;

  // --- controls: hand the real component to defineStory so @fumadocs/story
  // can derive controls from its prop types.
  let initial = null;
  if (s?.kind === "args") initial = s.args;
  else if (s?.kind === "render" && s.takesArgs && parsed.primary) {
    const fromJsx = jsxToArgs(s.jsx, parsed.primary);
    // The JSX spreads `{...args}` last, so the story's args take precedence.
    if (fromJsx) initial = s.args ? `{ ...${fromJsx}, ...${s.args} }` : fromJsx;
  }

  if (initial !== null && parsed.primary) {
    if (isClientComponent) {
      const keptImports = prune(parsed.imports, [], `${parsed.primary} ${initial}`).imports;
      return {
        story: storyModule(keptImports.join("\n"), parsed.primary, initial),
        demo: null,
        hasControls: true,
      };
    }
    // The component is deliberately server-safe (Button has no "use client",
    // so consumers can use it in RSC). Re-export it across the boundary
    // rather than adding a directive to the shipped source for the docs' sake.
    return {
      story: storyModule(
        `import { ${parsed.primary} } from "./${name}.demo";`,
        parsed.primary,
        initial,
      ),
      demo: `"use client";

${banner(`${name}.tsx`)}
export { ${parsed.primary} } from "./${name}";
`,
      hasControls: true,
    };
  }

  // --- composition: a fixed preview, wrapped in a client component.
  let demoBody = null;
  if (s?.kind === "render") {
    // The composition may still spread `{...args}`, and those args can carry
    // required props (Meter and Progress get their `value` that way), so bind
    // them to a local rather than dropping the spread.
    let jsx = s.jsx;
    let bound = "";
    if (s.takesArgs) {
      if (s.args) {
        bound = `\nconst storyArgs = ${s.args};\n`;
        jsx = jsx.replace(/\{\.\.\.args\}/g, "{...storyArgs}");
      } else {
        jsx = jsx.replace(/\s*\{\.\.\.args\}/g, "");
      }
    }
    demoBody = `${bound}
export function Demo() {
  return (
    ${jsx.split("\n").join("\n    ")}
  );
}
`;
  } else if (s?.kind === "renderBlock") {
    demoBody = `
export function Demo() {
  ${s.block.split("\n").join("\n  ")}
}
`;
  } else if (parsed.primary) {
    demoBody = `
export function Demo() {
  return <${parsed.primary} />;
}
`;
  }

  if (!demoBody) return null;

  const kept = prune(parsed.imports, parsed.fixtures, demoBody);
  const keptFixtures = kept.fixtures.length ? `\n${kept.fixtures.join("\n")}\n` : "";

  return {
    story: storyModule(`import { Demo } from "./${name}.demo";`, "Demo", "{}"),
    demo: `"use client";

${banner(`${name}.stories.tsx`)}
${kept.imports.join("\n")}
${keptFixtures}${demoBody}`,
    hasControls: false,
  };
}

function mdxFor(item, { exports, hasStory, hasControls }) {
  const { name, title, description, dependencies = [] } = item;
  const src = `src/components/ui/${name}/${name}.tsx`;

  const importList =
    exports.length > 3
      ? `import {\n${exports.map((e) => `  ${e},`).join("\n")}\n} from "@/components/ui/${name}";`
      : `import { ${exports.join(", ")} } from "@/components/ui/${name}";`;

  const preview = hasStory
    ? `import { story } from "@/components/ui/${name}/${name}.story";

## Preview

${
  hasControls
    ? "Every prop below is live — change one and the component re-renders."
    : "A representative composition. Open it in Storybook to vary the props."
}

<story.WithControl />
`
    : `## Preview

Not yet ported to a docs preview. Run it in Storybook:

\`\`\`bash
npm run storybook
\`\`\`
`;

  // Always quote: registry descriptions contain colons ("AI Summary (AS1):
  // a wash …"), which YAML reads as a nested mapping.
  return `---
title: ${yaml(title)}
description: ${yaml(description)}
---

${preview}
## Installation

\`\`\`bash
npx shadcn@latest add @sc1m/${name}
\`\`\`

This also merges the [token layer](/docs/foundations/tokens) and installs
\`src/lib/cn.ts\`${dependencies.length ? ` plus \`${dependencies.join("`, `")}\`` : ""}.

## Usage

\`\`\`tsx
${importList}
\`\`\`

## Exports

${exports.map((e) => `- \`${e}\``).join("\n")}

## Source

[\`${src}\`](${GITHUB}/${src}) — no \`next/*\` imports, so it drops into any
React 19 + Tailwind v4 app.
`;
}

/* ---------------------------------------------------------------- main */

const registry = JSON.parse(
  fs.readFileSync(path.join(root, "registry.json"), "utf8"),
);
const components = registry.items.filter((i) => i.type === "registry:ui");

fs.mkdirSync(DOCS_DIR, { recursive: true });

const catalog = [];
const created = [];
const skipped = [];
const missing = [];
const noControls = [];

for (const item of components) {
  const { name } = item;
  const dir = path.join(root, "src/components/ui", name);
  const componentPath = path.join(dir, `${name}.tsx`);
  const storiesPath = path.join(dir, `${name}.stories.tsx`);
  const storyPath = path.join(dir, `${name}.story.tsx`);
  const demoPath = path.join(dir, `${name}.demo.tsx`);
  const mdxPath = path.join(DOCS_DIR, `${name}.mdx`);

  const componentSrc = fs.readFileSync(componentPath, "utf8");
  const exports = [
    ...componentSrc.matchAll(/^export (?:function|const) ([A-Za-z0-9_]+)/gm),
  ].map((m) => m[1]);

  let parsed = null;
  if (fs.existsSync(storiesPath)) {
    parsed = parseStories(fs.readFileSync(storiesPath, "utf8"));
  }

  // --- story file
  let hasStory = fs.existsSync(storyPath);
  const built = parsed
    ? storyFilesFor(name, parsed, {
        isClientComponent: /^\s*["']use client["']/.test(componentSrc),
      })
    : null;
  const hasControls = built?.hasControls ?? false;

  if (built && (!hasStory || FORCE)) {
    if (!CHECK) {
      fs.writeFileSync(storyPath, built.story);
      if (built.demo) fs.writeFileSync(demoPath, built.demo);
      else if (fs.existsSync(demoPath)) fs.rmSync(demoPath);
    }
    created.push(path.relative(root, storyPath));
    if (built.demo) created.push(path.relative(root, demoPath));
    hasStory = true;
  } else if (hasStory) {
    skipped.push(path.relative(root, storyPath));
    // A hand-written story may differ, but the source story is still the
    // best available description of what it shows.
  }

  if (!hasStory) missing.push(name);
  if (hasStory && !hasControls) noControls.push(name);

  catalog.push({ name, title: item.title, hasStory, hasControls });

  // --- mdx page
  if (fs.existsSync(mdxPath) && !FORCE) {
    skipped.push(path.relative(root, mdxPath));
    continue;
  }
  if (!CHECK) {
    fs.writeFileSync(mdxPath, mdxFor(item, { exports, hasStory, hasControls }));
  }
  created.push(path.relative(root, mdxPath));
}

/* ------------------------------------------------------- components index */

const indexPath = path.join(DOCS_DIR, "index.mdx");
if (!fs.existsSync(indexPath) || FORCE) {
  const rows = catalog
    .map(
      (c) =>
        `| [${c.title}](/docs/components/${c.name}) | \`@sc1m/${c.name}\` | ` +
        `${c.hasControls ? "controls" : c.hasStory ? "preview" : "—"} |`,
    )
    .join("\n");

  const withControls = catalog.filter((c) => c.hasControls).length;
  const previewOnly = catalog.filter((c) => c.hasStory && !c.hasControls).length;

  const body = `---
title: "Components"
description: "Every component in the registry, with what its docs page currently shows."
---

${catalog.length} components, each built on a Base UI primitive and styled only
through [semantic tokens](/docs/foundations/tokens).

## Reading the Preview column

- **controls** — the page renders the real component with live prop inputs
  generated from its TypeScript props. ${withControls} pages.
- **preview** — the page renders a fixed, representative composition. Compound
  components (\`Dialog.Root\` + \`Trigger\` + \`Popup\`, and friends) have no single
  prop set to drive, so a composition is the honest thing to show. Vary them in
  Storybook: \`npm run storybook\`. ${previewOnly} pages.

Previews are lifted from each component's Storybook \`Default\` story by
\`npm run docs:gen\`, so they cannot drift from what is tested.

## Catalog

| Component | Install | Preview |
|---|---|---|
${rows}
`;
  if (!CHECK) fs.writeFileSync(indexPath, body);
  created.push(path.relative(root, indexPath));
}

/* ------------------------------------------------------ sidebar ordering */

const metaPath = path.join(DOCS_DIR, "meta.json");
if (!fs.existsSync(metaPath) || FORCE) {
  const meta = {
    title: "Components",
    pages: ["index", ...components.map((c) => c.name).sort()],
  };
  if (!CHECK) fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
  created.push(path.relative(root, metaPath));
}

/* ---------------------------------------------------------------- report */

console.log(
  `gen-component-docs: ${components.length} components — ` +
    `${created.length} written, ${skipped.length} left alone.`,
);
console.log(
  `  previews: ${components.length - missing.length} live ` +
    `(${components.length - missing.length - noControls.length} with prop controls, ` +
    `${noControls.length} fixed compositions)`,
);
if (missing.length) {
  console.log(`  no preview: ${missing.join(", ")}`);
}
if (CHECK && missing.length) process.exit(1);
