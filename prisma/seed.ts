// Seeds global activity definitions and their milestone ladders.
// Idempotent: safe to re-run and to extend with new activities later.
import { PrismaClient } from "@prisma/client";
import { criterionSchema, type Criterion } from "../src/lib/milestone-criteria";
import type { MilestoneResource } from "../src/lib/milestone-resources";
import { CATEGORY_BY_SLUG } from "../src/lib/activity-categories";
import * as bieganie from "./seed-data/bieganie";
import * as chodzenie from "./seed-data/chodzenie";
import * as jazdaNaRowerze from "./seed-data/jazda-na-rowerze";
import * as plywanie from "./seed-data/plywanie";
import * as treningSilowy from "./seed-data/trening-silowy";
import * as joga from "./seed-data/joga";
import * as pilkaNozna from "./seed-data/pilka-nozna";
import * as koszykowka from "./seed-data/koszykowka";
import * as siatkowka from "./seed-data/siatkowka";
import * as tenis from "./seed-data/tenis";
import * as tenisStolowy from "./seed-data/tenis-stolowy";
import * as badminton from "./seed-data/badminton";
import * as taniec from "./seed-data/taniec";
import * as sztukiWalki from "./seed-data/sztuki-walki";
import * as wspinaczka from "./seed-data/wspinaczka";
import * as narciarstwo from "./seed-data/narciarstwo";
import * as rolkiLyzwy from "./seed-data/rolki-lyzwy";
import * as golf from "./seed-data/golf";
import * as wioslarstwo from "./seed-data/wioslarstwo";
import * as turystykaGorska from "./seed-data/turystyka-gorska";
// --- batch 2 ---
import * as kajakarstwo from "./seed-data/kajakarstwo";
import * as zeglarstwo from "./seed-data/zeglarstwo";
import * as surfing from "./seed-data/surfing";
import * as nurkowanie from "./seed-data/nurkowanie";
import * as snowboard from "./seed-data/snowboard";
import * as lyzwiarstwoFigurowe from "./seed-data/lyzwiarstwo-figurowe";
import * as biathlon from "./seed-data/biathlon";
import * as lucznictwo from "./seed-data/lucznictwo";
import * as bilard from "./seed-data/bilard";
import * as kregle from "./seed-data/kregle";
import * as dart from "./seed-data/dart";
import * as pilkaReczna from "./seed-data/pilka-reczna";
import * as rugby from "./seed-data/rugby";
import * as hokej from "./seed-data/hokej";
import * as krykiet from "./seed-data/krykiet";
import * as squash from "./seed-data/squash";
import * as padel from "./seed-data/padel";
import * as kalistenika from "./seed-data/kalistenika";
import * as pilates from "./seed-data/pilates";
import * as gimnastyka from "./seed-data/gimnastyka";
// --- batch 3 ---
import * as triathlon from "./seed-data/triathlon";
import * as sprint from "./seed-data/sprint";
import * as narciarstwoBiegowe from "./seed-data/narciarstwo-biegowe";
import * as lyzwiarstwoSzybkie from "./seed-data/lyzwiarstwo-szybkie";
import * as skokiNarciarskie from "./seed-data/skoki-narciarskie";
import * as curling from "./seed-data/curling";
import * as windsurfing from "./seed-data/windsurfing";
import * as kitesurfing from "./seed-data/kitesurfing";
import * as sup from "./seed-data/sup";
import * as pilkaWodna from "./seed-data/pilka-wodna";
import * as baseball from "./seed-data/baseball";
import * as futbolAmerykanski from "./seed-data/futbol-amerykanski";
import * as hokejNaTrawie from "./seed-data/hokej-na-trawie";
import * as lacrosse from "./seed-data/lacrosse";
import * as ultimateFrisbee from "./seed-data/ultimate-frisbee";
import * as pickleball from "./seed-data/pickleball";
import * as snooker from "./seed-data/snooker";
import * as petanka from "./seed-data/petanka";
import * as strzelectwoSportowe from "./seed-data/strzelectwo-sportowe";
import * as podnoszenieCiezarow from "./seed-data/podnoszenie-ciezarow";
import * as trojbojSilowy from "./seed-data/trojboj-silowy";
import * as strongman from "./seed-data/strongman";
import * as crossfit from "./seed-data/crossfit";
import * as spinning from "./seed-data/spinning";
import * as skakanka from "./seed-data/skakanka";
import * as aerobik from "./seed-data/aerobik";
import * as boks from "./seed-data/boks";
import * as judo from "./seed-data/judo";
import * as zapasy from "./seed-data/zapasy";
import * as taniecTowarzyski from "./seed-data/taniec-towarzyski";
import * as jezdziectwo from "./seed-data/jezdziectwo";
import * as paralotniarstwo from "./seed-data/paralotniarstwo";
import * as biegNaOrientacje from "./seed-data/bieg-na-orientacje";
import * as parkour from "./seed-data/parkour";
import * as karting from "./seed-data/karting";
import * as motocross from "./seed-data/motocross";
import * as zuzel from "./seed-data/zuzel";
import * as szachy from "./seed-data/szachy";
import * as eSport from "./seed-data/e-sport";
import * as poker from "./seed-data/poker";
// --- batch 4: branża kreatywna ---
import * as rysowanie from "./seed-data/rysowanie";
import * as malarstwo from "./seed-data/malarstwo";
import * as akwarela from "./seed-data/akwarela";
import * as kaligrafia from "./seed-data/kaligrafia";
import * as garncarstwo from "./seed-data/garncarstwo";
import * as dzianie from "./seed-data/dzianie";
import * as szydelkowanie from "./seed-data/szydelkowanie";
import * as szycie from "./seed-data/szycie";
import * as stolarstwo from "./seed-data/stolarstwo";
import * as bizuteria from "./seed-data/bizuteria";
import * as origami from "./seed-data/origami";
import * as grafikaCyfrowa from "./seed-data/grafika-cyfrowa";
import * as fotografia from "./seed-data/fotografia";
import * as montazWideo from "./seed-data/montaz-wideo";
import * as animacja from "./seed-data/animacja";
import * as modelowanie3d from "./seed-data/modelowanie-3d";
import * as pisanie from "./seed-data/pisanie";
import * as graNaGitarze from "./seed-data/gra-na-gitarze";
import * as spiew from "./seed-data/spiew";
import * as produkcjaMuzyczna from "./seed-data/produkcja-muzyczna";
// --- batch 5: kuchnie świata ---
import * as kuchniaWloska from "./seed-data/kuchnia-wloska";
import * as kuchniaFrancuska from "./seed-data/kuchnia-francuska";
import * as kuchniaJaponska from "./seed-data/kuchnia-japonska";
import * as kuchniaChinska from "./seed-data/kuchnia-chinska";
import * as kuchniaMeksykanska from "./seed-data/kuchnia-meksykanska";
import * as kuchniaIndyjska from "./seed-data/kuchnia-indyjska";
import * as kuchniaTajska from "./seed-data/kuchnia-tajska";
import * as kuchniaHiszpanska from "./seed-data/kuchnia-hiszpanska";
import * as kuchniaGrecka from "./seed-data/kuchnia-grecka";
import * as kuchniaPolska from "./seed-data/kuchnia-polska";
import * as kuchniaTurecka from "./seed-data/kuchnia-turecka";
import * as kuchniaWietnamska from "./seed-data/kuchnia-wietnamska";
import * as kuchniaKoreanska from "./seed-data/kuchnia-koreanska";
import * as kuchniaAmerykanska from "./seed-data/kuchnia-amerykanska";
import * as kuchniaLibanska from "./seed-data/kuchnia-libanska";
import * as kuchniaMarokanska from "./seed-data/kuchnia-marokanska";
import * as kuchniaBrazylijska from "./seed-data/kuchnia-brazylijska";
import * as kuchniaNiemiecka from "./seed-data/kuchnia-niemiecka";
import * as kuchniaWegierska from "./seed-data/kuchnia-wegierska";
import * as kuchniaPeruwianska from "./seed-data/kuchnia-peruwianska";
// --- batch 6: instrumenty (18 nowych → 20 łącznie) ---
import * as pianino from "./seed-data/pianino";
import * as skrzypce from "./seed-data/skrzypce";
import * as perkusja from "./seed-data/perkusja";
import * as gitaraBasowa from "./seed-data/gitara-basowa";
import * as ukulele from "./seed-data/ukulele";
import * as saksofon from "./seed-data/saksofon";
import * as flet from "./seed-data/flet";
import * as trabka from "./seed-data/trabka";
import * as klarnet from "./seed-data/klarnet";
import * as wiolonczela from "./seed-data/wiolonczela";
import * as harmonijkaUstna from "./seed-data/harmonijka-ustna";
import * as akordeon from "./seed-data/akordeon";
import * as banjo from "./seed-data/banjo";
import * as mandolina from "./seed-data/mandolina";
import * as keyboard from "./seed-data/keyboard";
import * as puzon from "./seed-data/puzon";
import * as harfa from "./seed-data/harfa";
import * as organy from "./seed-data/organy";

