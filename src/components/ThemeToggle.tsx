"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme } from "@/lib/theme";

// Watch the <html> class list so the icon always reflects the active theme
// (the initial class is set by the inline script in layout.tsx before paint).
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false // server snapshot; corrected right after hydration
  );

  // Quick escape hatch to plain light/dark — clears any colorful/custom theme.
  function toggle() {
    applyTheme(dark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Przełącz tryb ciemny"
      title="Przełącz tryb ciemny"
      className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-violet-200"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
