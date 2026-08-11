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
            "origin-[var(--transform-origin)] transition-[opacity,transform] duration-fast ease-out-quad",
            "data-starting-style:scale-95 data-starting-style:opacity-0",
            "data-ending-style:scale-95 data-ending-style:opacity-0",
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
