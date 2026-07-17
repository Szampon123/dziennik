// Squash ladder 1-99. Manual — progression tracks: technique, matches played,
// club/ranking level.
import { ladderC, freq, prog } from "./helpers";

export const activity = {
  slug: "squash",
  name: "Squash",
  icon: "🎾",
  description:
    "Szybka gra w czterech ścianach — od pierwszego serwisu po drabinki rankingowe. Progresja: technika, rozegrane mecze i poziom rozgrywek.",
  sortOrder: 36,
  logKind: "manual" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // 1-10 · Pierwsze kroki
  ["Wykonaj poprawny serwis do właściwego pola", undefined, prog("technika", 1)],
  ["Odbij piłkę forehandem po ścianie czołowej", undefined, prog("technika", 2)],
  ["Odbij piłkę backhandem", undefined, prog("technika", 3)],
  ["Utrzymaj wymianę 5 odbić z partnerem", undefined, prog("technika", 4)],
  ["Zagraj piłkę wzdłuż ściany bocznej (rail/drive)", undefined, prog("technika", 5)],
  ["Wróć do pozycji T po każdym uderzeniu", undefined, prog("technika", 6)],
  ["Zagraj skuteczny lob do tylnego narożnika", undefined, prog("technika", 7)],
  ["Rozegraj pierwszego seta zgodnie z przepisami", undefined, prog("mecze", 1)],
  ["Wygraj pierwszą wymianę zagraniem kończącym"],
  ["Rozegraj pełny mecz (do 3 wygranych setów)", undefined, prog("mecze", 2)],
  // 11-25 · Regularny
  ["Graj raz w tygodniu przez 4 kolejne tygodnie", undefined, freq(1, 4)],
  ["Zagraj skuteczny drop shot (skrót przy ścianie czołowej)", undefined, prog("technika", 8)],
  ["Zagraj 5 meczów", undefined, prog("mecze", 5)],
  ["Utrzymaj wymianę 15 odbić", undefined, prog("technika", 9)],
  ["Zagraj boast (piłkę z odbiciem od ściany bocznej)", undefined, prog("technika", 10)],
  ["Wygraj pierwszy mecz z realnym przeciwnikiem"],
  ["Zagraj 10 meczów", undefined, prog("mecze", 10)],
  ["Kontroluj tempo gry — mieszaj lob i drop", undefined, prog("technika", 11)],
  ["Rozegraj mecz w lidze klubowej lub drabince", undefined, prog("liga", 1)],
  ["Zagraj 20 meczów", undefined, prog("mecze", 20)],
  ["Zagraj skuteczny volley (piłka z powietrza)", undefined, prog("technika", 12)],
  ["Wygraj 5 meczów łącznie"],
  ["Zagraj kill shot (mocne, płaskie zakończenie)", undefined, prog("technika", 13)],
  ["Zagraj 30 meczów", undefined, prog("mecze", 30)],
  ["Awansuj w drabince klubowej o kilka pozycji"],
  // 26-45 · Średniozaawansowany
  ["Graj 2 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(2, 12)],
  ["Utrzymaj wymianę 30 odbić w wysokim tempie", undefined, prog("technika", 14)],
  ["Zagraj 50 meczów", undefined, prog("mecze", 50)],
  ["Opanuj grę na pozycji T z presją na przeciwnika", undefined, prog("technika", 15)],
  ["Rozegraj pełny sezon w lidze klubowej", undefined, prog("liga", 2)],
  ["Zagraj skuteczny cross-court nick (piłka w połączenie ścian)", undefined, prog("technika", 16)],
  ["Zajmij miejsce w pierwszej połowie drabinki klubowej"],
  ["Zagraj 75 meczów", undefined, prog("mecze", 75)],
  ["Wygraj mecz z wynikiem 3:0 z zaawansowanym graczem"],
  ["Opanuj deceptive play (ukrywanie zamiaru uderzenia)", undefined, prog("technika", 17)],
  ["Zagraj 100 meczów", undefined, prog("mecze", 100)],
  ["Weź udział w pierwszym turnieju rangi regionalnej", undefined, prog("liga", 3)],
  ["Wygraj mecz turniejowy"],
  ["Utrzymaj wysokie tempo przez pełne 3 wygrane sety bez opadu formy", undefined, prog("technika", 18)],
  ["Zagraj 150 meczów", undefined, prog("mecze", 150)],
  ["Zajmij miejsce na podium turnieju amatorskiego"],
  ["Opanuj grę w narożnikach (odbieranie „śmierci” z tyłu kortu)", undefined, prog("technika", 19)],
  ["Wygraj drabinkę klubową (zostań numerem 1 klubu)"],
  ["Zagraj 200 meczów", undefined, prog("mecze", 200)],
  ["Wejdź do rankingu wojewódzkiego/regionalnego"],
  // 46-65 · Zaawansowany
  ["Graj lub trenuj 4+ razy w tygodniu przez sezon"],
  ["Zagraj 250 meczów", undefined, prog("mecze", 250)],
  ["Zajmij miejsce w czołówce turnieju regionalnego"],
  ["Opanuj pełny repertuar zagrań kończących z obu stron", undefined, prog("technika", 20)],
  ["Zagraj 300 meczów", undefined, prog("mecze", 300)],
  ["Wygraj turniej regionalny"],
  ["Wejdź do rankingu krajowego", undefined, prog("liga", 4)],
  ["Zagraj 350 meczów", undefined, prog("mecze", 350)],
  ["Wygraj mecz z zawodnikiem z rankingu krajowego"],
  ["Utrzymaj poziom gry pod presją meczu pięciosetowego", undefined, prog("technika", 21)],
  ["Zagraj 400 meczów", undefined, prog("mecze", 400)],
  ["Zajmij miejsce w pierwszej dziesiątce mistrzostw kraju (kategoria)"],
  ["Zagraj 450 meczów", undefined, prog("mecze", 450)],
  ["Wygraj mecz z zawodnikiem z Top 50 kraju"],
  ["Zagraj 500 meczów", undefined, prog("mecze", 500)],
  ["Zdobądź medal mistrzostw kraju w swojej kategorii"],
  ["Wejdź do Top 20 rankingu krajowego", undefined, prog("liga", 5)],
  ["Zagraj 600 meczów", undefined, prog("mecze", 600)],
  ["Wygraj turniej rangi ogólnokrajowej"],
  ["Uzyskaj wynik kwalifikujący do zawodów międzynarodowych"],
  // 66-85 · Wyczynowy
  ["Zagraj 700 meczów", undefined, prog("mecze", 700)],
  ["Wystąp w turnieju międzynarodowym (PSA Challenger)"],
  ["Wygraj mecz z zawodnikiem z rankingu światowego"],
  ["Zagraj 800 meczów", undefined, prog("mecze", 800)],
  ["Wejdź do Top 10 rankingu krajowego", undefined, prog("liga", 6)],
  ["Zostań rozpoznawalnym graczem w swoim regionie"],
  ["Zagraj 900 meczów", undefined, prog("mecze", 900)],
  ["Zajmij miejsce w pierwszej ósemce turnieju regionalnego"],
  ["Zdobądź podium mistrzostw regionu seniorów"],
  ["Zagraj 1000 meczów", undefined, prog("mecze", 1000)],
  ["Wygraj turniej klubowy niższej rangi"],
  ["Osiągnij czołową 20 rankingu regionalnego"],
  ["Zagraj 1100 meczów", undefined, prog("mecze", 1100)],
  ["Wygraj mecz z mocnym zawodnikiem regionalnym"],
  ["Zdobądź podium mistrzostw regionu seniorów"],
  ["Zagraj 1200 meczów", undefined, prog("mecze", 1200)],
  ["Osiągnij czołową dziesiątkę rankingu regionalnego"],
  ["Zagraj w turnieju drużynowym reprezentując klub"],
  ["Zagraj 1300 meczów", undefined, prog("mecze", 1300)],
  ["Awansuj do fazy głównej turnieju amatorskiego wysokiej rangi"],
  // 86-99 · Elita
  ["Zagraj 1400 meczów", undefined, prog("mecze", 1400)],
  ["Wejdź do czołówki rankingu regionalnego"],
  ["Wygraj mecz z bardzo mocnym zawodnikiem regionalnym"],
  ["Zdobądź tytuł na regionalnym turnieju wysokiej rangi"],
  ["Zagraj 1500 meczów", undefined, prog("mecze", 1500)],
  ["Utrzymaj się w czołówce regionu przez sezon"],
  ["Awansuj do ćwierćfinału turnieju amatorskiego wysokiej rangi"],
  ["Zagraj w mistrzostwach kraju amatorów"],
  ["Wejdź do Top 20 rankingu krajowego amatorów"],
  ["Zajmij miejsce w pierwszej ósemce mistrzostw kraju amatorów"],
  ["Wejdź do Top 10 rankingu krajowego amatorów"],
  ["Zdobądź tytuł na dużym turnieju amatorskim"],
  ["Awansuj do finału mistrzostw kraju amatorów"],
  ["Poziom mistrzowski (amatorski szczyt): wieloletni, czołowy zawodnik amatorski kraju", "Dalsze, zawodowe osiągnięcia potwierdzają osobne certyfikaty."],
]);

