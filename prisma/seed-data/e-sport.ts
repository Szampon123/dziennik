// Esports ladder 1-99. Manual — progression tracks: in-game rank tier, mechanics
// skill, and competition level (ladder → amateur → tier-2 → pro → Worlds).
import { ladderC, freq, prog } from "./helpers";

export const activity = {
  slug: "e-sport",
  name: "E-sport",
  icon: "🎮",
  description:
    "Rywalizacja w grach elektronicznych — od rankingowej drabinki po profesjonalne ligi. Progresja: ranga w grze, mechanika i poziom rozgrywek.",
  sortOrder: 79,
  logKind: "manual" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // 1-10 · Pierwsze kroki
  ["Opanuj podstawowe sterowanie i interfejs wybranej gry", undefined, prog("mechanika", 1)],
  ["Rozegraj pierwsze mecze rankingowe (placement)", undefined, prog("mecze", 1)],
  ["Zrozum cele i zasady trybu rywalizacyjnego", undefined, prog("mechanika", 2)],
  ["Osiągnij pierwszą rangę powyżej startowej (np. brąz)", undefined, prog("ranga", 1)],
  ["Opanuj podstawowy warm-up / rutynę celowania lub mechaniki", undefined, prog("mechanika", 3)],
  ["Wygraj 10 meczów rankingowych", undefined, prog("mecze", 10)],
  ["Naucz się jednej postaci/roli na przyzwoitym poziomie", undefined, prog("mechanika", 4)],
  ["Osiągnij rangę srebrną (lub odpowiednik)", undefined, prog("ranga", 2)],
  ["Analizuj własne błędy z powtórki (VOD review)", undefined, prog("mechanika", 5)],
  ["Rozegraj 50 meczów rankingowych", undefined, prog("mecze", 50)],
  // 11-25 · Regularny
  ["Graj i trenuj regularnie przez 4 tygodnie", undefined, freq(3, 4)],
  ["Osiągnij rangę złotą (lub odpowiednik)", undefined, prog("ranga", 3)],
  ["Opanuj podstawy mapy/gry na poziomie taktycznym", undefined, prog("mechanika", 6)],
  ["Osiągnij rangę platynową", undefined, prog("ranga", 4)],
  ["Utrzymaj stabilny poziom mechaniki (aim/CS/combo)", undefined, prog("mechanika", 7)],
  ["Wygraj 200 meczów rankingowych łącznie", undefined, prog("mecze", 200)],
  ["Dołącz do drużyny amatorskiej / zespołu", undefined, prog("liga", 1)],
  ["Osiągnij rangę diamentową", undefined, prog("ranga", 5)],
  ["Opanuj komunikację i koordynację w zespole (calle)", undefined, prog("mechanika", 8)],
  ["Zagraj w amatorskim turnieju online"],
  ["Osiągnij rangę powyżej diamentu (np. Master/Immortal wstępny próg)", undefined, prog("ranga", 6)],
  ["Wygraj 400 meczów rankingowych łącznie", undefined, prog("mecze", 400)],
  ["Opanuj kilka postaci/ról na wysokim poziomie", undefined, prog("mechanika", 9)],
  ["Zajmij miejsce w pierwszej połowie turnieju amatorskiego"],
  ["Osiągnij rangę top ladder (np. Grandmaster/Radiant próg)", undefined, prog("ranga", 7)],
  // 26-45 · Średniozaawansowany
  ["Trenuj z drużyną (scrimy) systematycznie przez 12 tygodni", undefined, freq(5, 12)],
  ["Utrzymaj rangę w top 1% drabinki", undefined, prog("ranga", 8)],
  ["Opanuj meta i draft/pick-ban na poziomie zaawansowanym", undefined, prog("mechanika", 10)],
  ["Wygraj 700 meczów rankingowych łącznie", undefined, prog("mecze", 700)],
  ["Zajmij miejsce na podium turnieju amatorskiego"],
  ["Utrzymaj rangę w top 0,5% drabinki", undefined, prog("ranga", 9)],
  ["Opanuj mechanikę na poziomie półprofesjonalnym", undefined, prog("mechanika", 11)],
  ["Dołącz do zespołu grającego w rozgrywkach tier-3", undefined, prog("liga", 2)],
  ["Wygraj mecz z zespołem z wyższej ligi (upset)"],
  ["Wygraj 1000 meczów rankingowych łącznie", undefined, prog("mecze", 1000)],
  ["Utrzymaj rangę w top 500 serwera/regionu", undefined, prog("ranga", 10)],
  ["Opanuj rolę shot-callera lub in-game leadera", undefined, prog("mechanika", 12)],
  ["Zajmij miejsce w pierwszej połowie ligi tier-3"],
  ["Awansuj z zespołem do rozgrywek tier-2", undefined, prog("liga", 3)],
  ["Utrzymaj rangę w top 200 serwera", undefined, prog("ranga", 11)],
  ["Wygraj 1500 meczów rankingowych łącznie", undefined, prog("mecze", 1500)],
  ["Zdobądź MVP meczu w lidze tier-2"],
  ["Opanuj mechanikę na poziomie profesjonalnym", undefined, prog("mechanika", 13)],
  ["Zajmij miejsce na podium turnieju tier-2"],
  ["Utrzymaj rangę w top 100 serwera", undefined, prog("ranga", 12)],
  // 46-65 · Zaawansowany
  ["Trenuj jak profesjonalista (bootcamp, pełne dni) przez sezon"],
  ["Dołącz do uznanej drużyny amatorskiej / semi-pro", undefined, prog("liga", 4)],
  ["Utrzymaj rangę w top 50 serwera", undefined, prog("ranga", 13)],
  ["Zdobądź pierwszą wygraną w profesjonalnej lidze"],
  ["Opanuj przygotowanie strategiczne i anty-strat pod rywala", undefined, prog("mechanika", 14)],
  ["Wygraj 2000 meczów rankingowych łącznie", undefined, prog("mecze", 2000)],
  ["Zajmij miejsce w górnej połowie tabeli ligi profesjonalnej"],
  ["Utrzymaj rangę w top 20 serwera", undefined, prog("ranga", 14)],
  ["Zdobądź MVP w rundzie ligi profesjonalnej"],
  ["Awansuj z zespołem do najwyższej ligi regionu", undefined, prog("liga", 5)],
  ["Utrzymaj rangę w top 10 serwera", undefined, prog("ranga", 15)],
  ["Zagraj w playoffach najwyższej ligi regionalnej"],
  ["Opanuj clutch i grę pod presją na scenie (LAN)", undefined, prog("mechanika", 15)],
  ["Wygraj 2500 meczów rankingowych łącznie", undefined, prog("mecze", 2500)],
  ["Zdobądź medal (podium) najwyższej ligi regionalnej"],
  ["Utrzymaj rangę w top 5 serwera", undefined, prog("ranga", 16)],
  ["Zakwalifikuj się do międzynarodowego turnieju (Major/Regional Finals)", undefined, prog("liga", 6)],
  ["Zajmij miejsce w fazie grupowej turnieju międzynarodowego"],
  ["Zdobądź nagrodę pieniężną w turnieju międzynarodowym"],
  ["Utrzymaj rangę #1 serwera/regionu", undefined, prog("ranga", 17)],
  // 66-85 · Wyczynowy
  ["Wygraj 3000 meczów rankingowych łącznie", undefined, prog("mecze", 3000)],
  ["Awansuj do fazy pucharowej turnieju amatorskiego o zasięgu ogólnokrajowym"],
  ["Zdobądź tytuł mistrza regionu z zespołem"],
  ["Opanuj mechanikę na bardzo wysokim, wieloletnio wypracowanym poziomie", undefined, prog("mechanika", 16)],
  ["Weź udział w turnieju kwalifikacyjnym o zasięgu ogólnokrajowym", undefined, prog("liga", 7)],
  ["Zdobądź MVP fazy grupowej dużego turnieju amatorskiego"],
  ["Wygraj 3500 meczów rankingowych łącznie", undefined, prog("mecze", 3500)],
  ["Zajmij miejsce w top 8 dużego turnieju amatorskiego"],
  ["Zdobądź medal dużego turnieju amatorskiego"],
  ["Utrzymaj status czołowego zawodnika swojej roli w regionie", undefined, prog("mechanika", 17)],
  ["Zajmij miejsce w top 8 mistrzostw kraju amatorów"],
  ["Wygraj duży turniej amatorski (regionalny/ogólnokrajowy)"],
  ["Wygraj 4000 meczów rankingowych łącznie", undefined, prog("mecze", 4000)],
  ["Zdobądź nagrodę indywidualną (all-star / MVP sezonu swojej ligi)"],
  ["Zajmij miejsce w top 4 mistrzostw kraju amatorów"],
  ["Zostań uznany za jednego z najlepszych na swojej pozycji w regionie", undefined, prog("mechanika", 18)],
  ["Awansuj do finału dużego turnieju amatorskiego"],
  ["Zdobądź złoto dużego turnieju amatorskiego"],
  ["Awansuj do finału mistrzostw kraju amatorów"],
  ["Zdobądź nagrodę MVP dużego turnieju amatorskiego", undefined, prog("mechanika", 19)],
  // 86-99 · Elita
  ["Wygraj 5000 meczów rankingowych łącznie", undefined, prog("mecze", 5000)],
  ["Zdobądź srebro lub brąz mistrzostw kraju amatorów"],
  ["Utrzymaj wysoki poziom gry przez cały sezon"],
  ["Zdobądź MVP mistrzostw kraju amatorów"],
  ["Zdobądź tytuł mistrza kraju amatorów dyscypliny", "Najwyższy krajowy tytuł amatorski."],
  ["Obroń tytuł mistrza kraju amatorów / wygraj kolejny duży turniej"],
  ["Zdobądź wielokrotne tytuły na krajowej scenie amatorskiej"],
  ["Zbuduj solidny, wieloletni dorobek osiągnięć w dyscyplinie", undefined, prog("mechanika", 20)],
  ["Zostań kapitanem/liderem uznanego składu amatorskiego"],
  ["Zdobądź uznanie w krajowej społeczności e-sportowej"],
  ["Utrzymaj czołową pozycję w regionie przez wiele sezonów"],
  ["Poprowadź kogoś przez zaawansowaną mechanikę i strategię gry"],
  ["Zainspiruj innych graczy w swojej społeczności jako mentor", undefined, prog("mechanika", 21)],
  ["Poziom mistrzowski (amatorski szczyt): wielokrotny mistrz kraju amatorów w dyscyplinie", "Dalsze, zawodowe osiągnięcia (scena światowa, Major) potwierdzają osobne certyfikaty."],
]);

