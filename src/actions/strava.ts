"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/session";
import { disconnectStrava, syncStravaActivities } from "@/lib/strava";
import { fail, type ActionResult } from "@/lib/action-errors";

export async function disconnectStravaAction(): Promise<ActionResult> {
  const userId = await requireUserId();
  await disconnectStrava(userId);
  revalidatePath("/settings");
  return { ok: true };
}

export type StravaSyncActionResult =
  | { ok: true; imported: number }
  | { ok: false; error: string };

export async function syncStravaAction(): Promise<StravaSyncActionResult> {
  const userId = await requireUserId();
  try {
    const { imported } = await syncStravaActivities(userId);
    revalidatePath("/activities");
    revalidatePath("/settings");
    return { ok: true, imported };
  } catch (error) {
    console.error("[STRAVA] manual sync failed:", error);
    return fail("strava.syncFailed");
  }
}
