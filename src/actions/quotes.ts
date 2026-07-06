"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { isKnownQuoteId } from "@/lib/quotes";
import type { ActionResult } from "@/actions/day-entry";

const schema = z.object({
  quoteId: z.string().min(1).max(100),
  favorite: z.boolean(),
});

/** Save or unsave a quote to the user's favourites (quotes are static ids). */
export async function setFavoriteQuote(input: z.input<typeof schema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = schema.safeParse(input);
  if (!parsed.success || !isKnownQuoteId(parsed.data.quoteId)) {
    return { ok: false, error: "Nieprawidłowy cytat." };
  }
  const { quoteId, favorite } = parsed.data;

  if (favorite) {
    await prisma.favoriteQuote.upsert({
      where: { userId_quoteId: { userId, quoteId } },
      update: {},
      create: { userId, quoteId },
    });
  } else {
    await prisma.favoriteQuote.deleteMany({ where: { userId, quoteId } });
  }

  revalidatePath("/");
  revalidatePath("/cytaty");
  return { ok: true };
}
