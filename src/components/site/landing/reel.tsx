"use client";

import * as React from "react";

import { Miniature } from "./miniatures";
import { ReelStack } from "./reel-stack";
import { BOTTOM, SLATS, TILE_H, TILE_H_OPEN } from "./slats";

const EASE = "cubic-bezier(.22,1,.36,1)";

/**
 * The reel runs newest first, left to right — today's screen leads and the
 * timeline reads backwards into February. SLATS itself stays chronological so
 * that adding a screen is still "append to the end", which is the gesture
 * anyone will reach for; the reversal happens once, here, at the boundary
 * between the journal and its display.
 */
const REEL = [...SLATS].reverse();

/**
 * Breathing room at each end of the rail. The end cards no longer need it —
 * they are anchored (see `anchorOf`) and grow inward — but their NEIGHBOURS
 * still grow symmetrically, and the second card in from either edge reaches
 * `g / 2` past the first one. Sized from the widest tile, so it stays correct
 * when a wider card is added.
 */
const EDGE_SLACK = Math.ceil(
  Math.max(...SLATS.map((s) => (s.w * (TILE_H_OPEN - TILE_H)) / s.h)) / 2,
);

const Slack = () => (
  <div aria-hidden className="flex-none" style={{ width: EDGE_SLACK }} />
);

/**
 * Where a tile grows from.
 *
 * A middle card grows from its own centre, which is the reel's whole gesture:
 * the row parts around the thing you are pointing at. The two end cards can't
 * — half their growth would go off the rail, where there is nothing to reflow
 * into and nothing to scroll to. So each end card is pinned by its outer edge
 * and grows inward: the first from its bottom-left, the last from its
 * bottom-right. At rest all three are identical (the box fills its column), so
 * this only ever shows while a card is open.
 */
type Anchor = "left" | "center" | "right";
const anchorOf = (i: number): Anchor =>
  i === 0 ? "left" : i === REEL.length - 1 ? "right" : "center";

/** How much wider a tile gets when it opens. */
const growthOf = (slat: (typeof REEL)[number]) =>
  Math.round((slat.w * (TILE_H_OPEN - TILE_H)) / slat.h);

/**
 * The reel (landing study 3A).
 *
 * Every screen the system has produced, as a 200px-tall miniature that is as
 * wide as its own aspect ratio needs. Pointing at one grows it from its own
 * centre and the row reflows around it: siblings slide outward on both sides,
 * nothing squeezes, and every miniature keeps its exact proportions.
 *
 * Two things make that work:
 *
 *  1. A tile is never re-laid-out. It renders at its natural size inside an
 *     absolutely-positioned inner box and the whole box is `scale()`d, so the
 *     zoom is a pure transform — no reflow inside the card, no text rewrap.
 *  2. The tile is anchored `BOTTOM`px above the bottom of its column, which is
 *     exactly the height of the label + timeline + note beneath it. So it
 *     grows upward into empty headroom and the timeline never moves.
 *
 * The row also shifts left by half the open tile's width growth, so the tile
 * you are pointing at expands around itself rather than pushing right.
 */
