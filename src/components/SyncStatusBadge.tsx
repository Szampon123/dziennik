import type { SyncStatus } from "@/lib/day";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";

const STYLES: Record<SyncStatus, { label: string; variant: BadgeVariant }> = {
  none: { label: "Nie synchronizowano", variant: "neutral" },
  pending: { label: "Synchronizacja…", variant: "warning" },
  synced: { label: "Notion ✓", variant: "success" },
  error: { label: "Błąd sync", variant: "warning" },
};

export function SyncStatusBadge({ status }: { status: string }) {
  const style = STYLES[(status as SyncStatus) in STYLES ? (status as SyncStatus) : "none"];
  return <Badge variant={style.variant}>{style.label}</Badge>;
}
