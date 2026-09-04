"use client";

import * as React from "react";

import { Miniature } from "./miniatures";
import { BOTTOM, SLATS, TILE_H, TILE_H_OPEN } from "./slats";

const EASE = "cubic-bezier(.22,1,.36,1)";

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

  const openSlat = open === null ? null : SLATS[open];
  const label = openSlat
    ? `${openSlat.name} · ${openSlat.parts}`
    : "Hover to zoom";

  const trackShift = openSlat
    ? -Math.round(
        (openSlat.w * (TILE_H_OPEN / openSlat.h) -
          openSlat.w * (TILE_H / openSlat.h)) /
          2,
      )
    : 0;

  return (
    <>
      <div className="px-6 sm:px-14">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[10.5px] font-semibold tracking-[0.16em] text-accent uppercase">
            The reel
          </span>
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[10.5px] tracking-[0.1em] text-fg-subtle uppercase">
            {label}
          </span>
        </div>
        <h1 className="mt-5 max-w-[30ch] text-[clamp(44px,7vw,86px)] leading-[0.93] font-semibold tracking-[-0.05em] text-fg">
          Every screen.
          <br />
          <span className="text-fg-subtle">One contract.</span>
        </h1>
      </div>

      <div
        className="rail relative flex h-[582px] items-end overflow-x-auto overflow-y-hidden px-6 pb-6 sm:px-11"
        onMouseLeave={() => setOpen(null)}
      >
        <div
          className="flex min-w-max items-end gap-4"
          style={{
            transform: `translateX(${trackShift}px)`,
            transition: `transform .45s ${EASE}`,
          }}
        >
          {SLATS.map((slat, i) => {
            const isOpen = i === open;
            const h = isOpen ? TILE_H_OPEN : TILE_H;
            const k = h / slat.h;
            const w = Math.round(slat.w * k);
            const wRest = Math.round(slat.w * (TILE_H / slat.h));

            return (
              <div
                key={slat.name}
                tabIndex={0}
                aria-label={`${slat.name} — ${slat.parts}. ${slat.note}`}
                onMouseEnter={() => setOpen(i)}
                onMouseLeave={() => setOpen(null)}
                onFocus={() => setOpen(i)}
                onBlur={() => setOpen(null)}
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
                  className="absolute left-1/2 overflow-hidden rounded-lg border border-line bg-surface-raised"
                  style={{
                    bottom: BOTTOM,
                    transform: "translateX(-50%)",
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
                    <Miniature slat={slat} />
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
        </div>
      </div>
    </>
  );
}
