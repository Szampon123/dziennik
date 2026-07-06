// "Dudu" companion — a simple doodle character that evolves as the user climbs
// activity levels. Growth is driven ONLY by activities: XP = the number of
// completed milestones (levels) across every activity, so every level you earn
// anywhere feeds the same character. Eight forms with an early-fast / late-slow
// curve keep early progress rewarding and top forms aspirational.

export type CharacterStage = {
  name: string;
  min: number; // completed-milestones needed to reach this form
  caption: string;
};

export const CHARACTER_STAGES: CharacterStage[] = [
  { name: "Iskra", min: 0, caption: "Wszystko zaczyna się od pierwszego poziomu." },
  { name: "Kiełek", min: 2, caption: "Pierwsze poziomy zaliczone — rośniesz." },
  { name: "Dudu", min: 6, caption: "Dudu nabiera kształtu." },
  { name: "Dudu Śmiałek", min: 15, caption: "Coraz śmielej sięgasz po nowe poziomy." },
  { name: "Dudu Wprawny", min: 30, caption: "Wprawa widoczna gołym okiem." },
  { name: "Dudu Mistrz", min: 60, caption: "Mistrzowska forma — opaska założona." },
  { name: "Dudu Bohater", min: 120, caption: "Bohater z peleryną i koroną." },
  { name: "Dudu Legenda", min: 240, caption: "Legenda w pełnej chwale." },
];

export type CharacterState = {
  xp: number;
  stageIndex: number;
  stageName: string;
  caption: string;
  nextName: string | null;
  toNext: number; // milestones remaining to the next form
  intoStage: number; // progress within the current form
  stageSpan: number; // size of the current form's band
  isMax: boolean;
};

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
    stageName: current.name,
    caption: current.caption,
    nextName: next?.name ?? null,
    toNext: next ? next.min - xp : 0,
    intoStage,
    stageSpan,
    isMax: next === null,
  };
}
