import { requireUserId } from "@/lib/session";
import { completedMilestoneCount } from "@/lib/queries";
import { computeCharacter, CHARACTER_STAGES } from "@/lib/character";
import { prisma } from "@/lib/prisma";
import { normalizeDuduColor, normalizeDuduConfig } from "@/lib/dudu";
import { Card } from "@/components/Card";
import { Progress } from "@/components/ui/Progress";
import { DuduCustomizer } from "@/components/DuduCustomizer";

export const dynamic = "force-dynamic";

export default async function DuduPage() {
  const userId = await requireUserId();
  const [user, xp] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { duduColor: true, duduConfigJson: true, duduName: true },
    }),
    completedMilestoneCount(userId),
  ]);
  const c = computeCharacter(xp);
  const color = normalizeDuduColor(user?.duduColor);
  const config = normalizeDuduConfig(user?.duduConfigJson);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">Dudu</h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          Twój towarzysz rośnie wraz z postępem w aktywnościach — tu dostosujesz jego wygląd.
        </p>
      </div>

      <Card title="Wygląd" subtitle="Kolor, kapelusz, ubranie i więcej — 8 kategorii do wyboru">
        <DuduCustomizer
          initialColor={color}
          initialConfig={config}
          initialName={user?.duduName ?? null}
          stage={c.stageIndex}
          stageName={c.stageName}
        />
      </Card>

      <Card title="Postęp formy" subtitle="Ewolucja zależy od zaliczonych poziomów aktywności">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-medium text-violet-700">
              Forma {c.stageIndex + 1} / {CHARACTER_STAGES.length} · {c.stageName}
            </span>
            <span className="text-neutral-500">
              Zaliczone poziomy: <span className="font-semibold text-neutral-800">{xp}</span>
            </span>
          </div>
          <Progress value={c.isMax ? 1 : c.intoStage} max={c.isMax ? 1 : c.stageSpan} />
          <p className="text-[13px] text-neutral-500">
            {c.isMax ? (
              "Maksymalna forma osiągnięta 🎉"
            ) : (
              <>
                Jeszcze <span className="font-semibold text-neutral-800">{c.toNext}</span> do formy:{" "}
                <span className="font-medium text-neutral-700">{c.nextName}</span>
              </>
            )}
          </p>
        </div>
      </Card>
    </div>
  );
}
