import { Gallery } from "@/components/site/gallery";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";

const colorTokens = [
  { name: "bg", class: "bg-bg", role: "Page background" },
  { name: "surface", class: "bg-surface", role: "Recessed surfaces" },
  { name: "surface-raised", class: "bg-surface-raised", role: "Cards, popups" },
  { name: "fg", class: "bg-fg", role: "Primary text" },
  { name: "fg-muted", class: "bg-fg-muted", role: "Secondary text" },
  { name: "fg-subtle", class: "bg-fg-subtle", role: "Hints, placeholders" },
  { name: "line", class: "bg-line", role: "Borders, dividers" },
  { name: "line-strong", class: "bg-line-strong", role: "Emphasized borders" },
  { name: "accent", class: "bg-accent", role: "Primary actions — brand ink" },
  { name: "accent-hover", class: "bg-accent-hover", role: "Action hover" },
  { name: "highlight", class: "bg-highlight", role: "The add action. Nothing else." },
  { name: "success", class: "bg-success", role: "Positive outcomes" },
  { name: "danger", class: "bg-danger", role: "Errors, destructive actions" },
  { name: "info", class: "bg-info", role: "AI authorship — the brand yellow" },
  { name: "ring", class: "bg-ring", role: "Focus indicator" },
];

const typeScale = [
  { label: "text-2xl / semibold", class: "text-2xl font-semibold tracking-tight", sample: "Page titles" },
  { label: "text-base / semibold", class: "text-base font-semibold", sample: "Section headings" },
  { label: "text-sm / medium", class: "text-sm font-medium", sample: "Labels and controls" },
  { label: "text-sm / regular", class: "text-sm", sample: "Body copy for product surfaces" },
  { label: "text-xs / regular", class: "text-xs text-fg-muted", sample: "Captions and helper text" },
];

const radii = [
  { name: "sm", class: "rounded-sm" },
  { name: "md", class: "rounded-md" },
  { name: "lg", class: "rounded-lg" },
  { name: "xl", class: "rounded-xl" },
];

export default function Home() {
  return (
    <TooltipProvider>
      <header className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <span className="text-sm font-semibold tracking-tight">
            sc1m<span className="text-fg-subtle">/design</span>
          </span>
          <nav aria-label="Sections" className="flex items-center gap-1">
            <a
              href="#foundations"
              className="rounded-md px-3 py-1.5 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface hover:text-fg"
            >
              Foundations
            </a>
            <a
              href="#components"
              className="rounded-md px-3 py-1.5 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface hover:text-fg"
            >
              Components
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        {/* Hero */}
        <section className="flex flex-col items-start gap-5 py-20">
          <p className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-fg-muted">
            Base UI · Tailwind v4 · Next.js · Brand: Ledger
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            A design system built from unstyled primitives.
          </h1>
          <p className="max-w-xl text-base text-fg-muted">
            Accessible behavior from Base UI, visual decisions from a
            three-layer token system. Every component starts bare and earns its
            styling from the same foundations.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#components"
              className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-colors duration-fast hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Browse components
            </a>
            <code className="rounded-md border border-line bg-surface px-3 py-2 font-mono text-xs text-fg-muted">
              npm run storybook
            </code>
          </div>
        </section>

        {/* Foundations */}
        <section id="foundations" className="scroll-mt-16 border-t border-line py-16">
          <h2 className="text-base font-semibold">Foundations</h2>
          <p className="mt-1 max-w-xl text-sm text-fg-muted">
            The active brand file assigns primitives to semantic tokens;
            semantic tokens feed Tailwind utilities. Components never
            reference a raw color, so a rebrand swaps one import.
          </p>

          <h3 className="mt-10 text-sm font-medium text-fg-muted">Color</h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {colorTokens.map((token) => (
              <li
                key={token.name}
                className="overflow-hidden rounded-lg border border-line"
              >
                <div className={`h-12 ${token.class}`} />
                <div className="px-3 py-2">
                  <p className="font-mono text-xs">{token.name}</p>
                  <p className="mt-0.5 text-xs text-fg-muted">{token.role}</p>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-12 text-sm font-medium text-fg-muted">
            Typography
          </h3>
          <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
            {typeScale.map((step) => (
              <li
                key={step.label}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className={step.class}>{step.sample}</span>
                <span className="font-mono text-xs text-fg-subtle">
                  {step.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-fg-muted">Radius</h3>
              <div className="mt-4 flex items-end gap-4">
                {radii.map((r) => (
                  <div key={r.name} className="flex flex-col items-center gap-2">
                    <div
                      className={`size-14 border border-line-strong bg-surface ${r.class}`}
                    />
                    <span className="font-mono text-xs text-fg-muted">
                      {r.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-fg-muted">Elevation</h3>
              <div className="mt-4 flex items-end gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="size-14 rounded-lg border border-line bg-surface-raised shadow-raised" />
                  <span className="font-mono text-xs text-fg-muted">raised</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="size-14 rounded-lg border border-line bg-surface-raised shadow-overlay" />
                  <span className="font-mono text-xs text-fg-muted">
                    overlay
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Components */}
        <section id="components" className="scroll-mt-16 border-t border-line py-16">
          <h2 className="text-base font-semibold">Components</h2>
          <p className="mt-1 max-w-xl text-sm text-fg-muted">
            Live previews of styled primitives. Every Base UI component has an
            unstyled wrapper in{" "}
            <code className="font-mono text-xs">src/components/ui</code>{" "}
            waiting for the same treatment — inspect each one in Storybook.
          </p>
          <div className="mt-8">
            <Gallery />
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-6 py-8 text-xs text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Built on Base UI primitives and a Tailwind v4 token layer.</p>
          <p className="font-mono">next 16 · react 19 · tailwind 4 · base-ui 1.7</p>
        </div>
      </footer>
    </TooltipProvider>
  );
}
