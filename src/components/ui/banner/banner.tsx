import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "info" | "warning" | "success" | "danger";

/**
 * Flat wash: a borderless tint, a tone-coloured icon, and body copy in the
 * tone's own ink rather than muted grey. The whole block is the signal, so it
 * survives being skimmed at speed.
 *
 * Three values drive every tone, so a tone is a row in this table and nothing
 * else:
 *   --banner-tone  the hue
 *   --banner-wash  how much of it lands in the fill
 *   --banner-ink   how far the body copy is pulled from --fg toward the hue
 *
 * The wash and ink percentages differ per tone on purpose — they are not a
 * single number applied four times. Yellow carries far less weight than blue
 * at the same percentage, so warning washes harder (8%) and inks lighter
 * (45%) to land at the same perceived strength. Normalising these would make
 * the warning banner read as the weakest of the set.
 */
const tones: Record<Tone, string> = {
  info: "[--banner-tone:var(--color-info)] [--banner-wash:7%] [--banner-ink:55%]",
  warning:
    "[--banner-tone:var(--color-warning)] [--banner-wash:8%] [--banner-ink:45%]",
  success:
    "[--banner-tone:var(--color-success)] [--banner-wash:7%] [--banner-ink:50%]",
  danger:
    "[--banner-tone:var(--color-danger)] [--banner-wash:7%] [--banner-ink:50%]",
};

/** Spoken prefix for the icon, which is decorative to a screen reader. */
const toneLabels: Record<Tone, string> = {
  info: "Note",
  warning: "Warning",
  success: "Success",
  danger: "Error",
};

/**
 * Phosphor-fill shapes, inlined rather than pulled from an icon package —
 * the DS ships no icon dependency and every other glyph here (the collapsible
 * chevron, the accordion chevron) is inline too, so a registry install stays
 * dependency-free.
 *
 * Each glyph is knocked out of the solid shape with the banner's own fill
 * (--banner-bg) instead of a hardcoded white, so it stays correct in dark mode
 * and under any brand.
 */
const icons: Record<Tone, React.ReactNode> = {
  info: (
    <>
      <circle cx="8" cy="8" r="7.25" />
      <circle cx="8" cy="4.6" r="0.95" className="fill-(--banner-bg)" />
      <rect
        x="7.2"
        y="6.6"
        width="1.6"
        height="5.2"
        rx="0.8"
        className="fill-(--banner-bg)"
      />
    </>
  ),
  warning: (
    <>
      <path d="M7.13 1.62 0.6 12.6a1 1 0 0 0 .87 1.5h13.06a1 1 0 0 0 .87-1.5L8.87 1.62a1 1 0 0 0-1.74 0Z" />
      <rect
        x="7.2"
        y="5.3"
        width="1.6"
        height="4.4"
        rx="0.8"
        className="fill-(--banner-bg)"
      />
      <circle cx="8" cy="11.6" r="0.95" className="fill-(--banner-bg)" />
    </>
  ),
  success: (
    <>
      <circle cx="8" cy="8" r="7.25" />
      <path
        d="M4.6 8.2 6.9 10.5 11.4 6"
        fill="none"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-(--banner-bg)"
      />
    </>
  ),
  danger: (
    <>
      <circle cx="8" cy="8" r="7.25" />
      <path
        d="M5.6 5.6 10.4 10.4M10.4 5.6 5.6 10.4"
        fill="none"
        strokeWidth="1.7"
        strokeLinecap="round"
        className="stroke-(--banner-bg)"
      />
    </>
  ),
};

export interface BannerProps extends React.ComponentPropsWithRef<"div"> {
  tone?: Tone;
}

export function Banner({
  tone = "info",
  className,
  children,
  role,
  ...props
}: BannerProps) {
  return (
    <div
      // danger is the one tone that interrupts: an error the reader must hear
      // about now. The rest announce politely. Pass `role` to override.
      role={role ?? (tone === "danger" ? "alert" : "status")}
      className={cn(
        "flex gap-[11px] rounded-lg px-4 py-[13px]",
        // resolved once here so the icon knockout can reuse the exact fill
        "[--banner-bg:color-mix(in_oklab,var(--banner-tone)_var(--banner-wash),var(--color-bg))]",
        "bg-(--banner-bg)",
        "text-[13.5px] leading-[1.6] text-pretty",
        "text-[color-mix(in_oklab,var(--banner-tone)_var(--banner-ink),var(--color-fg))]",
        tones[tone],
        className,
      )}
      {...props}
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="currentColor"
        className="mt-[3px] size-[15px] shrink-0 text-(--banner-tone)"
      >
        {icons[tone]}
      </svg>
      {/* a div, never a p: MDX wraps multi-line JSX children in a paragraph of
          its own, and a <p> inside a <p> is unwrappable HTML — it fragments
          the subtree and fails hydration. */}
      <div>
        <span className="sr-only">{toneLabels[tone]}: </span>
        {children}
      </div>
    </div>
  );
}
