// Indoor rowing (erg) ladder 1-99. Benchmarks (Concept2 rankings): novice 2k
// ~9:00+, trained amateur ~7:30, club ~7:00, competitive ~6:30, elite < 6:00
// (WR 5:35). Distances logged in km (500 m = 0,5).
import type { Criterion } from "../../src/lib/milestone-criteria";
import { ladder, d, t, tfd, weekly, monthly, total, freq } from "./helpers";

export const activity = {
  slug: "wioslarstwo",
  name: "Wioślarstwo (ergometr)",
  icon: "🚣",
  description:
    "Drabinka ergometru wioślarskiego — od pierwszych 500 m po czasy z rankingów Concept2. Dystanse wpisuj w km (500 m = 0,5).",
  sortOrder: 19,
  logKind: "distance" as const,
};

export const milestones = ladder([
  // 1-10 · Pierwsze kroki
  ["Przewiosłuj 500 m bez przerwy", "Poznaj sekwencję: nogi → tułów → ręce."],
  ["Przewiosłuj 1000 m bez przerwy"],
  ["Wiosłuj 5 minut bez przerwy"],
  ["Przewiosłuj 1500 m bez przerwy"],
  ["Wiosłuj 10 minut bez przerwy"],
  ["Przewiosłuj 2000 m bez przerwy", "Dystans olimpijski — na razie bez patrzenia na zegar."],
  ["Wiosłuj 15 minut bez przerwy"],
  ["Przewiosłuj 2500 m bez przerwy"],
  ["Wiosłuj 20 minut bez przerwy"],
  ["Przewiosłuj 3000 m bez przerwy"],
  // 11-25 · Regularny
  ["Wiosłuj 2 razy w tygodniu przez 4 kolejne tygodnie"],
  ["Przewiosłuj 2000 m poniżej 10:00", "Średnio 2:30/500 m."],
  ["Przewiosłuj 4000 m bez przerwy"],
  ["Przewiosłuj 500 m poniżej 2:10"],
  ["Przewiosłuj 5000 m bez przerwy"],
  ["Przewiosłuj 10 km łącznie w jednym tygodniu"],
  ["Przewiosłuj 2000 m poniżej 9:30"],
  ["Przewiosłuj 6000 m bez przerwy"],
  ["Przewiosłuj łącznie 50 km"],
  ["Przewiosłuj 500 m poniżej 2:00"],
  ["Wiosłuj 30 minut bez przerwy"],
  ["Przewiosłuj 2000 m poniżej 9:00"],
  ["Przewiosłuj 15 km łącznie w jednym tygodniu"],
  ["Przewiosłuj 8000 m bez przerwy"],
  ["Przewiosłuj 10 000 m bez przerwy", "Dycha na ergu — próba charakteru."],
  // 26-45 · Średniozaawansowany
  ["Wiosłuj 3 razy w tygodniu przez 12 kolejnych tygodni"],
  ["Przewiosłuj 2000 m poniżej 8:45"],
  ["Przewiosłuj 500 m poniżej 1:55"],
  ["Przewiosłuj 60 km łącznie w jednym miesiącu"],
  ["Przewiosłuj 12 km bez przerwy"],
  ["Przewiosłuj 2000 m poniżej 8:30", "Średnio 2:07/500 m."],
  ["Przewiosłuj 20 km łącznie w jednym tygodniu"],
  ["Przewiosłuj 5000 m poniżej 22:30"],
  ["Przewiosłuj łącznie 200 km"],
  ["Przewiosłuj 2000 m poniżej 8:15"],
  ["Wiosłuj 60 minut bez przerwy", "Pełna godzina pracy."],
  ["Przewiosłuj 15 km bez przerwy"],
  ["Przewiosłuj 500 m poniżej 1:50"],
  ["Przewiosłuj 2000 m poniżej 8:00", "Psychologiczna granica ósemki."],
  ["Przewiosłuj 25 km łącznie w jednym tygodniu"],
  ["Przewiosłuj 5000 m poniżej 21:00"],
  ["Przewiosłuj 100 km łącznie w jednym miesiącu"],
  ["Przewiosłuj 18 km bez przerwy"],
  ["Przewiosłuj 2000 m poniżej 7:50"],
  ["Przewiosłuj półmaraton na ergu (21 097 m)", "Klasyczny challenge Concept2."],
  // 46-65 · Zaawansowany
  ["Przewiosłuj 500 m poniżej 1:45"],
  ["Przewiosłuj 2000 m poniżej 7:40"],
  ["Przewiosłuj łącznie 500 km"],
  ["Przewiosłuj 30 km łącznie w jednym tygodniu"],
  ["Przewiosłuj 5000 m poniżej 20:00", "Równe 2:00/500 m przez 5 km."],
  ["Przewiosłuj 2000 m poniżej 7:30", "Solidny poziom wytrenowanego amatora."],
  ["Przewiosłuj 25 km bez przerwy"],
  ["Przewiosłuj 150 km łącznie w jednym miesiącu"],
  ["Przewiosłuj 500 m poniżej 1:42"],
  ["Przewiosłuj 2000 m poniżej 7:20"],
  ["Przewiosłuj 5000 m poniżej 19:00"],
  ["Przewiosłuj 40 km łącznie w jednym tygodniu"],
  ["Przewiosłuj 30 km bez przerwy"],
  ["Przewiosłuj łącznie 1000 km"],
  ["Przewiosłuj 2000 m poniżej 7:10"],
  ["Przewiosłuj 500 m poniżej 1:40"],
  ["Przewiosłuj 5000 m poniżej 18:30"],
  ["Przewiosłuj 200 km łącznie w jednym miesiącu"],
  ["Przewiosłuj 2000 m poniżej 7:00", "Siódemka pęka — poziom klubowy."],
  ["Przewiosłuj maraton na ergu (42 195 m)", "Elitarny klub maratończyków Concept2."],
  // 66-85 · Wyczynowy
  ["Przewiosłuj 500 m poniżej 1:38"],
  ["Przewiosłuj 2000 m poniżej 6:55"],
  ["Przewiosłuj 50 km łącznie w jednym tygodniu"],
  ["Przewiosłuj 5000 m poniżej 18:00"],
  ["Przewiosłuj 2000 m poniżej 6:50"],
  ["Przewiosłuj łącznie 2000 km"],
  ["Przewiosłuj 500 m poniżej 1:35"],
  ["Przewiosłuj 2000 m poniżej 6:45"],
  ["Przewiosłuj 250 km łącznie w jednym miesiącu"],
  ["Przewiosłuj 5000 m poniżej 17:30"],
  ["Przewiosłuj 2000 m poniżej 6:40"],
  ["Przewiosłuj 60 km łącznie w jednym tygodniu"],
  ["Przewiosłuj 500 m poniżej 1:33"],
  ["Przewiosłuj 2000 m poniżej 6:35"],
  ["Przewiosłuj 5000 m poniżej 17:00"],
  ["Przewiosłuj łącznie 3000 km"],
  ["Przewiosłuj 2000 m poniżej 6:30", "Czasy z czołówek rankingów amatorskich."],
  ["Przewiosłuj 300 km łącznie w jednym miesiącu"],
  ["Przewiosłuj 500 m poniżej 1:30"],
  ["Przewiosłuj 2000 m poniżej 6:25"],
  // 86-99 · Elita
  ["Przewiosłuj 5000 m poniżej 16:30"],
  ["Przewiosłuj 2000 m poniżej 6:20"],
  ["Przewiosłuj 80 km łącznie w jednym tygodniu"],
  ["Przewiosłuj 500 m poniżej 1:28"],
  ["Przewiosłuj 2000 m poniżej 6:15"],
  ["Przewiosłuj 5000 m poniżej 16:00"],
  ["Przewiosłuj łącznie 5000 km"],
  ["Przewiosłuj 2000 m poniżej 6:10"],
  ["Przewiosłuj 500 m poniżej 1:26"],
  ["Przewiosłuj 2000 m poniżej 6:05"],
  ["Przewiosłuj 5000 m poniżej 15:45"],
  ["Przewiosłuj 2000 m poniżej 6:00", "Sub-6 — mocna klubowa czołówka ergometru."],
  ["Przewiosłuj 500 m poniżej 1:24"],
  ["Poziom mistrzowski (amatorski szczyt): 2000 m poniżej 5:55", "Dojrzały, wieloletni warsztat wioślarski zaangażowanego amatora. Dalsze, zawodowe wyniki potwierdzają osobne certyfikaty."],
]);

