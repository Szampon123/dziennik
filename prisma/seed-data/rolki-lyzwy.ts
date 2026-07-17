// Inline/ice skating ladder 1-99. Benchmarks: recreational cruising 10-15 km/h;
// fit skater 18-22 km/h; inline marathon (42 km) finishers average ~1:40-2:00;
// elite marathon skaters < 1:10 (~36 km/h).
import type { Criterion } from "../../src/lib/milestone-criteria";
import type { MilestoneResource } from "../../src/lib/milestone-resources";
import { ladder, d, t, tfd, weekly, monthly, total, freq, anyOf, prog } from "./helpers";

export const activity = {
  slug: "rolki-lyzwy",
  name: "Rolki i łyżwy",
  icon: "🛼",
  description:
    "Jazda na rolkach lub łyżwach — od pierwszych metrów bez trzymanki po maraton rolkarski. Przejazdy loguj w km.",
  sortOrder: 17,
  logKind: "distance" as const,
};

export const milestones = ladder([
  // 1-10 · Pierwsze kroki
  ["Przejedź na rolkach 100 m bez podparcia", "Pierwsze samodzielne metry — równowaga ponad wszystko."],
  ["Zatrzymaj się kontrolowanie (hamulec lub pług)", "Bez łapania barierki i bez trawnika awaryjnego."],
  ["Przejedź na rolkach 500 m bez przerwy"],
  ["Przejedź na rolkach 1 km bez przerwy"],
  ["Skręć płynnie w obie strony"],
  ["Przejedź na rolkach 2 km bez przerwy"],
  ["Jedź 15 minut bez przerwy"],
  ["Przejedź na rolkach 3 km bez przerwy"],
  ["Przejedź na rolkach przez łagodny zjazd bez hamowania panicznego"],
  ["Przejedź na rolkach 5 km bez przerwy", "Pierwsza piątka na kółkach/ostrzach."],
  // 11-25 · Regularny
  ["Trenuj raz w tygodniu przez 4 kolejne tygodnie"],
  ["Przejedź na rolkach 6 km bez przerwy"],
  ["Jedź 30 minut bez przerwy"],
  ["Przejedź na rolkach 8 km bez przerwy"],
  ["Przejedź na rolkach 5 km poniżej 25 minut", "Średnia 12 km/h."],
  ["Przejedź na rolkach 15 km łącznie w jednym tygodniu"],
  ["Przejedź na rolkach 10 km bez przerwy"],
  ["Opanuj jazdę tyłem na krótkim odcinku"],
  ["Przejedź na rolkach łącznie 50 km"],
  ["Przejedź na rolkach 5 km poniżej 20 minut", "Średnia 15 km/h."],
  ["Przejedź na rolkach 12 km bez przerwy"],
  ["Jedź pełną godzinę bez przerwy"],
  ["Przejedź na rolkach 20 km łącznie w jednym tygodniu"],
  ["Przejedź na rolkach 10 km poniżej 40 minut"],
  ["Przejedź na rolkach 15 km bez przerwy"],
  // 26-45 · Średniozaawansowany
  ["Trenuj 2 razy w tygodniu przez 12 kolejnych tygodni"],
  ["Opanuj hamowanie T-stop lub półpług na prędkości"],
  ["Przejedź na rolkach 18 km bez przerwy"],
  ["Przejedź na rolkach 5 km poniżej 18 minut"],
  ["Przejedź na rolkach 30 km łącznie w jednym tygodniu"],
  ["Przejedź na rolkach 20 km bez przerwy", "Dłuższa trasa rekreacyjna."],
  ["Przejedź na rolkach łącznie 200 km"],
  ["Przejedź na rolkach 10 km poniżej 35 minut"],
  ["Opanuj przekładankę przodem w obu kierunkach", "Podstawa płynnej jazdy po łukach."],
  ["Przejedź na rolkach 60 km łącznie w jednym miesiącu"],
  ["Przejedź na rolkach 25 km bez przerwy"],
  ["Przejedź na rolkach 5 km poniżej 16 minut"],
  ["Przejedź na rolkach 10 km poniżej 32 minut"],
  ["Przejedź na rolkach 40 km łącznie w jednym tygodniu"],
  ["Przejedź na rolkach 30 km bez przerwy"],
  ["Przejedź na rolkach łącznie 500 km"],
  ["Przejedź na rolkach 10 km poniżej 30 minut", "Średnia 20 km/h — poziom sprawnego rolkarza."],
  ["Przejedź na rolkach 100 km łącznie w jednym miesiącu"],
  ["Przejedź na rolkach 35 km bez przerwy"],
  ["Przejedź na rolkach 5 km poniżej 14 minut"],
  // 46-65 · Zaawansowany
  ["Przejedź na rolkach 40 km bez przerwy"],
  ["Przejedź na rolkach 10 km poniżej 28 minut"],
  ["Weź udział w przejeździe zbiorowym (nightskating) lub zawodach", "Jazda w grupie to osobna umiejętność."],
  ["Przejedź na rolkach 50 km łącznie w jednym tygodniu"],
  ["Przejedź na rolkach 20 km poniżej 60 minut", "Średnia 20 km/h przez godzinę."],
  ["Przejedź na rolkach 45 km bez przerwy"],
  ["Przejedź na rolkach łącznie 1000 km"],
  ["Przejedź na rolkach 10 km poniżej 26 minut"],
  ["Opanuj jazdę w niskiej pozycji łyżwiarskiej przez 5 minut"],
  ["Przejedź na rolkach 150 km łącznie w jednym miesiącu"],
  ["Przejedź na rolkach 50 km bez przerwy"],
  ["Przejedź na rolkach 5 km poniżej 12:30", "Średnia 24 km/h."],
  ["Przejedź na rolkach 60 km łącznie w jednym tygodniu"],
  ["Przejedź na rolkach 20 km poniżej 55 minut"],
  ["Przejedź na rolkach 55 km bez przerwy"],
  ["Przejedź na rolkach 10 km poniżej 24 minut", "Średnia 25 km/h."],
  ["Przejedź na rolkach łącznie 2000 km"],
  ["Przejedź na rolkach 60 km bez przerwy"],
  ["Przejedź na rolkach 200 km łącznie w jednym miesiącu"],
  ["Przejedź na rolkach 42,2 km (dystans maratonu) bez przerwy", "Maraton rolkarski — dowolny czas."],
  // 66-85 · Wyczynowy
  ["Przejedź na rolkach 10 km poniżej 22 minut"],
  ["Przejedź na rolkach 70 km łącznie w jednym tygodniu"],
  ["Przejedź na rolkach 20 km poniżej 50 minut"],
  ["Przejedź na rolkach 70 km bez przerwy"],
  ["Przejedź na rolkach 5 km poniżej 11 minut"],
  ["Przejedź na rolkach łącznie 3000 km"],
  ["Przejedź na rolkach maraton (42,2 km) poniżej 2:00", "Średnia powyżej 21 km/h."],
  ["Przejedź na rolkach 250 km łącznie w jednym miesiącu"],
  ["Przejedź na rolkach 10 km poniżej 21 minut"],
  ["Przejedź na rolkach 80 km bez przerwy"],
  ["Przejedź na rolkach 20 km poniżej 46 minut"],
  ["Przejedź na rolkach 80 km łącznie w jednym tygodniu"],
  ["Przejedź na rolkach 10 km poniżej 20 minut", "Średnia 30 km/h — tempo wyścigowe."],
  ["Przejedź na rolkach maraton poniżej 1:50"],
  ["Przejedź na rolkach łącznie 5000 km"],
  ["Przejedź na rolkach 90 km bez przerwy"],
  ["Przejedź na rolkach 20 km poniżej 42 minut"],
  ["Przejedź na rolkach 300 km łącznie w jednym miesiącu"],
  ["Przejedź na rolkach maraton poniżej 1:40"],
  ["Przejedź na rolkach 100 km bez przerwy", "Setka na kółkach."],
  // 86-99 · Elita
  ["Przejedź na rolkach 10 km poniżej 19 minut"],
  ["Przejedź na rolkach 100 km łącznie w jednym tygodniu"],
  ["Przejedź na rolkach maraton poniżej 1:35"],
  ["Przejedź na rolkach 20 km poniżej 38 minut"],
  ["Przejedź na rolkach 10 km poniżej 18 minut"],
  ["Przejedź na rolkach łącznie 10 000 km"],
  ["Przejedź na rolkach maraton poniżej 1:28"],
  ["Przejedź na rolkach 400 km łącznie w jednym miesiącu"],
  ["Przejedź na rolkach 10 km poniżej 17 minut", "Średnia ~35 km/h."],
  ["Przejedź na rolkach 20 km poniżej 35 minut"],
  ["Przejedź na rolkach maraton poniżej 1:22"],
  ["Przejedź na rolkach 120 km bez przerwy"],
  ["Przejedź na rolkach 10 km poniżej 16 minut"],
  ["Poziom mistrzowski (amatorski szczyt): maraton poniżej 1:15 lub 10 km poniżej 15 minut", "Dojrzały, wieloletni warsztat rolkarski. Dalsze, zawodowe osiągnięcia potwierdzają osobne certyfikaty."],
]);

