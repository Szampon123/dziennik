export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-neutral-200 px-6 py-8 text-center">
      <p className="text-sm font-medium text-neutral-600">{title}</p>
      {hint && <p className="text-[13px] text-neutral-500">{hint}</p>}
      {action}
    </div>
  );
}
