import Link from "next/link";
import { computeCharacter, CHARACTER_STAGES } from "@/lib/character";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { Progress } from "@/components/ui/Progress";

// A companion panel pinned to the page's left gutter on wide screens. The Dudu
// character evolves with the user's activity progress; clicking jumps to
// Aktywności, where that progress is earned.
export function CharacterRail({ xp }: { xp: number }) {
  const c = computeCharacter(xp);

  return (
    <Link
      href="/activities"
      aria-label={`Twój towarzysz: ${c.stageName}. Zaliczone poziomy: ${xp}. Przejdź do aktywności.`}
      className="fixed left-4 top-1/2 z-30 hidden w-[184px] -translate-y-1/2 flex-col items-center gap-3 rounded-card border border-neutral-200 bg-neutral-0 p-4 shadow-card outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-violet-200 xl:flex"
    >
      <CharacterAvatar stage={c.stageIndex} size={96} className="dudu-breathe" />

      <div className="flex w-full flex-col items-center gap-1 text-center">
        <p className="text-[15px] font-semibold text-neutral-900">{c.stageName}</p>
        <p className="text-[11px] font-medium uppercase tracking-wide text-violet-700">
          Forma {c.stageIndex + 1}/{CHARACTER_STAGES.length}
        </p>
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <Progress value={c.isMax ? 1 : c.intoStage} max={c.isMax ? 1 : c.stageSpan} />
        <p className="text-center text-[12px] text-neutral-500">
          {c.isMax ? (
            "Maksymalna forma osiągnięta 🎉"
          ) : (
            <>
              <span className="font-semibold text-neutral-800">{c.toNext}</span> do formy:{" "}
              <span className="font-medium text-neutral-700">{c.nextName}</span>
            </>
          )}
        </p>
      </div>

      <p className="text-center text-[11px] leading-snug text-neutral-500">
        Zaliczone poziomy aktywności:{" "}
        <span className="font-semibold text-neutral-800">{xp}</span>
      </p>
    </Link>
  );
}