export const criteriaByLevel: Record<number, Criterion> = {
  1: d(0.5), 2: d(1), 3: t(5), 4: d(1.5), 5: t(10),
  6: d(2), 7: t(15), 8: d(2.5), 9: t(20), 10: d(3),
  11: freq(2, 4), 12: tfd(2, 10), 13: d(4), 14: tfd(0.5, 2.1667), 15: d(5),
  16: weekly(10), 17: tfd(2, 9.5), 18: d(6), 19: total(50), 20: tfd(0.5, 2),
  21: t(30), 22: tfd(2, 9), 23: weekly(15), 24: d(8), 25: d(10),
  26: freq(3, 12), 27: tfd(2, 8.75), 28: tfd(0.5, 1.9167), 29: monthly(60), 30: d(12),
  31: tfd(2, 8.5), 32: weekly(20), 33: tfd(5, 22.5), 34: total(200), 35: tfd(2, 8.25),
  36: t(60), 37: d(15), 38: tfd(0.5, 1.8333), 39: tfd(2, 8), 40: weekly(25),
  41: tfd(5, 21), 42: monthly(100), 43: d(18), 44: tfd(2, 7.8333), 45: d(21.097),
  46: tfd(0.5, 1.75), 47: tfd(2, 7.6667), 48: total(500), 49: weekly(30), 50: tfd(5, 20),
  51: tfd(2, 7.5), 52: d(25), 53: monthly(150), 54: tfd(0.5, 1.7), 55: tfd(2, 7.3333),
  56: tfd(5, 19), 57: weekly(40), 58: d(30), 59: total(1000), 60: tfd(2, 7.1667),
  61: tfd(0.5, 1.6667), 62: tfd(5, 18.5), 63: monthly(200), 64: tfd(2, 7), 65: d(42.195),
  66: tfd(0.5, 1.6333), 67: tfd(2, 6.9167), 68: weekly(50), 69: tfd(5, 18), 70: tfd(2, 6.8333),
  71: total(2000), 72: tfd(0.5, 1.5833), 73: tfd(2, 6.75), 74: monthly(250), 75: tfd(5, 17.5),
  76: tfd(2, 6.6667), 77: weekly(60), 78: tfd(0.5, 1.55), 79: tfd(2, 6.5833), 80: tfd(5, 17),
  81: total(3000), 82: tfd(2, 6.5), 83: monthly(300), 84: tfd(0.5, 1.5), 85: tfd(2, 6.4167),
  86: tfd(5, 16.5), 87: tfd(2, 6.3333), 88: weekly(80), 89: tfd(0.5, 1.4667), 90: tfd(2, 6.25),
  91: tfd(5, 16), 92: total(5000), 93: tfd(2, 6.1667), 94: tfd(0.5, 1.4333), 95: tfd(2, 6.0833),
  96: tfd(5, 15.75), 97: tfd(2, 6), 98: tfd(0.5, 1.4),
  99: tfd(2, 5.9167),
};

