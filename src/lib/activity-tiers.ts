// Tier bands for the 1-99 milestone ladder (client-safe constants).
import type { MessageKey } from "@/lib/i18n/messages";

export type Tier = { from: number; to: number; nameKey: MessageKey };

export const TIERS: Tier[] = [
  { from: 1, to: 10, nameKey: "tier.firstSteps" },
  { from: 11, to: 25, nameKey: "tier.regular" },
  { from: 26, to: 45, nameKey: "tier.intermediate" },
  { from: 46, to: 65, nameKey: "tier.advanced" },
  { from: 66, to: 85, nameKey: "tier.competitive" },
  { from: 86, to: 99, nameKey: "tier.elite" },
];

export function tierForLevel(level: number): Tier {
  return TIERS.find((t) => level >= t.from && level <= t.to) ?? TIERS[TIERS.length - 1];
}
