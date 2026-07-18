// Walking ladder 1-99. Benchmarks: comfortable walk ~5 km/h; brisk walk
// 6-6,5 km/h; power walking 7-8 km/h; race walking (sport) 10+ km/h.
// Long-distance landmarks: 20 km day hike, marathon-distance walk (42 km),
// 100 km ultra walks (e.g. Mammut/Oxfam) as the extreme end.
import type { Criterion } from "../../src/lib/milestone-criteria";
import { ladder, d, t, tfd, weekly, monthly, total, freq, anyOf } from "./helpers";

export const activity = {
  slug: "chodzenie",
  name: "Chodzenie",
  icon: "🚶",
  description:
    "Od pierwszego spaceru po ultramarsze. Najbardziej dostępny sport świata — liczy się marsz ciągły.",
  sortOrder: 2,
  logKind: "distance" as const,
};

export const milestones = ladder([
  // 1-10 · Pierwsze kroki
  ["Przejdź 1 km bez przerwy", "Zwykły spacer — od czegoś trzeba zacząć."],
  ["Przejdź 2 km bez przerwy"],
  ["Maszeruj 30 minut bez przerwy"],
  ["Przejdź 3 km bez przerwy"],
  ["Maszeruj 45 minut bez przerwy"],
  ["Przejdź 4 km bez przerwy"],
  ["Maszeruj pełną godzinę bez przerwy"],
  ["Przejdź 5 km bez przerwy", "Klasyczny dystans zdrowotnego spaceru."],
  ["Przejdź 6 km bez przerwy"],
  ["Przejdź 7 km bez przerwy"],
  // 11-25 · Regularny
  ["Spaceruj 3 razy w tygodniu przez 4 kolejne tygodnie"],
  ["Przejdź 8 km bez przerwy"],
  ["Przejdź 5 km poniżej 50 minut", "Tempo 6 km/h — szybki marsz."],
  ["Spaceruj 5 razy w tygodniu przez 4 kolejne tygodnie", "Niemal codzienny ruch — nawyk zdrowotny numer jeden."],
  ["Przejdź 10 km bez przerwy", "Pierwsza piesza dyszka."],
  ["Przejdź 20 km łącznie w jednym tygodniu"],
  ["Przejdź 12 km bez przerwy"],
  ["Przejdź 5 km poniżej 45 minut"],
  ["Przejdź 14 km bez przerwy"],
  ["Przejdź łącznie 100 km"],
  ["Przejdź 30 km łącznie w jednym tygodniu"],
  ["Przejdź 15 km bez przerwy"],
  ["Przejdź 10 km poniżej 1:40"],
  ["Przejdź 120 km łącznie w jednym miesiącu"],
  ["Przejdź 16 km bez przerwy"],
  // 26-45 · Średniozaawansowany
  ["Spaceruj 5 razy w tygodniu przez 12 kolejnych tygodni"],
  ["Przejdź 18 km bez przerwy"],
  ["Przejdź 5 km poniżej 42 minut"],
  ["Przejdź 40 km łącznie w jednym tygodniu"],
  ["Przejdź 20 km bez przerwy", "Całodniowa wycieczka piesza."],
  ["Przejdź 10 km poniżej 1:35"],
  ["Przejdź 22 km bez przerwy"],
  ["Przejdź łącznie 300 km"],
  ["Przejdź 160 km łącznie w jednym miesiącu"],
  ["Przejdź 24 km bez przerwy"],
  ["Przejdź 5 km poniżej 40 minut", "Tempo 7,5 km/h — power walking."],
  ["Przejdź 25 km bez przerwy"],
  ["Przejdź 50 km łącznie w jednym tygodniu"],
  ["Przejdź 10 km poniżej 1:30"],
  ["Przejdź 27 km bez przerwy"],
  ["Przejdź łącznie 500 km"],
  ["Przejdź 28 km bez przerwy"],
  ["Przejdź 200 km łącznie w jednym miesiącu"],
  ["Przejdź 5 km poniżej 38 minut"],
  ["Przejdź 30 km bez przerwy", "Dystans pielgrzymkowego etapu."],
  // 46-65 · Zaawansowany
  ["Przejdź 32 km bez przerwy"],
  ["Przejdź 10 km poniżej 1:25"],
  ["Przejdź 35 km bez przerwy"],
  ["Przejdź 60 km łącznie w jednym tygodniu"],
  ["Przejdź 5 km poniżej 36 minut"],
  ["Przejdź 38 km bez przerwy"],
  ["Przejdź łącznie 1000 km"],
  ["Przejdź 40 km bez przerwy"],
  ["Przejdź 10 km poniżej 1:20", "Tempo 7,5 km/h przez dyszkę."],
  ["Przejdź 250 km łącznie w jednym miesiącu"],
  ["Przejdź 42 km bez przerwy", "Dystans maratonu — pieszo!"],
  ["Przejdź 5 km poniżej 35 minut"],
  ["Przejdź 44 km bez przerwy"],
  ["Przejdź 70 km łącznie w jednym tygodniu"],
  ["Przejdź 46 km bez przerwy"],
  ["Przejdź 10 km poniżej 1:15", "Tempo 8 km/h."],
  ["Przejdź 48 km bez przerwy"],
  ["Przejdź łącznie 2000 km"],
  ["Przejdź 300 km łącznie w jednym miesiącu"],
  ["Przejdź 50 km bez przerwy", "Pół setki jednym marszem."],
  // 66-85 · Wyczynowy
  ["Przejdź 10 km poniżej 1:12"],
  ["Przejdź 80 km łącznie w jednym tygodniu"],
  ["Przejdź 55 km bez przerwy"],
  ["Przejdź 5 km poniżej 33 minut"],
  ["Przejdź 60 km bez przerwy"],
  ["Przejdź łącznie 3000 km"],
  ["Przejdź 10 km poniżej 1:10", "Tempo 8,6 km/h — pogranicze chodu sportowego."],
  ["Przejdź 350 km łącznie w jednym miesiącu"],
  ["Przejdź 65 km bez przerwy"],
  ["Przejdź 5 km poniżej 32 minut"],
  ["Przejdź 70 km bez przerwy"],
  ["Przejdź 100 km łącznie w jednym tygodniu"],
  ["Przejdź 10 km poniżej 1:08"],
  ["Przejdź 75 km bez przerwy"],
  ["Przejdź łącznie 5000 km"],
  ["Przejdź 80 km bez przerwy"],
  ["Przejdź 10 km poniżej 1:05"],
  ["Przejdź 400 km łącznie w jednym miesiącu"],
  ["Przejdź 85 km bez przerwy"],
  ["Przejdź 90 km bez przerwy"],
  // 86-99 · Elita
  ["Przejdź 5 km poniżej 30 minut", "Tempo 10 km/h — to już technika chodu sportowego."],
  ["Przejdź 95 km bez przerwy"],
  ["Przejdź 10 km poniżej 1:02"],
  ["Przejdź 100 km bez przerwy", "Setka pieszo — poziom ultramarszów typu Mammut."],
  ["Przejdź 120 km łącznie w jednym tygodniu"],
  ["Przejdź 10 km poniżej 60 minut", "Dycha chodem w godzinę."],
  ["Przejdź 110 km bez przerwy"],
  ["Przejdź łącznie 10 000 km"],
  ["Przejdź 120 km bez przerwy"],
  ["Przejdź 10 km poniżej 58 minut"],
  ["Przejdź 500 km łącznie w jednym miesiącu"],
  ["Przejdź 130 km bez przerwy"],
  ["Przejdź 10 km poniżej 55 minut"],
  ["Poziom ekstremalny: 150 km jednym marszem lub 10 km chodem poniżej 52 minut", "Chodziarze mistrzowscy łamią 39 minut na 10 km; 150 km to czołówka ultramarszów 24-godzinnych."],
]);

