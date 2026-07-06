"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { testNotionConnection } from "@/lib/notion";
import type { ActionResult } from "@/actions/day-entry";

const settingsSchema = z.object({
  token: z.string().trim().min(1, "Podaj token integracji Notion").max(300),
  parentPageId: z
    .string()
    .trim()
    .regex(/^[0-9a-f]{32}$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
      message: "ID strony to 32 znaki hex (z myślnikami lub bez)",
    }),
});

/** Save the user's Notion config after verifying it actually works. */
export async function saveNotionSettings(
  input: z.input<typeof settingsSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const { token, parentPageId } = parsed.data;

  const test = await testNotionConnection({ token, parentPageId });
  if (test.state === "error") {
    return { ok: false, error: test.message };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { notionToken: token, notionParentPageId: parentPageId },
  });

  revalidatePath("/settings");
  revalidatePath("/");
  return { ok: true };
}

export async function disconnectNotion(): Promise<ActionResult> {
  const userId = await requireUserId();
  await prisma.user.update({
    where: { id: userId },
    data: { notionToken: null, notionParentPageId: null },
  });
  revalidatePath("/settings");
  revalidatePath("/");
  return { ok: true };
}
