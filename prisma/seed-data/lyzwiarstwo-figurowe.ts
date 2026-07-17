// Figure skating ladder 1-99. Manual — the engine cannot see a jump.
//
// ─── WHY THIS LADDER WAS REBUILT (2026-07-14) ───────────────────────────────
// The old ladder was a competitive career, not an amateur's path. It asked for a
// triple salchow at level 47, a triple axel at 60 and a quad at 74 — and from 66 up
// it was ISU points and international competition. The middle of the ladder, where a
// user spends years, was out of reach of the person the app is for: an adult who
// started skating as a hobby will, in the overwhelming majority of cases, never land
// a triple. Half the ladder was decoration.
//
// It now follows the adult tracks that actually exist and are published:
//
//   1-25   Learn to Skate USA, adult curriculum (levels 1-6): stops, crossovers,
//          three turns, mohawks, the first spin, the waltz jump.
//          https://www.learntoskateusa.com/basic_skills
//   26-45  U.S. Figure Skating Adult Pre-Bronze / Bronze: the single jumps, sit and
//          camel spins, a first program, a first test, a first competition.
//   46-65  Adult Silver: combinations, the axel — the jump that separates a good
//          adult skater from an ordinary one — programs skated clean.
//   66-89  Adult Gold and Masters: the first doubles. For an adult this is already
//          exceptional; the Adult Bronze free-skate test asks for a waltz jump and a
//          toe loop, which is where most adults live.
//          https://www.usfigureskating.org/skate/skating-opportunities/adult-skating/adult-testing
//   90-99  Kept competitive, deliberately: the double axel, the triples, national and
//          international adult titles. A ladder should have a ceiling somebody can see
//          and almost nobody touches — but it must not put that ceiling in the middle.
//
// Jump difficulty on the `skok` track is the sport's own order — toe loop < salchow <
// loop < flip < lutz < axel — so the cascade is honest: landing a lutz does prove the
// easier single jumps beneath it, and proves nothing about spins.
import { ladderC, freq, prog } from "./helpers";
import type { MilestoneResource } from "../../src/lib/milestone-resources";

