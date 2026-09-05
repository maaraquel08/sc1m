"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { cn } from "@/lib/cn";

export const Select = BaseSelect.Root;
export const SelectValue = BaseSelect.Value;
export const SelectGroup = BaseSelect.Group;
export const SelectGroupLabel = BaseSelect.GroupLabel;

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger>) {
  return (
    <BaseSelect.Trigger
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-line bg-surface-raised px-3 text-sm text-fg",
        "transition-colors duration-fast ease-out-quad",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <SelectIcon />
    </BaseSelect.Trigger>
  );
}

function SelectIcon({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Icon>) {
  return (
    <BaseSelect.Icon
      className={cn("flex text-fg-muted", className)}
      {...props}
    >
      {/* phosphor: caret-up-down regular */}
      <svg
        aria-hidden
        viewBox="0 0 256 256"
        fill="currentColor"
        className="size-3.5"
      >
        <path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z" />
      </svg>
    </BaseSelect.Icon>
  );
}

/**
 * The open trigger's scale, or `null` when there is no open trigger to
 * measure — which is not the same as "unscaled", and is why this does not
 * just return 1. Base UI mounts the popup before it opens, and keeps it
 * mounted through the closing animation; in both of those states the answer
 * is "don't know", and the caller holds whatever it last measured rather
 * than snapping the popup back to full size mid-animation.
 */
function measureAnchorScale(): number | null {
  const trigger = document.querySelector<HTMLElement>(
    '[role="combobox"][aria-expanded="true"]',
  );
  if (!trigger?.offsetWidth) return null;
  const scale = trigger.getBoundingClientRect().width / trigger.offsetWidth;
  // Sub-1% is rounding, not a transform. Returning exactly 1 is what keeps
  // every ordinary select from emitting a transform at all.
  if (!Number.isFinite(scale) || Math.abs(scale - 1) <= 0.01) return 1;
  return scale;
}

/**
 * The scale the popup should render at: whatever its trigger renders at.
 *
 * A popup portals to <body>, so a `transform: scale()` anywhere above the
 * trigger applies to the trigger and not to the popup — the two end up drawn
 * at different sizes on the same surface. The reel does exactly this: every
 * miniature is authored at its natural size and scaled to fit its card, so
 * without this the currency select's popup lands at 1x on a card drawn at
 * 0.75x, as wide as the whole card.
 *
 * `getBoundingClientRect()` is measured after transforms and `offsetWidth`
 * before them, so their ratio is the cumulative scale — no matter how many
 * ancestors contributed to it, and without anyone having to pass it down.
 *
 * The trigger is found rather than threaded through context: a select popup
 * takes focus, so Base UI closes any other before opening this one and
 * exactly one trigger in the document is expanded. Threading it would mean
 * wrapping `Select`, which is `BaseSelect.Root` re-exported and generic over
 * its value type — the props table in the docs is generated from that symbol.
 *
 * Hung off a ref callback rather than an effect, because this component does
 * not re-render when its own popup opens — Base UI flips that state inside
 * the parts, and the Portal mounts the popup element without anything here
 * rendering again. An effect therefore only ever sees the closed state (and
 * `useSyncExternalStore` never gets told to look twice). The ref *is* the
 * open signal: React runs it when the popup element enters the DOM, in the
 * same commit that expands the trigger, and before paint.
 */
function useAnchorScale() {
  const [scale, setScale] = React.useState(1);

  const measureOnMount = React.useCallback((el: HTMLElement | null) => {
    // null is the popup leaving. Hold the last value so it keeps its size
    // through the closing animation instead of snapping back to full.
    if (!el) return;
    const next = measureAnchorScale();
    if (next !== null) setScale((prev) => (prev === next ? prev : next));
  }, []);

  return [scale, measureOnMount] as const;
}

export function SelectContent({
  className,
  children,
  side = "bottom",
  alignItemWithTrigger,
  style,
  ref,
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Base UI's default (`true`) overlaps the popup onto the trigger so the
   * selected item's text lands on the trigger's value — native-select
   * behaviour, and what `side`/`sideOffset` are ignored for.
   *
   * Pass `false` when the select sits inside a CSS-transformed ancestor. That
   * alignment measures the trigger and the item to compute an overlap offset,
   * and under a `scale()` the two measurements disagree, so the popup lands
   * away from its trigger. Turning it off falls back to ordinary side/offset
   * anchoring, which transforms correctly.
   */
  alignItemWithTrigger?: boolean;
}) {
  const [scale, measureAnchor] = useAnchorScale();

  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        side={side}
        sideOffset={8}
        alignItemWithTrigger={alignItemWithTrigger}
      >
        <BaseSelect.Popup
          className={cn(
            "max-h-72 min-w-[var(--anchor-width)] overflow-y-auto rounded-md border border-line bg-surface-raised p-1 text-fg shadow-overlay",
            // The popup takes focus for keyboard navigation, so without this
            // the browser paints its own blue ring around the whole panel.
            // The visible affordance belongs on the option (data-highlighted),
            // not the container — same as Menu, Menubar and ContextMenu.
            "outline-none",
            "popup-motion",
            className,
          )}
          style={
            // `popup-motion` animates the `scale` property and sets
            // transform-origin to Base UI's --transform-origin, which points
            // at the anchor. So this composes with the open/close animation
            // instead of overwriting it, and shrinks toward the trigger.
            scale === 1 ? style : { transform: `scale(${scale})`, ...style }
          }
          ref={(el: HTMLDivElement | null) => {
            measureAnchor(el);
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          {...props}
        >
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      className={cn(
        "flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm text-fg select-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <SelectItemIndicator />
    </BaseSelect.Item>
  );
}

function SelectItemIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.ItemIndicator>) {
  return (
    <BaseSelect.ItemIndicator
      className={cn("flex text-accent", className)}
      {...props}
    >
      {/* phosphor: check regular */}
      <svg
        aria-hidden
        viewBox="0 0 256 256"
        fill="currentColor"
        className="size-3.5"
      >
        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
      </svg>
    </BaseSelect.ItemIndicator>
  );
}
