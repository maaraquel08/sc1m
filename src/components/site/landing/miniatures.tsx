import {
  ArrowsClockwise,
  CheckCircle,
  Clock,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CurrencyConverter } from "./currency-converter";
import type { Slat } from "./slats";

/**
 * The miniatures.
 *
 * Each one is authored at its slat's *natural* size and never told how big to
 * be — the reel scales it. So everything in here is written at normal product
 * sizes (13px labels, 36px buttons) and reads correctly whether the tile is
 * 200px or 400px tall.
 */

const KICKER =
  "font-mono text-[9.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase";

/** Every miniature sits on the raised surface, like a screen on a desk. */
const SHELL = "flex h-full flex-col bg-surface-raised";

function Palette() {
  // The contract itself: fifteen roles plus the one local value (warning)
  // a study had to invent before it was promoted.
  const roles = [
    "bg-bg",
    "bg-surface",
    "bg-line-strong",
    "bg-fg-subtle",
    "bg-fg-muted",
    "bg-fg",
    "bg-accent",
    "bg-accent-hover",
    "bg-highlight",
    "bg-ring",
    "bg-success",
    "bg-danger",
    "bg-info",
    "bg-warning",
    "bg-surface-raised",
  ];
  return (
    <div className={SHELL}>
      <div className={`px-[26px] pt-[26px] pb-[14px] ${KICKER}`}>
        15 roles + 1 local
      </div>
      <div className="grid flex-1 grid-cols-5">
        {roles.map((role) => (
          <span key={role} className={role} />
        ))}
      </div>
    </div>
  );
}

/**
 * The stand-in for a screen that has not been built yet. It states what the
 * screen will be rather than pretending to be it — a wireframe, not a lie.
 */
function Plate({ kicker, title }: { kicker?: string; title?: string }) {
  return (
    <div className={`${SHELL} gap-2.5 p-[22px]`}>
      <span className={KICKER}>{kicker}</span>
      <span className="text-[17px] leading-[1.2] font-semibold tracking-[-0.018em] text-fg">
        {title}
      </span>
      <span className="h-px bg-line" />
      <span className="flex flex-col gap-[7px]">
        <span className="h-[9px] w-[88%] rounded-sm bg-surface" />
        <span className="h-[9px] w-[72%] rounded-sm bg-surface" />
        <span className="h-[9px] w-[54%] rounded-sm bg-surface" />
      </span>
      <span className="mt-auto flex gap-1.5">
        <span className="h-[26px] flex-1 rounded-md bg-accent" />
        <span className="h-[26px] w-[42%] rounded-md border border-line" />
      </span>
    </div>
  );
}

function Buttons() {
  return (
    <div className={`${SHELL} justify-center gap-3.5 p-[26px]`}>
      <span className={KICKER}>Button · four variants</span>
      <Button>Primary action</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete account</Button>
    </div>
  );
}

function Switches() {
  return (
    <div className={`${SHELL} justify-center gap-4 p-[26px]`}>
      <span className={KICKER}>Switch · Checkbox · Slider</span>
      <span className="flex items-center justify-between gap-3.5 text-[13px] text-fg">
        Two-factor
        <Switch defaultChecked />
      </span>
      <span className="flex items-center justify-between gap-3.5 text-[13px] text-fg">
        Weekly digest
        <Switch />
      </span>
      <span className="flex items-center gap-2.5 text-[13px] text-fg">
        <Checkbox defaultChecked />
        Remember this device
      </span>
      <div className="pt-1.5">
        <Slider defaultValue={62} />
      </div>
    </div>
  );
}

function Chips() {
  return (
    <div className={`${SHELL} justify-center gap-3 p-[26px]`}>
      <span className={KICKER}>Status chips</span>
      <Badge tone="success" className="w-fit" icon={<CheckCircle weight="fill" />}>
        Settled
      </Badge>
      <Badge tone="info" className="w-fit" icon={<Clock weight="fill" />}>
        Sending
      </Badge>
      <Badge tone="warning" className="w-fit" icon={<ArrowsClockwise weight="fill" />}>
        Retrying
      </Badge>
      <Badge tone="danger" className="w-fit" icon={<WarningCircle weight="fill" />}>
        Overdue
      </Badge>
    </div>
  );
}