export const activity = {
  slug: "lyzwiarstwo-figurowe",
  name: "Łyżwiarstwo figurowe",
  icon: "⛸️",
  description:
    "Od pierwszego kroku na lodzie po program z Axelem i podwójnymi skokami. Drabinka pisana pod dorosłego amatora — szczyt zostaje zawodniczy, ale środek jest do przejścia.",
  sortOrder: 26,
  logKind: "manual" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // ---- 1-10 · Pierwsze kroki na lodzie (Learn to Skate Adult 1-2) ----
  ["Ustój na łyżwach i przejdź kilka kroków po lodzie", "Wszyscy zaczynają tutaj, łącznie z mistrzami.", prog("technika", 1)],
  ["Jedź do przodu na łyżwach, odpychając się naprzemiennie", undefined, prog("technika", 2)],
  ["Zatrzymaj się pługiem", "Pierwsze hamowanie. Bez niego lód jest groźny.", prog("technika", 3)],
  ["Ślizgaj się na jednej nodze przez 3 sekundy", undefined, prog("technika", 4)],
  ["Wykonaj slalom do przodu na łukach (krawędzie)", undefined, prog("technika", 5)],
  ["Ślizgaj się do tyłu", "Moment, w którym łyżwiarstwo przestaje przypominać chodzenie.", prog("technika", 6)],
  ["Wykonaj przekładankę (crossover) do przodu w jedną stronę", undefined, prog("technika", 7)],
  ["Wykonaj przekładankę (crossover) do przodu w drugą stronę", "Słabsza strona zawsze przychodzi później — i zawsze musi przyjść.", prog("technika", 8)],
  ["Zatrzymaj się na krawędziach (T-stop lub hokejowo)", undefined, prog("technika", 9)],
  ["Wykonaj obrót z jazdy przodem na tył (three turn)", "Koniec kursu podstawowego. Umiesz jeździć na łyżwach.", prog("technika", 10)],

  // ---- 11-25 · Podstawy figurowe (Learn to Skate Adult 3-6) ----
  ["Trenuj raz w tygodniu przez 4 kolejne tygodnie", "Lód wybacza mniej niż siłownia — regularność jest tu warunkiem, nie ozdobą.", freq(1, 4)],
  ["Wykonaj przekładanki (crossover) do tyłu w obie strony", undefined, prog("technika", 11)],
  ["Wykonaj jaskółkę (spiralę) przez 3 sekundy", undefined, prog("technika", 12)],
  ["Wykonaj mohawk — przejście z przodu na tył na krawędziach", undefined, prog("technika", 13)],
  ["Wykonaj waltz jump — pierwszy skok, pół obrotu", "Pierwszy raz, kiedy obie łyżwy są w powietrzu.", prog("skok", 1)],
  ["Wykonaj piruet stojący (upright) — 3 obroty", undefined, prog("piruet", 1)],
  ["Trenuj 2 razy w tygodniu przez 8 kolejnych tygodni", undefined, freq(2, 8)],
  ["Wykonaj skok toe loop (pojedynczy)", "Najprostszy z sześciu skoków. Pierwszy pełny obrót.", prog("skok", 2)],
  ["Wykonaj piruet siedzący (sit spin) — 3 obroty", "Element wymagany na teście Adult Bronze.", prog("piruet", 2)],
  ["Wykonaj skok salchow (pojedynczy)", undefined, prog("skok", 3)],
  ["Wykonaj ósemki na krawędziach — do przodu i do tyłu", "Nudne. Buduje wszystko, co przyjdzie później.", prog("technika", 14)],
  ["Połącz waltz jump z toe loopem w kombinację", "Dokładnie ta kombinacja jest wymagana na teście Adult Bronze Free Skate.", prog("kombinacja", 1)],
  ["Zdaj test Adult Pre-Bronze (jazda podstawowa)", "Pierwszy oficjalny stopień w systemie dla dorosłych.", prog("test", 1)],
  ["Wystąp w pokazie klubowym lub zawodach dla dorosłych", "Lód pod publiką jest innym lodem.", prog("zawody", 1)],
  ["Wykonaj piruet w jaskółce (camel spin)", undefined, prog("piruet", 3)],

  // ---- 26-45 · Adult Bronze — komplet pojedynczych skoków ----
  ["Trenuj 2 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(2, 12)],
  ["Wykonaj skok rittberger/loop (pojedynczy)", "Pierwszy skok odbijany z krawędzi, bez pomocy toe picka.", prog("skok", 4)],
  ["Wykonaj piruet ze zmianą nogi", undefined, prog("piruet", 4)],
  ["Wykonaj skok flip (pojedynczy)", undefined, prog("skok", 5)],
  ["Zalicz test Adult Bronze (część jazdowa)", undefined, prog("test", 2)],
  ["Wykonaj skok lutz (pojedynczy)", "Najtrudniejszy z pojedynczych — odbicie z zewnętrznej krawędzi, wbrew obrotowi.", prog("skok", 6)],
  ["Połącz dwa pojedyncze skoki w kombinację", undefined, prog("kombinacja", 2)],
  ["Utrzymaj piruet siedzący przez 6+ obrotów", undefined, prog("piruet", 5)],
  ["Skomponuj i wykonaj krótki program z muzyką", "Elementy przestają być listą, a zaczynają być całością.", prog("program", 1)],
  ["Wykonaj sekwencję kroków w rytm muzyki", undefined, prog("program", 2)],
  ["Zalicz test Adult Bronze Free Skate", "Wymaga kombinacji waltz + toe loop i piruetu siedzącego. Tu mieszka większość dorosłych łyżwiarzy.", prog("test", 3)],
  ["Wystąp w zawodach dla dorosłych w kategorii Bronze", undefined, prog("zawody", 2)],
  ["Wykonaj piruet wycentrowany — bez „wędrowania” po lodzie", undefined, prog("piruet", 6)],
  ["Połącz trzy skoki w jedną kombinację", undefined, prog("kombinacja", 3)],
  ["Wykonaj cały program bez upadku", undefined, prog("program", 3)],
  ["Trenuj 3 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(3, 12)],
  ["Wykonaj piruet w pozycji layback lub Biellmann", "Zależy od gibkości — nie każdy dorosły ją odzyska, i to jest w porządku.", prog("piruet", 7)],
  ["Podejdź do Axela — pierwsze próby z asekuracją lub w uprzęży", "Axel jest jedynym skokiem odbijanym przodem. Stąd to dodatkowe pół obrotu.", prog("axel", 1)],
  ["Zajmij miejsce w pierwszej połowie zawodów dla dorosłych", undefined, prog("zawody", 3)],
  ["Zalicz test Adult Silver (część jazdowa)", undefined, prog("test", 4)],

  // ---- 46-65 · Adult Silver — axel i dojrzały program ----
  ["Wykonaj Axel (1,5 obrotu)", "Skok, który dzieli dorosłych łyżwiarzy na dwie grupy. Dla wielu to szczyt całej drogi — i szczyt zupełnie wystarczający.", prog("skok", 7)],
  ["Utrzymaj piruet 8+ obrotów w jednej pozycji", undefined, prog("piruet", 8)],
  ["Wykonaj piruet kombinowany (zmiana pozycji i nogi)", undefined, prog("piruet", 9)],
  ["Wykonaj kombinację z Axelem", undefined, prog("kombinacja", 4)],
  ["Wykonaj program dowolny z Axelem bez upadku", undefined, prog("program", 4)],
  ["Zalicz test Adult Silver Free Skate", undefined, prog("test", 5)],
  ["Trenuj 3 razy w tygodniu przez cały sezon", undefined, freq(3, 24)],
  ["Wykonaj sekwencję kroków z obrotami w obie strony", undefined, prog("program", 5)],
  ["Wystąp w zawodach dla dorosłych w kategorii Silver", undefined, prog("zawody", 4)],
  ["Zajmij miejsce na podium zawodów regionalnych dla dorosłych", undefined, prog("zawody", 5)],
  ["Wykonaj piruet z trudnym wejściem (z kroku lub ze skoku)", undefined, prog("piruet", 10)],
  ["Wykonaj program krótki i dowolny w jednych zawodach", undefined, prog("program", 6)],
  ["Wykonaj Axel czysto, w zawodach", "Trening to jedno. Axel pod publiką to drugie.", prog("skok", 7)],
  ["Utrzymaj poziom formy przez dwa kolejne sezony", undefined, freq(3, 48)],
  ["Wykonaj piruet z trudną pozycją (poziom 3 wg skali ISU)", undefined, prog("piruet", 11)],
  ["Zalicz test Adult Gold (część jazdowa)", undefined, prog("test", 6)],
  ["Wykonaj kombinację Axel + toe loop", undefined, prog("kombinacja", 5)],
  ["Wykonaj program z pełną, dojrzałą interpretacją muzyki", "Sędziowie nazywają to komponentami. Widz nazywa to „ta osoba umie jeździć na łyżwach”.", prog("program", 7)],
  ["Zajmij miejsce w czołówce zawodów krajowych dla dorosłych", undefined, prog("zawody", 6)],
  ["Wykonaj podwójny salchow", "Pierwszy skok podwójny. Dla dorosłego, który zaczął po dwudziestce — osiągnięcie rzadkie.", prog("skok", 8)],

  // ---- 66-89 · Adult Gold i Masters — podwójne skoki ----
  ["Wykonaj podwójny toe loop", undefined, prog("skok", 9)],
  ["Zalicz test Adult Gold Free Skate", "Najwyższy stopień w systemie testów dla dorosłych.", prog("test", 7)],
  ["Wykonaj piruet na poziomie 4 wg skali ISU", undefined, prog("piruet", 12)],
  ["Wykonaj program z podwójnym skokiem bez upadku", undefined, prog("program", 8)],
  ["Wykonaj podwójny loop", undefined, prog("skok", 10)],
  ["Wystąp w mistrzostwach kraju dla dorosłych", undefined, prog("zawody", 7)],
  ["Wykonaj kombinację dwóch podwójnych skoków", undefined, prog("kombinacja", 6)],
  ["Wykonaj podwójny flip", undefined, prog("skok", 11)],
  ["Utrzymaj piruet kombinowany 12+ obrotów", undefined, prog("piruet", 13)],
  ["Zajmij miejsce w pierwszej dziesiątce mistrzostw kraju dla dorosłych", undefined, prog("zawody", 8)],
  ["Wykonaj podwójny lutz", "Komplet podwójnych bez Axela. U dorosłego amatora to poziom, do którego dochodzą pojedyncze osoby w kraju.", prog("skok", 12)],
  ["Wykonaj program z trzema różnymi podwójnymi skokami", undefined, prog("program", 9)],
  ["Trenuj z trenerem indywidualnie przez pełny sezon", undefined, freq(4, 24)],
  ["Wykonaj sekwencję kroków na poziomie 4", undefined, prog("program", 10)],
  ["Zdobądź medal mistrzostw kraju dla dorosłych", undefined, prog("zawody", 9)],
  ["Wykonaj kombinację podwójny + podwójny", undefined, prog("kombinacja", 7)],
  ["Wykonaj oba programy w mistrzostwach bez błędu technicznego", undefined, prog("program", 11)],
  ["Wystąp w międzynarodowych zawodach dla dorosłych (ISU Adult)", undefined, prog("zawody", 10)],
  ["Wykonaj wszystkie sześć podwójnych skoków", undefined, prog("skok", 13)],
  ["Zdobądź podium w międzynarodowych zawodach dla dorosłych", undefined, prog("zawody", 11)],
  ["Poprowadź początkującego przez pierwsze kroki na lodzie", "Nauczyć kogoś jeździć na łyżwach to inny egzamin niż zdać test.", prog("program", 12)],
  ["Wykonaj program z podwójnym Axelem w treningu", undefined, prog("skok", 14)],
  ["Zdobądź tytuł mistrza kraju w kategorii dorosłych", undefined, prog("zawody", 12)],
  ["Utrzymaj wysoką formę zawodniczą przez pięć sezonów", "Ciało dorosłego regeneruje się wolniej. Pięć sezonów na tym poziomie to osobne osiągnięcie.", freq(4, 100)],

  // ---- 90-99 · Poziom zawodniczy (świadomie poza zasięgiem amatora) ----
  ["Wykonaj podwójny Axel czysto, w zawodach", "Od tego poziomu drabinka opisuje sport wyczynowy, nie hobby. Zostaje tu celowo — sufit ma być widoczny.", prog("skok", 15)],
  ["Wykonaj potrójny salchow", "Pierwszy skok potrójny. Dorosły, który zaczął po dwudziestce, ląduje ten skok niezwykle rzadko.", prog("skok", 16)],
  ["Wykonaj potrójny toe loop", undefined, prog("skok", 17)],
  ["Wykonaj program z potrójnym skokiem", undefined, prog("program", 13)],
  ["Wykonaj potrójny loop lub flip", undefined, prog("skok", 18)],
  ["Zakwalifikuj się do zawodów rangi ISU", undefined, prog("zawody", 13)],
  ["Wykonaj potrójny lutz", undefined, prog("skok", 19)],
  ["Wykonaj program z dwoma różnymi potrójnymi skokami", undefined, prog("program", 14)],
  ["Wykonaj kombinację potrójny + podwójny", undefined, prog("kombinacja", 8)],
  ["Poziom mistrzowski: potrójny Axel lub komplet potrójnych w programie zawodniczym", "Szczyt sportu, nie hobby. Dalsze osiągnięcia potwierdzają rankingi ISU, nie ta drabinka.", prog("skok", 20)],
]);

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "video", title: "How to Ice Skate — First Steps for Beginners", url: yt("1qX71pSiiMw") },
  ],
  7: [
    { kind: "video", title: "Forward Crossovers Tutorial — Figure Skating Basics", url: yt("GwU-lqYmJHQ") },
  ],
  10: [
    { kind: "video", title: "Three Turn Tutorial — Essential Figure Skating Move", url: yt("YpY0MLGqF9s") },
  ],
  15: [
    { kind: "video", title: "Waltz Jump Tutorial — Your First Skating Jump", url: yt("5HcbYFH2E0c") },
  ],
  18: [
    { kind: "video", title: "Single Toe Loop Tutorial for Figure Skaters", url: yt("dUO4JjbJXTc") },
  ],
  23: [
    { kind: "reference", title: "U.S. Figure Skating Adult Testing Guide", url: "https://www.usfigureskating.org/skate/skating-opportunities/adult-skating/adult-testing" },
  ],
  30: [
    { kind: "article", title: "Learn to Skate USA — Adult Curriculum Overview", url: "https://www.learntoskateusa.com/basic_skills" },
  ],
  46: [
    { kind: "video", title: "How to Land an Axel — Step by Step", url: yt("3S7X1YwH0Dw") },
  ],
  65: [
    { kind: "video", title: "Double Salchow Tutorial — First Double Jump", url: yt("Q_6xdxO9V2g") },
  ],
  90: [
    { kind: "reference", title: "ISU Judging System — How Figure Skating Scores Work", url: "https://www.isu.org/figure-skating/rules" },
  ],
};
