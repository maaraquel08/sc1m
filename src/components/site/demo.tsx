"use client";

import { createContext, useContext, useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * An example: the component running, with its source in a drawer underneath.
 *
 * Collapsed, the code is clipped to a few lines and faded out with a mask
 * rather than hidden — the design leans on that peek to tell you there is more
 * without spending the vertical space.
 *
 *   <Demo>
 *     <DemoPreview><story.Multiple /></DemoPreview>
 *     <DemoCode>```tsx …```</DemoCode>
 *   </Demo>
 */

const DemoContext = createContext<{ open: boolean; panelId: string } | null>(null);

export function Demo({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <DemoContext value={{ open, panelId }}>
      <div className="not-prose my-4 overflow-hidden rounded-xl border border-line bg-bg">
        {children}
        {/* No divider of its own — the drawer above already draws one, and the
            button reads as part of that same tinted footer. */}
        <div className="flex justify-center bg-surface pt-3.5 pb-4">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={panelId}
            className="rounded-lg border border-line bg-bg px-4 py-2 text-[13px] font-medium text-fg transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {open ? "Hide code" : "Show code"}
          </button>
        </div>
      </div>
    </DemoContext>
  );
}

export function DemoPreview({ children }: { children: ReactNode }) {
  return (
    <div className="px-9 py-10">
      <div className="mx-auto flex max-w-[520px] justify-center">{children}</div>
    </div>
  );
}

export function DemoCode({ children }: { children: ReactNode }) {
  const context = useContext(DemoContext);
  if (!context) throw new Error("<DemoCode /> must be used inside <Demo />.");
  const { open, panelId } = context;

  return (
    <div
      id={panelId}
      className={cn(
        "overflow-hidden border-t border-line bg-surface transition-[max-height] duration-300 ease-out-quad motion-reduce:transition-none",
        // The fence renders a fumadocs figure with its own shell; strip it so
        // the code sits flush inside the drawer.
        "[&_figure]:my-0 [&_figure]:rounded-none [&_figure]:border-none [&_figure]:bg-transparent [&_figure]:shadow-none",
        open ? "max-h-[60rem]" : "max-h-24",
      )}
      style={
        open
          ? undefined
          : {
              maskImage: "linear-gradient(to bottom, #000 45%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 45%, transparent)",
            }
      }
    >
      {children}
    </div>
  );
}