export function Reel() {
  const [open, setOpen] = React.useState<number | null>(null);
  /**
   * A miniature that opens a portalled popup (the converter's currency
   * selects) renders it into <body>, outside this tile — so moving the pointer
   * onto it would otherwise read as leaving the tile and collapse the card out
   * from under the menu. While such a popup is up, the tile is pinned.
   */
  const held = React.useRef(false);
  const release = React.useCallback(() => {
    if (!held.current) setOpen(null);
  }, []);

  const openSlat = open === null ? null : REEL[open];
  const label = openSlat
    ? `${openSlat.name} · ${openSlat.parts}`
    : "Hover to zoom";

  /**
   * The column always widens rightward — that is just flex — so the track
   * slides left to place the growth where the anchor says it belongs: not at
   * all for a left-anchored card (it already grows the right way), by the full
   * growth for a right-anchored one (pinning its right edge), and by half for
   * everything in between.
   */
  const trackShift = (() => {
    if (open === null || !openSlat) return 0;
    const g = growthOf(openSlat);
    const anchor = anchorOf(open);
    if (anchor === "left") return 0;
    if (anchor === "right") return -g;
    return -Math.round(g / 2);
  })();

  return (
    <>
      <div className="px-6 sm:px-14">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[10.5px] font-semibold tracking-[0.16em] text-accent uppercase">
            The reel
          </span>
          <span className="h-px flex-1 bg-line" />
          {/* "Hover to zoom" is a promise only a pointer can keep. Below md
              the stack shows every card open already, so there is nothing to
              say and the rule simply runs to the edge. */}
          <span className="hidden font-mono text-[10.5px] tracking-[0.1em] text-fg-subtle uppercase md:inline">
            {label}
          </span>
        </div>
        <h1 className="mt-5 max-w-[30ch] text-[clamp(44px,7vw,86px)] leading-[0.93] font-semibold tracking-[-0.05em] text-fg">
          Every screen.
          <br />
          <span className="text-fg-subtle">One contract.</span>
        </h1>
      </div>

      <ReelStack className="mt-9 px-6 pb-4 md:hidden" />

      {/* The rail is a pointer instrument — hover to open, row reflows around
          the open card, 677px wide at its widest. None of that fits a phone,
          so below md it is not rendered at all and ReelStack tells the same
          journal vertically. CSS makes that choice, not a JS media query: the
          server cannot know the viewport, and a JS swap would render the rail
          first and snap on hydration — the worst possible flash, on exactly
          the devices least able to absorb it. */}
      <div
        className="rail relative hidden h-[582px] items-end overflow-x-auto overflow-y-hidden px-6 pb-6 sm:px-11 md:flex"
        onMouseLeave={release}
      >
        <div
          className="flex min-w-max items-end gap-4"
          style={{
            transform: `translateX(${trackShift}px)`,
            transition: `transform .45s ${EASE}`,
          }}
        >
          <Slack />
          {REEL.map((slat, i) => {
            const isOpen = i === open;
            const h = isOpen ? TILE_H_OPEN : TILE_H;
            const k = h / slat.h;
            const w = Math.round(slat.w * k);
            const wRest = Math.round(slat.w * (TILE_H / slat.h));
            const anchor = anchorOf(i);

            return (
              <div
                key={slat.name}
                tabIndex={0}
                aria-label={`${slat.name} — ${slat.parts}. ${slat.note}`}
                onMouseEnter={() => setOpen(i)}
                onMouseLeave={release}
                onFocus={() => setOpen(i)}
                onBlur={release}
                className="relative flex min-w-0 cursor-pointer flex-col items-start gap-2.5 outline-none"
                style={{
                  flex: `0 0 ${isOpen ? w : wRest}px`,
                  zIndex: isOpen ? 20 : 1,
                  opacity: isOpen ? 1 : open !== null ? 0.42 : 1,
                  transition: `flex-basis .45s ${EASE}, opacity .3s`,
                }}
              >
                {/* Reserves the resting footprint so the row's height is fixed. */}
                <div className="w-full flex-none" style={{ height: TILE_H }} />

                <div
                  className="absolute overflow-hidden rounded-lg border border-line bg-surface-raised"
                  style={{
                    bottom: BOTTOM,
                    // The anchored edge is the one that stays put as `width`
                    // animates; the box fills its column at rest, so all three
                    // resolve to the same place until the card opens.
                    ...(anchor === "left"
                      ? { left: 0 }
                      : anchor === "right"
                        ? { right: 0 }
                        : { left: "50%", transform: "translateX(-50%)" }),
                    width: w,
                    height: h,
                    boxShadow: isOpen ? "0 14px 34px rgb(0 0 0 / .14)" : "none",
                    transition: `width .45s ${EASE}, height .45s ${EASE}, box-shadow .35s`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{
                      width: slat.w,
                      height: slat.h,
                      transform: `scale(${k})`,
                      transition: `transform .45s ${EASE}`,
                      pointerEvents: isOpen ? "auto" : "none",
                    }}
                  >
                    <Miniature
                      slat={slat}
                      onHoldChange={(h) => {
                        held.current = h;
                      }}
                    />
                  </div>
                </div>

                <div
                  className="h-[18px] max-w-full self-stretch overflow-hidden text-[13px] leading-[18px] font-medium tracking-[-0.005em] text-ellipsis whitespace-nowrap"
                  style={{
                    color: isOpen ? "var(--color-fg)" : "var(--color-fg-subtle)",
                    transition: "color .3s",
                  }}
                >
                  {slat.name}
                </div>

                {/* This card's own segment of the timeline: dot at its left
                    edge, line running its width and into the gap. */}
                <div className="mt-1 flex h-3 w-[calc(100%+16px)] items-center">
                  <span
                    className="size-[11px] flex-none rounded-full border-[1.5px]"
                    style={{
                      borderColor: isOpen
                        ? "var(--color-accent)"
                        : "var(--color-line-strong)",
                      background: isOpen
                        ? "var(--color-accent)"
                        : "var(--color-bg)",
                      transform: `scale(${isOpen ? 1.25 : 1})`,
                      transition: `background .4s ${EASE}, border-color .4s ${EASE}, transform .45s ${EASE}`,
                    }}
                  />
                  <span
                    className="h-px flex-1"
                    style={{
                      background: isOpen
                        ? "var(--color-accent)"
                        : "var(--color-line-strong)",
                      transition: `background .4s ${EASE}`,
                    }}
                  />
                </div>

                <div className="mt-2 flex h-[52px] w-full flex-col gap-[3px] overflow-hidden">
                  <span
                    className="font-mono text-[10px] tracking-[0.1em] uppercase"
                    style={{
                      color: isOpen
                        ? "var(--color-accent)"
                        : "var(--color-fg-subtle)",
                      transition: `color .4s ${EASE}`,
                    }}
                  >
                    {slat.date}
                  </span>
                  <span
                    className="text-[11.5px] leading-[1.4] text-pretty text-fg-muted"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: `translateY(${isOpen ? 0 : 4}px)`,
                      transition: `opacity .4s ${EASE}, transform .4s ${EASE}`,
                    }}
                  >
                    {slat.note}
                  </span>
                </div>
              </div>
            );
          })}
          <Slack />
        </div>
      </div>
    </>
  );
}
