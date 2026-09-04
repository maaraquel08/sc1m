"use client";

/**
 * The Tokens page's spec tables.
 *
 * Separate from token-tables.tsx on purpose: that file's compact card grid is
 * what the gallery homepage shows, and this is the documentation view — four
 * columns, a live sample, and the utility you actually type. Both read the
 * same data, so neither can drift from the other.
 *
 * "use client" is load-bearing. Every value column reads its own token back
 * out of the DOM, so the tables are a live test of the contract rather than a
 * transcription of it: flip the theme or the brand and the numbers follow.
 * Nothing here hardcodes a colour.
 */

import * as React from "react";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ live */

/** Reads custom properties off <html>, re-reading whenever theme or brand flips. */
function useTokenValues(names: string[]) {
  const key = names.join(",");
  const subscribe = React.useCallback((onChange: () => void) => {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-brand"],
    });
    return () => observer.disconnect();
  }, []);

  // Read inside the snapshot so a brand/theme flip produces a new string and
  // React re-renders. Both callbacks close over `key` rather than the array,
  // so they stay stable across renders — a fresh getSnapshot identity every
  // render would make useSyncExternalStore loop.
  const getSnapshot = React.useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    return key
      .split(",")
      .map((n) => style.getPropertyValue(n).trim())
      .join("|");
  }, [key]);

  // The server has no DOM, so the first paint ships em dashes and the effect
  // fills them in. Rendering a guess would be a hydration mismatch.
  const serverSnapshot = React.useCallback(
    () => key.split(",").map(() => "").join("|"),
    [key],
  );

  const raw = React.useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  return raw.split("|");
}

/* ----------------------------------------------------------------- shell */

type Col = { label: string; width: string };

function Table({
  columns,
  children,
}: {
  columns: Col[];
  children: React.ReactNode;
}) {
  const template = columns.map((c) => c.width).join(" ");
  return (
    <div className="mt-3 overflow-x-auto rounded-md border border-line">
      <div
        // min-width rather than a responsive collapse: a spec table that
        // reflows into stacked cards stops being scannable, which is the only
        // thing it is for. It scrolls instead.
        className="grid min-w-[560px] border-b border-line bg-surface font-mono text-[9.5px] font-semibold tracking-[0.12em] text-fg-subtle uppercase"
        style={{ gridTemplateColumns: template }}
      >
        {columns.map((c, i) => (
          <div key={c.label + i} className={i === 0 ? "px-[18px] py-2" : "px-3 py-2"}>
            {c.label}
          </div>
        ))}
      </div>
      <div style={{ ["--cols" as string]: template }}>{children}</div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="grid min-w-[560px] items-center border-b border-line last:border-b-0"
      style={{ gridTemplateColumns: "var(--cols)" }}
    >
      {children}
    </div>
  );
}

/** A 26px chip painted by a utility class, never a literal colour. */
function Swatch({ className }: { className: string }) {
  return (
    <div className="px-[18px] py-2">
      <span
        className={cn(
          "block size-[26px] rounded-[3px] border border-line-strong",
          className,
        )}
      />
    </div>
  );
}

const Name = ({ children }: { children: React.ReactNode }) => (
  <div className="px-3 py-[9px] font-mono text-[12.5px] text-fg">{children}</div>
);
const Role = ({ children }: { children: React.ReactNode }) => (
  <div className="px-3 py-[9px] text-[13px] text-fg-muted">{children}</div>
);
const Value = ({ children }: { children: React.ReactNode }) => (
  <div className="px-[18px] py-[9px] font-mono text-xs text-fg-subtle">
    {children || "—"}
  </div>
);

