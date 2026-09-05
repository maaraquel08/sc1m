"use client";

import * as React from "react";

/**
 * Repaints the browser-tab icon in the active brand's colour.
 *
 * The mark itself is fixed — Mics 3A, the lowercase m — and only its
 * ground changes: orange for sc1m, sage for Luntian. Colour comes from
 * --brand-icon / --brand-icon-fg (src/styles/contract.ts), so adding a
 * brand is still just dropping in a CSS file; nothing here needs to
 * learn the new brand's name.
 *
 * Deliberately theme-independent. The tab sits in browser chrome, not
 * on our canvas, so the dark-mode accent lift would be answering a
 * contrast question nobody asked. The token parity test enforces that.
 */

/* Geometry from assets/README.txt: 8x8 module grid inside a 12x12
 * viewBox, glyph inset by 2 and dropped 3. The tight glyph box is
 * 8x5 — a shoulder bar over three 2-unit legs with 1-unit counters.
 * Expressed as rects rather than a path so a canvas can draw it
 * directly; this is the same shape as src/app/icon.svg. */
const GRID = 12;
const ORIGIN = { x: 2, y: 3 };
/** [x, y, w, h] in module units, relative to ORIGIN. */
const GLYPH: readonly (readonly [number, number, number, number])[] = [
  [0, 0, 8, 1], // shoulder
  [0, 1, 2, 4], // left leg
  [3, 1, 2, 4], // middle leg
  [6, 1, 2, 4], // right leg
];

/** 64px covers the 16/32px the browser actually asks for, with room
 * for a 2x tab strip, and still encodes to a small data URI. */
const SIZE = 64;

/**
 * The *used* value of a custom property.
 *
 * getComputedStyle().getPropertyValue('--x') hands back the authored
 * token stream, which for a var() chain can come back unsubstituted.
 * Painting `color` onto a throwaway element and reading it back gives
 * a real colour string every time — and canvas fillStyle accepts
 * whatever the browser parsed, so Luntian's oklch() survives without
 * us having to convert anything.
 */
function usedColor(name: string, fallback: string): string {
  const probe = document.createElement("span");
  probe.style.color = fallback;
  probe.style.color = `var(--${name})`;
  probe.style.display = "none";
  document.documentElement.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value || fallback;
}

function paint(): string | null {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const unit = SIZE / GRID;
  // Fallbacks are sc1m's, so a brand file that forgets the slot still
  // gets the default mark rather than a blank tab.
  ctx.fillStyle = usedColor("brand-icon", "#ff5a00");
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.fillStyle = usedColor("brand-icon-fg", "#ffffff");
  for (const [x, y, w, h] of GLYPH) {
    ctx.fillRect(
      (ORIGIN.x + x) * unit,
      (ORIGIN.y + y) * unit,
      w * unit,
      h * unit,
    );
  }

  return canvas.toDataURL("image/png");
}

export function BrandFavicon() {
  React.useEffect(() => {
    let url: string | null = null;

    /* Every icon link, not just the first.
     *
     * Next renders the <link> for src/app/icon.svg itself, and re-adds a
     * fresh one on re-render — so mutating "the" link leaves a stale
     * duplicate behind and lets the browser choose between them. Painting
     * all of them makes the choice not matter. We only ever set
     * attributes on React's nodes, never remove them; removing would
     * start a tug-of-war with the reconciler. */
    function repaint(recompute: boolean) {
      if (recompute || !url) url = paint();
      if (!url) return;
      for (const link of document.querySelectorAll<HTMLLinkElement>(
        'link[rel~="icon"]',
      )) {
        if (link.getAttribute("href") === url) continue;
        link.setAttribute("type", "image/png");
        link.setAttribute("href", url);
      }
    }

    repaint(true);

    /* Two triggers, deliberately different:
     *   - data-brand on <html> means a new colour, so repaint.
     *     BrandSwitcher owns that attribute (brand-switcher.tsx), and
     *     anything else that sets it — Storybook's Brand toolbar — is
     *     followed for free. `class` is ignored on purpose: the mark
     *     does not follow dark mode.
     *   - a new <link> in <head> means React re-rendered its icon, so
     *     re-apply the colour we already have.
     * Setting attributes never fires a childList record, so these
     * cannot feed each other. */
    const onBrand = new MutationObserver(() => repaint(true));
    onBrand.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-brand"],
    });

    const onHead = new MutationObserver(() => repaint(false));
    onHead.observe(document.head, { childList: true });

    return () => {
      onBrand.disconnect();
      onHead.disconnect();
    };
  }, []);

  return null;
}
