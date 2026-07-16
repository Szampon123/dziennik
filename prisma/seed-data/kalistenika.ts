// Calisthenics ladder 1-99. Manual — progression tracks by reps (push-ups,
// pull-ups, dips) and skill lines (handstand, L-sit/front lever, planche).
// Skill values encode difficulty within each line so higher implies lower.
import { ladderC, freq, prog } from "./helpers";

export const activity = {
  slug: "kalistenika",
  name: "Kalistenika",
  icon: "🤸",
  description:
    "Trening z masą własnego ciała — od pierwszej pompki po planche i flagę. Progresja: powtórzenia (pompki, podciągnięcia, dipy) i elementy siłowe.",
  sortOrder: 38,
  logKind: "manual" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // 1-10 · Pierwsze kroki
  ["Zrób 1 pompkę z pełnym zakresem ruchu", undefined, prog("pompki", 1)],
  ["Zrób 5 pompek pod rząd", undefined, prog("pompki", 5)],
  ["Wykonaj 20-sekundową deskę (plank)", undefined, prog("core", 1)],
  ["Zrób 10 przysiadów z masą ciała pod rząd", undefined, prog("nogi", 10)],
  ["Zrób 10 pompek pod rząd", undefined, prog("pompki", 10)],
  ["Zawiśnij na drążku przez 30 sekund (martwy zwis)", undefined, prog("plecy", 1)],
  ["Zrób 1 podciągnięcie (pull-up) pełnym zakresem", undefined, prog("podciaganie", 1)],
  ["Zrób 5 dipów na poręczach", undefined, prog("dipy", 5)],
  ["Zrób 15 pompek pod rząd", undefined, prog("pompki", 15)],
  ["Zrób 3 podciągnięcia pod rząd", undefined, prog("podciaganie", 3)],
  // 11-25 · Regularny
  ["Trenuj 2 razy w tygodniu przez 4 kolejne tygodnie", undefined, freq(2, 4)],
  ["Zrób 20 pompek pod rząd", undefined, prog("pompki", 20)],
  ["Zrób 5 podciągnięć pod rząd", undefined, prog("podciaganie", 5)],
  ["Zrób 10 dipów pod rząd", undefined, prog("dipy", 10)],
  ["Utrzymaj L-sit przez 5 sekund", undefined, prog("core", 3)],
  ["Zrób 25 pompek pod rząd", undefined, prog("pompki", 25)],
  ["Zrób 8 podciągnięć pod rząd", undefined, prog("podciaganie", 8)],
  ["Zrób 15 dipów pod rząd", undefined, prog("dipy", 15)],
  ["Utrzymaj stanie na rękach przy ścianie przez 20 sekund", undefined, prog("handstand", 1)],
  ["Zrób 30 pompek pod rząd", undefined, prog("pompki", 30)],
  ["Zrób 10 podciągnięć pod rząd", "Dyszka na drążku — solidna baza.", prog("podciaganie", 10)],
  ["Zrób 20 dipów pod rząd", undefined, prog("dipy", 20)],
  ["Utrzymaj L-sit przez 15 sekund", undefined, prog("core", 5)],
  ["Zrób 10 przysiadów bułgarskich na każdą nogę", undefined, prog("nogi", 20)],
  ["Zrób pierwszy pistol squat (przysiad na jednej nodze)", undefined, prog("nogi", 30)],
  // 26-45 · Średniozaawansowany
  ["Trenuj 3 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(3, 12)],
  ["Zrób 40 pompek pod rząd", undefined, prog("pompki", 40)],
  ["Zrób 12 podciągnięć pod rząd", undefined, prog("podciaganie", 12)],
  ["Zrób pierwszego muscle-upa na drążku", "Połączenie podciągnięcia i dipa — kamień milowy.", prog("podciaganie", 15)],
  ["Utrzymaj stanie na rękach bez ściany przez 10 sekund", undefined, prog("handstand", 3)],
  ["Zrób 25 dipów pod rząd", undefined, prog("dipy", 25)],
  ["Wykonaj australijski front lever (tuck front lever) 10 s", undefined, prog("lever", 1)],
  ["Zrób 50 pompek pod rząd", "Pięćdziesiątka!", prog("pompki", 50)],
  ["Zrób 15 podciągnięć pod rząd", undefined, prog("podciaganie", 18)],
  ["Utrzymaj L-sit przez 30 sekund", undefined, prog("core", 8)],
  ["Zrób 5 pompek w staniu na rękach przy ścianie (HSPU)", undefined, prog("handstand", 5)],
  ["Wykonaj advanced tuck front lever 10 s", undefined, prog("lever", 2)],
  ["Zrób 30 dipów pod rząd", undefined, prog("dipy", 30)],
  ["Zrób 20 podciągnięć pod rząd", undefined, prog("podciaganie", 20)],
  ["Utrzymaj stanie na rękach bez ściany przez 30 sekund", undefined, prog("handstand", 8)],
  ["Wykonaj tuck planche 5 s", undefined, prog("planche", 1)],
  ["Zrób 3 muscle-upy pod rząd", undefined, prog("podciaganie", 22)],
  ["Wykonaj pełny front lever (jedna noga) 5 s", undefined, prog("lever", 3)],
  ["Zrób 60 pompek pod rząd", undefined, prog("pompki", 60)],
  ["Zrób 10 pistol squatów na każdą nogę", undefined, prog("nogi", 40)],
  // 46-65 · Zaawansowany
  ["Trenuj 4+ razy w tygodniu przez cały sezon"],
  ["Zrób 25 podciągnięć pod rząd", undefined, prog("podciaganie", 25)],
  ["Wykonaj advanced tuck planche 5 s", undefined, prog("planche", 2)],
  ["Wykonaj pełny front lever 5 s", "Element flagowy kalisteniki.", prog("lever", 4)],
  ["Zrób 8 HSPU pod rząd (przy ścianie)", undefined, prog("handstand", 12)],
  ["Zrób 40 dipów pod rząd", undefined, prog("dipy", 40)],
  ["Wykonaj straddle planche 3 s", undefined, prog("planche", 3)],
  ["Zrób 5 muscle-upów pod rząd", undefined, prog("podciaganie", 28)],
  ["Utrzymaj wolne stanie na rękach przez 60 sekund", undefined, prog("handstand", 15)],
  ["Wykonaj back lever 10 s", undefined, prog("lever", 5)],
  ["Zrób 30 podciągnięć pod rząd", undefined, prog("podciaganie", 30)],
  ["Wykonaj pełną planche (tuck→straddle) 5 s", undefined, prog("planche", 4)],
  ["Zrób pierwsze podciągnięcie jednorącz (assisted → wolne)", undefined, prog("podciaganie", 35)],
  ["Wykonaj front lever raises (5 powtórzeń)", undefined, prog("lever", 6)],
  ["Zrób 10 HSPU pod rząd", undefined, prog("handstand", 18)],
  ["Wykonaj human flag (flaga) 5 s", "Ikoniczny element siły bocznej.", prog("core", 12)],
  ["Zrób 8 muscle-upów pod rząd", undefined, prog("podciaganie", 38)],
  ["Wykonaj full planche 5 s", undefined, prog("planche", 5)],
  ["Zrób 15 pistol squatów na każdą nogę", undefined, prog("nogi", 50)],
  ["Wykonaj front lever przez 15 s", undefined, prog("lever", 7)],
  // 66-85 · Wyczynowy
  ["Zrób 35 podciągnięć pod rząd", undefined, prog("podciaganie", 40)],
  ["Wykonaj planche push-up (1 powtórzenie)", undefined, prog("planche", 6)],
  ["Utrzymaj full planche 10 s", undefined, prog("planche", 7)],
  ["Zrób pierwsze pełne podciągnięcie jednorącz (one-arm pull-up)", "Bardzo rzadka siła.", prog("podciaganie", 45)],
  ["Wykonaj front lever pull-ups (3 powtórzenia)", undefined, prog("lever", 8)],
  ["Utrzymaj human flag 15 s", undefined, prog("core", 16)],
  ["Zrób 15 HSPU wolnostojących (bez ściany)", undefined, prog("handstand", 22)],
  ["Wykonaj 3 planche push-ups", undefined, prog("planche", 8)],
  ["Zrób 12 muscle-upów pod rząd", undefined, prog("podciaganie", 48)],
  ["Wykonaj maltese (zaawansowana pozycja pchająca) — próba", undefined, prog("planche", 9)],
  ["Zrób 40 podciągnięć pod rząd", undefined, prog("podciaganie", 50)],
  ["Wykonaj front lever przez 30 s", undefined, prog("lever", 9)],
  ["Zrób 2 podciągnięcia jednorącz na każdą rękę", undefined, prog("podciaganie", 55)],
  ["Wykonaj 5 planche push-ups", undefined, prog("planche", 10)],
  ["Utrzymaj human flag 30 s", undefined, prog("core", 20)],
  ["Wykonaj one-arm handstand (próba, przy asyście)", undefined, prog("handstand", 28)],
  ["Zrób 15 muscle-upów pod rząd", undefined, prog("podciaganie", 60)],
  ["Wykonaj full planche 20 s", undefined, prog("planche", 11)],
  ["Wykonaj front lever touch (dotknięcie drążka w pełnym lever)", undefined, prog("lever", 10)],
  ["Zrób 20 pistol squatów z obciążeniem na każdą nogę", undefined, prog("nogi", 60)],
  // 86-99 · Elita
  ["Zrób 50 podciągnięć pod rząd", undefined, prog("podciaganie", 65)],
  ["Wykonaj maltese 3 s", "Element z pogranicza gimnastyki wyczynowej.", prog("planche", 12)],
  ["Wykonaj wolnostojące one-arm handstand 3 s", undefined, prog("handstand", 35)],
  ["Zrób 4 podciągnięcia jednorącz na każdą rękę", undefined, prog("podciaganie", 70)],
  ["Wykonaj planche na 90° push-ups (3 powtórzenia)", undefined, prog("planche", 13)],
  ["Wykonaj front lever przez 45 s", undefined, prog("lever", 11)],
  ["Utrzymaj human flag 45 s", undefined, prog("core", 24)],
  ["Wykonaj victorian cross lub inny element ekstremalny — próba", undefined, prog("planche", 14)],
  ["Zrób 20 muscle-upów pod rząd", undefined, prog("podciaganie", 75)],
  ["Wykonaj one-arm handstand push-up (próba)", undefined, prog("handstand", 40)],
  ["Wykonaj maltese 5 s", undefined, prog("planche", 15)],
  ["Wykonaj kombinację kluczowych elementów sygnaturowych (planche → lever → flag)"],
  ["Wystąp w zawodach kalisteniki (freestyle/streetlifting) rangi krajowej"],
  ["Poziom mistrzowski: pełen zestaw kluczowych elementów sygnaturowych + tytuł zawodów", "Planche, front lever, maltese, one-arm — szczyt kalisteniki."],
]);

