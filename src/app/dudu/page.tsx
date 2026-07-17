import type { Metadata } from "next";
import { requireUserId } from "@/lib/session";
import { completedMilestoneCount } from "@/lib/queries";
import { computeCharacter, CHARACTER_STAGES } from "@/lib/character";
import { prisma } from "@/lib/prisma";
import { normalizeDuduColor, normalizeDuduConfig } from "@/lib/dudu";
import { getT } from "@/lib/i18n/server";
import { Card } from "@/components/Card";
import { Progress } from "@/components/ui/Progress";
import { DuduCustomizer } from "@/components/DuduCustomizer";

export const dynamic = "force-dynamic";

// Behind the auth proxy: a signed-out crawler is redirected away, so this page
// must never be indexed. noindex takes the place of a canonical — a canonical
// would only assert that this URL duplicates another one.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t("page.hero.title"),
    robots: { index: false, follow: false },
  };
}

export default async function DuduPage() {
  const userId = await requireUserId();
  const [user, xp, { t }] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { duduColor: true, duduConfigJson: true, duduName: true },
    }),
    completedMilestoneCount(userId),
    getT(),
  ]);
  const c = computeCharacter(xp);
  const color = normalizeDuduColor(user?.duduColor);
  const config = normalizeDuduConfig(user?.duduConfigJson);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">
          {t("page.hero.title")}
        </h1>
        <p className="mt-1 text-[13px] text-neutral-500">{t("page.hero.subtitle")}</p>
      </div>

      <Card title={t("hero.appearance.title")} subtitle={t("hero.appearance.subtitle")}>
        <DuduCustomizer
          initialColor={color}
          initialConfig={config}
          initialName={user?.duduName ?? null}
          stage={c.stageIndex}
          stageName={t(c.stageNameKey)}
        />
      </Card>

      <Card title={t("hero.progress.title")} subtitle={t("hero.progress.subtitle")}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-medium text-violet-700">
              {t("hero.form", {
                n: c.stageIndex + 1,
                total: CHARACTER_STAGES.length,
                name: t(c.stageNameKey),
              })}
            </span>
            <span className="text-neutral-500">
              {t("hero.completedLevels")}{" "}
              <span className="font-semibold text-neutral-800">{xp}</span>
            </span>
          </div>
          <Progress value={c.isMax ? 1 : c.intoStage} max={c.isMax ? 1 : c.stageSpan} />
          <p className="text-[13px] text-neutral-500">
            {c.isMax ? (
              t("hero.maxReached")
            ) : (
              <>
                {t("hero.toNextForm", { n: c.toNext })}{" "}
                <span className="font-medium text-neutral-800">
                  {c.nextNameKey ? t(c.nextNameKey) : ""}
                </span>
              </>
            )}
          </p>
        </div>
      </Card>
    </div>
  );
}
