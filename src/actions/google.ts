"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/session";
import { disconnectGoogle } from "@/lib/google";
import { clearCalendarCache } from "@/lib/calendar-cache";
import type { ActionResult } from "@/lib/action-errors";

export async function disconnectGoogleAction(): Promise<ActionResult> {
  const userId = await requireUserId();
  await disconnectGoogle(userId);
  clearCalendarCache(userId);
  revalidatePath("/settings");
  revalidatePath("/");
  return { ok: true };
}
