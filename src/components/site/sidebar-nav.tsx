"use client";

import type { SidebarPageTreeComponents } from "fumadocs-ui/components/sidebar/page-tree";

/**
 * Sidebar section headings.
 *
 * `"use client"` is load-bearing: the docs layout is a server component, and a
 * component handed across that boundary has to be a client reference.
 *
 * The nav is a flat list — `content/docs/meta.json` uses `---Name---`
 * separators instead of folders, so nothing collapses and every page is one
 * click away. The heading is the quiet element here and the links carry the
 * weight, which is the inverse of fumadocs' default.
 */
export const sidebarComponents: Partial<SidebarPageTreeComponents> = {
  Separator: ({ item }) => (
    <p className="mt-7 mb-1 px-2 text-sm text-fd-muted-foreground first:mt-0">
      {item.icon}
      {item.name}
    </p>
  ),
};

/**
 * Inactive links default to `text-fd-muted-foreground`, which reads as
 * secondary against the headings. Lifted to full contrast and medium weight;
 * the active link keeps fumadocs' primary tint.
 */
export const sidebarClassName =
  "[&_a[data-active='false']]:font-medium [&_a[data-active='false']]:text-fd-foreground";
