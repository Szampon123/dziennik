// Ballroom dance ladder 1-99. Manual — progression tracks: skill class
// (WDSF: E → D → C → B → A → S → M), technique, and competition level.
import { ladderC, freq, prog } from "./helpers";
import type { MilestoneResource } from "../../src/lib/milestone-resources";

export const activity = {
  slug: "taniec-towarzyski",
  name: "Taniec towarzyski",
  icon: "💃",
  description:
    "Standard i latino w parach — od pierwszych kroków po klasę mistrzowską. Progresja: klasa taneczna (E→S/M), technika i poziom turniejów.",
  sortOrder: 70,
  logKind: "manual" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // 1-10 · Pierwsze kroki
  ["Opanuj podstawowy krok walca angielskiego", undefined, prog("technika", 1)],
  ["Opanuj podstawowy krok cha-cha", undefined, prog("technika", 2)],
  ["Utrzymaj rytm i tempo z muzyką", undefined, prog("technika", 3)],
  ["Opanuj prawidłową ramkę i trzymanie w parze", undefined, prog("technika", 4)],
  ["Zatańcz jive'a w podstawowej wersji", undefined, prog("technika", 5)],
  ["Zatańcz tango w podstawowej wersji", undefined, prog("technika", 6)],
  ["Poprowadź/podążaj (lead & follow) w prostej figurze", undefined, prog("technika", 7)],
  ["Zatańcz pełną rundę parkietu bez zatrzymania", undefined, prog("technika", 8)],
  ["Opanuj podstawy 5 tańców jednego stylu (standard lub latino)", undefined, prog("technika", 9)],
  ["Weź udział w pierwszym turnieju w klasie E", undefined, prog("klasa", 1)],
  // 11-25 · Regularny
  ["Trenuj z partnerem 2 razy w tygodniu przez 4 tygodnie", undefined, freq(2, 4)],
  ["Opanuj figury z rotacją i zmianą kierunku", undefined, prog("technika", 10)],
  ["Zdobądź punkty do awansu z klasy E"],
  ["Zatańcz poprawnie technicznie 3 tańce standardowe", undefined, prog("technika", 11)],
  ["Awansuj do klasy D", undefined, prog("klasa", 2)],
  ["Opanuj podstawy drugiego stylu (jeśli 10 tańców)", undefined, prog("technika", 12)],
  ["Zatańcz turniej w wielu tańcach bez błędu prowadzenia"],
  ["Zajmij miejsce w finale turnieju klasy D"],
  ["Opanuj swing i sway w tańcach standardowych", undefined, prog("technika", 13)],
  ["Awansuj do klasy C", undefined, prog("klasa", 3)],
  ["Opanuj akcje biodrowe (Cuban motion) w latino", undefined, prog("technika", 14)],
  ["Zatańcz choreografię turniejową z pamięci pod presją"],
  ["Zajmij miejsce w finale turnieju klasy C"],
  ["Opanuj kontrolę parkietu i mijanie innych par (floorcraft)", undefined, prog("technika", 15)],
  ["Awansuj do klasy B", undefined, prog("klasa", 4)],
  // 26-45 · Średniozaawansowany
  ["Trenuj 3-4 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(4, 12)],
  ["Opanuj zaawansowaną technikę stopy (footwork) i pracę kostek", undefined, prog("technika", 16)],
  ["Zajmij miejsce w pierwszej połowie turnieju klasy B"],
  ["Zatańcz pełny program 5 tańców na wysokim poziomie", undefined, prog("technika", 17)],
  ["Awansuj do klasy A", "Wysoka klasa taneczna.", prog("klasa", 5)],
  ["Opanuj ekspresję i interpretację muzyczną (musicality)", undefined, prog("technika", 18)],
  ["Zajmij miejsce w finale turnieju klasy A"],
  ["Zatańcz turniej ogólnopolski klasy A"],
  ["Opanuj zaawansowane figury (np. oversway, spanish drag)", undefined, prog("technika", 19)],
  ["Zajmij miejsce na podium turnieju klasy A"],
  ["Utrzymaj perfekcyjną synchronizację pary przez cały program", undefined, prog("technika", 20)],
  ["Awansuj do klasy S (najwyższa krajowa)", undefined, prog("klasa", 6)],
  ["Opanuj charakter każdego z tańców latino (odmienny styl)", undefined, prog("technika", 21)],
  ["Zajmij miejsce w ćwierćfinale turnieju klasy S"],
  ["Zatańcz na Mistrzostwach Polski (kwalifikacja)"],
  ["Opanuj power i dynamikę na poziomie mistrzowskim", undefined, prog("technika", 22)],
  ["Zajmij miejsce w półfinale turnieju klasy S"],
  ["Zdobądź wysokie noty za technikę i choreografię od sędziów", undefined, prog("technika", 23)],
  ["Zajmij miejsce w finale turnieju klasy S"],
  ["Zajmij miejsce w pierwszej szóstce Mistrzostw Polski"],
  // 46-65 · Zaawansowany
  ["Trenuj jak para zawodowa przez cały sezon"],
  ["Zdobądź klasę międzynarodową (M / open)", undefined, prog("klasa", 7)],
  ["Zajmij miejsce na podium Mistrzostw Polski"],
  ["Opanuj pełen repertuar figur międzynarodowych", undefined, prog("technika", 24)],
  ["Wystartuj w turnieju międzynarodowym (WDSF Open)"],
  ["Zajmij miejsce w pierwszej połowie turnieju międzynarodowego"],
  ["Zostań Mistrzem Polski w swojej kategorii"],
  ["Zdobądź punkty w rankingu WDSF", undefined, prog("klasa", 8)],
  ["Opanuj scenografię i prezentację na poziomie międzynarodowym", undefined, prog("technika", 25)],
  ["Zajmij miejsce w ćwierćfinale turnieju WDSF Open"],
  ["Wygraj mecz/turniej z parą z rankingu międzynarodowego"],
  ["Zajmij miejsce w półfinale turnieju WDSF Open"],
  ["Utrzymaj mistrzowską spójność stylu i techniki pod presją", undefined, prog("technika", 26)],
  ["Zajmij miejsce w finale turnieju WDSF Open"],
  ["Zakwalifikuj się do Mistrzostw Europy"],
  ["Wejdź do Top 48 rankingu światowego WDSF"],
  ["Zajmij miejsce w pierwszej połowie Mistrzostw Europy"],
  ["Opanuj interpretację i emocję na najwyższym poziomie", undefined, prog("technika", 27)],
  ["Wejdź do Top 24 rankingu światowego"],
  ["Zajmij miejsce w ćwierćfinale Mistrzostw Europy"],
  // 66-85 · Wyczynowy
  ["Zdobądź medal turnieju WDSF Open"],
  ["Wejdź do Top 12 rankingu światowego"],
  ["Zajmij miejsce w półfinale Mistrzostw Europy"],
  ["Zdobądź medal Mistrzostw Europy"],
  ["Wygraj turniej WDSF Open"],
  ["Zakwalifikuj się do Mistrzostw Świata"],
  ["Zajmij miejsce w pierwszej połowie Mistrzostw Świata"],
  ["Wejdź do Top 8 rankingu światowego"],
  ["Zajmij miejsce w ćwierćfinale Mistrzostw Świata"],
  ["Osiągnij mistrzowską perfekcję w każdym z 5 tańców", undefined, prog("technika", 28)],
  ["Wygraj turniej WDSF World Open"],
  ["Zajmij miejsce w półfinale Mistrzostw Świata"],
  ["Osiągnij czołową szóstkę rankingu krajowego"],
  ["Zdobądź medal mistrzostw kraju (kategoria wiekowa lub open)"],
  ["Zajmij miejsce w finale dużego turnieju o zasięgu ogólnokrajowym"],
  ["Zdobądź złoto mistrzostw regionu"],
  ["Osiągnij czołową trójkę rankingu krajowego"],
  ["Zajmij miejsce na podium dużego turnieju o zasięgu ogólnokrajowym"],
  ["Zdobądź srebro lub brąz mistrzostw kraju"],
  ["Osiągnij status uznanej pary w krajowym środowisku turniejowym", undefined, prog("technika", 29)],
  // 86-99 · Elita
  ["Wygraj duży turniej o zasięgu ogólnokrajowym"],
  ["Zostań numerem 1 rankingu krajowego"],
  ["Awansuj do finału mistrzostw kraju"],
  ["Zdobądź złoto mistrzostw kraju"],
  ["Wygraj klasyfikację generalną sezonu w swojej klasie"],
  ["Obroń tytuł mistrza kraju"],
  ["Zdobądź wielokrotne mistrzostwo kraju"],
  ["Utrzymaj pozycję w silnej klasie międzynarodowej (M/WDSF) przez wiele sezonów", undefined, prog("klasa", 9)],
  ["Poprowadź własną szkołę tańca przez dłuższy czas"],
  ["Zdobądź uznanie w krajowym środowisku tanecznym"],
  ["Wychowaj / poprowadź parę do sukcesów turniejowych"],
  ["Zdobądź uznanie w międzynarodowym środowisku amatorskim"],
  ["Osiągnij dojrzały, w pełni rozpoznawalny styl tańca pary", undefined, prog("technika", 30)],
  ["Poziom mistrzowski (amatorski szczyt): wielokrotny mistrz kraju w tańcu towarzyskim", "Dalsze, zawodowe osiągnięcia (mistrzostwa świata, WDSF GrandSlam) potwierdzają osobne certyfikaty."],
]);

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "video", title: "Waltz Basic Steps for Beginners", url: yt("wEPkJGatcJA") },
  ],
  5: [
    { kind: "video", title: "Dance Insanity — Jive Basics for Beginners", url: yt("J6MvuZ1GSWM") },
  ],
  10: [
    { kind: "video", title: "Your First Ballroom Dance Competition — What to Expect", url: yt("5_kF6VjLsqM") },
  ],
  15: [
    { kind: "article", title: "WDSF Competition Classes Explained", url: "https://www.worlddancesport.org/Rule/Competition" },
  ],
  21: [
    { kind: "video", title: "Cuban Motion Tutorial — Latin Hip Action", url: yt("p2AxVjDQTMw") },
  ],
  30: [
    { kind: "video", title: "How to Improve Posture and Frame in Ballroom", url: yt("Z2eCGGCaJ7I") },
  ],
  37: [
    { kind: "video", title: "Advanced Footwork Techniques in Standard Dances", url: yt("Y44GIhk4cMQ") },
  ],
  46: [
    { kind: "article", title: "How to Prepare for a Ballroom Dance Competition", url: "https://www.wikihow.com/Prepare-for-a-Ballroom-Dancing-Competition" },
  ],
  55: [
    { kind: "video", title: "Musicality and Expression in Latin Dance", url: yt("lxuLyF-GXWI") },
  ],
  66: [
    { kind: "reference", title: "WDSF World Ranking — DanceSport", url: "https://www.worlddancesport.org/Ranking" },
  ],
};
