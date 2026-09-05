"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

/** False during SSR and the first client paint, true once hydrated. */
const subscribeNothing = () => () => {};
function useHydrated() {
  return React.useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}

/**
 * Reads and writes next-themes (supplied by fumadocs' RootProvider), which
 * puts .dark on <html> — so portalled popups theme too, and this button stays
 * in sync with the toggle in the /docs chrome.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The theme is only knowable on the client, so show the stable label until
  // hydration rather than letting the server and first paint disagree.
  const dark = useHydrated() && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {dark ? (
        <Sun weight="fill" aria-hidden className="size-3.5" />
      ) : (
        <Moon weight="fill" aria-hidden className="size-3.5" />
      )}
      {/* Icon-only on a phone — the landing header has ~342px of usable
          width and the label is 37px of it. aria-label already carries the
          meaning, so nothing is lost but the word. */}
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </Button>
  );
}
