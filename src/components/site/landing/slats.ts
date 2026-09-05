/**
 * The reel (landing study 3A).
 *
 * Every entry is one miniature screen *and* one node on the timeline — the
 * reel doubles as the journal of how the system was built, so the list is
 * ordered by `date`, not by importance. It runs oldest first here; the reel
 * reverses it for display, which is why a new screen is APPENDED to the end
 * of this array and shows up at the left of the rail.
 *
 * `w`/`h` are the miniature's *natural* size. The reel never resizes a card:
 * it renders each one at its own dimensions and scales the whole thing so the
 * height lands on TILE_H (resting) or TILE_H_OPEN (pointed at). That is what
 * keeps every miniature's exact proportions while the row reflows around it.
 */
export type SlatKind =
  | "palette"
  | "plate"
  | "buttons"
  | "access"
  | "type"
  | "send"
  | "chips"
  | "insights"
  | "switches"
  | "converter";

export interface Slat {
  kind: SlatKind;
  /** Label under the tile, and the left half of the reel's status line. */
  name: string;
  /** Which primitives the screen is made of — the right half of that line. */
  parts: string;
  w: number;
  h: number;
  date: string;
  note: string;
  /** `plate` only: the placeholder screens still waiting on a real UI. */
  kicker?: string;
  title?: string;
}

export const SLATS: Slat[] = [
  {
    kind: "palette",
    name: "Colour",
    parts: "15 roles",
    w: 440,
    h: 260,
    date: "Feb 04",
    note: "Fifteen colour roles agreed before a single component existed.",
  },
  {
    kind: "buttons",
    name: "Buttons",
    parts: "4 variants",
    w: 300,
    h: 330,
    date: "Mar 12",
    note: "Focus became a token here — every ring reads --ring.",
  },
  {
    kind: "access",
    name: "Permissions",
    parts: "Switch · Button",
    w: 360,
    h: 352,
    date: "Mar 28",
    note: "Permissions forced the Switch/Checkbox states to agree.",
  },
  {
    kind: "type",
    name: "Type",
    parts: "2 families",
    w: 300,
    h: 320,
    date: "Apr 09",
    note: "The type scale stopped growing at five steps.",
  },
  {
    kind: "send",
    name: "Transfer composer",
    parts: "Input · Button",
    w: 360,
    h: 336,
    date: "Apr 30",
    note: "Transfer composer: the screen that proved the contract survives a rebrand.",
  },
  {
    kind: "insights",
    name: "Payout runs",
    parts: "Progress · Chip",
    w: 360,
    h: 300,
    date: "Jun 03",
    note: "Progress, Meter and Toast landed as one feedback family.",
  },
  {
    kind: "converter",
    name: "Currency converter",
    parts: "Select · Input",
    w: 420,
    h: 336,
    date: "Sep 05",
    note: "The swap card: two stacked fields, either one editable, and the only screen so far whose title is set in the accent.",
  },
];

/** Resting miniature height. */
export const TILE_H = 200;
/** Height a miniature grows to when pointed at. */
export const TILE_H_OPEN = 400;
/**
 * Distance from the bottom of a reel column to the bottom of its tile — i.e.
 * the exact height of the label, timeline row and date block stacked below.
 * Anchoring the tile here is what makes it grow upward instead of shoving the
 * timeline down.
 */
export const BOTTOM = 124;
