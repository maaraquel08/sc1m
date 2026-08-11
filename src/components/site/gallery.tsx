"use client";

import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";

function Demo({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-line bg-surface-raised">
      <h3 className="border-b border-line px-5 py-3 text-sm font-medium text-fg-muted">
        {title}
      </h3>
      <div className="flex min-h-32 flex-1 items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}

export function Gallery() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Demo title="Button">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </Demo>

      <Demo title="Switch & Checkbox">
        <div className="flex items-center gap-8">
          <Switch.Root
            defaultChecked
            aria-label="Enable notifications"
            className="relative flex h-6 w-10 rounded-full bg-line-strong p-0.5 transition-colors duration-fast data-checked:bg-accent"
          >
            <Switch.Thumb className="aspect-square h-full rounded-full bg-surface-raised shadow-raised transition-transform duration-fast data-checked:translate-x-4" />
          </Switch.Root>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox.Root
              defaultChecked
              className="flex size-5 items-center justify-center rounded-sm border border-line-strong bg-surface-raised transition-colors duration-fast data-checked:border-accent data-checked:bg-accent"
            >
              <Checkbox.Indicator className="text-accent-fg data-unchecked:hidden">
                <svg viewBox="0 0 12 10" fill="none" className="size-3">
                  <path
                    d="M1 5.5L4 8.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Checkbox.Indicator>
            </Checkbox.Root>
            Subscribe
          </label>
        </div>
      </Demo>

      <Demo title="Tabs">
        <Tabs.Root defaultValue="tokens" className="w-full max-w-72">
          <Tabs.List className="relative flex gap-1 rounded-lg bg-surface p-1">
            {["tokens", "components"].map((value) => (
              <Tabs.Tab
                key={value}
                value={value}
                className="z-1 flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize text-fg-muted transition-colors duration-fast data-selected:text-fg"
              >
                {value}
              </Tabs.Tab>
            ))}
            <Tabs.Indicator className="absolute top-1 left-0 h-[calc(100%-0.5rem)] w-(--active-tab-width) translate-x-(--active-tab-left) rounded-md bg-surface-raised shadow-raised transition-all duration-fast" />
          </Tabs.List>
          <Tabs.Panel value="tokens" className="p-3 text-sm text-fg-muted">
            Semantic tokens drive every visual decision.
          </Tabs.Panel>
          <Tabs.Panel value="components" className="p-3 text-sm text-fg-muted">
            Primitives stay unstyled until you theme them.
          </Tabs.Panel>
        </Tabs.Root>
      </Demo>

      <Demo title="Slider">
        <Slider.Root defaultValue={60} className="w-full max-w-72">
          <Slider.Control className="flex w-full items-center py-2">
            <Slider.Track className="h-1.5 w-full rounded-full bg-line select-none">
              <Slider.Indicator className="rounded-full bg-accent select-none" />
              <Slider.Thumb
                aria-label="Value"
                className="size-4 rounded-full bg-surface-raised shadow-raised outline outline-line-strong select-none focus-visible:outline-2 focus-visible:outline-ring"
              />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </Demo>

      <Demo title="Overlays">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Tooltip content="Tooltips ride the token layer too">
            <Button variant="secondary">Tooltip</Button>
          </Tooltip>

          <Popover>
            <PopoverTrigger render={<Button variant="secondary" />}>
              Popover
            </PopoverTrigger>
            <PopoverContent>
              <PopoverTitle className="text-sm font-semibold">
                Portalled popover
              </PopoverTitle>
              <PopoverDescription className="mt-1 text-sm text-fg-muted">
                Rendered into the body, above the isolated app root.
              </PopoverDescription>
            </PopoverContent>
          </Popover>

          <Dialog.Root>
            <Dialog.Trigger render={<Button variant="secondary" />}>
              Dialog
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 bg-black/40 transition-opacity duration-fast data-starting-style:opacity-0 data-ending-style:opacity-0" />
              <Dialog.Popup className="fixed top-1/2 left-1/2 w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface-raised p-6 text-fg shadow-overlay transition-[opacity,transform] duration-fast data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0">
                <Dialog.Title className="text-base font-semibold">
                  Modal dialog
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-fg-muted">
                  Focus is trapped, scroll is locked, and Escape closes it —
                  all from the unstyled primitive.
                </Dialog.Description>
                <div className="mt-5 flex justify-end">
                  <Dialog.Close render={<Button variant="secondary" />}>
                    Close
                  </Dialog.Close>
                </div>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </Demo>

      <Demo title="Accordion">
        <Accordion.Root className="w-full max-w-80 rounded-lg border border-line">
          {[
            {
              value: "a",
              title: "Unstyled by default",
              body: "Every primitive ships bare; the token layer does the styling.",
            },
            {
              value: "b",
              title: "Accessible by default",
              body: "Keyboard, focus, and ARIA handled by Base UI.",
            },
          ].map((item) => (
            <Accordion.Item
              key={item.value}
              value={item.value}
              className="border-b border-line last:border-b-0"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors duration-fast hover:bg-surface">
                  {item.title}
                  <span aria-hidden className="text-fg-subtle">
                    +
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel className="px-4 pb-3 text-sm text-fg-muted">
                {item.body}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Demo>
    </div>
  );
}