export const criteriaByLevel: Record<number, Criterion> = {
  1: d(0.1), 3: d(0.5), 4: d(1), 6: d(2), 7: t(15), 8: d(3), 10: d(5),
  2: prog("technika", 1), 5: prog("technika", 2), 9: prog("technika", 3),
  11: freq(1, 4), 12: d(6), 13: t(30), 14: d(8), 15: tfd(5, 25),
  16: weekly(15), 17: d(10), 18: prog("technika", 4), 19: total(50), 20: tfd(5, 20),
  21: d(12), 22: t(60), 23: weekly(20), 24: tfd(10, 40), 25: d(15),
  26: freq(2, 12), 27: prog("technika", 5), 28: d(18), 29: tfd(5, 18), 30: weekly(30),
  31: d(20), 32: total(200), 33: tfd(10, 35), 34: prog("technika", 6), 35: monthly(60),
  36: d(25), 37: tfd(5, 16), 38: tfd(10, 32), 39: weekly(40), 40: d(30),
  41: total(500), 42: tfd(10, 30), 43: monthly(100), 44: d(35), 45: tfd(5, 14),
  46: d(40), 47: tfd(10, 28), 49: weekly(50), 50: tfd(20, 60),
  51: d(45), 52: total(1000), 53: tfd(10, 26), 54: prog("technika", 7), 55: monthly(150),
  56: d(50), 57: tfd(5, 12.5), 58: weekly(60), 59: tfd(20, 55), 60: d(55),
  61: tfd(10, 24), 62: total(2000), 63: d(60), 64: monthly(200), 65: d(42.2),
  66: tfd(10, 22), 67: weekly(70), 68: tfd(20, 50), 69: d(70), 70: tfd(5, 11),
  71: total(3000), 72: tfd(42.2, 120), 73: monthly(250), 74: tfd(10, 21), 75: d(80),
  76: tfd(20, 46), 77: weekly(80), 78: tfd(10, 20), 79: tfd(42.2, 110), 80: total(5000),
  81: d(90), 82: tfd(20, 42), 83: monthly(300), 84: tfd(42.2, 100), 85: d(100),
  86: tfd(10, 19), 87: weekly(100), 88: tfd(42.2, 95), 89: tfd(20, 38), 90: tfd(10, 18),
  91: total(10000), 92: tfd(42.2, 88), 93: monthly(400), 94: tfd(10, 17), 95: tfd(20, 35),
  96: tfd(42.2, 82), 97: d(120), 98: tfd(10, 16),
  99: anyOf(tfd(42.2, 75), tfd(10, 15)),
  // 48 — udział w przejeździe/zawodach: manual (zawody rolkarskie loguj flagą przy treningu, gdy jeździsz dystans).
};

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "video", title: "Skatefresh — How to Inline Skate for Beginners", url: yt("dPvwaRBtSXk") },
  ],
  2: [
    { kind: "video", title: "How to Stop on Inline Skates — 3 Easy Methods", url: yt("rFMhRhRRsNU") },
  ],
  10: [
    { kind: "video", title: "Dirty Deb — Beginner Roller Skating Tips", url: yt("RlwEstnHFhQ") },
  ],
  18: [
    { kind: "video", title: "How to Skate Backwards on Inline Skates", url: yt("OPvG0Ld_xJc") },
  ],
  27: [
    { kind: "video", title: "How to T-Stop on Rollerblades", url: yt("EpfH6-vfNZI") },
  ],
  34: [
    { kind: "video", title: "Crossover Tutorial — Inline Skating Technique", url: yt("mJFPZZGa1rk") },
  ],
  48: [
    { kind: "article", title: "Inline Skating Training Plan for Marathon", url: "https://www.verywellfit.com/inline-skating-workout-tips-1230916" },
  ],
  54: [
    { kind: "video", title: "Skatefresh — Advanced Skating Speed Technique", url: yt("Z2wqb89RTOA") },
  ],
  65: [
    { kind: "article", title: "How to Prepare for an Inline Skating Marathon", url: "https://www.wikihow.com/Improve-Inline-Skating" },
  ],
  72: [
    { kind: "reference", title: "World Skate Rankings — Inline Speed Skating", url: "https://www.worldskate.org/speed-skating/rankings.html" },
  ],
};
