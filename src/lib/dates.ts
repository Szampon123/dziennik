// Date helpers. Day keys are "YYYY-MM-DD" in the *local* timezone —
// the journal follows the user's wall clock, not UTC.

export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayKey(): string {
  return toDayKey(new Date());
}

/** Parse a "YYYY-MM-DD" key into a local-midnight Date. */
export function dayKeyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isValidDayKey(key: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(key) && !isNaN(dayKeyToDate(key).getTime());
}

/** e.g. "środa, 2 lipca 2026" */
export function formatDayLong(key: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dayKeyToDate(key));
}

/** e.g. "2 lip" — compact label for lists and charts. */
export function formatDayShort(key: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "short",
  }).format(dayKeyToDate(key));
}

/** e.g. "3 lipca 2026" — achievement dates (accepts Date or epoch ms). */
export function formatDate(date: Date | number): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(typeof date === "number" ? new Date(date) : date);
}

/** e.g. "14:35" */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Day key N days before today (n=0 → today). */
export function dayKeyDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDayKey(d);
}

/** Day key shifted by `n` days (negative = earlier). */
export function addDays(key: string, n: number): string {
  const d = dayKeyToDate(key);
  d.setDate(d.getDate() + n);
  return toDayKey(d);
}

/** Monday of the week containing `key` (weeks start Monday, pl convention). */
export function startOfWeek(key: string): string {
  const d = dayKeyToDate(key);
  const mondayOffset = (d.getDay() + 6) % 7; // 0=Mon … 6=Sun
  d.setDate(d.getDate() - mondayOffset);
  return toDayKey(d);
}

/** e.g. "pon" — short weekday label (locale-formatted, trailing dot stripped). */
export function formatWeekdayShort(key: string): string {
  return new Intl.DateTimeFormat("pl-PL", { weekday: "short" })
    .format(dayKeyToDate(key))
    .replace(/\.$/, "");
}

/** e.g. "lipiec 2026" — month + year label for the calendar header. */
export function formatMonthYear(key: string): string {
  return new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(
    dayKeyToDate(key)
  );
}

// ---------- Month keys ("YYYY-MM") — used by the habit tracker ----------

/** Month key ("YYYY-MM") of a day key or Date. */
export function monthKeyOf(key: string): string {
  return key.slice(0, 7);
}

export function isValidMonthKey(key: string): boolean {
  return /^\d{4}-\d{2}$/.test(key) && !isNaN(new Date(`${key}-01T00:00:00`).getTime());
}

/** First day key ("YYYY-MM-01") of a month key. */
export function firstDayOfMonth(monthKey: string): string {
  return `${monthKey}-01`;
}

/** All day keys ("YYYY-MM-DD") of a month, in order. */
export function daysInMonth(monthKey: string): string[] {
  const [y, m] = monthKey.split("-").map(Number);
  const count = new Date(y, m, 0).getDate(); // day 0 of next month = last day of this
  return Array.from({ length: count }, (_, i) => `${monthKey}-${String(i + 1).padStart(2, "0")}`);
}

/** Month key shifted by `n` months (negative = earlier). */
export function addMonths(monthKey: string, n: number): string {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
