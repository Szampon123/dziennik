import { requireUserId } from "@/lib/session";
import { listHabitsWithChecks, archivedHabits } from "@/lib/habits";
import { HabitTracker } from "@/components/HabitTracker";
import { todayKey, monthKeyOf, isValidMonthKey } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function NawykiPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const [userId, { m }] = await Promise.all([requireUserId(), searchParams]);
  const today = todayKey();
  const monthKey = m && isValidMonthKey(m) ? m : monthKeyOf(today);
  const [habits, archived] = await Promise.all([
    listHabitsWithChecks(userId, monthKey),
    archivedHabits(userId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">Nawyki</h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          Określ nawyki i ich cel na tydzień (np. 3×/tydz), a potem odklikuj dowolne dni. Postęp
          liczy się względem celu tygodniowego.
        </p>
      </div>

      <HabitTracker habits={habits} archived={archived} monthKey={monthKey} today={today} />
    </div>
  );
}
