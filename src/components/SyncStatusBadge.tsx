"use client";

import { CircleCheck } from "lucide-react";
import type { SyncStatus } from "@/lib/day";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { useT } from "@/components/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const STYLES: Record<SyncStatus, { labelKey: MessageKey; variant: BadgeVariant }> = {
  none: { labelKey: "sync.none", variant: "neutral" },
  pending: { labelKey: "sync.pending", variant: "warning" },
  synced: { labelKey: "sync.synced", variant: "success" },
  error: { labelKey: "sync.errorBadge", variant: "warning" },
};

export function SyncStatusBadge({ status }: { status: string }) {
  const t = useT();
  const style = STYLES[(status as SyncStatus) in STYLES ? (status as SyncStatus) : "none"];
  return (
    <Badge variant={style.variant}>
      {status === "synced" && <CircleCheck aria-hidden className="h-3.5 w-3.5" />}
      {t(style.labelKey)}
    </Badge>
  );
}
