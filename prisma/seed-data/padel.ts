// Padel ladder 1-99. Manual — progression tracks: technique, matches played,
// and level (World Padel Tour uses a 1.0-7.0+ player-level scale, mirrored here).
import { ladderC, freq, prog } from "./helpers";

export const activity = {
  slug: "padel",
  name: "Padel",
  icon: "🎾",
  description:
    "Najszybciej rosnący sport rakietowy świata. Od pierwszej wymiany przy szybach po turnieje. Progresja: technika, mecze i poziom gracza.",
  sortOrder: 37,
  logKind: "manual" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // 1-10 · Pierwsze kroki
  ["Wykonaj poprawny serwis od dołu (podbicie)", undefined, prog("technika", 1)],
  ["Odbij piłkę forehandem po odbiciu od podłoża", undefined, prog("technika", 2)],
  ["Odbij piłkę backhandem", undefined, prog("technika", 3)],
  ["Utrzymaj wymianę 4 odbić z partnerem", undefined, prog("technika", 4)],
  ["Zagraj piłkę po jej odbiciu od tylnej szyby", undefined, prog("technika", 5)],
  ["Zrozum ustawienie w deblu i poruszaj się z partnerem", undefined, prog("technika", 6)],
  ["Zagraj wolej przy siatce", undefined, prog("technika", 7)],
  ["Rozegraj pierwszego gema zgodnie z przepisami", undefined, prog("mecze", 1)],
  ["Wygraj wymianę atakiem przy siatce"],
  ["Rozegraj pełny mecz (do 2 wygranych setów)", undefined, prog("mecze", 2)],
  // 11-25 · Regularny
  ["Graj raz w tygodniu przez 4 kolejne tygodnie", undefined, freq(1, 4)],
  ["Zagraj skuteczną bandeję (podstawowy smecz padlowy)", undefined, prog("technika", 8)],
  ["Zagraj 5 meczów", undefined, prog("mecze", 5)],
  ["Zagraj piłkę z podwójnej szyby (szyba boczna + tylna)", undefined, prog("technika", 9)],
  ["Osiągnij poziom gracza 2.0", "Skala WPT 1.0-7.0.", prog("poziom", 20)],
  ["Wygraj pierwszy mecz z realnymi przeciwnikami"],
  ["Zagraj 10 meczów", undefined, prog("mecze", 10)],
  ["Zagraj skuteczny lob ponad przeciwnikami przy siatce", undefined, prog("technika", 10)],
  ["Rozegraj mecz w lidze amatorskiej lub lidze padla", undefined, prog("liga", 1)],
  ["Osiągnij poziom gracza 2.5", undefined, prog("poziom", 25)],
  ["Zagraj 20 meczów", undefined, prog("mecze", 20)],
  ["Zagraj víborę (smecz wypychający piłkę za szybę)", undefined, prog("technika", 11)],
  ["Osiągnij poziom gracza 3.0", undefined, prog("poziom", 30)],
  ["Zagraj 30 meczów", undefined, prog("mecze", 30)],
  ["Kontroluj grę z głębi kortu i wychodź do siatki zespołowo", undefined, prog("technika", 12)],
  // 26-45 · Średniozaawansowany
  ["Graj 2 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(2, 12)],
  ["Osiągnij poziom gracza 3.5", undefined, prog("poziom", 35)],
  ["Zagraj 50 meczów", undefined, prog("mecze", 50)],
  ["Opanuj chiquitę (niska piłka do stóp rywala przy siatce)", undefined, prog("technika", 13)],
  ["Rozegraj pełny sezon w lidze padla", undefined, prog("liga", 2)],
  ["Osiągnij poziom gracza 4.0", "Solidny gracz klubowy.", prog("poziom", 40)],
  ["Zajmij miejsce w pierwszej połowie turnieju amatorskiego"],
  ["Zagraj 75 meczów", undefined, prog("mecze", 75)],
  ["Zagraj skuteczny smecz za szybę (por tres / por cuatro)", undefined, prog("technika", 14)],
  ["Osiągnij poziom gracza 4.5", undefined, prog("poziom", 45)],
  ["Zagraj 100 meczów", undefined, prog("mecze", 100)],
  ["Weź udział w turnieju rangi regionalnej", undefined, prog("liga", 3)],
  ["Wygraj mecz turniejowy"],
  ["Opanuj grę defensywną z obu szyb pod presją", undefined, prog("technika", 15)],
  ["Osiągnij poziom gracza 5.0", "Zaawansowany zawodnik.", prog("poziom", 50)],
  ["Zagraj 150 meczów", undefined, prog("mecze", 150)],
  ["Zajmij miejsce na podium turnieju amatorskiego"],
  ["Opanuj zmianę ról z partnerem w trakcie wymiany", undefined, prog("technika", 16)],
  ["Zagraj 200 meczów", undefined, prog("mecze", 200)],
  ["Osiągnij poziom gracza 5.5", undefined, prog("poziom", 55)],
  // 46-65 · Zaawansowany
  ["Graj lub trenuj 4+ razy w tygodniu przez sezon"],
  ["Zagraj 250 meczów", undefined, prog("mecze", 250)],
  ["Zajmij miejsce w czołówce turnieju regionalnego"],
  ["Opanuj pełen repertuar smeczów (bandeja, víbora, por tres)", undefined, prog("technika", 17)],
  ["Osiągnij poziom gracza 6.0", "Poziom półprofesjonalny.", prog("poziom", 60)],
  ["Wygraj turniej regionalny"],
  ["Wejdź do rankingu krajowego", undefined, prog("liga", 4)],
  ["Zagraj 300 meczów", undefined, prog("mecze", 300)],
  ["Wygraj mecz z parą z rankingu krajowego"],
  ["Utrzymaj poziom gry w meczu trzysetowym pod presją", undefined, prog("technika", 18)],
  ["Zagraj 400 meczów", undefined, prog("mecze", 400)],
  ["Osiągnij poziom gracza 6.3", undefined, prog("poziom", 63)],
  ["Zajmij miejsce w pierwszej dziesiątce mistrzostw kraju (kategoria)"],
  ["Zagraj 450 meczów", undefined, prog("mecze", 450)],
  ["Wygraj mecz z parą z Top 50 kraju"],
  ["Osiągnij poziom gracza 6.5", undefined, prog("poziom", 65)],
  ["Zagraj 500 meczów", undefined, prog("mecze", 500)],
  ["Zdobądź medal mistrzostw kraju w swojej kategorii"],
  ["Wejdź do Top 20 rankingu krajowego", undefined, prog("liga", 5)],
  ["Wygraj turniej rangi ogólnokrajowej"],
  // 66-85 · Wyczynowy
  ["Zagraj 600 meczów", undefined, prog("mecze", 600)],
  ["Wystąp w turnieju międzynarodowym (FIP/Cupra)"],
  ["Osiągnij poziom gracza 6.8", undefined, prog("poziom", 68)],
  ["Wygraj mecz z parą z rankingu międzynarodowego"],
  ["Zagraj 700 meczów", undefined, prog("mecze", 700)],
  ["Wejdź do Top 10 rankingu krajowego", undefined, prog("liga", 6)],
  ["Zdobądź punkty w rankingu międzynarodowym"],
  ["Zagraj 800 meczów", undefined, prog("mecze", 800)],
  ["Zajmij miejsce w pierwszej ósemce turnieju międzynarodowego"],
  ["Osiągnij poziom gracza 7.0", "Bardzo wysoki, wieloletnio wypracowany poziom.", prog("poziom", 70)],
  ["Zdobądź medal mistrzostw kraju seniorów"],
  ["Zagraj 900 meczów", undefined, prog("mecze", 900)],
  ["Wygraj turniej regionalny niższej rangi"],
  ["Zagraj 1000 meczów", undefined, prog("mecze", 1000)],
  ["Wygraj mecz z mocną parą regionalną"],
  ["Zdobądź podium mistrzostw regionu seniorów"],
  ["Weź udział w turnieju o zasięgu ogólnokrajowym"],
  ["Zagraj 1100 meczów", undefined, prog("mecze", 1100)],
  ["Zagraj w turnieju drużynowym reprezentując klub"],
  ["Wygraj rundę główną turnieju ogólnokrajowego"],
  // 86-99 · Elita
  ["Zagraj 1200 meczów", undefined, prog("mecze", 1200)],
  ["Osiągnij czołową 20 rankingu krajowego"],
  ["Wygraj mecz z mocną parą z czołówki kraju"],
  ["Awansuj do ćwierćfinału turnieju ogólnokrajowego"],
  ["Zagraj 1300 meczów", undefined, prog("mecze", 1300)],
  ["Osiągnij czołową dziesiątkę rankingu krajowego"],
  ["Zdobądź tytuł turnieju o zasięgu ogólnokrajowym"],
  ["Weź udział w mistrzostwach kraju amatorów"],
  ["Osiągnij czołową piątkę rankingu krajowego"],
  ["Zajmij miejsce w pierwszej ósemce mistrzostw kraju amatorów"],
  ["Wejdź do czołówki rankingu krajowego"],
  ["Awansuj do finału turnieju ogólnokrajowego"],
  ["Wygraj mistrzostwa kraju amatorów"],
  ["Poziom mistrzowski (amatorski szczyt): wieloletni, czołowy zawodnik amatorski kraju", "Dalsze, zawodowe osiągnięcia potwierdzają osobne certyfikaty."],
]);

