"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "@/lib/cn";

export const ToastProvider = BaseToast.Provider;
export const useToastManager = BaseToast.useToastManager;
export const createToastManager = BaseToast.createToastManager;

export function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof BaseToast.Viewport>) {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport
        className={cn(
          "fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2",
          className,
        )}
        {...props}
      />
    </BaseToast.Portal>
  );
}

export function Toast({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseToast.Root>) {
  return (
    <BaseToast.Root
      className={cn(
        "relative rounded-lg border border-line bg-surface-raised p-4 pr-8 text-fg shadow-overlay",
        "transition-[opacity,transform] duration-fast ease-out-quad",
        "data-starting-style:translate-y-1 data-starting-style:opacity-0",
        "data-ending-style:opacity-0",
        className,
      )}
      {...props}
    >
      {children}
    </BaseToast.Root>
  );
}

export function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseToast.Title>) {
  return (
    <BaseToast.Title
      className={cn("text-sm font-medium text-fg", className)}
      {...props}
    />
  );
}

export function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseToast.Description>) {
  return (
    <BaseToast.Description
      className={cn("mt-1 text-sm text-fg-muted", className)}
      {...props}
    />
  );
}

export function ToastClose({
  className,
  ...props
}: React.ComponentProps<typeof BaseToast.Close>) {
  return (
    <BaseToast.Close
      className={cn(
        "absolute top-2 right-2 rounded-sm p-1 text-fg-subtle transition-colors duration-fast ease-out-quad hover:bg-surface hover:text-fg",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}
