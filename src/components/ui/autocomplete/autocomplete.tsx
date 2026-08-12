"use client";

import * as React from "react";
import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { cn } from "@/lib/cn";

export const Autocomplete = BaseAutocomplete.Root;

export function AutocompleteInput({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Input>) {
  return (
    <BaseAutocomplete.Input
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

export function AutocompleteContent({
  className,
  children,
  side = "bottom",
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <BaseAutocomplete.Portal>
      <BaseAutocomplete.Positioner side={side} sideOffset={8}>
        <BaseAutocomplete.Popup
          className={cn(
            "max-h-72 min-w-[var(--anchor-width)] overflow-y-auto rounded-md border border-line bg-surface-raised p-1 text-fg shadow-overlay",
            "popup-motion",
            className,
          )}
          {...props}
        >
          {children}
        </BaseAutocomplete.Popup>
      </BaseAutocomplete.Positioner>
    </BaseAutocomplete.Portal>
  );
}

export function AutocompleteList({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.List>) {
  return (
    <BaseAutocomplete.List className={cn("flex flex-col", className)} {...props} />
  );
}

export function AutocompleteItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Item>) {
  return (
    <BaseAutocomplete.Item
      className={cn(
        "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm text-fg select-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function AutocompleteEmpty({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Empty>) {
  return (
    <BaseAutocomplete.Empty
      className={cn("px-2 py-1.5 text-sm text-fg-subtle", className)}
      {...props}
    />
  );
}
