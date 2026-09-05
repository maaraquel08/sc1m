import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Banner } from "@/components/ui/banner";

/**
 * The docs-site callout, rendered with the DS's own `Banner` instead of
 * fumadocs' boxed one. It keeps fumadocs' authoring API — `type` plus an
 * optional `title` — so MDX pages (and anything generated into them) read the
 * same, and the site stops shipping a second, borrowed notice style.
 *
 * `Banner` is deliberately "a tone and a sentence": one element, no parts, no
 * title. The title line lives here rather than in the component, because it is
 * a docs-prose need, not a DS one.
 */
const tones = {
  info: "info",
  idea: "info",
  warn: "warning",
  warning: "warning",
  error: "danger",
  success: "success",
} as const;

export interface CalloutProps
  extends Omit<ComponentProps<typeof Banner>, "tone" | "title"> {
  type?: keyof typeof tones;
  title?: ReactNode;
}

export function Callout({
  type = "info",
  title,
  className,
  children,
  ...props
}: CalloutProps) {
  return (
    <Banner
      tone={tones[type]}
      // A banner is borderless, so two of them in a row would read as one
      // block with two titles — prose margins land on paragraphs, not on the
      // div this renders. Match the prose paragraph rhythm (1.25em) so the
      // margin collapses to the same gap either side.
      className={cn("my-5", className)}
      {...props}
    >
      {/* MDX children arrive as prose blocks carrying fumadocs' 1.25em
          paragraph margins, which are sized for body copy and dwarf a 13.5px
          banner. Zero them and let one gap own the rhythm instead. */}
      <div
        className={[
          "flex flex-col gap-2 [&_:is(p,ul,ol,li,pre)]:my-0",
          // docs-body tints inline code with --surface, a neutral grey that
          // reads as foreign matter on a coloured wash. Re-mix the chip out of
          // the banner's own hue instead; --banner-tone inherits from the root.
          "[&_:not(pre)>code]:bg-[color-mix(in_oklab,var(--banner-tone)_12%,var(--color-bg))]!",
        ].join(" ")}
      >
        {title ? <p className="font-semibold">{title}</p> : null}
        {children}
      </div>
    </Banner>
  );
}
