"use client";

import { useRouter } from "next/navigation";
import { MAX_LEVEL } from "@/lib/forum";
import { inputClass } from "@/components/ui/Input";

// Pick which level's discussion to view. Options are annotated with the message
// count so you can see at a glance where people have written. Navigates on
// change (server-rendered per selection via ?level=).
export function LevelPicker({
  slug,
  current,
  generalCount,
  levelCounts,
}: {
  slug: string;
  current: number | null;
  generalCount: number;
  levelCounts: Record<number, number>;
}) {
  const router = useRouter();

  function go(value: string) {
    router.push(value === "" ? `/forum/${slug}` : `/forum/${slug}?level=${value}`);
  }

  const suffix = (n: number) => (n > 0 ? ` — ${n}` : "");

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-neutral-800">Poziom</span>
      <select
        value={current === null ? "" : String(current)}
        onChange={(e) => go(e.target.value)}
        aria-label="Wybierz poziom"
        className={`${inputClass} w-full sm:w-72`}
      >
        <option value="">Ogólne (cała umiejętność){suffix(generalCount)}</option>
        {Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map((lvl) => (
          <option key={lvl} value={lvl}>
            Poziom {lvl}
            {suffix(levelCounts[lvl] ?? 0)}
          </option>
        ))}
      </select>
    </label>
  );
}
