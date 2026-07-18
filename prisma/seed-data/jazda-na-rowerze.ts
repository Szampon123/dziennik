// Cycling ladder 1-99. Benchmarks: recreational avg ~15-20 km/h; trained
// amateur 25-28 km/h; club rider 30-32 km/h; "evergreen" goal = 40 km/h over
// a 40 km TT; brevets 200-600 km; a century (160 km) is the classic long goal.
import type { Criterion } from "../../src/lib/milestone-criteria";
import { ladder, d, t, tfd, weekly, monthly, total, freq, anyOf } from "./helpers";

export const activity = {
  slug: "jazda-na-rowerze",
  name: "Jazda na rowerze",
  icon: "🚴",
  description:
    "Od pierwszych kilometrów po brevety i czasówki w tempie zawodowym. Liczy się jazda ciągła (szosa, gravel, MTB, trenażer).",
  sortOrder: 3,
  logKind: "distance" as const,
};

export const milestones = ladder([
  // 1-10 · Pierwsze kroki
  ["Przejedź 2 km bez przerwy", "Dowolne tempo, dowolny rower."],
  ["Przejedź 5 km bez przerwy"],
  ["Przejedź 8 km bez przerwy"],
  ["Przejedź 10 km bez przerwy", "Pierwsza „dyszka” w siodle."],
  ["Jedź 30 minut bez schodzenia z roweru"],
  ["Przejedź 15 km bez przerwy"],
  ["Jedź 45 minut bez schodzenia z roweru"],
  ["Przejedź 20 km bez przerwy"],
  ["Jedź pełną godzinę bez schodzenia z roweru"],
  ["Przejedź 25 km bez przerwy"],
  // 11-25 · Regularny
  ["Jeźdź raz w tygodniu przez 4 kolejne tygodnie"],
  ["Przejedź 30 km bez przerwy"],
  ["Przejedź 20 km ze średnią 20 km/h", "Czas poniżej godziny."],
  ["Jeźdź 2 razy w tygodniu przez 4 kolejne tygodnie"],
  ["Przejedź 35 km bez przerwy"],
  ["Przejedź 50 km łącznie w jednym tygodniu"],
  ["Przejedź 40 km bez przerwy"],
  ["Przejedź 20 km ze średnią 24 km/h"],
  ["Przejedź 50 km bez przerwy", "Połówka setki — solidna niedzielna pętla."],
  ["Przejedź łącznie 300 km"],
  ["Przejedź 75 km łącznie w jednym tygodniu"],
  ["Przejedź 60 km bez przerwy"],
  ["Przejedź 40 km poniżej 2 godzin", "Średnia 20 km/h na dłuższym dystansie."],
  ["Przejedź 300 km łącznie w jednym miesiącu"],
  ["Przejedź 70 km bez przerwy"],
  // 26-45 · Średniozaawansowany
  ["Jeźdź 2 razy w tygodniu przez 12 kolejnych tygodni"],
  ["Przejedź 80 km bez przerwy"],
  ["Przejedź 20 km ze średnią ~27 km/h", "Czas poniżej 45 minut."],
  ["Przejedź 100 km łącznie w jednym tygodniu"],
  ["Przejedź 90 km bez przerwy"],
  ["Przejedź 40 km poniżej 1:50"],
  ["Przejedź 100 km bez przerwy", "SETKA — kultowy dystans każdego kolarza amatora."],
  ["Przejedź łącznie 1000 km"],
  ["Przejedź 20 km poniżej 42 minut"],
  ["Przejedź 500 km łącznie w jednym miesiącu"],
  ["Przejedź 110 km bez przerwy"],
  ["Przejedź 40 km poniżej 1:40", "Średnia 24 km/h."],
  ["Przejedź 130 km łącznie w jednym tygodniu"],
  ["Przejedź 120 km bez przerwy"],
  ["Przejedź 100 km poniżej 4:30"],
  ["Przejedź 20 km poniżej 40 minut", "Średnia 30 km/h — poziom klubowy."],
  ["Przejedź 130 km bez przerwy"],
  ["Przejedź łącznie 2500 km"],
  ["Przejedź 40 km poniżej 1:32"],
  ["Przejedź 150 km bez przerwy"],
  // 46-65 · Zaawansowany
  ["Przejedź 100 km poniżej 4:00", "Średnia 25 km/h przez setkę."],
  ["Przejedź 160 km łącznie w jednym tygodniu"],
  ["Przejedź 20 km poniżej 38 minut"],
  ["Przejedź 160 km bez przerwy", "Century — sto mil w siodle."],
  ["Przejedź 40 km poniżej 1:25"],
  ["Przejedź 800 km łącznie w jednym miesiącu"],
  ["Przejedź 180 km bez przerwy"],
  ["Przejedź 100 km poniżej 3:45"],
  ["Przejedź 20 km poniżej 36 minut", "Średnia 33 km/h."],
  ["Przejedź 200 km bez przerwy", "Dystans brevetu BRM 200."],
  ["Przejedź łącznie 5000 km"],
  ["Przejedź 40 km poniżej 1:20", "Średnia 30 km/h na 40 km."],
  ["Przejedź 200 km łącznie w jednym tygodniu"],
  ["Przejedź 100 km poniżej 3:30"],
  ["Przejedź 20 km poniżej 34 minut"],
  ["Przejedź 220 km bez przerwy"],
  ["Przejedź 40 km poniżej 1:15", "Średnia 32 km/h."],
  ["Przejedź 1000 km łącznie w jednym miesiącu"],
  ["Przejedź 100 km poniżej 3:20", "Średnia 30 km/h przez setkę."],
  ["Przejedź 250 km bez przerwy"],
  // 66-85 · Wyczynowy
  ["Przejedź 20 km poniżej 32 minut"],
  ["Przejedź 250 km łącznie w jednym tygodniu"],
  ["Przejedź 40 km poniżej 1:12"],
  ["Przejedź 100 km poniżej 3:10"],
  ["Przejedź 270 km bez przerwy"],
  ["Przejedź łącznie 10 000 km", "Ekwator! Obwód Ziemi masz w nogach w jednej czwartej."],
  ["Przejedź 20 km poniżej 31 minut"],
  ["Przejedź 40 km poniżej 1:08", "Średnia ponad 35 km/h."],
  ["Przejedź 1200 km łącznie w jednym miesiącu"],
  ["Przejedź 300 km bez przerwy", "Dystans brevetu BRM 300."],
  ["Przejedź 100 km poniżej 3:00", "Średnia 33 km/h przez setkę."],
  ["Przejedź 20 km poniżej 30 minut", "Średnia 40 km/h — bardzo wysoki próg czasówki."],
  ["Przejedź 300 km łącznie w jednym tygodniu"],
  ["Przejedź 40 km poniżej 1:05"],
  ["Przejedź 100 km poniżej 2:50"],
  ["Przejedź 20 km poniżej 29 minut"],
  ["Przejedź 350 km bez przerwy"],
  ["Przejedź 40 km poniżej 1:02"],
  ["Przejedź 100 km poniżej 2:45"],
  ["Przejedź 400 km bez przerwy", "Dystans brevetu BRM 400 — jazda przez noc."],
  // 86-99 · Elita
  ["Przejedź 20 km poniżej 28 minut"],
  ["Przejedź 40 km poniżej 60 minut", "40 km/h przez pełną godzinę — święty Graal amatorów TT."],
  ["Przejedź 400 km łącznie w jednym tygodniu"],
  ["Przejedź 100 km poniżej 2:40"],
  ["Przejedź 20 km poniżej 27 minut"],
  ["Przejedź 500 km bez przerwy"],
  ["Przejedź 40 km poniżej 58 minut"],
  ["Przejedź 100 km poniżej 2:30", "Średnia 40 km/h przez setkę."],
  ["Przejedź 2000 km łącznie w jednym miesiącu"],
  ["Przejedź 40 km poniżej 56 minut"],
  ["Przejedź 600 km bez przerwy", "Brevet BRM 600 — przepustka do Paryż-Brest-Paryż."],
  ["Przejedź 100 km poniżej 2:25"],
  ["Przejedź 40 km poniżej 54 minut", "Średnia 44 km/h."],
  ["Poziom mistrzowski (amatorski szczyt): 40 km poniżej 52 minut lub 100 km poniżej 2:20", "Dojrzały, wieloletni warsztat kolarski zaangażowanego amatora. Dalsze, zawodowe wyniki potwierdzają osobne certyfikaty."],
]);

