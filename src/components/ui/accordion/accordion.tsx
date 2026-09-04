"use client";

import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cn } from "@/lib/cn";

export function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Root>) {
  return (
    // Detached expansion: the group owns no box of its own. Each item is its
    // own card, and the closed ones overlap borders to read as a single stack.
    // No `overflow-hidden` here — the open item's shadow has to escape.
    <BaseAccordion.Root className={cn("isolate", className)} {...props} />
  );
}

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Item>) {
  return (
    <BaseAccordion.Item
      className={cn(
        "relative block overflow-hidden border border-line bg-surface-raised",
        // Closed neighbours pull up 1px so their touching borders collapse
        // into one line. Not applied to the first item, and not when the item
        // above is open — that one has detached, so there is no border to meet.
        "[&:not([data-open]):not(:first-child):not([data-open]+*)]:-mt-px",
        // Open: leave the stack. 12px of air on both sides, all four corners
        // rounded, lifted above the neighbours it is now floating over.
        "data-open:z-10 data-open:my-3 data-open:rounded-xl data-open:shadow-raised",
        // Closed: round only the edges that face the outside of the stack —
        // the ends of the list, or a gap left by the item that detached.
        "first:rounded-t-xl last:rounded-b-xl",
        "[[data-open]+&]:rounded-t-xl [&:has(+[data-open])]:rounded-b-xl",
        "transition-[margin,border-radius,box-shadow] duration-(--acc-expand) ease-(--acc-ease)",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Header>
      <BaseAccordion.Trigger
        className={cn(
          "group flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-fg transition-colors duration-fast ease-out-quad hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          // Disabled. Base UI renders this trigger with `aria-disabled` and
          // keeps it in the tab order (`focusableWhenDisabled`), and blocks
          // activation in its own handlers — so the usual
          // `pointer-events-none opacity-50` pair is wrong here on two counts:
          // an element that takes no pointer events can never show a cursor,
          // and fading the button fades its focus ring, which this one still
          // needs because it is still focusable. Mute the contents instead.
          "data-disabled:cursor-not-allowed data-disabled:text-fg-subtle",
          "data-disabled:hover:bg-transparent",
          className,
        )}
        {...props}
      >
        {children}
        {/* the caret rotates 180° rather than flipping: rotation carries the
            shape through the whole transition, where scaleY(-1) passes through
            a degenerate flat state at the midpoint. Not a path morph either —
            CSS `d:` interpolation is Chromium-only.

            translate(0,-8) is what makes the rotation land: Phosphor's caret
            ink is not centred in its 256 box (round caps put the bbox centre
            at y=136), so rotating about the element centre would swing it 1px
            off. The path data itself stays byte-identical to Phosphor. */}
        {/* phosphor: caret-down regular */}
        <svg
          aria-hidden
          viewBox="0 0 256 256"
          fill="currentColor"
          className="size-4 shrink-0 text-fg-subtle transition-transform duration-(--acc-chevron) ease-(--acc-ease) group-data-disabled:opacity-50 group-data-panel-open:rotate-180 motion-reduce:transition-none"
        >
          <g transform="translate(0,-8)">
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
          </g>
        </svg>
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export function AccordionPanel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel
      className={cn(
        // Base UI measures the content into --accordion-panel-height;
        // entering/exiting states pin height to 0 so open/close tweens.
        "h-(--accordion-panel-height) overflow-hidden text-sm text-fg-muted",
        "transition-[height,opacity,filter] duration-(--acc-collapse) ease-(--acc-ease) data-open:duration-(--acc-expand)",
        "data-starting-style:h-0 data-starting-style:opacity-0 data-starting-style:blur-[2px]",
        "data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:blur-[2px]",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {/* padding lives on the inner element, never the measured panel —
          padding on the collapsing box leaves a residual height strip */}
      <div className="px-5 pb-4">{children}</div>
    </BaseAccordion.Panel>
  );
}
