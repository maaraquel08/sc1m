"use client";

import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "@/lib/cn";

export const Popover = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;

export function PopoverContent({
  className,
  children,
  side = "bottom",
  ...props
}: React.ComponentProps<typeof BasePopover.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} sideOffset={8}>
        <BasePopover.Popup
          className={cn(
            "w-72 rounded-lg border border-line bg-surface-raised p-4 text-fg shadow-overlay",
            // transitions.dev menu-dropdown: grows from the trigger side
            // (Base UI feeds --transform-origin), slower open than close,
            // and a tighter pre-scale on entry than on exit
            "origin-(--transform-origin) transition-[opacity,scale] will-change-[opacity,scale]",
            "duration-(--dropdown-close-dur) ease-(--dropdown-ease) data-open:duration-(--dropdown-open-dur)",
            "data-starting-style:scale-(--dropdown-pre-scale) data-starting-style:opacity-0",
            "data-ending-style:scale-(--dropdown-closing-scale) data-ending-style:opacity-0",
            "motion-reduce:transition-none",
            className,
          )}
          {...props}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export const PopoverTitle = BasePopover.Title;
export const PopoverDescription = BasePopover.Description;
