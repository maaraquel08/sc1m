"use client";

import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { cn } from "@/lib/cn";

export const Collapsible = BaseCollapsible.Root;

export function CollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Trigger>) {
  return (
    <BaseCollapsible.Trigger
      className={cn(
        "group flex w-full items-center justify-between gap-2 rounded-md border border-line bg-surface-raised px-3 py-2 text-left text-sm font-medium text-fg",
        "transition-colors duration-fast ease-out-quad hover:bg-surface",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    >
      {children}
      {/* the caret flips scaleY(-1) rather than morphing its path — CSS `d:`
          interpolation is Chromium-only, and the flip passes through the same
          flat midpoint. Phosphor's caret is NOT centred in its 256 box — round
          caps put the bbox centre at y=136 — so the geometry is translated by
          -8 to make the flip land on the "^" without a 1px jump. */}
      {/* phosphor: caret-down regular */}
      <svg
        aria-hidden
        viewBox="0 0 256 256"
        fill="currentColor"
        className="size-4 shrink-0 text-fg-subtle transition-transform duration-(--acc-chevron) ease-(--acc-spring) group-data-panel-open:-scale-y-100 motion-reduce:transition-none"
      >
        <g transform="translate(0,-8)">
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
        </g>
      </svg>
    </BaseCollapsible.Trigger>
  );
}

export function CollapsiblePanel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      className={cn(
        // Base UI measures the content into --collapsible-panel-height;
        // entering/exiting states pin height to 0 so open/close tweens.
        "h-(--collapsible-panel-height) overflow-hidden text-sm text-fg-muted",
        // spring on the way open only: the overshoot settles the panel into
        // its measured height. Closing keeps --acc-ease — an overshoot there
        // drives height past 0, which clamps, so the motion just ends flat.
        "transition-[height,opacity,filter] duration-(--acc-collapse) ease-(--acc-ease)",
        "data-open:duration-(--acc-expand) data-open:ease-(--acc-spring)",
        "data-starting-style:h-0 data-starting-style:opacity-0 data-starting-style:blur-[2px]",
        "data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:blur-[2px]",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {/* padding lives on the inner element, never the measured panel —
          padding on the collapsing box leaves a residual height strip */}
      <div className="px-3 pt-2 pb-3">{children}</div>
    </BaseCollapsible.Panel>
  );
}