/** Section sub-head: the name on the left, what the group is for on the right. */
export function TokenGroup({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-7 flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="m-0 text-[13px] font-semibold text-fg">{title}</h3>
        <span className="text-right text-xs text-fg-subtle">{caption}</span>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ root tier */

/** Each brand names its own primitives; the ramp is the one shared shape. */
const BRAND_PALETTES: Record<string, { name: string; resolves: string }[]> = {
  sc1m: [
    { name: "--sc1m-orange", resolves: "accent, accent-hover, ring" },
    { name: "--sc1m-paper", resolves: "bg, surface-raised, accent-fg" },
  ],
  ledger: [
    { name: "--brand-ink", resolves: "accent, ring, fg" },
    { name: "--brand-accent", resolves: "highlight, info" },
    { name: "--brand-paper", resolves: "bg, surface-raised" },
    { name: "--money-in", resolves: "success" },
    { name: "--money-out", resolves: "danger" },
  ],
};

function useBrand() {
  const subscribe = React.useCallback((onChange: () => void) => {
    const o = new MutationObserver(onChange);
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-brand"] });
    return () => o.disconnect();
  }, []);
  return React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute("data-brand") ?? "sc1m",
    () => "sc1m",
  );
}

export function RootHues() {
  const brand = useBrand();
  const rows = BRAND_PALETTES[brand] ?? BRAND_PALETTES.sc1m;
  const values = useTokenValues(rows.map((r) => r.name));
  return (
    <Table
      columns={[
        { label: "Value", width: "minmax(64px,170px)" },
        { label: "Root token", width: "minmax(90px,170px)" },
        { label: "Resolves", width: "minmax(90px,1fr)" },
        { label: "Current", width: "minmax(110px,180px)" },
      ]}
    >
      {rows.map((r, i) => (
        <Row key={r.name}>
          <div className="px-[18px] py-2">
            <span
              className="block size-[26px] rounded-[3px] border border-line-strong"
              style={{ background: `var(${r.name})` }}
            />
          </div>
          <Name>{r.name}</Name>
          <Role>{r.resolves}</Role>
          <Value>{values[i]}</Value>
        </Row>
      ))}
    </Table>
  );
}

const RAMP = [
  { name: "--n-0", role: "Deepest recess" },
  { name: "--n-50", role: "surface" },
  { name: "--n-100", role: "surface-raised in dark" },
  { name: "--n-200", role: "line" },
  { name: "--n-300", role: "line-strong" },
  { name: "--n-400", role: "Muted marks" },
  { name: "--n-500", role: "fg-subtle" },
  { name: "--n-700", role: "fg-muted" },
  { name: "--n-900", role: "fg" },
];

export function NeutralRamp() {
  const values = useTokenValues(RAMP.map((r) => r.name));
  return (
    <Table
      columns={[
        { label: "Value", width: "minmax(64px,170px)" },
        { label: "Root token", width: "minmax(90px,170px)" },
        { label: "Resolves", width: "minmax(90px,1fr)" },
        { label: "Current", width: "minmax(110px,180px)" },
      ]}
    >
      {RAMP.map((r, i) => (
        <Row key={r.name}>
          <div className="px-[18px] py-2">
            <span
              className="block size-[26px] rounded-[3px] border border-line-strong"
              style={{ background: `var(${r.name})` }}
            />
          </div>
          <Name>{r.name}</Name>
          <Role>{r.role}</Role>
          <Value>{values[i]}</Value>
        </Row>
      ))}
    </Table>
  );
}

/* -------------------------------------------------------- semantic tier */

type Semantic = { name: string; swatch: string; role: string; utility: string };

function SemanticTable({ rows }: { rows: Semantic[] }) {
  const values = useTokenValues(rows.map((r) => `--${r.name}`));
  return (
    <Table
      columns={[
        { label: "", width: "52px" },
        { label: "Token", width: "minmax(90px,170px)" },
        { label: "Role", width: "minmax(90px,1fr)" },
        { label: "Utility", width: "minmax(110px,180px)" },
      ]}
    >
      {rows.map((r, i) => (
        <Row key={r.name}>
          <Swatch className={r.swatch} />
          <Name>{r.name}</Name>
          <Role>{r.role}</Role>
          <div className="px-[18px] py-[9px] font-mono text-xs">
            <span className="text-fg-subtle">{r.utility}</span>
            <span className="sr-only"> resolves to {values[i]}</span>
          </div>
        </Row>
      ))}
    </Table>
  );
}

export const SurfaceTokens = () => (
  <SemanticTable
    rows={[
      { name: "bg", swatch: "bg-bg", role: "Page background", utility: "bg-bg" },
      { name: "surface", swatch: "bg-surface", role: "Recessed surfaces", utility: "bg-surface" },
      { name: "surface-raised", swatch: "bg-surface-raised", role: "Cards, popups", utility: "bg-surface-raised" },
    ]}
  />
);

/** Text tokens are shown as type, because type is the only thing they paint. */
export function TextTokens() {
  const rows = [
    { name: "fg", cls: "text-fg", role: "Primary text", utility: "text-fg" },
    { name: "fg-muted", cls: "text-fg-muted", role: "Secondary text", utility: "text-fg-muted" },
    { name: "fg-subtle", cls: "text-fg-subtle", role: "Hints, placeholders", utility: "text-fg-subtle" },
  ];
  return (
    <Table
      columns={[
        { label: "Sample", width: "minmax(64px,170px)" },
        { label: "Token", width: "minmax(90px,170px)" },
        { label: "Role", width: "minmax(90px,1fr)" },
        { label: "Utility", width: "minmax(110px,180px)" },
      ]}
    >
      {rows.map((r) => (
        <Row key={r.name}>
          <div className={cn("px-[18px] py-2 text-base tracking-tight", r.cls)}>
            Aa quick fox
          </div>
          <Name>{r.name}</Name>
          <Role>{r.role}</Role>
          <Value>{r.utility}</Value>
        </Row>
      ))}
    </Table>
  );
}

/** Lines are hairlines, so a 26px block would misrepresent them. */
export function LineTokens() {
  const rows = [
    { name: "line", cls: "border-line", role: "Borders, dividers", utility: "border-line" },
    { name: "line-strong", cls: "border-line-strong", role: "Emphasised borders", utility: "border-line-strong" },
  ];
  return (
    <Table
      columns={[
        { label: "Sample", width: "minmax(64px,170px)" },
        { label: "Token", width: "minmax(90px,170px)" },
        { label: "Role", width: "minmax(90px,1fr)" },
        { label: "Utility", width: "minmax(110px,180px)" },
      ]}
    >
      {rows.map((r) => (
        <Row key={r.name}>
          <div className="px-[18px] py-3">
            <span className={cn("block h-0 w-full border-t", r.cls)} />
          </div>
          <Name>{r.name}</Name>
          <Role>{r.role}</Role>
          <Value>{r.utility}</Value>
        </Row>
      ))}
    </Table>
  );
}

export const ActionTokens = () => (
  <SemanticTable
    rows={[
      { name: "accent", swatch: "bg-accent", role: "Primary actions", utility: "bg-accent" },
      { name: "accent-hover", swatch: "bg-accent-hover", role: "Action hover", utility: "bg-accent-hover" },
      { name: "accent-fg", swatch: "bg-accent-fg", role: "Text on accent", utility: "text-accent-fg" },
      { name: "highlight", swatch: "bg-highlight", role: "The add action. Nothing else.", utility: "bg-highlight" },
      { name: "highlight-fg", swatch: "bg-highlight-fg", role: "Glyph on highlight", utility: "text-highlight-fg" },
      { name: "ring", swatch: "bg-ring", role: "Focus indicator", utility: "outline-ring" },
    ]}
  />
);

export const StatusTokens = () => (
  <SemanticTable
    rows={[
      { name: "success", swatch: "bg-success", role: "Positive outcomes", utility: "bg-success" },
      { name: "warning", swatch: "bg-warning", role: "Caution, deprecation", utility: "bg-warning" },
      { name: "danger", swatch: "bg-danger", role: "Errors, destructive actions", utility: "bg-danger" },
      { name: "danger-fg", swatch: "bg-danger-fg", role: "Text on danger", utility: "text-danger-fg" },
      { name: "info", swatch: "bg-info", role: "AI authorship signal", utility: "bg-info" },
    ]}
  />
);

/* ------------------------------------------------------- shape and type */

export function TypeSpec() {
  const rows = [
    { cls: "text-2xl font-semibold tracking-tight", sample: "Page titles", used: "Page titles", size: "text-2xl", weight: "semibold" },
    { cls: "text-base font-semibold", sample: "Section headings", used: "Section headings", size: "text-base", weight: "semibold" },
    { cls: "text-sm font-medium", sample: "Labels and controls", used: "Labels, controls", size: "text-sm", weight: "medium" },
    { cls: "text-sm", sample: "Body copy", used: "Body copy", size: "text-sm", weight: "regular" },
    { cls: "text-xs text-fg-muted", sample: "Captions", used: "Captions, helper text", size: "text-xs", weight: "regular" },
  ];
  return (
    <Table
      columns={[
        { label: "Sample", width: "minmax(64px,170px)" },
        { label: "Used for", width: "minmax(90px,170px)" },
        { label: "Size", width: "minmax(90px,1fr)" },
        { label: "Weight", width: "minmax(110px,180px)" },
      ]}
    >
      {rows.map((r) => (
        <Row key={r.size + r.weight}>
          <div className={cn("px-[18px] py-2.5 text-fg", r.cls)}>{r.sample}</div>
          <Role>{r.used}</Role>
          <div className="px-3 py-[9px] font-mono text-xs text-fg-subtle">{r.size}</div>
          <Value>{r.weight}</Value>
        </Row>
      ))}
    </Table>
  );
}

export function RadiusSpec() {
  const names = ["--brand-radius-sm", "--brand-radius-md", "--brand-radius-lg", "--brand-radius-xl"];
  const values = useTokenValues(names);
  const rows = [
    { cls: "rounded-sm", used: "Chips, code, small marks" },
    { cls: "rounded-md", used: "Inputs, tiles, small cards" },
    { cls: "rounded-lg", used: "Cards, banners, panels" },
    { cls: "rounded-xl", used: "Sheets, detached surfaces" },
  ];
  return (
    <Table
      columns={[
        { label: "Sample", width: "minmax(64px,170px)" },
        { label: "Token", width: "minmax(90px,170px)" },
        { label: "Used for", width: "minmax(90px,1fr)" },
        { label: "Current", width: "minmax(110px,180px)" },
      ]}
    >
      {rows.map((r, i) => (
        <Row key={r.cls}>
          <div className="px-[18px] py-2.5">
            <span
              className={cn("block h-[26px] w-11 border border-line-strong bg-surface", r.cls)}
            />
          </div>
          <Name>{names[i].slice(2)}</Name>
          <Role>{r.used}</Role>
          <Value>{values[i]}</Value>
        </Row>
      ))}
    </Table>
  );
}

export function ElevationSpec() {
  const rows = [
    { cls: "shadow-raised", name: "shadow-raised", used: "Cards, detached accordion items", utility: "shadow-raised" },
    { cls: "shadow-overlay", name: "shadow-overlay", used: "Popups, menus, dialogs", utility: "shadow-overlay" },
  ];
  return (
    <Table
      columns={[
        { label: "Sample", width: "minmax(64px,170px)" },
        { label: "Token", width: "minmax(90px,170px)" },
        { label: "Used for", width: "minmax(90px,1fr)" },
        { label: "Utility", width: "minmax(110px,180px)" },
      ]}
    >
      {rows.map((r) => (
        <Row key={r.name}>
          <div className="px-[18px] py-3.5">
            <span
              className={cn(
                "block h-[26px] w-11 rounded-md border border-line bg-surface-raised",
                r.cls,
              )}
            />
          </div>
          <Name>{r.name}</Name>
          <Role>{r.used}</Role>
          <Value>{r.utility}</Value>
        </Row>
      ))}
    </Table>
  );
}
