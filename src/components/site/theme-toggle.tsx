"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = React.useState(false);

  function toggle() {
    const next = !dark;
    setDark(next);
    // .dark lives on <html> so portalled popups (in <body>) also theme
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle}>
      <span aria-hidden>{dark ? "☀︎" : "☾"}</span>
      {dark ? "Light" : "Dark"}
    </Button>
  );
}
