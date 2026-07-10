import type { Metadata } from "next";
import { requireUserId } from "@/lib/session";
import { listHabitsWithChecks, archivedHabits } from "@/lib/habits";
import { HabitTracker } from "@/components/HabitTracker";
import { todayKey, monthKeyOf, isValidMonthKey } from "@/lib/dates";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

// Behind the auth proxy: a signed-out crawler is redirected away, so this page
// must never be indexed. noindex takes the place of a canonical — a canonical
// would only assert that this URL duplicates another one.
export const metadata: Metadata = {
  title: "Nawyki",
  robots: { index: false, follow: false },
};

export default async function NawykiPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const [userId, { m }, { t }] = await Promise.all([requireUserId(), searchParams, getT()]);
  const today = todayKey();
  const monthKey = m && isValidMonthKey(m) ? m : monthKeyOf(today);
  const [habits, archived] = await Promise.all([
    listHabitsWithChecks(userId, monthKey),
    archivedHabits(userId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">
          {t("page.habits.title")}
        </h1>
        <p className="mt-1 text-[13px] text-neutral-500">{t("page.habits.subtitle")}</p>
      </div>

      <HabitTracker habits={habits} archived={archived} monthKey={monthKey} today={today} />
    </div>
  );
}
