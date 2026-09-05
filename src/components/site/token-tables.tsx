/**
 * The foundations, as renderable data.
 *
 * Both the gallery homepage (src/app/page.tsx) and the docs' Tokens page
 * (content/docs/foundations/tokens.mdx) show these, so they live here rather
 * than being written out twice and drifting.
 *
 * Every swatch is painted with a Tailwind utility, not a hard-coded colour —
 * so these tables re-render correctly under .dark and under any [data-brand].
 */

export const colorTokens = [
  { name: "bg", class: "bg-bg", role: "Page background" },
  { name: "surface", class: "bg-surface", role: "Recessed surfaces" },
  { name: "surface-raised", class: "bg-surface-raised", role: "Cards, popups" },
  { name: "fg", class: "bg-fg", role: "Primary text" },
  { name: "fg-muted", class: "bg-fg-muted", role: "Secondary text" },
  { name: "fg-subtle", class: "bg-fg-subtle", role: "Hints, placeholders" },
  { name: "line", class: "bg-line", role: "Borders, dividers" },
  { name: "line-strong", class: "bg-line-strong", role: "Emphasized borders" },
  { name: "accent", class: "bg-accent", role: "Primary actions" },
  { name: "accent-hover", class: "bg-accent-hover", role: "Action hover" },
  { name: "highlight", class: "bg-highlight", role: "The add action. Nothing else." },
  { name: "success", class: "bg-success", role: "Positive outcomes" },
  { name: "danger", class: "bg-danger", role: "Errors, destructive actions" },
  { name: "info", class: "bg-info", role: "AI authorship signal" },
  { name: "ring", class: "bg-ring", role: "Focus indicator" },
];

export const typeScale = [
  {
    label: "text-2xl / semibold",
    class: "text-2xl font-semibold tracking-tight",
    sample: "Page titles",
  },
  { label: "text-base / semibold", class: "text-base font-semibold", sample: "Section headings" },
  { label: "text-sm / medium", class: "text-sm font-medium", sample: "Labels and controls" },
  { label: "text-sm / regular", class: "text-sm", sample: "Body copy for product surfaces" },
  { label: "text-xs / regular", class: "text-xs text-fg-muted", sample: "Captions and helper text" },
];

export const radii = [
  { name: "sm", class: "rounded-sm" },
  { name: "md", class: "rounded-md" },
  { name: "lg", class: "rounded-lg" },
  { name: "xl", class: "rounded-xl" },
];

export function ColorTokens() {
  return (
    <ul className="mt-4 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
      {colorTokens.map((token) => (
        <li key={token.name} className="overflow-hidden rounded-lg border border-line">
          <div className={`h-12 ${token.class}`} />
          <div className="px-3 py-2">
            <p className="font-mono text-xs">{token.name}</p>
            <p className="mt-0.5 text-xs text-fg-muted">{token.role}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TypeScale() {
  return (
    <ul className="mt-4 list-none divide-y divide-line rounded-lg border border-line p-0">
      {typeScale.map((step) => (
        <li
          key={step.label}
          className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between"
        >
          <span className={step.class}>{step.sample}</span>
          <span className="font-mono text-xs text-fg-subtle">{step.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function Radii() {
  return (
    <div className="mt-4 flex items-end gap-4">
      {radii.map((r) => (
        <div key={r.name} className="flex flex-col items-center gap-2">
          <div className={`size-14 border border-line-strong bg-surface ${r.class}`} />
          <span className="font-mono text-xs text-fg-muted">{r.name}</span>
        </div>
      ))}
    </div>
  );
}

export function Elevation() {
  return (
    <div className="mt-4 flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="size-14 rounded-lg border border-line bg-surface-raised shadow-raised" />
        <span className="font-mono text-xs text-fg-muted">raised</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="size-14 rounded-lg border border-line bg-surface-raised shadow-overlay" />
        <span className="font-mono text-xs text-fg-muted">overlay</span>
      </div>
    </div>
  );
}
