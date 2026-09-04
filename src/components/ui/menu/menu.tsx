"use client";

import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cn } from "@/lib/cn";

export const Menu = BaseMenu.Root;
export const MenuTrigger = BaseMenu.Trigger;

export function MenuContent({
  className,
  children,
  side = "bottom",
  align = "start",
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner side={side} align={align} sideOffset={8}>
        <BaseMenu.Popup
          className={cn(
            "min-w-40 rounded-lg border border-line bg-surface-raised py-1 text-fg shadow-overlay",
            "popup-motion",
            className,
          )}
          {...props}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export function MenuItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Item>) {
  return (
    <BaseMenu.Item
      className={cn(
        "flex cursor-default items-center rounded-sm px-3 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function MenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-3 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <MenuCheckboxItemIndicator />
      {children}
    </BaseMenu.CheckboxItem>
  );
}

export function MenuCheckboxItemIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.CheckboxItemIndicator>) {
  return (
    <BaseMenu.CheckboxItemIndicator
      className={cn("flex size-4 items-center justify-center", className)}
      {...props}
    >
      {/* phosphor: check regular */}
      <svg
        aria-hidden="true"
        viewBox="0 0 256 256"
        fill="currentColor"
        className="size-3.5"
      >
        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
      </svg>
    </BaseMenu.CheckboxItemIndicator>
  );
}

export const MenuRadioGroup = BaseMenu.RadioGroup;

export function MenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.RadioItem>) {
  return (
    <BaseMenu.RadioItem
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-3 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <MenuRadioItemIndicator />
      {children}
    </BaseMenu.RadioItem>
  );
}

export function MenuRadioItemIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.RadioItemIndicator>) {
  return (
    <BaseMenu.RadioItemIndicator
      className={cn("flex size-4 items-center justify-center", className)}
      {...props}
    >
      <span className="size-1.5 rounded-full bg-fg" />
    </BaseMenu.RadioItemIndicator>
  );
}

export function MenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Separator>) {
  return (
    <BaseMenu.Separator
      className={cn("my-1 h-px bg-line", className)}
      {...props}
    />
  );
}

export const MenuGroup = BaseMenu.Group;

export function MenuGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.GroupLabel>) {
  return (
    <BaseMenu.GroupLabel
      className={cn(
        "px-3 py-1.5 text-xs font-medium text-fg-subtle",
        className,
      )}
      {...props}
    />
  );
}

export const MenuSubmenuRoot = BaseMenu.SubmenuRoot;

export function MenuSubmenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.SubmenuTrigger>) {
  return (
    <BaseMenu.SubmenuTrigger
      className={cn(
        "flex cursor-default items-center justify-between rounded-sm px-3 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      {/* phosphor: caret-right regular */}
      <svg
        aria-hidden="true"
        viewBox="0 0 256 256"
        fill="currentColor"
        className="size-3.5 text-fg-subtle"
      >
        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
      </svg>
    </BaseMenu.SubmenuTrigger>
  );
}