const prisma = new PrismaClient();

type ActivityModule = {
  activity: {
    slug: string;
    name: string;
    icon?: string;
    description?: string;
    sortOrder?: number;
    logKind?: "distance" | "manual";
  };
  milestones: { level: number; title: string; detail?: string }[];
  criteriaByLevel?: Record<number, Criterion>;
  videoByLevel?: Record<number, { yt: string; tut: string; kind?: "piece" | "technika" }>;
  resourcesByLevel?: Record<number, MilestoneResource[]>;
};

// Top-20 activities by worldwide participation (walking, running, cycling,
// swimming, strength training, yoga, football, basketball, volleyball,
// tennis, table tennis, badminton, dance, martial arts, climbing, skiing,
// skating, golf, rowing, hiking — GWI/WorldAtlas participation data).
const modules: ActivityModule[] = [
  bieganie,
  chodzenie,
  jazdaNaRowerze,
  plywanie,
  treningSilowy,
  joga,
  pilkaNozna,
  koszykowka,
  siatkowka,
  tenis,
  tenisStolowy,
  badminton,
  taniec,
  sztukiWalki,
  wspinaczka,
  narciarstwo,
  rolkiLyzwy,
  golf,
  wioslarstwo,
  turystykaGorska,
  // --- batch 2: kolejnych 20 aktywności ---
  kajakarstwo,
  zeglarstwo,
  surfing,
  nurkowanie,
  snowboard,
  lyzwiarstwoFigurowe,
  biathlon,
  lucznictwo,
  bilard,
  kregle,
  dart,
  pilkaReczna,
  rugby,
  hokej,
  krykiet,
  squash,
  padel,
  kalistenika,
  pilates,
  gimnastyka,
  // --- batch 3: kolejnych 40 dyscyplin ---
  triathlon,
  sprint,
  narciarstwoBiegowe,
  lyzwiarstwoSzybkie,
  skokiNarciarskie,
  curling,
  windsurfing,
  kitesurfing,
  sup,
  pilkaWodna,
  baseball,
  futbolAmerykanski,
  hokejNaTrawie,
  lacrosse,
  ultimateFrisbee,
  pickleball,
  snooker,
  petanka,
  strzelectwoSportowe,
  podnoszenieCiezarow,
  trojbojSilowy,
  strongman,
  crossfit,
  spinning,
  skakanka,
  aerobik,
  boks,
  judo,
  zapasy,
  taniecTowarzyski,
  jezdziectwo,
  paralotniarstwo,
  biegNaOrientacje,
  parkour,
  karting,
  motocross,
  zuzel,
  szachy,
  eSport,
  poker,
  // --- batch 4: branża kreatywna (20) ---
  rysowanie,
  malarstwo,
  akwarela,
  kaligrafia,
  garncarstwo,
  dzianie,
  szydelkowanie,
  szycie,
  stolarstwo,
  bizuteria,
  origami,
  grafikaCyfrowa,
  fotografia,
  montazWideo,
  animacja,
  modelowanie3d,
  pisanie,
  graNaGitarze,
  spiew,
  produkcjaMuzyczna,
  // --- batch 5: kuchnie świata ---
  kuchniaWloska,
  kuchniaFrancuska,
  kuchniaJaponska,
  kuchniaChinska,
  kuchniaMeksykanska,
  kuchniaIndyjska,
  kuchniaTajska,
  kuchniaHiszpanska,
  kuchniaGrecka,
  kuchniaPolska,
  kuchniaTurecka,
  kuchniaWietnamska,
  kuchniaKoreanska,
  kuchniaAmerykanska,
  kuchniaLibanska,
  kuchniaMarokanska,
  kuchniaBrazylijska,
  kuchniaNiemiecka,
  kuchniaWegierska,
  kuchniaPeruwianska,
  // --- batch 6: instrumenty ---
  pianino,
  skrzypce,
  perkusja,
  gitaraBasowa,
  ukulele,
  saksofon,
  flet,
  trabka,
  klarnet,
  wiolonczela,
  harmonijkaUstna,
  akordeon,
  banjo,
  mandolina,
  keyboard,
  puzon,
  harfa,
  organy,
];

