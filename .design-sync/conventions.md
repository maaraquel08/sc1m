## How to build with sc1m

**Everything is a semantic token.** No component takes a colour, radius, or
duration value. You style with utility classes whose names *are* the token
names, and the active brand and theme decide what they resolve to. Never write
a hex value, and never reach for a Tailwind palette class (`bg-slate-100`,
`text-gray-500`) — they are not in this stylesheet and will do nothing.

### The class vocabulary

| Family | Classes |
|---|---|
| Page & surfaces | `bg-bg` (page) · `bg-surface` (recessed/tinted) · `bg-surface-raised` (cards) |
| Text | `text-fg` (primary) · `text-fg-muted` (secondary) · `text-fg-subtle` (tertiary) |
| Borders | `border-line` (hairline) · `border-line-strong` · `divide-line` |
| Brand / action | `bg-accent` + `text-accent-fg` · `bg-accent-hover` · `text-accent` · `border-accent` |
| Status | `bg-highlight` · `text-danger` / `bg-danger` + `text-danger-fg` · `text-info` · `bg-success` |
| Focus | `focus-visible:outline-ring focus-visible:outline-2 focus-visible:-outline-offset-2` (the ring is inset), plus `outline-bg` |
| Radius | `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` `rounded-full` |
| Elevation | `shadow-raised` (resting lift) · `shadow-overlay` (popups) |
| Type | `font-mono` · `font-normal` `font-medium` `font-semibold` |

**The stylesheet is pre-compiled — there is no Tailwind running.** Only classes
already emitted (~466 of them) work. Standard layout and spacing utilities are
present (`flex`, `grid`, `items-center`, `gap-0`–`gap-6`/`gap-8`, `p-4`, `px-3`,
`mt-2`, `w-full`, `h-9`, `text-sm`…), so compose layouts with those. For
anything outside that set, use an inline style against the token variable —
`style={{ background: "var(--surface)" }}` — rather than inventing a class.
The variables are the same names without the utility prefix: `--bg`,
`--surface`, `--surface-raised`, `--fg`, `--fg-muted`, `--fg-subtle`, `--line`,
`--line-strong`, `--accent`, `--accent-fg`, `--highlight`, `--success`,
`--danger`, `--info`, `--ring`, plus `--brand-radius-sm|md|lg|xl`.

### Wrapping and setup

- Wrap the app in `<div className="root">`. It sets `isolation: isolate`, which
  is what keeps Base UI's portalled popups (dialog, select, menu, tooltip)
  stacking above your content. Without it overlays can paint underneath.
- **Tooltips need a provider.** `<TooltipProvider>` must be an ancestor of any
  `<Tooltip>`, once near the app root. No other component needs a provider —
  everything else is styled purely by the token layer.
- **Dark mode** is the `dark` class on an ancestor (usually `<html>`). Do not
  write `dark:` variants of your own; the tokens flip underneath you.
- **Brands**: the default (`:root`) brand is sc1m — orange accent, sharp radii.
  Setting `data-brand="luntian"` on `<html>` switches to the Luntian brand
  (deep sage-green accent on a warm white, softer radii) with no component
  changes.

### Where the truth lives

Read `styles.css` and the files it `@import`s for the full token layer, and
`components/ui/<Name>/<Name>.prompt.md` for a component's real usage docs
(these are the library's own documentation pages, including composition trees
and prop tables).

### An idiomatic snippet

```jsx
<div className="root">
  <TooltipProvider>
    <div className="rounded-xl border border-line bg-surface-raised p-4">
      <h2 className="text-sm font-semibold text-fg">Invite teammates</h2>
      <p className="mt-2 text-sm text-fg-muted">
        Send an invite link to anyone on your team.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button>Send invite</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
    </div>
  </TooltipProvider>
</div>
```
