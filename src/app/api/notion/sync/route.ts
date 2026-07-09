import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionUserId } from "@/lib/session";
import { syncDayToNotion } from "@/lib/notion";
import { isValidDayKey } from "@/lib/dates";
import { rateLimit } from "@/lib/rate-limit";

// POST /api/notion/sync { date: "YYYY-MM-DD" } — (re)sync the signed-in
// user's closed day to Notion.
export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Zaloguj się ponownie." }, { status: 401 });
  }

  const rl = rateLimit(`api:notion:${userId}`, 10, 60);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Zbyt wiele żądań synchronizacji. Spróbuj ponownie za chwilę." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  let date: unknown;
  try {
    ({ date } = await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Nieprawidłowe żądanie." }, { status: 400 });
  }
  if (typeof date !== "string" || !isValidDayKey(date)) {
    return NextResponse.json({ ok: false, error: "Nieprawidłowa data." }, { status: 400 });
  }

  const result = await syncDayToNotion(userId, date);

  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath(`/history/${date}`);

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
