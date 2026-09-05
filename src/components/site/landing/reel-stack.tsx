"use client";

import * as React from "react";

import { Miniature } from "./miniatures";
import { SLATS } from "./slats";

/**
 * The reel, for phones.
 *
 * The rail (reel.tsx) is a pointer instrument: you aim at a card, it grows,
 * the row parts around it, and its note fades in. None of that survives a
 * touchscreen — there is no hover to aim with, an open card wants 677px of
 * width, and the note would be unreachable. So below `md` the same journal is
 * told the way a phone already reads: top to bottom, every card at full
 * width, every note visible, the timeline running down the left as a spine
 * instead of across as a rule.
 *
 * Same source (SLATS), same reversal — newest first — so a new screen is
 * still just appended to the array and shows up at the top here and at the
 * left of the rail.
 */
const REEL = [...SLATS].reverse();

/** Width of the spine gutter: dot (11px) centred on the rule, plus air. */
const GUTTER = 28;

/**
 * The list's width, measured.
 *
 * A miniature is authored at its own natural size and never told how big to
 * be — the rail scales it, and so does this. The scale factor is
 * `width / slat.w`, which has to be a plain number: `scale()` takes a
 * unitless factor, so a percentage cannot express it and this has to be a
 * measurement rather than pure CSS.
 *
 * Measured in a layout effect *and* observed. The one-off read is what makes
 * the first paint correct: ResizeObserver is suspended while a tab is in the
 * background, so a page opened in a background tab (a restored session, a
 * middle-click) would otherwise sit at scale(1) — every card clipped to its
 * own top-left corner — until someone looked at it. The observer then handles
 * what the read cannot: rotating the phone.
 *
 * The ref goes on the <ol>, which carries no padding or border, so the
 * border-box the effect reads and the content-box the observer reports are
 * the same number.
 */
function useWidth() {
  const ref = React.useRef<HTMLOListElement>(null);
  const [width, setWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

export function ReelStack({ className }: { className?: string }) {
  const [ref, width] = useWidth();

  return (
    <div className={className}>
      <ol ref={ref} className="relative flex flex-col gap-9">
        {REEL.map((slat, i) => {
          // Fall back to the natural size on the first paint, before the
          // observer has reported: the card is briefly its own size inside a
          // clipping box rather than a collapsed sliver.
          const k = width > 0 ? (width - GUTTER) / slat.w : 1;

          return (
            <li key={slat.name} className="relative flex gap-0">
              {/* Each entry owns its own segment of the spine — the same way
                  a rail card owns the piece of timeline under it — so the
                  line stops at the oldest screen instead of trailing past it
                  down the last note. It runs a few px past the next dot's
                  top edge so no hairline gap can survive rounding; the dot
                  is opaque and sits above it (z-10), so the overlap never
                  shows. */}
              {i < REEL.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-[16px] -bottom-[46px] left-[5px] w-px bg-line-strong"
                />
              )}
              <span className="relative z-10 flex-none pt-[5px]">
                <span className="block size-[11px] rounded-full border-[1.5px] border-accent bg-accent" />
              </span>

              <div
                className="min-w-0 flex-1"
                style={{ paddingLeft: GUTTER - 11 }}
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[10px] tracking-[0.1em] text-accent uppercase">
                    {slat.date}
                  </span>
                  <span className="text-[13px] leading-[18px] font-medium tracking-[-0.005em] text-fg">
                    {slat.name}
                  </span>
                </div>

                {/* aspect-ratio holds the card's exact proportions while the
                    inner box is scaled, so the row reserves the right height
                    before the transform is applied — no jump on first paint. */}
                <div
                  className="relative mt-2.5 w-full overflow-hidden rounded-lg border border-line bg-surface-raised"
                  style={{
                    aspectRatio: `${slat.w} / ${slat.h}`,
                    /* The cards are live, and some of them contain things you
                       drag — a Slider, a Switch. Reserving vertical panning
                       for the page means a swipe that happens to start on a
                       control still scrolls, while taps and the horizontal
                       drags those controls actually want still reach them. */
                    touchAction: "pan-y",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{
                      width: slat.w,
                      height: slat.h,
                      transform: `scale(${k})`,
                    }}
                  >
                    <Miniature slat={slat} />
                  </div>
                </div>

                <p className="mt-3 text-[13px] leading-[1.5] text-pretty text-fg-muted">
                  {slat.note}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
