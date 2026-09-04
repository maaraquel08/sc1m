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
      {/* chevron flips scaleY(-1) instead of morphing its path — the flip
          passes through a flat line at the midpoint like a path morph but
          animates in every browser (CSS `d:` is Chromium-only). The path is
          symmetric about the viewBox centre so the flip lands on the "^", and
          non-scaling-stroke keeps the stroke constant through the squash. */}
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 shrink-0 text-fg-subtle transition-transform duration-(--acc-chevron) ease-(--acc-spring) group-data-panel-open:-scale-y-100 motion-reduce:transition-none"
      >
        <path d="M4 6.5L8 10.5L12 6.5" vectorEffect="non-scaling-stroke" />
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
