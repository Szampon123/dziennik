"use client";

import { useEffect, useState } from "react";
import {
  THEME_OPTIONS,
  THEME_CHANGE_EVENT,
  applyTheme,
  readTheme,
  type ThemeId,
} from "@/lib/theme";
import { CustomThemeEditor } from "@/components/CustomThemeEditor";

// Design System v1.0 — segmented control on a neutral-100 track.
export function ThemeSegmented() {
  const [theme, setTheme] = useState<ThemeId>("system");

  useEffect(() => {
    // Read the persisted choice after hydration (server renders "system").
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(readTheme());
    const sync = () => setTheme(readTheme());
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, sync);
  }, []);

  function select(next: ThemeId) {
    setTheme(next);
    applyTheme(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className="inline-flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1"
        role="radiogroup"
        aria-label="Motyw"
      >
        {THEME_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={theme === o.id}
            onClick={() => select(o.id)}
            className={`min-h-10 rounded-md px-4 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
              theme === o.id
                ? "bg-neutral-0 text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {theme === "custom" && <CustomThemeEditor />}
    </div>
  );
}
