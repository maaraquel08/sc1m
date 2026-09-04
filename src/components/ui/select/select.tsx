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

export function SelectContent({
  className,
  children,
  side = "bottom",
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner side={side} sideOffset={8}>
        <BaseSelect.Popup
          className={cn(
            "max-h-72 min-w-[var(--anchor-width)] overflow-y-auto rounded-md border border-line bg-surface-raised p-1 text-fg shadow-overlay",
            "popup-motion",
            className,
          )}
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