async function seedActivity({
  activity,
  milestones,
  criteriaByLevel,
  videoByLevel,
  resourcesByLevel,
}: ActivityModule) {
  const levels = new Set(milestones.map((m) => m.level));
  if (levels.size !== milestones.length) {
    throw new Error(`${activity.slug}: duplicate levels in seed data`);
  }
  for (let i = 1; i <= milestones.length; i++) {
    if (!levels.has(i)) {
      throw new Error(`${activity.slug}: missing level ${i} (levels must be contiguous from 1)`);
    }
  }
  for (const [level, criterion] of Object.entries(criteriaByLevel ?? {})) {
    if (!levels.has(Number(level))) {
      throw new Error(`${activity.slug}: criteria for unknown level ${level}`);
    }
    const parsed = criterionSchema.safeParse(criterion);
    if (!parsed.success) {
      throw new Error(`${activity.slug}: invalid criteria for level ${level}`);
    }
  }

  const activityData = {
    name: activity.name,
    icon: activity.icon,
    description: activity.description,
    sortOrder: activity.sortOrder ?? 0,
    logKind: activity.logKind ?? "distance",
    category: CATEGORY_BY_SLUG[activity.slug] ?? "inne",
  };
  const row = await prisma.activity.upsert({
    where: { slug: activity.slug },
    update: activityData,
    create: { slug: activity.slug, ...activityData },
  });

  // The Polish text is the source; the *En/*De/*Es columns are machine translations
  // of whatever it said when scripts/translate-seed.mjs last ran. Rewrite a level and
  // those columns describe the level it used to be — so a Polish reader would see the
  // new ladder and an English one the old, silently, with nothing to reveal it.
  //
  // Clear them whenever the source text changes. Null means "not translated yet", and
  // the display helpers fall back to Polish (src/lib/i18n/translate.ts) — visibly
  // untranslated beats confidently wrong. The next translate-seed run refills them.
  const existing = await prisma.milestone.findMany({
    where: { activityId: row.id },
    select: { level: true, title: true, detail: true },
  });
  const before = new Map(existing.map((m) => [m.level, m]));

  let retranslate = 0;

  for (const m of milestones) {
    const criterion = criteriaByLevel?.[m.level];
    const video = videoByLevel?.[m.level];
    const resources = resourcesByLevel?.[m.level];
    const detail = m.detail ?? null;

    const prev = before.get(m.level);
    const textChanged = prev !== undefined && (prev.title !== m.title || prev.detail !== detail);
    if (textChanged) retranslate++;

    const data = {
      title: m.title,
      detail,
      criteriaJson: criterion ? JSON.stringify(criterion) : null,
      videoJson: video ? JSON.stringify(video) : null,
      resourcesJson: resources && resources.length > 0 ? JSON.stringify(resources) : null,
      ...(textChanged
        ? {
            titleEn: null,
            titleDe: null,
            titleEs: null,
            detailEn: null,
            detailDe: null,
            detailEs: null,
          }
        : {}),
    };
    await prisma.milestone.upsert({
      where: { activityId_level: { activityId: row.id, level: m.level } },
      update: data,
      create: { activityId: row.id, level: m.level, ...data },
    });
  }

  if (retranslate > 0) {
    console.log(
      `  ${activity.slug}: ${retranslate} level(s) rewritten — their translations were dropped and need scripts/translate-seed.mjs.`
    );
  }

  const autoCount = Object.keys(criteriaByLevel ?? {}).length;
  console.log(`Seeded ${activity.slug}: ${milestones.length} milestones (${autoCount} auto-evaluable).`);
}

async function main() {
  for (const mod of modules) {
    await seedActivity(mod);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