// ---------------------------------------------------------------------------
// Learning resources. Every URL fetched before it was written here.
//
// Rowing is the one endurance sport in this app whose governing body publishes real
// percentiles: Concept2's logbook rankings print them (median male 2k ≈ 7:46 in 2024).
// They are self-selected — people rank a 2k when they are proud of it — so the link at
// L85 is context for a time, not a claim about the population.
import type { MilestoneResource } from "../../src/lib/milestone-resources";

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [{ kind: "reference", title: "Technika wiosłowania na ergu — oficjalny przewodnik Concept2", url: "https://www.concept2.com/training/rowing-technique" }],
  5: [{ kind: "video", title: "Trzy najczęstsze błędy techniczne i jak je naprawić", url: yt("PAHRAR9tXSA") }],
  10: [{ kind: "article", title: "Couch to Consistency — plan startowy Concept2", url: "https://www.concept2.com/training/plans/couch-to-consistency" }],
  20: [{ kind: "video", title: "Najczęstsze błędy na ergometrze (Concept2)", url: yt("ura2mFCdvVs") }],
  25: [{ kind: "article", title: "Beginner Pete Plan — 24 tygodnie do testu na 2 km", url: "https://thepeteplan.wordpress.com/beginner-training/" }],
  35: [{ kind: "video", title: "Pełna technika ruchu — film instruktażowy Concept2", url: yt("QPvYrfyGHi8") }],
  45: [{ kind: "article", title: "Jak poprawiać technikę — materiały Concept2", url: "https://www.concept2.com/training/improve-your-rowing-technique" }],
  65: [{ kind: "reference", title: "Million Meter Club — dożywotni licznik metrów", url: "https://www.concept2.com/community/million-meter-club" }],
  85: [{ kind: "reference", title: "Rankingi Concept2 — percentyle czasów na 2 km", url: "https://log.concept2.com/rankings" }],
};
