// Ultimate frisbee ladder 1-99. Manual — progression tracks: matches played,
// scores (goals+assists total), and competition level. Self-refereed sport.
import { ladderC, freq, prog } from "./helpers";
import type { MilestoneResource } from "../../src/lib/milestone-resources";

export const activity = {
  slug: "ultimate-frisbee",
  name: "Ultimate frisbee",
  icon: "🥏",
  description:
    "Dynamiczny sport drużynowy z dyskiem, grany bez sędziego (Spirit of the Game). Progresja: mecze, zdobycze (gole+asysty) i poziom rozgrywek.",
  sortOrder: 55,
  logKind: "manual" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // 1-10 · Pierwsze kroki
  ["Rzuć backhandem celnie na 10 m", undefined, prog("technika", 1)],
  ["Rzuć forehandem (flick) na 10 m", undefined, prog("technika", 2)],
  ["Złap dysk jednorącz i oburącz (pancake)", undefined, prog("technika", 3)],
  ["Zrozum zasady: pivot, stall count, brak biegu z dyskiem", undefined, prog("technika", 4)],
  ["Wykonaj rzut w biegu do partnera", undefined, prog("technika", 5)],
  ["Ustaw się i złap dysk w strefie punktowej (endzone)", undefined, prog("technika", 6)],
  ["Zablokuj podanie przeciwnika (defensywny D)", undefined, prog("technika", 7)],
  ["Zagraj pierwszy mecz treningowy", undefined, prog("mecze", 1)],
  ["Zdobądź pierwszą zdobycz (gol lub asysta)", undefined, prog("zdobycze", 1)],
  ["Rozegraj pełny mecz (do 15 punktów lub na czas)", undefined, prog("mecze", 2)],
  // 11-25 · Regularny
  ["Trenuj lub graj raz w tygodniu przez 4 kolejne tygodnie", undefined, freq(1, 4)],
  ["Rzuć hammer (rzut górą nad obroną)", undefined, prog("technika", 8)],
  ["Zagraj 5 meczów", undefined, prog("mecze", 5)],
  ["Zdobądź 8 zdobyczy łącznie", undefined, prog("zdobycze", 8)],
  ["Wykonaj skuteczny cut (zbieg pod dysk) z timingiem", undefined, prog("technika", 9)],
  ["Zagraj całą grę utrzymując dyscyplinę obrony osobistej"],
  ["Zagraj 10 meczów", undefined, prog("mecze", 10)],
  ["Zdobądź 18 zdobyczy łącznie", undefined, prog("zdobycze", 18)],
  ["Rzuć dysk na pełną długość boiska (huck)", undefined, prog("technika", 10)],
  ["Rozegraj mecz w lidze amatorskiej lub turnieju hat", undefined, prog("liga", 1)],
  ["Zagraj 20 meczów", undefined, prog("mecze", 20)],
  ["Zdobądź 35 zdobyczy łącznie", undefined, prog("zdobycze", 35)],
  ["Wykonaj layout (rzut nurkujący po dysk)", undefined, prog("technika", 11)],
  ["Zdobądź 3 punkty (scores) w jednym meczu", undefined, prog("zdobycze-mecz", 3)],
  ["Zagraj 30 meczów", undefined, prog("mecze", 30)],
  // 26-45 · Średniozaawansowany
  ["Trenuj 2 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(2, 12)],
  ["Zdobądź 55 zdobyczy łącznie", undefined, prog("zdobycze", 55)],
  ["Opanuj rzuty pod presją markingu (break the mark)", undefined, prog("technika", 12)],
  ["Zagraj 50 meczów", undefined, prog("mecze", 50)],
  ["Zdobądź 80 zdobyczy łącznie", undefined, prog("zdobycze", 80)],
  ["Rozegraj pełny sezon w regularnej lidze", undefined, prog("liga", 2)],
  ["Zdobądź 5 zdobyczy w jednym meczu", undefined, prog("zdobycze-mecz", 5)],
  ["Graj skutecznie w obronie strefowej (zone D)", undefined, prog("technika", 13)],
  ["Zagraj 75 meczów", undefined, prog("mecze", 75)],
  ["Zdobądź 120 zdobyczy łącznie", undefined, prog("zdobycze", 120)],
  ["Zajmij miejsce w pierwszej połowie turnieju"],
  ["Zostań liderem statystyk zespołu", undefined, prog("technika", 14)],
  ["Zagraj 100 meczów", undefined, prog("mecze", 100)],
  ["Zdobądź 170 zdobyczy łącznie", undefined, prog("zdobycze", 170)],
  ["Rozegraj mecz w lidze wyższej klasy (I liga/ekstraliga)", undefined, prog("liga", 3)],
  ["Zajmij miejsce na podium turnieju regionalnego"],
  ["Zdobądź 230 zdobyczy łącznie", undefined, prog("zdobycze", 230)],
  ["Zagraj 150 meczów", undefined, prog("mecze", 150)],
  ["Poprowadź zespół jako kapitan / handler prowadzący", undefined, prog("technika", 15)],
  ["Zdobądź 7 zdobyczy w jednym meczu", undefined, prog("zdobycze-mecz", 7)],
  // 46-65 · Zaawansowany
  ["Trenuj 4+ razy w tygodniu przez cały sezon"],
  ["Zdobądź 300 zdobyczy łącznie", undefined, prog("zdobycze", 300)],
  ["Zagraj w najwyższej lidze krajowej", undefined, prog("liga", 4)],
  ["Zagraj 200 meczów", undefined, prog("mecze", 200)],
  ["Zdobądź 380 zdobyczy łącznie", undefined, prog("zdobycze", 380)],
  ["Zostań kluczowym zawodnikiem czołowej drużyny ligowej"],
  ["Zajmij miejsce w czołówce ligi krajowej"],
  ["Zagraj 250 meczów", undefined, prog("mecze", 250)],
  ["Zdobądź 470 zdobyczy łącznie", undefined, prog("zdobycze", 470)],
  ["Zdobądź 9 zdobyczy w jednym meczu", undefined, prog("zdobycze-mecz", 9)],
  ["Zagraj na mistrzostwach kraju (finały)", undefined, prog("liga", 5)],
  ["Zdobądź 560 zdobyczy łącznie", undefined, prog("zdobycze", 560)],
  ["Zagraj 300 meczów", undefined, prog("mecze", 300)],
  ["Zdobądź zdobycz w meczu mistrzostw kraju"],
  ["Zdobądź 650 zdobyczy łącznie", undefined, prog("zdobycze", 650)],
  ["Zostań kluczowym zawodnikiem drużyny walczącej o mistrzostwo"],
  ["Zagraj 400 meczów", undefined, prog("mecze", 400)],
  ["Zdobądź 750 zdobyczy łącznie", undefined, prog("zdobycze", 750)],
  ["Zostań MVP lub najlepszym zawodnikiem turnieju krajowego"],
  ["Zostań uznanym zawodnikiem swojej ligi regionalnej"],
  // 66-85 · Wyczynowy
  ["Zdobądź 850 zdobyczy łącznie", undefined, prog("zdobycze", 850)],
  ["Zagraj 500 meczów", undefined, prog("mecze", 500)],
  ["Zdobądź mistrzostwo kraju z klubem"],
  ["Zdobądź 950 zdobyczy łącznie", undefined, prog("zdobycze", 950)],
  ["Zagraj w turnieju klubów o zasięgu ogólnokrajowym"],
  ["Zagraj 600 meczów", undefined, prog("mecze", 600)],
  ["Zdobądź 1050 zdobyczy łącznie", undefined, prog("zdobycze", 1050)],
  ["Weź udział w turnieju o zasięgu ogólnokrajowym"],
  ["Zdobądź 1150 zdobyczy łącznie", undefined, prog("zdobycze", 1150)],
  ["Zagraj 700 meczów", undefined, prog("mecze", 700)],
  ["Zdobądź zdobycz w ważnym meczu turniejowym"],
  ["Zdobądź 1250 zdobyczy łącznie", undefined, prog("zdobycze", 1250)],
  ["Zagraj w World Ultimate Club Championships"],
  ["Zdobądź 1350 zdobyczy łącznie", undefined, prog("zdobycze", 1350)],
  ["Zagraj 800 meczów", undefined, prog("mecze", 800)],
  ["Zajmij czołowe miejsce na turnieju o zasięgu ogólnokrajowym"],
  ["Zdobądź nagrodę Spirit of the Game jako wzór fair play"],
  ["Zdobądź 1450 zdobyczy łącznie", undefined, prog("zdobycze", 1450)],
  ["Zagraj 900 meczów", undefined, prog("mecze", 900)],
  ["Zostań kapitanem swojej drużyny klubowej"],
  // 86-99 · Elita
  ["Zdobądź 1550 zdobyczy łącznie", undefined, prog("zdobycze", 1550)],
  ["Zostań kluczowym zawodnikiem swojej drużyny przez cały sezon"],
  ["Zagraj 1000 meczów", undefined, prog("mecze", 1000)],
  ["Zdobądź 1650 zdobyczy łącznie", undefined, prog("zdobycze", 1650)],
  ["Zdobądź zdobycz w ważnym meczu turniejowym"],
  ["Zdobądź podium turnieju o zasięgu ogólnokrajowym"],
  ["Zostań czołowym zawodnikiem swojej ligi"],
  ["Awansuj do fazy medalowej mistrzostw kraju amatorów"],
  ["Znajdź się w składzie gwiazd sezonu"],
  ["Zdobądź nagrodę MVP swojej ligi lub turnieju"],
  ["Zdobądź tytuł mistrzowski swojej ligi klubowej"],
  ["Zdobądź medal mistrzostw kraju amatorów"],
  ["Zdobądź uznanie w krajowym środowisku ultimate"],
  ["Poziom mistrzowski (amatorski szczyt): wieloletni, kluczowy zawodnik silnej drużyny klubowej", "Dalsze, zawodowe osiągnięcia potwierdzają osobne certyfikaty."],
]);

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "video", title: "How to Throw a Backhand in Ultimate Frisbee", url: yt("t9Ku4S-SVVE") },
  ],
  2: [
    { kind: "video", title: "Forehand (Flick) Throw Tutorial — Ultimate Frisbee", url: yt("ueI7hETuGPY") },
  ],
  8: [
    { kind: "video", title: "Rowan McDonnell — Hammer Throw Tutorial", url: yt("K5tdZMlc64M") },
  ],
  15: [
    { kind: "video", title: "Cutting Technique in Ultimate Frisbee — How to Get Open", url: yt("hCr_UEcwpLI") },
  ],
  23: [
    { kind: "article", title: "WFDF Rules of Ultimate — Official Rulebook", url: "https://rules.wfdf.org/rules/2021/01" },
  ],
  29: [
    { kind: "video", title: "How to Play Zone Defense in Ultimate Frisbee", url: yt("aLbPjzXaFCo") },
  ],
  36: [
    { kind: "video", title: "Huck Tutorial — How to Throw Long in Ultimate", url: yt("SSUdxHdwA-s") },
  ],
  48: [
    { kind: "article", title: "Ultimate Frisbee Training — Fitness and Strategy", url: "https://www.verywellfit.com/ultimate-frisbee-4157137" },
  ],
  68: [
    { kind: "reference", title: "WFDF World Rankings — Ultimate", url: "https://wfdf.sport/rankings/" },
  ],
  88: [
    { kind: "video", title: "Best Ultimate Frisbee Plays — Layout Catches and Skies", url: yt("oHg5SJYRHA0") },
  ],
};
