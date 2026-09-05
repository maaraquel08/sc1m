"use client";

import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cn } from "@/lib/cn";

export const Combobox = BaseCombobox.Root;

export function ComboboxInput({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Input>) {
  return (
    <BaseCombobox.Input
      className={cn(
        "h-9 w-full rounded-md border border-line bg-surface-raised px-3 text-sm text-fg placeholder:text-fg-subtle",
        "transition-colors duration-fast ease-out-quad",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxContent({
  className,
  children,
  side = "bottom",
  ...props
}: React.ComponentProps<typeof BaseCombobox.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner side={side} sideOffset={8}>
        <BaseCombobox.Popup
          className={cn(
            "max-h-72 min-w-[var(--anchor-width)] overflow-y-auto rounded-md border border-line bg-surface-raised p-1 text-fg shadow-overlay",
            "popup-motion",
            className,
          )}
          {...props}
        >
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

export function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.List>) {
  return <BaseCombobox.List className={cn("flex flex-col", className)} {...props} />;
}

export function ComboboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Item>) {
  return (
    <BaseCombobox.Item
      className={cn(
        "flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm text-fg select-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxItemIndicator />
    </BaseCombobox.Item>
  );
}

function ComboboxItemIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.ItemIndicator>) {
  return (
    <BaseCombobox.ItemIndicator
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
    </BaseCombobox.ItemIndicator>
  );
}

export function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Empty>) {
  return (
    <BaseCombobox.Empty
      className={cn(
        "px-2 py-1.5 text-sm text-fg-subtle",
        // Base UI renders the CHILDREN only when the list is empty, but keeps
        // the element mounted on purpose — it is a role="status" live region,
        // and its docs are explicit that hiding it with display:none, hidden,
        // aria-hidden or conditional rendering breaks the announcement. So
        // collapse the padding rather than the element: with results present
        // the div is childless and would otherwise sit above the list as a
        // 12px strip of dead space (py-1.5 top and bottom, no content).
        "empty:p-0",
        className,
      )}
      {...props}
    />
  );
}