export const criteriaByLevel: Record<number, Criterion> = {
  1: d(1), 2: d(2), 3: t(30), 4: d(3), 5: t(45),
  6: d(4), 7: t(60), 8: d(5), 9: d(6), 10: d(7),
  11: freq(3, 4), 12: d(8), 13: tfd(5, 50), 14: freq(5, 4), 15: d(10),
  16: weekly(20), 17: d(12), 18: tfd(5, 45), 19: d(14), 20: total(100),
  21: weekly(30), 22: d(15), 23: tfd(10, 100), 24: monthly(120), 25: d(16),
  26: freq(5, 12), 27: d(18), 28: tfd(5, 42), 29: weekly(40), 30: d(20),
  31: tfd(10, 95), 32: d(22), 33: total(300), 34: monthly(160), 35: d(24),
  36: tfd(5, 40), 37: d(25), 38: weekly(50), 39: tfd(10, 90), 40: d(27),
  41: total(500), 42: d(28), 43: monthly(200), 44: tfd(5, 38), 45: d(30),
  46: d(32), 47: tfd(10, 85), 48: d(35), 49: weekly(60), 50: tfd(5, 36),
  51: d(38), 52: total(1000), 53: d(40), 54: tfd(10, 80), 55: monthly(250),
  56: d(42), 57: tfd(5, 35), 58: d(44), 59: weekly(70), 60: d(46),
  61: tfd(10, 75), 62: d(48), 63: total(2000), 64: monthly(300), 65: d(50),
  66: tfd(10, 72), 67: weekly(80), 68: d(55), 69: tfd(5, 33), 70: d(60),
  71: total(3000), 72: tfd(10, 70), 73: monthly(350), 74: d(65), 75: tfd(5, 32),
  76: d(70), 77: weekly(100), 78: tfd(10, 68), 79: d(75), 80: total(5000),
  81: d(80), 82: tfd(10, 65), 83: monthly(400), 84: d(85), 85: d(90),
  86: tfd(5, 30), 87: d(95), 88: tfd(10, 62), 89: d(100), 90: weekly(120),
  91: tfd(10, 60), 92: d(110), 93: total(10000), 94: d(120), 95: tfd(10, 58),
  96: monthly(500), 97: d(130), 98: tfd(10, 55),
  99: anyOf(d(150), tfd(10, 52)),
};

