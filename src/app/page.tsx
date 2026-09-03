import Link from "next/link";

import { Gallery } from "@/components/site/gallery";
import { ThemeToggle } from "@/components/site/theme-toggle";
import {
  ColorTokens,
  Elevation,
  Radii,
  TypeScale,
} from "@/components/site/token-tables";
import { TooltipProvider } from "@/components/ui/tooltip";

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
            <Link
              href="/docs"
              className="rounded-md px-3 py-1.5 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface hover:text-fg"
            >
              Docs
            </Link>
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
            <Link
              href="/docs"
              className="inline-flex h-9 items-center rounded-md border border-line bg-surface-raised px-4 text-sm font-medium text-fg shadow-raised transition-colors duration-fast hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Read the docs
            </Link>
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
          <ColorTokens />

          <h3 className="mt-12 text-sm font-medium text-fg-muted">
            Typography
          </h3>
          <TypeScale />

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-fg-muted">Radius</h3>
              <Radii />
            </div>
            <div>
              <h3 className="text-sm font-medium text-fg-muted">Elevation</h3>
              <Elevation />
            </div>
          </div>
        </section>

        {/* Components */}
        <section id="components" className="scroll-mt-16 border-t border-line py-16">
          <h2 className="text-base font-semibold">Components</h2>
          <p className="mt-1 max-w-xl text-sm text-fg-muted">
            Live previews of styled primitives. Every Base UI component has an
            unstyled wrapper in{" "}
            <code className="font-mono text-xs">src/components/ui</code>.{" "}
            <Link href="/docs/components" className="underline underline-offset-2 hover:text-fg">
              Every one is documented
            </Link>{" "}
            with install, props and a live preview.
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
