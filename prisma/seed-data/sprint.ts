// Sprinting ladder 1-99 (100/200/400 m). Manual — progression tracks per
// distance use an increasing counter (faster time = higher value) so the
// implication cascade works; the real time is in the milestone text.
// Benchmarks: recreational 100 m ~14-15 s; fit ~12-13 s; club ~11 s;
// national ~10.5 s; elite sub-10 (WR 9.58).
import { ladderC, freq, prog } from "./helpers";
import type { MilestoneResource } from "../../src/lib/milestone-resources";

export const activity = {
  slug: "sprint",
  name: "Sprint (biegi krótkie)",
  icon: "🏃‍♂️",
  description:
    "Biegi sprinterskie 100/200/400 m — od pierwszego zrywu po czasy zawodnicze. Progresja: czasy na poszczególnych dystansach i poziom zawodów.",
  sortOrder: 42,
  logKind: "manual" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // 1-10 · Pierwsze kroki
  ["Przebiegnij 100 m sprintem bez zwalniania", undefined, prog("s100", 1)],
  ["Opanuj start z niskiej pozycji (z bloków lub przysiadu)", undefined, prog("technika", 1)],
  ["Przebiegnij 100 m poniżej 16 s", undefined, prog("s100", 2)],
  ["Przebiegnij 200 m sprintem", undefined, prog("s200", 1)],
  ["Popraw technikę pracy ramion i wysokiego kolana", undefined, prog("technika", 2)],
  ["Przebiegnij 100 m poniżej 15 s", undefined, prog("s100", 3)],
  ["Przebiegnij 400 m w tempie sprinterskim", undefined, prog("s400", 1)],
  ["Przebiegnij 200 m poniżej 32 s", undefined, prog("s200", 2)],
  ["Przebiegnij 100 m poniżej 14 s", "Poziom sprawnego amatora.", prog("s100", 4)],
  ["Wykonaj serię 3×100 m z pełną intensywnością", undefined, prog("technika", 3)],
  // 11-25 · Regularny
  ["Trenuj sprint 2 razy w tygodniu przez 4 kolejne tygodnie", undefined, freq(2, 4)],
  ["Przebiegnij 400 m poniżej 70 s", undefined, prog("s400", 2)],
  ["Przebiegnij 200 m poniżej 30 s", undefined, prog("s200", 3)],
  ["Przebiegnij 100 m poniżej 13,5 s", undefined, prog("s100", 5)],
  ["Opanuj bieg po wirażu na 200 m", undefined, prog("technika", 4)],
  ["Przebiegnij 400 m poniżej 65 s", undefined, prog("s400", 3)],
  ["Przebiegnij 100 m poniżej 13 s", undefined, prog("s100", 6)],
  ["Przebiegnij 200 m poniżej 28 s", undefined, prog("s200", 4)],
  ["Wystartuj w pierwszych zawodach lekkoatletycznych"],
  ["Przebiegnij 400 m poniżej 62 s", undefined, prog("s400", 4)],
  ["Przebiegnij 100 m poniżej 12,5 s", undefined, prog("s100", 7)],
  ["Przebiegnij 200 m poniżej 26 s", undefined, prog("s200", 5)],
  ["Opanuj rozkład siły na 400 m (equal split)", undefined, prog("technika", 5)],
  ["Przebiegnij 400 m poniżej 58 s", undefined, prog("s400", 5)],
  ["Przebiegnij 100 m poniżej 12,2 s", undefined, prog("s100", 8)],
  // 26-45 · Średniozaawansowany
  ["Trenuj 3 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(3, 12)],
  ["Przebiegnij 200 m poniżej 25 s", undefined, prog("s200", 6)],
  ["Przebiegnij 100 m poniżej 12 s", "Bariera 12 sekund.", prog("s100", 9)],
  ["Przebiegnij 400 m poniżej 56 s", undefined, prog("s400", 6)],
  ["Popraw fazę akceleracji (pierwsze 30 m)", undefined, prog("technika", 6)],
  ["Przebiegnij 200 m poniżej 24 s", undefined, prog("s200", 7)],
  ["Przebiegnij 100 m poniżej 11,7 s", undefined, prog("s100", 10)],
  ["Przebiegnij 400 m poniżej 54 s", undefined, prog("s400", 7)],
  ["Zajmij miejsce w pierwszej połowie zawodów regionalnych"],
  ["Przebiegnij 200 m poniżej 23,5 s", undefined, prog("s200", 8)],
  ["Przebiegnij 100 m poniżej 11,5 s", undefined, prog("s100", 11)],
  ["Przebiegnij 400 m poniżej 52 s", undefined, prog("s400", 8)],
  ["Opanuj maksymalną prędkość bez spięcia (relaksacja w sprincie)", undefined, prog("technika", 7)],
  ["Przebiegnij 200 m poniżej 23 s", undefined, prog("s200", 9)],
  ["Przebiegnij 100 m poniżej 11,3 s", undefined, prog("s100", 12)],
  ["Przebiegnij 400 m poniżej 51 s", undefined, prog("s400", 9)],
  ["Zajmij miejsce na podium zawodów regionalnych"],
  ["Przebiegnij 200 m poniżej 22,5 s", undefined, prog("s200", 10)],
  ["Przebiegnij 100 m poniżej 11,1 s", undefined, prog("s100", 13)],
  // 46-65 · Zaawansowany
  ["Trenuj z planem periodyzacji przez pełny sezon"],
  ["Przebiegnij 400 m poniżej 50 s", "Bariera 50 sekund na 400 m.", prog("s400", 10)],
  ["Przebiegnij 200 m poniżej 22 s", undefined, prog("s200", 11)],
  ["Przebiegnij 100 m poniżej 11 s", "Bariera 11 sekund — poziom klubowy.", prog("s100", 14)],
  ["Zajmij miejsce w czołówce mistrzostw okręgu"],
  ["Przebiegnij 400 m poniżej 49 s", undefined, prog("s400", 11)],
  ["Przebiegnij 200 m poniżej 21,7 s", undefined, prog("s200", 12)],
  ["Przebiegnij 100 m poniżej 10,9 s", undefined, prog("s100", 15)],
  ["Przebiegnij 400 m poniżej 48 s", undefined, prog("s400", 12)],
  ["Zajmij miejsce w pierwszej dziesiątce mistrzostw kraju (kategoria)"],
  ["Przebiegnij 200 m poniżej 21,5 s", undefined, prog("s200", 13)],
  ["Przebiegnij 100 m poniżej 10,7 s", undefined, prog("s100", 16)],
  ["Przebiegnij 400 m poniżej 47,5 s", undefined, prog("s400", 13)],
  ["Zdobądź minimum na mistrzostwa kraju seniorów"],
  ["Przebiegnij 200 m poniżej 21,2 s", undefined, prog("s200", 14)],
  ["Przebiegnij 100 m poniżej 10,6 s", undefined, prog("s100", 17)],
  ["Przebiegnij 400 m poniżej 47 s", undefined, prog("s400", 14)],
  ["Zdobądź medal mistrzostw kraju juniorów"],
  ["Przebiegnij 200 m poniżej 21 s", undefined, prog("s200", 15)],
  ["Przebiegnij 100 m poniżej 10,5 s", "Poziom krajowej czołówki.", prog("s100", 18)],
  // 66-85 · Wyczynowy
  ["Przebiegnij 400 m poniżej 46,5 s", undefined, prog("s400", 15)],
  ["Przebiegnij 200 m poniżej 20,8 s", undefined, prog("s200", 16)],
  ["Przebiegnij 100 m poniżej 10,4 s", undefined, prog("s100", 19)],
  ["Zdobądź medal mistrzostw kraju seniorów"],
  ["Przebiegnij 400 m poniżej 46 s", undefined, prog("s400", 16)],
  ["Przebiegnij 200 m poniżej 20,6 s", undefined, prog("s200", 17)],
  ["Przebiegnij 100 m poniżej 10,3 s", undefined, prog("s100", 20)],
  ["Wystartuj w zawodach międzynarodowych"],
  ["Przebiegnij 400 m poniżej 45,5 s", undefined, prog("s400", 17)],
  ["Przebiegnij 200 m poniżej 20,5 s", undefined, prog("s200", 18)],
  ["Przebiegnij 100 m poniżej 10,2 s", "Bardzo wysoki, wieloletnio trenowany poziom.", prog("s100", 21)],
  ["Zdobądź minimum na mistrzostwa kraju amatorów"],
  ["Przebiegnij 400 m poniżej 45 s", "Sub-45 na 400 m.", prog("s400", 18)],
  ["Przebiegnij 200 m poniżej 20,3 s", undefined, prog("s200", 19)],
  ["Przebiegnij 100 m poniżej 10,1 s", undefined, prog("s100", 22)],
  ["Awansuj do finału mistrzostw kraju seniorów"],
  ["Przebiegnij 400 m poniżej 44,8 s", undefined, prog("s400", 19)],
  ["Przebiegnij 200 m poniżej 20,1 s", undefined, prog("s200", 20)],
  ["Przebiegnij 100 m poniżej 10 s", "Bariera 10 sekund — bardzo rzadki wynik.", prog("s100", 23)],
  ["Awansuj do półfinału mistrzostw kraju amatorów"],
  ["Ustanów swój rekord życiowy w hali (60 m) na zawodach"],
  // 86-99 · Elita
  ["Przebiegnij 400 m poniżej 44,5 s", undefined, prog("s400", 20)],
  ["Przebiegnij 200 m poniżej 20 s", "Bariera 20 sekund na 200 m.", prog("s200", 21)],
  ["Przebiegnij 100 m poniżej 9,95 s", undefined, prog("s100", 24)],
  ["Zdobądź medal mistrzostw regionu"],
  ["Przebiegnij 400 m poniżej 44,2 s", undefined, prog("s400", 21)],
  ["Przebiegnij 200 m poniżej 19,9 s", undefined, prog("s200", 22)],
  ["Przebiegnij 100 m poniżej 9,9 s", undefined, prog("s100", 25)],
  ["Weź udział w finale mistrzostw kraju amatorów"],
  ["Przebiegnij 400 m poniżej 44 s", undefined, prog("s400", 22)],
  ["Przebiegnij 200 m poniżej 19,8 s", undefined, prog("s200", 23)],
  ["Przebiegnij 100 m poniżej 9,85 s", undefined, prog("s100", 26)],
  ["Zdobądź medal mistrzostw kraju amatorów"],
  ["Poprowadź kogoś przez zaawansowaną technikę sprintu"],
  ["Poziom mistrzowski (amatorski szczyt): wieloletni, dojrzały warsztat sprinterski", "Dalsze, zawodowe osiągnięcia (mistrzostwa świata, igrzyska, rekordy) potwierdzają osobne certyfikaty."],
]);

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  2: [
    { kind: "video", title: "Athlete.X — Sprint Start Technique from Blocks", url: yt("l2v3mQ8egFg") },
  ],
  5: [
    { kind: "video", title: "Arm Mechanics and High Knee Drive for Sprinters", url: yt("hKKVBQ5VKBM") },
  ],
  10: [
    { kind: "video", title: "Sprint Interval Training — 3x100m Workout", url: yt("cNp2wTgE3GY") },
  ],
  15: [
    { kind: "video", title: "How to Run the 200m Curve — Sprinting Technique", url: yt("N5Bwm1UUbwI") },
  ],
  23: [
    { kind: "video", title: "400m Race Strategy — Pacing and Energy Distribution", url: yt("JhCfJuG9H00") },
  ],
  31: [
    { kind: "video", title: "ALTIS — Acceleration Phase in Sprinting Explained", url: yt("GuJeIaH8bXE") },
  ],
  39: [
    { kind: "video", title: "Sprint Relaxation Technique — Run Faster by Staying Loose", url: yt("wP1Gxe8gEpA") },
  ],
  50: [
    { kind: "article", title: "Sprint Training — Periodization for 100/200/400m", url: "https://www.verywellfit.com/interval-training-for-sprinters-3120497" },
  ],
  70: [
    { kind: "reference", title: "World Athletics — Sprint Records and Rankings", url: "https://worldathletics.org/records/all-time-toplists/sprints" },
  ],
  86: [
    { kind: "video", title: "Usain Bolt Race Analysis — What Made Him the Fastest", url: yt("3nbjhpcZ9_g") },
  ],
};