export const criteriaByLevel: Record<number, Criterion> = {
  1: d(2), 2: d(5), 3: d(8), 4: d(10), 5: t(30),
  6: d(15), 7: t(45), 8: d(20), 9: t(60), 10: d(25),
  11: freq(1, 4), 12: d(30), 13: tfd(20, 60), 14: freq(2, 4), 15: d(35),
  16: weekly(50), 17: d(40), 18: tfd(20, 50), 19: d(50), 20: total(300),
  21: weekly(75), 22: d(60), 23: tfd(40, 120), 24: monthly(300), 25: d(70),
  26: freq(2, 12), 27: d(80), 28: tfd(20, 45), 29: weekly(100), 30: d(90),
  31: tfd(40, 110), 32: d(100), 33: total(1000), 34: tfd(20, 42), 35: monthly(500),
  36: d(110), 37: tfd(40, 100), 38: weekly(130), 39: d(120), 40: tfd(100, 270),
  41: tfd(20, 40), 42: d(130), 43: total(2500), 44: tfd(40, 92), 45: d(150),
  46: tfd(100, 240), 47: weekly(160), 48: tfd(20, 38), 49: d(160), 50: tfd(40, 85),
  51: monthly(800), 52: d(180), 53: tfd(100, 225), 54: tfd(20, 36), 55: d(200),
  56: total(5000), 57: tfd(40, 80), 58: weekly(200), 59: tfd(100, 210), 60: tfd(20, 34),
  61: d(220), 62: tfd(40, 75), 63: monthly(1000), 64: tfd(100, 200), 65: d(250),
  66: tfd(20, 32), 67: weekly(250), 68: tfd(40, 72), 69: tfd(100, 190), 70: d(270),
  71: total(10000), 72: tfd(20, 31), 73: tfd(40, 68), 74: monthly(1200), 75: d(300),
  76: tfd(100, 180), 77: tfd(20, 30), 78: weekly(300), 79: tfd(40, 65), 80: tfd(100, 170),
  81: tfd(20, 29), 82: d(350), 83: tfd(40, 62), 84: tfd(100, 165), 85: d(400),
  86: tfd(20, 28), 87: tfd(40, 60), 88: weekly(400), 89: tfd(100, 160), 90: tfd(20, 27),
  91: d(500), 92: tfd(40, 58), 93: tfd(100, 150), 94: monthly(2000), 95: tfd(40, 56),
  96: d(600), 97: tfd(100, 145), 98: tfd(40, 54),
  99: anyOf(tfd(40, 52), tfd(100, 140)),
};

