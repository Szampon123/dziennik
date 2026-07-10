"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { formatDayShort } from "@/lib/dates";
import { useLocale } from "@/components/i18n/I18nProvider";
import { useT } from "@/components/i18n/I18nProvider";

export type ChartPoint = {
  date: string;
  dayRating: number | null;
  energyLevel: number | null;
  tasksDone: number | null;
  tasksTotal: number | null;
};

// Design System v1.0 — data belongs to azure; day rating keeps the violet accent.
// Tasks completion is a % on its own right-hand axis (success/green = done).
export function HistoryChart({ data }: { data: ChartPoint[] }) {
  const t = useT();
  const locale = useLocale();
  const points = data.map((d) => ({
    ...d,
    label: formatDayShort(d.date, locale),
    tasksPct:
      d.tasksTotal !== null && d.tasksTotal > 0
        ? Math.round(((d.tasksDone ?? 0) / d.tasksTotal) * 100)
        : null,
  }));

  return (
    <div className="h-56 w-full text-xs">
      <ResponsiveContainer>
        <LineChart data={points} margin={{ top: 5, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" />
          <XAxis dataKey="label" stroke="var(--neutral-500)" tickLine={false} />
          <YAxis
            yAxisId="rating"
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            stroke="var(--neutral-500)"
            tickLine={false}
          />
          <YAxis
            yAxisId="pct"
            orientation="right"
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            unit="%"
            width={40}
            stroke="var(--success)"
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--neutral-0)",
              border: "1px solid var(--neutral-200)",
              borderRadius: "8px",
              color: "var(--neutral-900)",
              fontSize: "0.75rem",
            }}
            formatter={(value, name) =>
              name === t("chart.tasksPct") ? [`${value}%`, name] : [value, name]
            }
          />
          <Legend />
          <Line
            yAxisId="rating"
            type="monotone"
            dataKey="dayRating"
            name={t("close.rating")}
            stroke="var(--violet-600)"
            strokeWidth={2}
            dot={{ r: 2 }}
            connectNulls
          />
          <Line
            yAxisId="rating"
            type="monotone"
            dataKey="energyLevel"
            name={t("chart.energy")}
            stroke="var(--azure-500)"
            strokeWidth={2}
            dot={{ r: 2 }}
            connectNulls
          />
          <Line
            yAxisId="pct"
            type="monotone"
            dataKey="tasksPct"
            name={t("chart.tasksPct")}
            stroke="var(--success)"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ r: 2 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
