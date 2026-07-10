// "Dudu" companion — a simple doodle character that evolves as the user climbs
// activity levels. Growth is driven ONLY by activities: XP = the number of
// completed milestones (levels) across every activity, so every level you earn
// anywhere feeds the same character. Eight forms with an early-fast / late-slow
// curve keep early progress rewarding and top forms aspirational.
//
// Each stage has a stable `key`. In-app surfaces resolve the display name and
// caption from `hero.stage.<key>.*` message keys, so the companion evolves in
// the reader's locale. `name` is the English label, kept for the landing page
// (English-only) and as a non-null fallback.
import type { MessageKey } from "@/lib/i18n/messages";

export type CharacterStage = {
  key: string;
  name: string;
  min: number; // completed-milestones needed to reach this form
};

export const CHARACTER_STAGES: CharacterStage[] = [
  { key: "spark", name: "Spark", min: 0 },
  { key: "sprout", name: "Sprout", min: 2 },
  { key: "dudu", name: "Dudu", min: 6 },
  { key: "daredevil", name: "Dudu the Bold", min: 15 },
  { key: "adept", name: "Dudu the Adept", min: 30 },
  { key: "master", name: "Dudu the Master", min: 60 },
  { key: "hero", name: "Dudu the Hero", min: 120 },
  { key: "legend", name: "Dudu the Legend", min: 240 },
];

export type CharacterState = {
  xp: number;
  stageIndex: number;
  stageKey: string;
  stageName: string; // English; in-app callers prefer stageNameKey
  stageNameKey: MessageKey;
  captionKey: MessageKey;
  nextName: string | null; // English
  nextNameKey: MessageKey | null;
  toNext: number; // milestones remaining to the next form
  intoStage: number; // progress within the current form
  stageSpan: number; // size of the current form's band
  isMax: boolean;
};

const nameKey = (key: string) => `hero.stage.${key}.name` as MessageKey;
const captionKey = (key: string) => `hero.stage.${key}.caption` as MessageKey;

export function computeCharacter(xp: number): CharacterState {
  let stageIndex = 0;
  for (let i = 0; i < CHARACTER_STAGES.length; i++) {
    if (xp >= CHARACTER_STAGES[i].min) stageIndex = i;
  }
  const current = CHARACTER_STAGES[stageIndex];
  const next = CHARACTER_STAGES[stageIndex + 1] ?? null;
  const intoStage = xp - current.min;
  const stageSpan = next ? next.min - current.min : 0;
  return {
    xp,
    stageIndex,
    stageKey: current.key,
    stageName: current.name,
    stageNameKey: nameKey(current.key),
    captionKey: captionKey(current.key),
    nextName: next?.name ?? null,
    nextNameKey: next ? nameKey(next.key) : null,
    toNext: next ? next.min - xp : 0,
    intoStage,
    stageSpan,
    isMax: next === null,
  };
}