// ---------------------------------------------------------------------------
// Learning resources. Every URL fetched before it was written here.
//
// A caution worth leaving in the file: two of the three PubMed ids I looked up via
// NCBI's search API came back as the WRONG PAPER — live links, real titles, not the
// studies I asked for. A URL that resolves is not the same as the right source, and
// the only thing that catches that is reading the title it returns. Both are gone.
// What is left is the meta-analysis (Paluch 2022, 15 cohorts, 47,471 adults) and the
// NHANES step-count paper, each described as what it actually is.
//
// The step targets in this ladder are distance, not steps, so these are context rather
// than criteria. Note also that "10,000 steps" is 1965 pedometer marketing, not a
// finding — the mortality curve flattens between 6,000 and 8,000. Nothing here says
// otherwise.
import type { MilestoneResource } from "../../src/lib/milestone-resources";

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "article", title: "NHS: chodzenie dla zdrowia — od czego zacząć", url: "https://www.nhs.uk/live-well/exercise/walking-for-health/" },
    { kind: "video", title: "Technika marszu — postawa i krok", url: yt("wRkeBVMQSgg") },
  ],
  5: [{ kind: "article", title: "Jak zacząć regularnie chodzić — plan 4-tygodniowy", url: "https://www.verywellfit.com/how-to-start-walking-3436605" }],
  10: [{ kind: "video", title: "Nordic walking — technika od podstaw", url: yt("zAmsHhc2zCw") }],
  15: [{ kind: "video", title: "Dobór butów do marszów", url: yt("aqShBKWrNGQ") }],
  20: [{ kind: "video", title: "Nordic walking w czterech krokach", url: yt("oHksVVU6A_s") }],
  30: [{ kind: "video", title: "Nordic walking — wprowadzenie i technika", url: yt("ZKTufkzpo8E") }],
  40: [{ kind: "article", title: "Power walking — technika szybkiego marszu", url: "https://www.verywellfit.com/how-to-walk-faster-3436345" }],
  45: [{ kind: "reference", title: "Ile kroków dziennie ma sens — metaanaliza 15 kohort (47 471 osób)", url: "https://pubmed.ncbi.nlm.nih.gov/35247352/" }],
  55: [{ kind: "article", title: "Przygotowanie do marszu 50 km", url: "https://www.verywellfit.com/training-for-a-50k-walk-3435186" }],
  60: [{ kind: "reference", title: "Ile kroków robią naprawdę dorośli — dane NHANES", url: "https://pubmed.ncbi.nlm.nih.gov/42002910/" }],
  70: [{ kind: "article", title: "Jak chodzić na 100 km — marsz ultra", url: "https://www.verywellfit.com/walking-a-100k-ultramarathon-3435482" }],
  80: [{ kind: "reference", title: "Marsz Czterodniowy w Nijmegen — dystanse i wymagania", url: "https://www.4daagse.nl/en/participate/civilian/distances" }],
};
