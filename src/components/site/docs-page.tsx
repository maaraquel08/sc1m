import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge, type BadgeProps } from "@/components/ui/badge";

/**
 * Page furniture for component docs, following the Claude Design
 * "Accordion Docs" layout: status badges under the title, a tinted preview
 * frame, and mono-headed spec tables for props, keyboard, and tokens.
 *
 * Every colour, radius, and font here resolves through the sc1m token
 * contract, so the pages follow the active brand and theme rather than the
 * design file's own palette.
 */

/* ---------------------------------------------------------------- chips -- */

/**
 * The status chips under a page title are the DS's own `Badge`, so the docs
 * demonstrate the component rather than a look-alike. `Chips` only owns the
 * row: the wrap, the gap, and `not-prose` to keep fumadocs' typography off it.
 */
interface Chip {
  label: string;
  tone?: BadgeProps["tone"];
}

export function Chips({ items }: { items: Chip[] }) {
  return (
    <div className="not-prose mt-4 flex flex-wrap gap-2">
      {items.map(({ label, tone }) => (
        <Badge key={label} tone={tone}>
          {label}
        </Badge>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- preview -- */

/**
 * The tinted frame every example sits in: a soft panel, with the component
 * itself on the page background at the centre.
 */
export function Preview({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "not-prose my-4 rounded-xl border border-line bg-surface px-9 py-10",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[560px] justify-center">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------- spec table -- */

interface Column {
  label: string;
  /** Extra classes for every cell in this column (not the header). */
  className?: string;
}

interface SpecTableProps {
  columns: Column[];
  /** CSS `grid-template-columns` value. Defaults to equal columns. */
  widths?: string;
  rows: ReactNode[][];
  /** Minimum grid width before the table scrolls horizontally. */
  minWidth?: number;
}

/**
 * The bordered grid the design uses for props, keyboard shortcuts, and
 * tokens. One primitive rather than three near-identical tables — the
 * column set is the only thing that differs between them.
 */
export function SpecTable({
  columns,
  widths,
  rows,
  minWidth = 560,
}: SpecTableProps) {
  const template = widths ?? `repeat(${columns.length}, 1fr)`;

  return (
    <div className="not-prose my-4 overflow-x-auto rounded-lg border border-line">
      <div style={{ minWidth }}>
        <div
          className="grid bg-surface px-3.5 py-2.5 font-mono text-[10.5px] tracking-[0.08em] text-fg-subtle uppercase"
          style={{ gridTemplateColumns: template }}
        >
          {columns.map((column) => (
            <span key={column.label}>{column.label}</span>
          ))}
        </div>
        {rows.map((row, rowIndex) => (
          <div
            // Rows carry no id of their own and cells may repeat across them.
            key={rowIndex}
            className="grid items-baseline border-t border-line px-3.5 py-3 text-[13px]"
            style={{ gridTemplateColumns: template }}
          >
            {row.map((cell, cellIndex) => (
              <span
                key={cellIndex}
                className={cn("leading-relaxed", columns[cellIndex]?.className)}
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Column presets, so each page states its data and not its typography. */
export const propColumns: Column[] = [
  { label: "Prop", className: "font-mono text-xs text-fg" },
  { label: "Type", className: "font-mono text-xs text-info" },
  { label: "Default", className: "font-mono text-xs text-fg-muted" },
  { label: "Description", className: "text-fg-muted" },
];

export const keyColumns: Column[] = [
  { label: "Key", className: "font-mono text-xs text-fg" },
  { label: "Behaviour", className: "text-fg-muted" },
];

export const tokenColumns: Column[] = [
  { label: "Token", className: "font-mono text-xs text-fg" },
  { label: "Resolves to", className: "font-mono text-xs text-fg-muted" },
  { label: "Applied to", className: "text-fg-muted" },
];
