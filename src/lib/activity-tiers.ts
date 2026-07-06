// Tier bands for the 1-99 milestone ladder (client-safe constants).
export type Tier = { from: number; to: number; name: string };

export const TIERS: Tier[] = [
  { from: 1, to: 10, name: "Pierwsze kroki" },
  { from: 11, to: 25, name: "Regularny" },
  { from: 26, to: 45, name: "Średniozaawansowany" },
  { from: 46, to: 65, name: "Zaawansowany" },
  { from: 66, to: 85, name: "Wyczynowy" },
  { from: 86, to: 99, name: "Elita" },
];

export function tierForLevel(level: number): Tier {
  return TIERS.find((t) => level >= t.from && level <= t.to) ?? TIERS[TIERS.length - 1];
}
