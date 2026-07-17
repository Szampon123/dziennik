// Pétanque ladder 1-99. Manual — progression tracks: technique (pointing &
// shooting skill), matches played, and competition level.
import { ladderC, freq, prog } from "./helpers";

export const activity = {
  slug: "petanka",
  name: "Petanka (bule)",
  icon: "🔴",
  description:
    "Francuska gra w bule — precyzyjne dostawianie i wystrzeliwanie kul. Progresja: technika ustawiania i strzału, mecze i poziom rozgrywek.",
  sortOrder: 58,
  logKind: "manual" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // 1-10 · Pierwsze kroki
  ["Rzuć bulę (boule) tak, by dojechała w okolice świnki (cochonnet)", undefined, prog("pointing", 1)],
  ["Opanuj poprawny chwyt i postawę w kole", undefined, prog("technika", 1)],
  ["Dostaw kulę bliżej świnki niż przeciwnik (pointing)", undefined, prog("pointing", 2)],
  ["Rzuć kulę półwysoko (demi-portée)", undefined, prog("technika", 2)],
  ["Trafij kulą w kupkę kul przeciwnika (rough shot)", undefined, prog("shooting", 1)],
  ["Ustaw 3 kule w promieniu 50 cm od świnki", undefined, prog("pointing", 3)],
  ["Zrozum liczenie punktów i przebieg endu", undefined, prog("technika", 3)],
  ["Zagraj pierwszy mecz treningowy", undefined, prog("mecze", 1)],
  ["Wygraj pierwszego enda"],
  ["Rozegraj pełny mecz do 13 punktów", undefined, prog("mecze", 2)],
  // 11-25 · Regularny
  ["Graj raz w tygodniu przez 4 kolejne tygodnie", undefined, freq(1, 4)],
  ["Rzuć kulę na wysokim łuku (portée) z kontrolą", undefined, prog("technika", 4)],
  ["Wybij kulę przeciwnika strzałem (tir) — trafienie", undefined, prog("shooting", 2)],
  ["Zagraj 5 meczów", undefined, prog("mecze", 5)],
  ["Ustaw kulę w promieniu 30 cm od świnki", undefined, prog("pointing", 4)],
  ["Wykonaj carreau (strzał wybijający z pozostawieniem swojej buli)", undefined, prog("shooting", 3)],
  ["Wygraj pierwszy mecz z realnym przeciwnikiem"],
  ["Zagraj 10 meczów", undefined, prog("mecze", 10)],
  ["Trafij strzałem 4/6 kul w serii", undefined, prog("shooting", 4)],
  ["Rozegraj mecz w lidze lub turnieju amatorskim", undefined, prog("liga", 1)],
  ["Zagraj 20 meczów", undefined, prog("mecze", 20)],
  ["Ustaw kulę w promieniu 20 cm od świnki", undefined, prog("pointing", 5)],
  ["Wykonaj tir au fer (strzał bezpośredni w kulę bez ziemi)", undefined, prog("shooting", 5)],
  ["Graj skutecznie na różnym podłożu (twarde/miękkie)", undefined, prog("technika", 5)],
  ["Zagraj 30 meczów", undefined, prog("mecze", 30)],
  // 26-45 · Średniozaawansowany
  ["Graj 2 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(2, 12)],
  ["Trafij strzałem 5/6 kul w serii", undefined, prog("shooting", 6)],
  ["Ustaw kulę w promieniu 15 cm od świnki", undefined, prog("pointing", 6)],
  ["Zagraj 50 meczów", undefined, prog("mecze", 50)],
  ["Wykonaj carreau na twardym terenie", undefined, prog("shooting", 7)],
  ["Rozegraj pełny sezon w lidze", undefined, prog("liga", 2)],
  ["Zajmij miejsce w pierwszej połowie turnieju"],
  ["Ustaw kulę „na świnkę” (biberon — dotykając świnki)", undefined, prog("pointing", 7)],
  ["Zagraj 75 meczów", undefined, prog("mecze", 75)],
  ["Trafij strzałem 8/10 kul w teście strzeleckim", undefined, prog("shooting", 8)],
  ["Opanuj rolę tireur i pointeur w zespole (triplette)", undefined, prog("technika", 6)],
  ["Zagraj 100 meczów", undefined, prog("mecze", 100)],
  ["Zajmij miejsce na podium turnieju regionalnego"],
  ["Ustaw kule z konsekwencją w promieniu 10 cm", undefined, prog("pointing", 8)],
  ["Wykonaj strzał na odległość 9 m z trafieniem", undefined, prog("shooting", 9)],
  ["Zagraj 150 meczów", undefined, prog("mecze", 150)],
  ["Poprowadź zespół jako kapitan (milieu)", undefined, prog("technika", 7)],
  ["Trafij strzałem 12/15 kul w teście", undefined, prog("shooting", 10)],
  ["Wejdź do rankingu wojewódzkiego", undefined, prog("liga", 3)],
  ["Zagraj 200 meczów", undefined, prog("mecze", 200)],
  // 46-65 · Zaawansowany
  ["Graj lub trenuj 4+ razy w tygodniu przez sezon"],
  ["Trafij strzałem 15/20 kul w teście", undefined, prog("shooting", 11)],
  ["Zajmij miejsce w czołówce turnieju regionalnego"],
  ["Ustaw kule „biberon” konsekwentnie w serii", undefined, prog("pointing", 9)],
  ["Zagraj 250 meczów", undefined, prog("mecze", 250)],
  ["Wygraj turniej regionalny"],
  ["Wejdź do rankingu krajowego", undefined, prog("liga", 4)],
  ["Trafij strzałem 20/25 kul w teście", undefined, prog("shooting", 12)],
  ["Zagraj 300 meczów", undefined, prog("mecze", 300)],
  ["Wygraj mecz z zawodnikiem z rankingu krajowego"],
  ["Wykonaj carreau na sztywno pod presją meczu", undefined, prog("shooting", 13)],
  ["Ustaw kulę idealnie z 10 m (pointing na dystans)", undefined, prog("pointing", 10)],
  ["Zagraj 400 meczów", undefined, prog("mecze", 400)],
  ["Zajmij miejsce w pierwszej dziesiątce mistrzostw kraju"],
  ["Trafij strzałem 25/30 kul w teście strzeleckim", undefined, prog("shooting", 14)],
  ["Zagraj 500 meczów", undefined, prog("mecze", 500)],
  ["Zdobądź medal mistrzostw kraju (triplette/doublette)"],
  ["Ustaw kule z mistrzowską precyzją w każdych warunkach", undefined, prog("pointing", 11)],
  ["Wygraj turniej rangi ogólnokrajowej"],
  ["Zostań rozpoznawalnym zawodnikiem w swoim regionie"],
  // 66-85 · Wyczynowy
  ["Trafij strzałem 28/30 kul w teście", undefined, prog("shooting", 15)],
  ["Zagraj 600 meczów", undefined, prog("mecze", 600)],
  ["Zostań mistrzem kraju"],
  ["Wygraj konkurs strzelecki (tir de précision) na zawodach", undefined, prog("shooting", 16)],
  ["Wystartuj w turnieju międzynarodowym"],
  ["Zagraj 700 meczów", undefined, prog("mecze", 700)],
  ["Ustaw serię kul bez błędu w meczu międzynarodowym", undefined, prog("pointing", 12)],
  ["Wygraj mecz z zespołem z rankingu światowego"],
  ["Zagraj 800 meczów", undefined, prog("mecze", 800)],
  ["Zdobądź punkty w rankingu międzynarodowym"],
  ["Trafij strzałem 30/30 w teście strzeleckim", "Perfekcyjna seria.", prog("shooting", 17)],
  ["Zajmij miejsce w pierwszej ósemce turnieju międzynarodowego"],
  ["Zagraj 900 meczów", undefined, prog("mecze", 900)],
  ["Weź udział w mistrzostwach regionu"],
  ["Wygraj konkurs strzelecki o zasięgu ogólnokrajowym", undefined, prog("shooting", 18)],
  ["Zagraj 1000 meczów", undefined, prog("mecze", 1000)],
  ["Zajmij miejsce w pierwszej ósemce mistrzostw regionu"],
  ["Osiągnij mistrzowską spójność ustawiania (pointing) na zawodach", undefined, prog("pointing", 13)],
  ["Zdobądź medal mistrzostw regionu"],
  ["Zostań kapitanem swojej drużyny klubowej"],
  // 86-99 · Elita
  ["Weź udział w mistrzostwach kraju amatorów"],
  ["Wygraj tir de précision o zasięgu ogólnokrajowym", undefined, prog("shooting", 19)],
  ["Zajmij miejsce w pierwszej ósemce mistrzostw kraju amatorów"],
  ["Ustaw kule z absolutną precyzją w finale dużego turnieju", undefined, prog("pointing", 14)],
  ["Zdobądź medal mistrzostw kraju amatorów w konkurencji zespołowej"],
  ["Wygraj prestiżowy turniej o szerokim zasięgu"],
  ["Zostań mistrzem kraju amatorów w tir de précision", undefined, prog("shooting", 20)],
  ["Awansuj do finału mistrzostw kraju amatorów"],
  ["Zdobądź złoto mistrzostw kraju amatorów z drużyną"],
  ["Zostań wielokrotnym medalistą mistrzostw kraju amatorów"],
  ["Poprowadź kogoś przez zaawansowaną technikę petanki"],
  ["Utrzymaj czołową pozycję w kraju przez cały sezon"],
  ["Zostań wielokrotnym mistrzem kraju amatorów"],
  ["Poziom mistrzowski (amatorski szczyt): wielokrotny mistrz kraju amatorów w petance", "Dalsze, zawodowe osiągnięcia (mistrzostwa świata, Mondial de Marseille) potwierdzają osobne certyfikaty."],
]);