/** The one inverted tile in the reel — the type scale reads on its own ground. */
function TypeScale() {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 bg-fg p-[26px] text-bg">
      <span className="font-mono text-[9.5px] font-semibold tracking-[0.14em] uppercase opacity-55">
        Type scale
      </span>
      <span className="text-[40px] leading-none font-semibold tracking-[-0.04em]">
        Aa
      </span>
      <span className="text-[15px] font-medium">Labels and controls</span>
      <span className="text-[13px] opacity-70">
        Body copy for product surfaces
      </span>
      <span className="font-mono text-[11px] opacity-55">
        token-name · 12px mono
      </span>
    </div>
  );
}

/** Sample screen — placeholder data until the real composer is built. */
function Send() {
  return (
    <div className={`${SHELL} gap-3.5 p-[22px]`}>
      <span className={KICKER}>Transfer composer</span>
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-fg-muted">To</span>
        <Input defaultValue="Cordia Partners Ltd" readOnly />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-fg-muted">Amount</span>
        <Input defaultValue="₱ 48,200.00" readOnly />
      </label>
      <span className="flex items-center justify-between text-[12px] text-fg-subtle">
        Arrives<span className="text-fg">Today, before 6:00 PM</span>
      </span>
      <span className="mt-auto flex gap-2">
        <Button className="flex-1">Send transfer</Button>
        <Button variant="secondary">Cancel</Button>
      </span>
    </div>
  );
}

/** Sample screen — placeholder data until the real permissions list is built. */
function Access() {
  const people = [
    { name: "Rina Alvarez", role: "Owner", on: true },
    { name: "Tomas Diaz", role: "Approver", on: true },
    { name: "Jae Park", role: "Bookkeeper", on: false },
  ];
  return (
    <div className={`${SHELL} gap-3 p-[22px]`}>
      <span className={KICKER}>Permissions</span>
      {people.map((p) => (
        <span
          key={p.name}
          className="flex items-center gap-2.5 rounded-md border border-line p-2.5"
        >
          <Avatar className="size-8 text-[11px]">
            <AvatarFallback>
              {p.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[13px] font-medium text-fg">
              {p.name}
            </span>
            <span className="text-[11.5px] text-fg-subtle">{p.role}</span>
          </span>
          <Switch defaultChecked={p.on} />
        </span>
      ))}
      <Button variant="secondary" className="mt-auto">
        Invite someone
      </Button>
    </div>
  );
}

/** Sample screen — placeholder data until the real payout view is built. */
function Insights() {
  const runs = [
    { label: "Payroll · September", value: 100, tone: "success" as const, status: "Settled" },
    { label: "Vendors · Q3", value: 64, tone: "info" as const, status: "Sending" },
    { label: "Refunds · August", value: 28, tone: "warning" as const, status: "Retrying" },
  ];
  return (
    <div className={`${SHELL} gap-3.5 p-[22px]`}>
      <span className={KICKER}>Payout runs</span>
      {runs.map((run) => (
        <Progress key={run.label} value={run.value} className="gap-2">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-[12.5px] text-fg">{run.label}</span>
            <Badge tone={run.tone} className="h-5 px-2 text-[10.5px]">
              {run.status}
            </Badge>
          </span>
          <ProgressTrack className="h-1.5">
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      ))}
      <Button variant="secondary" className="mt-auto">
        Open run history
      </Button>
    </div>
  );
}

export function Miniature({
  slat,
  onHoldChange,
}: {
  slat: Slat;
  /** Passed to miniatures that open a portalled popup — see the reel. */
  onHoldChange?: (held: boolean) => void;
}) {
  switch (slat.kind) {
    case "palette":
      return <Palette />;
    case "buttons":
      return <Buttons />;
    case "switches":
      return <Switches />;
    case "chips":
      return <Chips />;
    case "type":
      return <TypeScale />;
    case "send":
      return <Send />;
    case "access":
      return <Access />;
    case "insights":
      return <Insights />;
    case "converter":
      return <CurrencyConverter onHoldChange={onHoldChange} />;
    case "plate":
      return <Plate kicker={slat.kicker} title={slat.title} />;
  }
}