import type { MilestoneResource } from "../../src/lib/milestone-resources";
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "video", title: "Getting Started in Competitive Gaming — ProGuides", url: yt("8YMvp6XNMLY") },
  ],
  5: [
    { kind: "video", title: "How to Warm Up Properly for Esports — ProGuides", url: yt("BPJrKTkIu-Y") },
  ],
  9: [
    { kind: "video", title: "VOD Review Guide — How to Analyze Your Gameplay — Blitz Esports", url: yt("V3R_CdFx5oM") },
  ],
  13: [
    { kind: "video", title: "Map Awareness and Game Sense — ProGuides", url: yt("lYmgW4UkyZU") },
  ],
  15: [
    { kind: "video", title: "Improving Mechanics — Aim and Movement — ProGuides", url: yt("xhQVbO-4GPo") },
  ],
  19: [
    { kind: "video", title: "Team Communication Guide — Blitz Esports", url: yt("2y3qBgJKRrk") },
  ],
  27: [
    { kind: "video", title: "Understanding Meta and Drafting — Blitz Esports", url: yt("9N7AXZC5hfU") },
  ],
  32: [
    { kind: "video", title: "How to Be a Shot-Caller — ProGuides", url: yt("kJJ_8e5YhcY") },
  ],
  44: [
    { kind: "article", title: "Breaking into the Competitive Scene — wikiHow", url: "https://www.wikihow.com/Become-a-Professional-Gamer" },
  ],
  55: [
    { kind: "video", title: "Pro Mindset and Mental Game in Esports", url: yt("nIThG9r-FHk") },
  ],
  77: [
    { kind: "video", title: "LAN Tournament Preparation — Blitz Esports", url: yt("mQ-BVj4HZ5Y") },
  ],
};