import type { MilestoneResource } from "../../src/lib/milestone-resources";
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "article", title: "Petanque Rules and Basics — wikiHow", url: "https://www.wikihow.com/Play-P%C3%A9tanque" },
  ],
  2: [
    { kind: "video", title: "How to Hold and Throw a Boule", url: yt("0TlPHQBpPss") },
  ],
  3: [
    { kind: "video", title: "Pointing Technique Basics", url: yt("RpKqXQ13b2I") },
  ],
  5: [
    { kind: "video", title: "Shooting (Tir) Basics", url: yt("xVSgSNXI3Y4") },
  ],
  12: [
    { kind: "video", title: "Portée Throwing Technique", url: yt("vK_7TQN_Jt4") },
  ],
  16: [
    { kind: "video", title: "How to Do a Carreau", url: yt("mK_HXQZ2WGI") },
  ],
  23: [
    { kind: "video", title: "Tir au Fer Technique", url: yt("2Rq2JACyHKE") },
  ],
  31: [
    { kind: "video", title: "Biberon Shot Explained", url: yt("1n4SfxPVq5w") },
  ],
  46: [
    { kind: "video", title: "Advanced Shooting Accuracy", url: yt("pqJ0_f1Dz_k") },
  ],
  55: [
    { kind: "article", title: "Team Strategy in Triplette — Pétanque.org", url: "https://www.petanque.org/rules/" },
  ],
  86: [
    { kind: "reference", title: "Competition Preparation — FIPJP Official Site", url: "https://www.fipjp.org/en/" },
  ],
};
