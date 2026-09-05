"use client";

import * as React from "react";
import { ArrowsDownUp } from "@phosphor-icons/react/dist/ssr";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/cn";

/**
 * The swap card (reel study 1B).
 *
 * Two stacked fields and one floating control. Either amount is editable —
 * type into the bottom field and the top one back-solves through the same
 * rate, which is why the footer's left label changes to say so.
 *
 * Swapping animates ONLY the currency selects. The fields hold still and the
 * selects arc past each other (see the sel-down/sel-up keyframes in
 * globals.css); the from/to state flips at the end of that arc, so the labels
 * never change mid-flight. The swap glyph turns a half-turn clockwise on every
 * press — `turns` only ever increments, so repeated presses keep rotating in
 * one direction instead of springing back.
 */

const SWAP_MS = 520;

/**
 * `per` is how many PHP one unit is worth. These values are the SEED: they
 * paint the card on first render and stand in whenever the rate feed can't be
 * reached, so the card is never blank and never wrong-by-omission — just
 * openly out of date, which the footer says.
 */
const CCY = [
  { code: "PHP", label: "Philippine peso", per: 1 },
  { code: "USD", label: "US dollar", per: 58.2 },
  { code: "EUR", label: "Euro", per: 63.1 },
  { code: "JPY", label: "Japanese yen", per: 0.39 },
  { code: "SGD", label: "Singapore dollar", per: 43.4 },
  { code: "AUD", label: "Australian dollar", per: 38.6 },
];

const SEED: Record<string, number> = Object.fromEntries(
  CCY.map((c) => [c.code, c.per]),
);

/**
 * Our own route, not the provider's. The key lives server-side there (see
 * src/app/api/rates/route.ts); calling the provider from here would mean
 * publishing it in the bundle. The route also re-bases to PHP and narrows to
 * the six currencies below.
 *
 * The feed publishes once a day, so "live" means the latest published rate,
 * not a market tick — which is why the footer names the day rather than
 * claiming to be realtime.
 */
const RATES_URL = "/api/rates";

type Feed =
  | { status: "seed" }
  | { status: "live"; updated: string }
  | { status: "failed" };

/** Yen doesn't subdivide in practice, so it carries no decimals. */
const dp = (code: string) => (code === "JPY" ? 0 : 2);

const fmt = (n: number, code: string) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: dp(code),
    maximumFractionDigits: dp(code),
  });

const rateOf = (rates: Record<string, number>, a: string, b: string) =>
  rates[a] / rates[b];

type Payload = { rates?: Record<string, number>; updated?: number };

/**
 * One request per page, however many converters are on it.
 *
 * The landing page renders the reel twice — the rail for pointers, the stack
 * for phones — and CSS decides which one you see, so both mount and both ask
 * for rates. The day's published rate is the same for everyone, so the
 * request is memoised at module scope and every instance awaits the same
 * promise.
 *
 * No AbortController: the promise is shared, so a component unmounting must
 * not cancel a fetch its sibling is still waiting on. Each caller guards its
 * own setState instead.
 */
let pending: Promise<Payload> | null = null;
const fetchRates = () =>
  (pending ??= fetch(RATES_URL)
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json() as Promise<Payload>;
    })
    // A failed request must not be cached as the answer — the next mount
    // should be free to try again.
    .catch((err) => {
      pending = null;
      throw err;
    }));

/**
 * Seeds from the static table, then swaps in live rates once /api/rates
 * answers. The route already returns pesos-per-unit, matching `per`, so
 * nothing here has to know how the provider bases its quotes.
 */