import type { MilestoneResource } from "../../src/lib/milestone-resources";
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "video", title: "Squash Serve Tutorial for Beginners", url: yt("brpbGN0T-CE") },
  ],
  3: [
    { kind: "video", title: "Backhand Drive Basics — SquashSkills", url: yt("X7pVBossVhI") },
  ],
  6: [
    { kind: "video", title: "Movement to the T — Court Positioning", url: yt("0q-7W8xjSBs") },
  ],
  12: [
    { kind: "video", title: "Drop Shot Technique — SquashSkills", url: yt("ZQVwm0YFiLk") },
  ],
  15: [
    { kind: "video", title: "Boast Shot Explained", url: yt("DZnQvtiCV-I") },
  ],
  18: [
    { kind: "video", title: "Controlling Pace and Tempo", url: yt("7JIbsYMlqKY") },
  ],
  29: [
    { kind: "article", title: "Rules of Squash — World Squash", url: "https://www.worldsquash.org/squash-rules/" },
  ],
  35: [
    { kind: "video", title: "Deception in Squash — Disguising Your Shots", url: yt("4lTYRr_cL9o") },
  ],
  42: [
    { kind: "video", title: "Corner Game — Attacking from the Back", url: yt("5bFQVE8WHFI") },
  ],
  50: [
    { kind: "video", title: "Full Repertoire Finishing Shots — Both Sides", url: yt("brpbGN0T-CE") },
  ],
  65: [
    { kind: "video", title: "Mental Game Under Pressure — Match Psychology", url: yt("7JIbsYMlqKY") },
  ],
};
