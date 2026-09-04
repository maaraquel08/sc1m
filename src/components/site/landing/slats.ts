/**
 * The reel (landing study 3A).
 *
 * Every entry is one miniature screen *and* one node on the timeline — the
 * reel doubles as the journal of how the system was built, so the list is
 * ordered by `date`, not by importance.
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
  | "switches";

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
    kind: "plate",
    name: "Dialog",
    parts: "Base UI portal",
    w: 400,
    h: 280,
    date: "Feb 21",
    note: "Dialog was the first thing to need a portal and an elevation pair.",
    kicker: "Overlay",
    title: "Confirm payout run",
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
    kind: "chips",
    name: "Status",
    parts: "4 tones",
    w: 320,
    h: 300,
    date: "May 15",
    note: "Status cut from five colours to three roles.",
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
    kind: "switches",
    name: "Controls",
    parts: "Switch · Slider",
    w: 340,
    h: 340,
    date: "Jun 22",
    note: "Slider was the last control to give up its own colours.",
  },
  {
    kind: "plate",
    name: "Toast",
    parts: "queue of 3",
    w: 380,
    h: 220,
    date: "Jul 07",
    note: "Toast queue capped at three; anything more is a log, not a toast.",
    kicker: "Feedback",
    title: "Transfer sent",
  },
  {
    kind: "plate",
    name: "Tabs",
    parts: "Toolbar · Tabs",
    w: 420,
    h: 300,
    date: "Jul 24",
    note: "Tabs and Toolbar merged their focus-ring logic.",
    kicker: "Navigation",
    title: "Accounts / Cards / Limits",
  },
  {
    kind: "plate",
    name: "Table",
    parts: "ScrollArea",
    w: 480,
    h: 300,
    date: "Aug 11",
    note: "Table moved onto ScrollArea and stopped inventing borders.",
    kicker: "Data",
    title: "412 transactions",
  },
  {
    kind: "plate",
    name: "Command",
    parts: "Autocomplete",
    w: 420,
    h: 260,
    date: "Aug 29",
    note: "Command palette prototyped on Autocomplete.",
    kicker: "Search",
    title: "Jump to anything",
  },
  {
    kind: "plate",
    name: "Avatars",
    parts: "Avatar · PreviewCard",
    w: 300,
    h: 240,
    date: "Sep 05",
    note: "Avatars and PreviewCard — identity was the last gap.",
    kicker: "Identity",
    title: "Six people, one account",
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