function useRates() {
  const [rates, setRates] = React.useState(SEED);
  const [feed, setFeed] = React.useState<Feed>({ status: "seed" });

  React.useEffect(() => {
    let live = true;
    (async () => {
      try {
        const data = await fetchRates();
        if (!live) return;
        const next: Record<string, number> = {};
        for (const c of CCY) {
          const q = data.rates?.[c.code];
          // A currency the feed drops keeps its seed rather than becoming NaN
          // and blanking the field.
          next[c.code] = typeof q === "number" && q > 0 ? q : c.per;
        }
        setRates(next);
        setFeed({
          status: "live",
          updated: new Date((data.updated ?? 0) * 1000).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric" },
          ),
        });
      } catch {
        if (live) setFeed({ status: "failed" });
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  return { rates, feed };
}

const toNumber = (v: string) => {
  const n = parseFloat(v.replace(/[^0-9.]/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

type Side = "from" | "to" | null;

function AmountField({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  active,
  raised,
  selectSlot,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  active: boolean;
  /** The recipient field sits a step forward: raised fill, stronger edge. */
  raised: boolean;
  selectSlot: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-[78px] items-center gap-3 rounded-md border px-[18px]",
        "transition-[border-color,box-shadow] duration-200 ease-out-quad",
        raised ? "bg-surface-raised" : "bg-surface",
        active
          ? "border-accent shadow-[inset_0_0_0_1px_var(--color-accent)]"
          : raised
            ? "border-line-strong"
            : "border-line",
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-[5px]">
        <span className="text-[11.5px] font-medium text-fg-muted">{label}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          inputMode="decimal"
          aria-label={label}
          className={cn(
            "w-full border-0 bg-transparent p-0 font-mono text-[26px]",
            "tracking-[-0.03em] tabular-nums text-fg caret-accent outline-none",
          )}
        />
      </span>
      {selectSlot}
    </div>
  );
}

function CurrencySelect({
  value,
  onValueChange,
  onOpenChange,
  className,
  style,
  label,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onOpenChange: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  label: string;
}) {
  return (
    <div className={cn("relative flex-none rounded-md", className)} style={style}>
      <Select
        value={value}
        onValueChange={(v) => v && onValueChange(v as string)}
        onOpenChange={onOpenChange}
      >
        <SelectTrigger className="w-[150px]" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        {/* Study 2B — code first.
            The mono code is the scan column and the name reads beside it. No
            symbol: the code already identifies the currency, and a symbol slot
            would only push the thing people actually scan off the left edge.
            alignItemWithTrigger is off because the reel scales this card, and
            the default item-over-trigger overlap does not survive a transform. */}
        <SelectContent
          className="min-w-[280px] rounded-lg p-1.5"
          alignItemWithTrigger={false}
        >
          {CCY.map((c) => (
            <SelectItem
              key={c.code}
              value={c.code}
              className={cn(
                "gap-4 rounded-md px-3 py-2.5",
                // The selected row tints toward the accent and pulls its code
                // with it; the name stays muted either way, so the code holds
                // the emphasis on its own.
                "data-selected:bg-[color-mix(in_oklab,var(--color-accent)_10%,var(--color-surface-raised))]",
                "data-selected:text-accent",
              )}
            >
              <span className="flex w-full min-w-[246px] items-center gap-4">
                <span className="w-11 flex-none font-mono text-[13px] font-semibold tracking-[0.02em]">
                  {c.code}
                </span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] text-fg-muted">
                  {c.label}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function CurrencyConverter({
  /** Lets the reel pin this tile open while a select's popup is on screen. */
  onHoldChange,
}: {
  onHoldChange?: (held: boolean) => void;
}) {
  const [amount, setAmount] = React.useState(1240);
  const [from, setFrom] = React.useState("PHP");
  const [to, setTo] = React.useState("USD");
  const [swapping, setSwapping] = React.useState(false);
  const [turns, setTurns] = React.useState(0);
  const [side, setSide] = React.useState<Side>(null);
  const [typed, setTyped] = React.useState<string | null>(null);

  const { rates, feed } = useRates();

  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const rate = rateOf(rates, from, to);
  const converted = amount * rate;

  // While a side is being typed into, that field shows the raw keystrokes and
  // the other shows the derived value — never the other way round, or the
  // caret would jump as the text reformats under it.
  const amountText =
    side === "from" && typed !== null ? typed : amount.toLocaleString("en-US");
  const convertedText =
    side === "to" && typed !== null ? typed : fmt(converted, to);

  function swap() {
    if (swapping) return;
    setSwapping(true);
    setTurns((t) => t + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setFrom(to);
      setTo(from);
      setSwapping(false);
    }, SWAP_MS);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface-raised">
      <div className="px-6 pt-[22px]">
        <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">
          Convert
        </span>
        <h2 className="mt-2.5 text-[22px] leading-[1.15] font-semibold tracking-[-0.025em] text-accent">
          What your money becomes
        </h2>
      </div>

      <div className="px-6 pt-[22px]">
        <div className="relative flex flex-col gap-2.5">
          <AmountField
            label="You convert"
            value={amountText}
            onChange={(v) => {
              setTyped(v);
              setAmount(toNumber(v));
            }}
            onFocus={() => setSide("from")}
            onBlur={() => {
              setSide(null);
              setTyped(null);
            }}
            active={side === "from"}
            raised={false}
            selectSlot={
              <CurrencySelect
                label="Convert from"
                value={from}
                onValueChange={setFrom}
                onOpenChange={(o) => onHoldChange?.(o)}
                className="fx-select"
                style={{
                  zIndex: swapping ? 4 : 2,
                  boxShadow: swapping ? "0 12px 26px rgb(0 0 0 / .14)" : "none",
                  transition: "box-shadow .4s ease",
                  animation: swapping
                    ? `sel-down ${SWAP_MS}ms cubic-bezier(.45,.05,.3,1) forwards`
                    : undefined,
                }}
              />
            }
          />

          <AmountField
            label="Recipient gets"
            value={convertedText}
            onChange={(v) => {
              setTyped(v);
              setAmount(toNumber(v) / rate);
            }}
            onFocus={() => setSide("to")}
            onBlur={() => {
              setSide(null);
              setTyped(null);
            }}
            active={side === "to"}
            raised
            selectSlot={
              <CurrencySelect
                label="Convert to"
                value={to}
                onValueChange={setTo}
                onOpenChange={(o) => onHoldChange?.(o)}
                className="fx-select"
                style={{
                  zIndex: swapping ? 3 : 2,
                  boxShadow: swapping ? "0 12px 26px rgb(0 0 0 / .14)" : "none",
                  transition: "box-shadow .4s ease",
                  animation: swapping
                    ? `sel-up ${SWAP_MS}ms cubic-bezier(.45,.05,.3,1) forwards`
                    : undefined,
                }}
              />
            }
          />

          <button
            type="button"
            onClick={swap}
            title="Swap currencies"
            aria-label={`Swap ${from} and ${to}`}
            className={cn(
              "absolute top-1/2 right-3.5 z-[5] -mt-[17px] inline-flex size-[34px]",
              "items-center justify-center rounded-full border border-accent bg-accent text-accent-fg",
              "shadow-[0_2px_10px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            <ArrowsDownUp
              weight="fill"
              aria-hidden
              className="size-3.5"
              style={{
                transform: `rotate(${turns * 180}deg)`,
                transition: "transform .52s cubic-bezier(.34,1.26,.44,1)",
              }}
            />
          </button>
        </div>
      </div>

      <div className="mx-6 mt-5 flex items-center justify-between gap-4 border-t border-line pt-3.5 pb-[22px]">
        <span className="text-xs text-fg-muted">
          {side === "to"
            ? "Back-solved from the recipient amount"
            : feed.status === "live"
              ? `Rate · updated ${feed.updated}`
              : feed.status === "failed"
                ? "Rate · offline table"
                : "Rate"}
        </span>
        <span className="font-mono text-[12.5px] tabular-nums text-fg">
          1 {from} ={" "}
          {rate.toLocaleString("en-US", { maximumSignificantDigits: 5 })} {to}
        </span>
      </div>
    </div>
  );
}