import type { MilestoneResource } from "../../src/lib/milestone-resources";
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "video", title: "How to Serve in Padel — Basics", url: yt("N9OXq4MmKQE") },
  ],
  5: [
    { kind: "video", title: "Playing Off the Glass — Wall Rebounds", url: yt("nGhW_VG_5z8") },
  ],
  6: [
    { kind: "video", title: "Doubles Positioning in Padel", url: yt("mJSQ_VTW2xM") },
  ],
  12: [
    { kind: "video", title: "Bandeja Tutorial — The Padel School", url: yt("JzC89VE-pis") },
  ],
  22: [
    { kind: "video", title: "Vibora Tutorial — Offensive Overhead", url: yt("kI7wO7_fib4") },
  ],
  29: [
    { kind: "video", title: "Chiquita Tutorial — Low Ball to Feet", url: yt("tR54vDQ_yAA") },
  ],
  34: [
    { kind: "video", title: "Smash Por Tres / Por Cuatro — Through the Glass", url: yt("0PNj80KMuWI") },
  ],
  40: [
    { kind: "video", title: "Defensive Glass Play Under Pressure", url: yt("3Xm9OW_tDmE") },
  ],
  49: [
    { kind: "video", title: "Full Smash Repertoire — Bandeja, Vibora, Por Tres", url: yt("kI7wO7_fib4") },
  ],
  65: [
    { kind: "video", title: "High-Level Padel Match Analysis", url: yt("0PNj80KMuWI") },
  ],
};
