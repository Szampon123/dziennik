"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { serializeDashboard } from "@/lib/dashboard";
import type { ActionResult } from "@/actions/day-entry";

const schema = z.object({
  order: z.array(z.string().max(40)).max(20),
  hidden: z.array(z.string().max(40)).max(20),
});

/** Save the user's personalised "Dziś" layout (widget order + hidden set). */
export async function saveDashboard(input: z.input<typeof schema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Nieprawidłowe dane układu." };
  }
  const json = serializeDashboard(parsed.data.order, parsed.data.hidden);
  await prisma.user.update({ where: { id: userId }, data: { dashboardJson: json } });
  revalidatePath("/");
  return { ok: true };
}

/** Restore the default layout (all widgets visible in the default order). */
export async function resetDashboard(): Promise<ActionResult> {
  const userId = await requireUserId();
  await prisma.user.update({ where: { id: userId }, data: { dashboardJson: null } });
  revalidatePath("/");
  return { ok: true };
}
