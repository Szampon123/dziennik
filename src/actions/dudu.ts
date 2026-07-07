"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import {
  DUDU_COLORS,
  normalizeDuduColor,
  normalizeDuduConfig,
  serializeDuduConfig,
  type DuduColor,
  type DuduConfig,
} from "@/lib/dudu";
import type { ActionResult } from "@/actions/day-entry";

/** Save the user's chosen Dudu colour palette. */
export async function setDuduColor(color: string): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!(color in DUDU_COLORS)) {
    return { ok: false, error: "Nieznany kolor." };
  }
  await prisma.user.update({
    where: { id: userId },
    data: { duduColor: color as DuduColor },
  });
  revalidatePath("/");
  revalidatePath("/dudu");
  return { ok: true };
}

/** Save Dudu's full appearance: colour palette + accessory config (validated). */
export async function setDuduAppearance(input: {
  color: string;
  config: DuduConfig;
}): Promise<ActionResult> {
  const userId = await requireUserId();
  const color = normalizeDuduColor(input?.color) as DuduColor;
  const configJson = serializeDuduConfig(normalizeDuduConfig(input?.config));

  await prisma.user.update({
    where: { id: userId },
    data: { duduColor: color, duduConfigJson: configJson },
  });
  revalidatePath("/");
  revalidatePath("/dudu");
  return { ok: true };
}
