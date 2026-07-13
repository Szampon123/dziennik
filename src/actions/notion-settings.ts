"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, issueKey } from "@/lib/action-errors";
import { requireUserId } from "@/lib/session";
import { encrypt } from "@/lib/crypto";
import { testNotionConnection } from "@/lib/notion";
import type { ActionResult } from "@/lib/action-errors";

const settingsSchema = z.object({
  token: z.string().trim().min(1, "Podaj token integracji Notion").max(300),
  parentPageId: z
    .string()
    .trim()
    .regex(/^[0-9a-f]{32}$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
      message: "errors.notionPageId",
    }),
});

/** Save the user's Notion config after verifying it actually works. */
export async function saveNotionSettings(
  input: z.input<typeof settingsSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return fail(issueKey(parsed.error));
  }
  const { token, parentPageId } = parsed.data;

  // Test with the PLAIN-TEXT token from the form (the Notion API needs it raw)…
  const test = await testNotionConnection({ token, parentPageId });
  if (test.state === "error") {
    return { ok: false, error: test.message };
  }

  // …then encrypt it for storage.
  await prisma.user.update({
    where: { id: userId },
    data: { notionToken: encrypt(token), notionParentPageId: parentPageId },
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
