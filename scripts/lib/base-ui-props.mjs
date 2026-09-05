// Reads the *own* props of a Base UI part straight from its shipped .d.ts.
//
// Base UI's part files follow one layout — `@base-ui/react/<primitive>/<part>/
// <Pascal><Part>.d.ts`, exporting `interface <Pascal><Part>Props extends
// BaseUIComponentProps<…> { … }`. Only the members declared in that interface
// are read: everything inherited is the underlying element's DOM props plus
// Base UI's `className`/`render`, which would bury the handful of props a
// reader actually reaches for under a few hundred HTML attributes.
//
// Descriptions and defaults come from the JSDoc Base UI already writes, so
// nothing here is authored — it is the library's own documentation, surfaced.

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const BASE_UI = "node_modules/@base-ui/react";

/** "alert-dialog" -> "AlertDialog", "root" -> "Root" */
export function pascal(kebab) {
  return kebab.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
}

/** "SubmenuRoot" -> "submenu-root" */
function kebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Which Base UI primitive a component wraps, and which of its parts it uses.
 *
 * Both come from the source rather than a hand-kept map: the import names the
 * primitive, and `Base<X>.<Part>` call sites name the parts. Parts are
 * returned in the order they first appear, which is composition order.
 */
export function parseBaseUi(componentSrc) {
  const primitive = componentSrc.match(
    /from\s+"@base-ui\/react\/([a-z-]+)"/,
  )?.[1];
  if (!primitive) return null;

  const parts = [];
  const re = /\bBase[A-Za-z]*\.([A-Z][A-Za-z]*)\b/g;
  let m;
  while ((m = re.exec(componentSrc))) {
    if (!parts.includes(m[1])) parts.push(m[1]);
  }
  return { primitive, parts };
}

/** Strip a JSDoc block to its prose, and pull out `@default`. */
function readDoc(block) {
  if (!block) return { description: "", def: "" };

  const lines = block
    .replace(/^\/\*\*/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((l) => l.replace(/^\s*\*ic?\s?/, "").replace(/^\s*\*\s?/, ""));

  let def = "";
  const prose = [];
  let inExample = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("@default")) {
      def = trimmed.slice("@default".length).trim();
      continue;
    }
    // Code samples and cross-references are useful in an editor tooltip and
    // noise in a table cell.
    if (trimmed.startsWith("@example")) inExample = true;
    if (trimmed.startsWith("@")) continue;
    if (inExample) continue;
    prose.push(trimmed);
  }

  const full = prose
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .trim();

  // First sentence only. Base UI's longer entries enumerate every value of a
  // union, which reads fine in an editor tooltip and overwhelms a table row;
  // the page links its reference for the rest.
  const cut = full.search(/\.(?=\s+[A-Z-]|$)/);
  const description = cut === -1 ? full : full.slice(0, cut + 1);

  return { description, def };
}

/** Top-level members of an interface body, with the JSDoc above each. */
function ownMembers(body) {
  const rows = [];
  let i = 0;
  let pendingDoc = null;

  while (i < body.length) {
    // JSDoc block
    if (body.startsWith("/**", i)) {
      const end = body.indexOf("*/", i);
      if (end === -1) break;
      pendingDoc = body.slice(i, end + 2);
      i = end + 2;
      continue;
    }

    const m = /^\s*(readonly\s+)?([A-Za-z_$][A-Za-z0-9_$]*)(\?)?\s*:/.exec(
      body.slice(i),
    );
    if (!m) {
      i++;
      continue;
    }

    const start = i + m[0].length;
    // Walk to the semicolon that ends this member, ignoring the ones nested
    // inside object types, generics, and parenthesised signatures.
    let depth = 0;
    let j = start;
    for (; j < body.length; j++) {
      const c = body[j];
      if (c === "{" || c === "(" || c === "<" || c === "[") depth++;
      else if (c === "}" || c === ")" || c === ">" || c === "]") depth--;
      else if (c === ";" && depth <= 0) break;
    }

    const type = body
      .slice(start, j)
      .replace(/\s+/g, " ")
      // `| undefined` is how Base UI spells optional; the `?` already says it.
      .replace(/\s*\|\s*undefined\s*$/, "")
      .trim();

    const { description, def } = readDoc(pendingDoc);
    // Deprecated members are documented as such and only add noise.
    if (!/@deprecated/.test(pendingDoc ?? "")) {
      rows.push({ name: m[2], optional: Boolean(m[3]), type, description, def });
    }
    pendingDoc = null;
    i = j + 1;
  }

  return rows;
}

/**
 * Own props of one part, or null when the part has no `.d.ts` of its own
 * (`Header`, `Provider`, and other pass-through parts).
 */
export function readPartProps(root, primitive, part) {
  // A primitive with no parts (CheckboxGroup, Toggle, Separator) ships one
  // flat file instead of a directory per part.
  const flat = part === null;
  const file = flat
    ? resolve(root, BASE_UI, primitive, `${pascal(primitive)}.d.ts`)
    : resolve(
        root,
        BASE_UI,
        primitive,
        kebab(part),
        `${pascal(primitive)}${part}.d.ts`,
      );
  if (!existsSync(file)) return null;

  const src = readFileSync(file, "utf8");
  const name = flat
    ? `${pascal(primitive)}Props`
    : `${pascal(primitive)}${part}Props`;
  const at = src.indexOf(`interface ${name}`);
  if (at === -1) return null;

  const open = src.indexOf("{", at);
  if (open === -1) return null;
  let depth = 0;
  let end = open;
  for (; end < src.length; end++) {
    if (src[end] === "{") depth++;
    else if (src[end] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }

  const rows = ownMembers(src.slice(open + 1, end));
  return rows.length ? rows : null;
}