// ---------------------------------------------------------------------------
// Learning resources. Every URL fetched before it was written here.
//
// Calisthenics has no federation and no official grading, which is worth knowing before
// trusting anybody's "levels". What it does have are two de-facto ladders, both linked:
// Hybrid Calisthenics (progressions from a wall push-up upward, free) and Overcoming
// Gravity, whose 16 levels are built on the FIG gymnastics element values — the closest
// thing to an objective difficulty scale the discipline has.
import type { MilestoneResource } from "../../src/lib/milestone-resources";

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [{ kind: "article", title: "Hybrid Calisthenics — progresje od ściany do pełnej pompki", url: "https://www.hybridcalisthenics.com/routine" }],
  6: [{ kind: "article", title: "Podciąganie poziome — pierwszy krok do drążka", url: "https://www.hybridcalisthenics.com/horizontal-pullups" }],
  10: [
    { kind: "video", title: "Od zera do dziesięciu podciągnięć", url: yt("Hyrk8sSHTkk") },
    { kind: "article", title: "Progresje podciągania (Hybrid Calisthenics)", url: "https://www.hybridcalisthenics.com/pullups" },
  ],
  40: [{ kind: "reference", title: "Overcoming Gravity — 16 poziomów trudności elementów", url: "https://stevenlow.org/overcoming-gravity/" }],
  60: [{ kind: "reference", title: "The Fitness Wiki — planowanie treningu i progresji", url: "https://thefitness.wiki/" }],
};
