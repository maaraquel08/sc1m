"use client";

import * as React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { cn } from "@/lib/cn";

export const Drawer = BaseDrawer.Root;
export const DrawerTrigger = BaseDrawer.Trigger;

// Bottom sheet: anchored to the bottom edge, dismissed via swipe-down by
// default (Drawer.Root's `swipeDirection` defaults to "down").
export function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseDrawer.Popup>) {
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop className="fixed inset-0 bg-black/40 transition-opacity duration-fast data-starting-style:opacity-0 data-ending-style:opacity-0" />
      <BaseDrawer.Viewport className="fixed inset-0 flex items-end justify-center">
        <BaseDrawer.Popup
          className={cn(
            "w-full max-w-lg rounded-t-xl border-t border-line bg-surface-raised p-6 text-fg shadow-overlay",
            "[transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-fast ease-out-quad",
            "data-starting-style:[transform:translateY(100%)] data-ending-style:[transform:translateY(100%)]",
            className,
          )}
          {...props}
        >
          <div
            aria-hidden
            className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-line-strong"
          />
          <BaseDrawer.Content className="mx-auto w-full">
            {children}
          </BaseDrawer.Content>
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

export const DrawerTitle = BaseDrawer.Title;
export const DrawerDescription = BaseDrawer.Description;
export const DrawerClose = BaseDrawer.Close;
