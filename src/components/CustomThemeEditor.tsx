"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  CUSTOM_TOKENS,
  applyCustomVars,
  readCustom,
  saveCustom,
  type CustomVars,
} from "@/lib/theme";
import { Button } from "@/components/ui/Button";

// Lets the user recolour individual UI elements (the "Custom" theme). Changes
// apply live and persist to localStorage; each token can be reset to default.
export function CustomThemeEditor() {
  const [vars, setVars] = useState<CustomVars>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVars(readCustom());
  }, []);

  const groups = useMemo(() => {
    const order: string[] = [];
    for (const t of CUSTOM_TOKENS) if (!order.includes(t.group)) order.push(t.group);
    return order.map((group) => ({
      group,
      tokens: CUSTOM_TOKENS.filter((t) => t.group === group),
    }));
  }, []);

  function commit(next: CustomVars) {
    setVars(next);
    saveCustom(next);
    applyCustomVars(next);
  }

  function setColor(cssVar: string, value: string) {
    commit({ ...vars, [cssVar]: value });
  }

  function resetToken(cssVar: string) {
    const next = { ...vars };
    delete next[cssVar];
    commit(next);
  }

  function resetAll() {
    commit({});
  }

  const hasOverrides = Object.keys(vars).length > 0;

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-[13px] text-neutral-500">
        Dostosuj kolory poszczególnych elementów. Zmiany zapisują się od razu i tylko na tym
        urządzeniu.
      </p>

      {groups.map(({ group, tokens }) => (
        <div key={group} className="flex flex-col gap-2">
          <p className="text-[13px] font-medium text-neutral-800">{group}</p>
          <div className="flex flex-col gap-2">
            {tokens.map((t) => {
              const current = vars[t.cssVar] ?? t.default;
              const overridden = t.cssVar in vars;
              return (
                <div key={t.cssVar} className="flex items-center gap-3">
                  <label
                    className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-md border border-neutral-300"
                    style={{ backgroundColor: current }}
                    title={`Zmień: ${t.label}`}
                  >
                    <input
                      type="color"
                      value={current}
                      onChange={(e) => setColor(t.cssVar, e.target.value)}
                      aria-label={t.label}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </label>
                  <span className="flex-1 text-sm text-neutral-800">{t.label}</span>
                  <span className="font-mono text-[13px] uppercase text-neutral-500">
                    {current}
                  </span>
                  <button
                    type="button"
                    onClick={() => resetToken(t.cssVar)}
                    disabled={!overridden}
                    aria-label={`Przywróć domyślny: ${t.label}`}
                    title="Przywróć domyślny"
                    className="rounded p-1 text-neutral-500 transition-colors hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-30"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div>
        <Button variant="secondary" onClick={resetAll} disabled={!hasOverrides}>
          Przywróć wszystkie domyślne
        </Button>
      </div>
    </div>
  );
}
