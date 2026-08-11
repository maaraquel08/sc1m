"use client";

import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
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
          <Switch defaultChecked aria-label="Enable notifications" />
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked />
            Subscribe
          </label>
        </div>
      </Demo>

      <Demo title="Tabs">
        <Tabs defaultValue="tokens" className="w-full max-w-72">
          <TabsList>
            {["tokens", "components"].map((value) => (
              <TabsTab key={value} value={value} className="capitalize">
                {value}
              </TabsTab>
            ))}
          </TabsList>
          <TabsPanel value="tokens" className="p-3 text-sm text-fg-muted">
            Semantic tokens drive every visual decision.
          </TabsPanel>
          <TabsPanel value="components" className="p-3 text-sm text-fg-muted">
            Primitives stay unstyled until you theme them.
          </TabsPanel>
        </Tabs>
      </Demo>

      <Demo title="Slider">
        <Slider defaultValue={60} className="w-full max-w-72" />
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

          <Dialog>
            <DialogTrigger render={<Button variant="secondary" />}>
              Dialog
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-base font-semibold">
                Modal dialog
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-fg-muted">
                Focus is trapped, scroll is locked, and Escape closes it — all
                from the unstyled primitive.
              </DialogDescription>
              <div className="mt-5 flex justify-end">
                <DialogClose render={<Button variant="secondary" />}>
                  Close
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Demo>

      <Demo title="Accordion">
        <Accordion className="w-full max-w-80">
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
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionPanel>{item.body}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Demo>
    </div>
  );
}