// ---------------------------------------------------------------------------
// Learning resources. Every URL fetched before it was written here.
//
// The power references (L65, L85) are the sport's real currency and this ladder does
// not use it: we measure distance and time, because that is what a workout log holds.
// Watts per kilogram is where a cyclist actually places themselves, so the links are
// here — with the caveat that Cycling Analytics' percentiles are drawn from people who
// own a power meter, roughly half of whom race. Their median is not the median cyclist.
import type { MilestoneResource } from "../../src/lib/milestone-resources";

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  // — Rozszerzenie zasobów Tier 1 (wszystkie linki zweryfikowane jako aktywne) —
  2: [{ kind: "video", title: "4 podstawowe umiejętności dla początkującego kolarza", url: yt("4ssLDk1eX9w") }],
  4: [{ kind: "video", title: "Dopasowanie roweru — podstawy bike fittingu", url: yt("c0gw_UG1zZM") }],
  8: [{ kind: "video", title: "Jak jeść i pić na rowerze — odżywianie w skrócie", url: yt("sjhSm3lguxc") }],
  12: [{ kind: "video", title: "Jak zbudować wytrzymałość kolarską", url: yt("dyOMcnSBl64") }],
  19: [{ kind: "article", title: "Jak przejechać pierwszą setkę — 5 wskazówek na długi dystans", url: "https://www.bikeradar.com/advice/fitness-and-training/how-to-ride-100-miles" }],
  26: [{ kind: "article", title: "12-tygodniowy plan treningowy dla kolarza", url: "https://www.bikeradar.com/advice/fitness-and-training/cycling-training-plan" }],
  30: [{ kind: "article", title: "Odżywianie w trakcie jazdy — ile jeść i kiedy", url: "https://roadmancycling.com/blog/cycling-in-ride-nutrition-guide" }],
  32: [{ kind: "article", title: "Jak przygotować się do setki (century) — przewodnik", url: "https://www.trainerroad.com/blog/how-to-prepare-for-and-ride-your-first-century/" }],
  45: [{ kind: "article", title: "Wprowadzenie do audax i randonneuringu dla początkujących", url: "https://www.audax.uk/about-audax/new-to-audax/" }],
  55: [{ kind: "article", title: "Porady na jazdę w brevecie — przygotowanie do 200 km", url: "https://www.audax.uk/about-audax/new-to-audax/advice-for-riding-audax-events/" }],
  1: [
    { kind: "video", title: "Wysokość siodła — najczęstszy błąd początkujących", url: yt("FVu5Zrktm40") },
    { kind: "video", title: "Przerzutki — jak zmieniać biegi", url: yt("TJsQ1PbkDqc") },
  ],
  5: [{ kind: "video", title: "Ustaw rower sam: siodło i zasięg", url: yt("iZZlm8Kj3Vo") }],
  10: [{ kind: "video", title: "Kadencja — ile obrotów na minutę?", url: yt("BwkNsLBNH4E") }],
  15: [{ kind: "article", title: "Odżywianie na rowerze — co jeść i pić", url: "https://www.cyclinguk.org/article/nutrition-cycling-eating-and-drinking-essentials" }],
  25: [{ kind: "article", title: "10-tygodniowy plan do pierwszych 100 km (Cycling UK)", url: "https://www.cyclinguk.org/article/10-week-training-plan-100km-ride" }],
  35: [{ kind: "video", title: "Jazda w grupie — zasady i bezpieczeństwo", url: yt("4wF4lBjHRPg") }],
  40: [{ kind: "video", title: "Wysokość siodła — sposób bikefittera", url: yt("N_y5eSUOqNk") }],
  50: [{ kind: "video", title: "Strefy tętna i mocy — jak trenować efektywnie", url: yt("ZEfPJr2Vuxo") }],
  65: [{ kind: "reference", title: "Profil mocy Coggana — W/kg od amatora do elity", url: "https://www.highnorth.co.uk/articles/power-profiling-cycling" }],
  75: [{ kind: "video", title: "Trening interwałowy na rowerze — FTP booster", url: yt("KPg61Cc4gzM") }],
  85: [{ kind: "article", title: "Gdzie jesteś na tle innych — percentyle FTP", url: "https://www.cyclinganalytics.com/blog/2018/06/how-does-your-cycling-power-output-compare" }],
  96: [{ kind: "reference", title: "Audax — limity czasu na brevety 200–1000 km", url: "https://www.audax.uk/about-audax/classifications/" }],
};
