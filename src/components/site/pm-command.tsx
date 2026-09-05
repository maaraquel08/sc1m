import {
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  Pre,
} from "fumadocs-ui/components/codeblock";
import { cn } from "@/lib/cn";

/**
 * Package-manager tabs, in the shape shadcn/ui uses on its component pages:
 * a terminal glyph, four pill triggers, one command underneath.
 *
 * The tab group is `groupId`-linked and `persist`ed, so picking pnpm on one
 * page selects pnpm on every other block across the site and survives a
 * reload — the whole point of the pattern.
 */

const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;

type PackageManager = (typeof PACKAGE_MANAGERS)[number];

/** One-off binary execution (`shadcn@latest add …`). */
const EXEC: Record<PackageManager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};

/** Dependency installation (`@base-ui/react`). */
const ADD: Record<PackageManager, string> = {
  pnpm: "pnpm add",
  npm: "npm install",
  yarn: "yarn add",
  bun: "bun add",
};

/** Arbitrary package.json script (`dev`). */
const RUN: Record<PackageManager, string> = {
  pnpm: "pnpm",
  npm: "npm run",
  yarn: "yarn",
  bun: "bun run",
};

interface PMCommandProps {
  /** Run a binary once, e.g. `shadcn@latest add @sc1m/accordion`. */
  exec?: string;
  /** Add dependencies, e.g. `@base-ui/react clsx`. */
  add?: string;
  /** Run a package script, e.g. `dev`. */
  run?: string;
}

export function PMCommand({ exec, add, run }: PMCommandProps) {
  const [prefixes, argument] = exec
    ? [EXEC, exec]
    : add
      ? [ADD, add]
      : run
        ? [RUN, run]
        : [null, null];

  if (!prefixes || !argument) {
    throw new Error("<PMCommand /> needs one of `exec`, `add` or `run`.");
  }

  return (
    <CodeBlockTabs
      groupId="package-manager"
      persist
      defaultValue="pnpm"
      // `relative` here + `static` on the inner CodeBlock lifts its copy button
      // out of the command row and into the tab header, where the design puts
      // it. `overflow-hidden` keeps the command row square against the rounded
      // shell.
      className="relative overflow-hidden border-line bg-surface"
    >
      <CodeBlockTabsList className="items-center gap-1 px-1.5 py-1.5">
        <span
          aria-hidden
          className="flex size-[22px] shrink-0 items-center justify-center rounded-[5px] bg-fg font-mono text-[10px] leading-none text-bg"
        >
          &gt;_
        </span>
        {PACKAGE_MANAGERS.map((pm) => (
          <CodeBlockTabsTrigger
            key={pm}
            value={pm}
            className={cn(
              // Kill the underline indicator fumadocs paints, then re-style
              // the trigger as the raised pill shadcn uses.
              "[&>div]:hidden",
              "rounded-md px-2.5 py-1 font-mono text-[12.5px] font-normal text-fg-subtle",
              "data-[state=active]:border data-[state=active]:border-line",
              "data-[state=active]:bg-bg data-[state=active]:text-fg",
            )}
          >
            {pm}
          </CodeBlockTabsTrigger>
        ))}
      </CodeBlockTabsList>
      {PACKAGE_MANAGERS.map((pm) => (
        <CodeBlockTab key={pm} value={pm}>
          <CodeBlock className="static rounded-none border-0 bg-transparent shadow-none">
            <Pre>
              <code>
                <span className="line">{`${prefixes[pm]} ${argument}`}</span>
              </code>
            </Pre>
          </CodeBlock>
        </CodeBlockTab>
      ))}
    </CodeBlockTabs>
  );
}
