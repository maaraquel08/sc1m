"use client";

// Docs previews. These live in a .tsx rather than inline in the MDX
// deliberately: MDX parses multi-line JSX children as markdown and wraps them
// in its own <p>, which nests a <p> inside AiSummaryText's <p>. The HTML
// parser then auto-closes the outer one, so the browser DOM stops matching
// React's tree — a hydration mismatch, and highlight marks that fragment into
// slivers. JSX in a .tsx has no such rule. See .design-sync/NOTES.md.

import {
  AiSummary,
  AiSummaryLabel,
  AiSummaryMark,
  AiSummaryText,
  type AiSummaryPalette,
} from "./ai-summary";

const PALETTES: AiSummaryPalette[] = ["ember", "tide", "moss", "ink"];

// The docs Live preview uses `ember` rather than the `ink` default: ink is
// deliberately the near-still palette (three masses, minimal warp, a 60s pan),
// so it reads as a frozen image and demonstrates nothing. Ember's warp cycles
// on 26s/34s with a much larger displacement, which is where the motion
// actually shows.
export function Demo() {
  return (
    <AiSummary palette="ember" className="w-full max-w-[440px]">
      <AiSummaryLabel>What mattered</AiSummaryLabel>
      <AiSummaryText>
        You made 42 purchases in August.{" "}
        <AiSummaryMark>Twelve were the same café at the same hour</AiSummaryMark>{" "}
        — a habit, not a decision. Groceries fell{" "}
        <AiSummaryMark>31%</AiSummaryMark>{" "}
        in the same weeks.
      </AiSummaryText>
    </AiSummary>
  );
}

export function Palettes() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PALETTES.map((palette) => (
        <AiSummary key={palette} palette={palette}>
          <AiSummaryLabel>{palette}</AiSummaryLabel>
          <AiSummaryText className="mt-2 text-sm/[1.7]">
            Groceries fell <AiSummaryMark>31%</AiSummaryMark> while
            eating out held flat.
          </AiSummaryText>
        </AiSummary>
      ))}
    </div>
  );
}
