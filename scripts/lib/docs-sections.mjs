// Derives the per-component docs sections from sources that already exist —
// the component file, its generated demo, and Base UI's shipped types — so a
// page never states anything that is not true of the code it documents.
//
// Anything that cannot be derived is omitted rather than invented: a component
// with no second story gets no Example section, a part with no props of its
// own gets no table.

import { readPartProps } from "./base-ui-props.mjs";

/** Props every part inherits; listing them buries the ones that matter. */
const NOISE = new Set(["children", "className", "render", "style"]);

/* ------------------------------------------------------------- API rows */

export function apiSections(root, baseUi, exportsByPart, exports) {
  if (!baseUi) return [];

  // No parts means the primitive is a single element; its props live in one
  // flat file, and our first export is the thing that renders it.
  const parts = baseUi.parts.length ? baseUi.parts : [null];

  const sections = [];
  for (const part of parts) {
    const rows = readPartProps(root, baseUi.primitive, part);
    if (!rows) continue;

    const kept = rows.filter((r) => !NOISE.has(r.name));
    if (!kept.length) continue;

    // Name the section after our export, not Base UI's part — that is the
    // name a reader types.
    const exported = part === null ? exports[0] : exportsByPart.get(part);
    if (!exported) continue;

    sections.push({
      name: exported,
      rows: kept.map((r) => ({
        prop: r.name,
        type: r.type,
        def: r.def || "—",
        description: r.description,
      })),
    });
  }

  // Some primitives expose parts but still declare their props in one flat
  // file (Menubar). If no part yielded a table, try that before giving up.
  if (!sections.length && baseUi.parts.length) {
    const rows = readPartProps(root, baseUi.primitive, null);
    if (rows) {
      const kept = rows.filter((r) => !NOISE.has(r.name));
      if (kept.length) {
        sections.push({
          name: exports[0],
          rows: kept.map((r) => ({
            prop: r.name,
            type: r.type,
            def: r.def || "—",
            description: r.description,
          })),
        });
      }
    }
  }

  return sections;
}

/* --------------------------------------------------------- composition */

/**
 * The element tree of the demo, filtered to this component's own exports.
 *
 * Reading it out of real composed JSX means the tree matches something that
 * actually renders, and it re-derives itself when the demo changes.
 */
export function compositionTree(demoSrc, exports) {
  const own = new Set(exports);
  const lines = [];
  const stack = [];

  const tagRe = /<(\/?)([A-Z][A-Za-z0-9_.]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = tagRe.exec(demoSrc))) {
    const [, closing, tag, , selfClosing] = m;
    const mine = own.has(tag);

    if (closing) {
      const at = stack.lastIndexOf(tag);
      if (at !== -1) stack.length = at;
      continue;
    }

    if (mine) lines.push({ tag, depth: stack.filter((t) => own.has(t)).length });
    if (!selfClosing) stack.push(tag);
  }

  if (!lines.length) return null;

  // A demo repeats parts — three AccordionItems, two DialogCloses. The tree
  // describes shape, not multiplicity, so each (tag, depth) appears once.
  const seen = new Set();
  const out = [];
  for (const line of lines) {
    const key = `${line.tag}@${line.depth}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }

  // A single node is not a composition — the page says nothing by drawing it.
  if (out.length < 2) return null;

  return out.map((l) => `${"  ".repeat(l.depth)}${l.tag}`).join("\n");
}

/* -------------------------------------------------------------- tokens */

/**
 * Which semantic tokens the component consumes, and where.
 *
 * Scanned from the utilities in the source, so the table cannot drift from
 * the component. "Applied to" is the export the utility sits in, which is
 * derivable; no attempt is made to describe *why* — that would be authored.
 */
const TOKEN_UTILITIES = [
  [/\b(?:bg|text|border|outline|ring|fill|stroke|decoration|divide)-(bg|surface-raised|surface|fg-muted|fg-subtle|fg|line-strong|line|accent-hover|accent-fg|accent|highlight-fg|highlight|success|danger-fg|danger|info|ring)\b/g, (t) => `--${t}`],
  [/\brounded-(sm|md|lg|xl)\b/g, (t) => `--brand-radius-${t}`],
  [/\bshadow-(raised|overlay)\b/g, (t) => `--shadow-${t}`],
  [/\bduration-\(--([a-z0-9-]+)\)/g, (t) => `--${t}`],
  [/\bease-\(--([a-z0-9-]+)\)/g, (t) => `--${t}`],
  [/\bfont-(sans|mono)\b/g, (t) => `--font-${t}`],
];

export function tokenRows(componentSrc, exports) {
  // Split the file into its exported functions so a hit can be attributed.
  const bodies = [];
  const fnRe = /export function ([A-Za-z0-9_]+)\s*\(/g;
  let m;
  const marks = [];
  while ((m = fnRe.exec(componentSrc))) marks.push({ name: m[1], at: m.index });
  for (let i = 0; i < marks.length; i++) {
    bodies.push({
      name: marks[i].name,
      text: componentSrc.slice(marks[i].at, marks[i + 1]?.at ?? componentSrc.length),
    });
  }

  const found = new Map(); // token -> Set(export)
  for (const body of bodies) {
    if (!exports.includes(body.name)) continue;
    for (const [re, toToken] of TOKEN_UTILITIES) {
      re.lastIndex = 0;
      let hit;
      while ((hit = re.exec(body.text))) {
        const token = toToken(hit[1]);
        if (!found.has(token)) found.set(token, new Set());
        found.get(token).add(body.name);
      }
    }
  }

  return [...found.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([token, where]) => [token, [...where].join(", ")]);
}

/* ------------------------------------------------------- accessibility */

/**
 * Only claims that can be checked against the source. The behaviour a reader
 * most wants — the full keyboard map — belongs to the primitive, so the
 * section points at Base UI's page for it rather than paraphrasing from
 * memory.
 */
export function accessibilityNotes(componentSrc, baseUi, title) {
  const notes = [];

  if (baseUi) {
    notes.push(
      `Behaviour, focus management, and ARIA wiring come from ` +
        `[Base UI's ${title}](https://base-ui.com/react/components/${baseUi.primitive}) — ` +
        `see its reference for the full keyboard map.`,
    );
  }

  const facts = [];
  if (/focus-visible:outline/.test(componentSrc)) {
    facts.push(
      "Keyboard focus draws a 2px ring in `--ring`, never removed — only " +
        "shown on `:focus-visible`, so a pointer press does not paint one.",
    );
  }
  if (/aria-hidden/.test(componentSrc)) {
    facts.push("Decorative glyphs are `aria-hidden`, so they are not announced.");
  }
  if (/data-disabled/.test(componentSrc)) {
    facts.push(
      "Disabled parts mute their contents rather than the element, keeping " +
        "the focus ring at full strength where the part stays focusable.",
    );
  }
  if (/motion-reduce:/.test(componentSrc)) {
    facts.push("Every transition is dropped under `prefers-reduced-motion`.");
  }

  return { intro: notes, facts };
}

