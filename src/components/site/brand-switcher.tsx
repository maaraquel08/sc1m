"use client";

import * as React from "react";
import { BRANDS } from "@/styles/contract";

const STORAGE_KEY = "sc1m-brand";
const DEFAULT_BRAND = BRANDS[0].key;

/** Brand keys are lowercase slugs; these are how they are written. */
const LABELS: Record<string, string> = {
  sc1m: "sc1m",
  luntian: "Luntian",
};

/* --------------------------------------------------------------------------
 * The stored brand, as an external store.
 *
 * localStorage is exactly that — state living outside React — so reading it
 * with useSyncExternalStore rather than an effect means no render with the
 * wrong brand, and no setState-in-effect cascade. `storage` covers other tabs;
 * the local event covers this one, which `storage` does not fire for.
 * ------------------------------------------------------------------------ */
const EVENT = "sc1m-brand-change";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function getSnapshot() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved && BRANDS.some((b) => b.key === saved) ? saved : DEFAULT_BRAND;
}

function useStoredBrand() {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_BRAND);
}

/**
 * Swaps the active brand token layer. Because --color-fd-* is bridged onto
 * the same tokens (src/styles/fumadocs-bridge.css), this re-themes the docs
 * chrome as well as the components on the page.
 */
export function BrandSwitcher() {
  const brand = useStoredBrand();

  React.useEffect(() => {
    const entry = BRANDS.find((b) => b.key === brand) ?? BRANDS[0];
    // data-brand lives on <html> so portalled popups (in <body>) rebrand too.
    // The default brand owns :root and carries no attribute.
    if (entry.attr) document.documentElement.dataset.brand = entry.attr;
    else delete document.documentElement.dataset.brand;
  }, [brand]);

  function select(next: string) {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <div className="flex flex-col gap-1.5 px-1 py-2">
      <span className="text-xs font-medium text-fd-muted-foreground">Brand</span>
      <div
        role="radiogroup"
        aria-label="Active brand"
        className="flex gap-1 rounded-md border border-fd-border p-0.5"
      >
        {BRANDS.map((b) => (
          <button
            key={b.key}
            type="button"
            role="radio"
            aria-checked={brand === b.key}
            onClick={() => select(b.key)}
            className={`flex-1 rounded-sm px-2 py-1 text-xs transition-colors ${
              brand === b.key
                ? "bg-fd-primary text-fd-primary-foreground"
                : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
            }`}
          >
            {LABELS[b.key] ?? b.key}
          </button>
        ))}
      </div>
    </div>
  );
}