/* ------------------------------------------------- export ↔ Base UI part */

/**
 * Which Base UI part each of our exports renders, e.g. `AccordionTrigger` ->
 * `Trigger`. Taken from the first `Base<X>.<Part>` inside each exported
 * function, which is the element that export *is*.
 */
export function exportsByPart(componentSrc, exports) {
  const map = new Map();

  // A part this thin is re-exported outright: `export const Dialog =
  // BaseDialog.Root`. Those bind an export to a part directly.
  const aliasRe = /export const ([A-Za-z0-9_]+)\s*=\s*Base[A-Za-z]*\.([A-Z][A-Za-z]*)\s*;/g;
  let m;
  while ((m = aliasRe.exec(componentSrc))) {
    if (exports.includes(m[1]) && !map.has(m[2])) map.set(m[2], m[1]);
  }

  // Anything styled is a function; the part is the element it renders.
  const marks = [];
  const fnRe = /export function ([A-Za-z0-9_]+)\s*\(/g;
  while ((m = fnRe.exec(componentSrc))) marks.push({ name: m[1], at: m.index });

  for (let i = 0; i < marks.length; i++) {
    const { name, at } = marks[i];
    if (!exports.includes(name)) continue;
    const body = componentSrc.slice(at, marks[i + 1]?.at ?? componentSrc.length);
    const part = body.match(/\bBase[A-Za-z]*\.([A-Z][A-Za-z]*)\b/)?.[1];
    // First export wins a part: `AccordionTrigger` renders Header *and*
    // Trigger, and Trigger is the one it is named for.
    if (part && !map.has(part)) map.set(part, name);
  }
  return map;
}

/* ---------------------------------------------------------- demo source */

/**
 * The JSX the demo returns, dedented — the Example section's code.
 *
 * This is the exact source of what the preview above it renders, so the two
 * can never disagree.
 */
export function demoJsx(demoSrc) {
  const at = demoSrc.search(/export function Demo\s*\([^)]*\)\s*\{/);
  if (at === -1) return null;

  // `return ( … );` for a composed demo, `return <X … />;` for one built from
  // a controls story.
  const ret = demoSrc.indexOf("return", at);
  if (ret === -1) return null;

  let open = demoSrc.indexOf("(", ret);
  const angle = demoSrc.indexOf("<", ret);
  if (open === -1 || (angle !== -1 && angle < open)) {
    const end = demoSrc.indexOf(";", angle);
    return end === -1 ? null : demoSrc.slice(angle, end).trim();
  }
  let depth = 0;
  let end = open;
  for (; end < demoSrc.length; end++) {
    if (demoSrc[end] === "(") depth++;
    else if (demoSrc[end] === ")") {
      depth--;
      if (depth === 0) break;
    }
  }

  const body = demoSrc.slice(open + 1, end).replace(/^\n/, "").replace(/\s+$/, "");
  const indents = body
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => l.match(/^\s*/)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return body
    .split("\n")
    .map((l) => l.slice(min))
    .join("\n");
}
