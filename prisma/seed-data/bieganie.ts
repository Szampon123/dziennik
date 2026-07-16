// Running skill ladder, levels 1-99.
// Thresholds grounded in large-sample race data (RunRepeat, RunningLevel,
// Motera, sub3-marathon.com, 2024-2025): median 5k ~30 min, top 25% ~25:30,
// top 10% ~22:00, sub-20 ~2% of finishers; median half marathon ~2:14;
// average marathon ~4:30; sub-3 marathon ~4% of finishers.
// Levels 1-10 follow the Couch-to-5K progression.
// Times are "open" category (no age/sex grading) — noted in top-level details.

import type { Criterion } from "../../src/lib/milestone-criteria";

export type MilestoneSeed = {
  level: number;
  title: string;
  detail?: string;
};

export const activity = {
  slug: "bieganie",
  name: "Bieganie",
  icon: "🏃",
  description:
    "Od pierwszej minuty ciągłego biegu do poziomu międzynarodowej elity. Progi oparte na danych o wynikach milionów biegaczy.",
  sortOrder: 1,
};

export const milestones: MilestoneSeed[] = [
  // ---- 1-10 · Pierwsze kroki (progresja Couch-to-5K) ----
  { level: 1, title: "Przebiegnij 1 minutę bez zatrzymania", detail: "Dowolne tempo — trucht się liczy. Dokładnie tak zaczyna program Couch-to-5K." },
  { level: 2, title: "Przebiegnij 3 minuty bez zatrzymania", detail: "Możesz przeplatać biegi marszem w ramach treningu — liczy się jeden ciągły odcinek 3 minut." },
  { level: 3, title: "Przebiegnij 5 minut bez zatrzymania", detail: "Pierwszy próg, przy którym ciało zaczyna łapać rytm biegu." },
  { level: 4, title: "Przebiegnij 1 km bez zatrzymania", detail: "Pierwszy okrągły dystans. Tempo nie gra roli." },
  { level: 5, title: "Przebiegnij 10 minut bez zatrzymania", detail: "Mniej więcej połowa drogi programu Couch-to-5K." },
  { level: 6, title: "Przebiegnij 15 minut bez zatrzymania", detail: "Typowy moment, w którym bieganie przestaje boleć, a zaczyna sprawiać frajdę." },
  { level: 7, title: "Przebiegnij 2 km bez zatrzymania", detail: "Dystans dookoła sporego parku. Utrzymuj tempo rozmowy (możesz mówić pełnymi zdaniami)." },
  { level: 8, title: "Przebiegnij 20 minut bez zatrzymania", detail: "Kluczowy tydzień 5 programu C25K — najczęstszy „przełom psychiczny” początkujących." },
  { level: 9, title: "Przebiegnij 3 km bez zatrzymania", detail: "Ostatnia prosta przed pełną piątką." },
  { level: 10, title: "Przebiegnij 5 km bez zatrzymania", detail: "Cel programu Couch-to-5K. Dowolne tempo — większość początkujących osiąga to w 8-10 tygodni." },

  // ---- 11-25 · Regularny biegacz ----
  { level: 11, title: "Biegaj 2 razy w tygodniu przez 4 kolejne tygodnie", detail: "Regularność buduje formę mocniej niż pojedyncze zrywy." },
  { level: 12, title: "Przebiegnij 5 km poniżej 40 minut", detail: "Tempo 8:00/km — spokojny, równy bieg bez marszu." },
  { level: 13, title: "Przebiegnij łącznie 50 km", detail: "Suma wszystkich treningów (aplikacja/zegarek). Pierwszy „licznik przebiegu”." },
  { level: 14, title: "Biegaj 3 razy w tygodniu przez 4 kolejne tygodnie", detail: "Trzy biegi tygodniowo to klasyczna baza planów treningowych." },
  { level: 15, title: "Przebiegnij 5 km poniżej 35 minut", detail: "Tempo 7:00/km. Typowy wynik po 2-3 miesiącach regularnego biegania." },
  { level: 16, title: "Przebiegnij 6 km bez zatrzymania", detail: "Pierwsze wyjście poza komfortową piątkę." },
  { level: 17, title: "Przebiegnij 15 km łącznie w jednym tygodniu", detail: "Np. 3 biegi po 5 km. Bezpieczny tygodniowy kilometraż rekreacyjny." },
  { level: 18, title: "Weź udział w oficjalnym biegu lub parkrunie", detail: "Dowolny dystans. Atmosfera startu i mierzony czas — nowy wymiar biegania." },
  { level: 19, title: "Przebiegnij 8 km bez zatrzymania", detail: "Dwie trzecie drogi do dyszki." },
  { level: 20, title: "Przebiegnij 5 km poniżej 32 minut", detail: "Tempo 6:24/km — zauważalnie szybciej niż „tylko dobiec”." },
  { level: 21, title: "Przebiegnij 20 km łącznie w jednym tygodniu", detail: "Typowy tygodniowy kilometraż rekreacyjnego biegacza." },
  { level: 22, title: "Przebiegnij 10 km bez zatrzymania", detail: "Kultowa „dyszka”. Dowolne tempo." },
  { level: 23, title: "Przebiegnij 5 km poniżej 30 minut", detail: "Tempo 6:00/km — mniej więcej mediana wszystkich biegaczy 5 km. Jesteś w górnej połowie!" },
  { level: 24, title: "Przebiegnij łącznie 200 km", detail: "Mniej więcej dystans Warszawa-Łódź i z powrotem." },
  { level: 25, title: "Przebiegnij 10 km poniżej 70 minut", detail: "Tempo 7:00/km na dwukrotnie dłuższym dystansie." },

  // ---- 26-45 · Średniozaawansowany ----
  { level: 26, title: "Biegaj 3 razy w tygodniu przez 12 kolejnych tygodni", detail: "Kwartał systematyczności — nawyk jest już trwały." },
  { level: 27, title: "Przebiegnij 5 km poniżej 28 minut", detail: "Tempo 5:36/km. Zaczynasz wyprzedzać peleton parkrunu." },
  { level: 28, title: "Przebiegnij 12 km bez zatrzymania", detail: "Wejście w strefę długich wybiegań." },
  { level: 29, title: "Przebiegnij 10 km poniżej 65 minut", detail: "Tempo 6:30/km utrzymane przez godzinę." },
  { level: 30, title: "Przebiegnij 25 km łącznie w jednym tygodniu", detail: "Kilometraż typowy dla przygotowań do dłuższych dystansów." },
  { level: 31, title: "Przebiegnij 5 km poniżej 27 minut", detail: "Tempo 5:24/km." },
  { level: 32, title: "Przebiegnij 10 km poniżej 60 minut", detail: "Złamanie godziny na dziesiątce (10 km) — klasyczny cel amatora. Blisko mediany biegaczy 10 km." },
  { level: 33, title: "Przebiegnij 15 km bez zatrzymania", detail: "Trzy czwarte półmaratonu." },
  { level: 34, title: "Przebiegnij 100 km łącznie w jednym miesiącu", detail: "Setka w miesiąc — próg „poważnego amatora”." },
  { level: 35, title: "Przebiegnij 5 km poniżej 26 minut", detail: "Tempo 5:12/km." },
  { level: 36, title: "Przebiegnij 10 km poniżej 55 minut", detail: "Tempo 5:30/km przez całą dyszkę." },
  { level: 37, title: "Przebiegnij 30 km łącznie w jednym tygodniu", detail: "Solidna baza tlenowa." },
  { level: 38, title: "Przebiegnij 18 km bez zatrzymania", detail: "Ostatni długi krok przed półmaratonem." },
  { level: 39, title: "Przebiegnij 5 km poniżej 25:30", detail: "Wynik lepszy niż ~75% biegaczy 5 km (top 25%)." },
  { level: 40, title: "Ukończ półmaraton (21,1 km)", detail: "Dowolny czas — sam finisz stawia Cię w mniejszości ludzkości, która to zrobiła." },
  { level: 41, title: "Przebiegnij 10 km poniżej 52 minut", detail: "Tempo 5:12/km." },
  { level: 42, title: "Ukończ półmaraton poniżej 2:20", detail: "Równe, kontrolowane 21 km." },
  { level: 43, title: "Przebiegnij 35 km łącznie w jednym tygodniu", detail: "Kilometraż typowy dla planów półmaratońskich." },
  { level: 44, title: "Ukończ półmaraton poniżej 2:15", detail: "Mediana wszystkich finisherów półmaratonu — górna połowa stawki." },
  { level: 45, title: "Przebiegnij 5 km poniżej 24:30", detail: "Tempo 4:54/km — schodzisz poniżej 5 min/km." },

  // ---- 46-65 · Zaawansowany ----
  { level: 46, title: "Przebiegnij 10 km poniżej 50 minut", detail: "Okrągły próg 5:00/km na dyszce." },
  { level: 47, title: "Przebiegnij łącznie 1000 km", detail: "Tysiąc kilometrów w nogach. Historia treningów to potwierdzi." },
  { level: 48, title: "Ukończ półmaraton poniżej 2:10", detail: "Tempo ~6:09/km przez 21 km." },
  { level: 49, title: "Przebiegnij 5 km poniżej 24 minut", detail: "Tempo 4:48/km." },
  { level: 50, title: "Przebiegnij 25 km bez zatrzymania", detail: "Połowa drabinki! Dystans z zapasem ponad półmaraton." },
  { level: 51, title: "Ukończ półmaraton poniżej 2:00", detail: "Kultowe „złamanie dwóch godzin” — cel numer jeden amatorów półmaratonu." },
  { level: 52, title: "Przebiegnij 10 km poniżej 48 minut", detail: "Tempo 4:48/km." },
  { level: 53, title: "Przebiegnij 40 km łącznie w jednym tygodniu", detail: "Kilometraż maratoński. Regeneracja staje się częścią treningu." },
  { level: 54, title: "Przebiegnij 5 km poniżej 23 minut", detail: "Tempo 4:36/km — okolice top 15% biegaczy." },
  { level: 55, title: "Przebiegnij 30 km bez zatrzymania", detail: "Klasyczne najdłuższe wybieganie przed maratonem." },
  { level: 56, title: "Ukończ maraton (42,195 km)", detail: "Królewski dystans. Dowolny czas — mniej niż 1% populacji kiedykolwiek to zrobił." },
  { level: 57, title: "Przebiegnij 10 km poniżej 46 minut", detail: "Tempo 4:36/km." },
  { level: 58, title: "Ukończ maraton poniżej 4:30", detail: "Mniej więcej średni czas wszystkich maratończyków — środek stawki." },
  { level: 59, title: "Przebiegnij 5 km poniżej 22 minut", detail: "Wynik lepszy niż ~90% biegaczy 5 km (top 10%)." },
  { level: 60, title: "Ukończ półmaraton poniżej 1:55", detail: "Tempo ~5:27/km." },
  { level: 61, title: "Przebiegnij 50 km łącznie w jednym tygodniu", detail: "Poważny tygodniowy kilometraż — wymaga 4-5 biegów." },
  { level: 62, title: "Ukończ maraton poniżej 4:15", detail: "Równe tempo ~6:02/km przez 42 km." },
  { level: 63, title: "Przebiegnij 10 km poniżej 45 minut", detail: "Tempo 4:30/km — częsty wymóg „dobrego klubowego” poziomu." },
  { level: 64, title: "Ukończ półmaraton poniżej 1:50", detail: "Tempo ~5:13/km." },
  { level: 65, title: "Ukończ maraton poniżej 4:00", detail: "Magiczna „czwórka” — cel większości ambitnych amatorów; wyraźnie powyżej mediany." },

  // ---- 66-85 · Wyczynowy amator ----
  { level: 66, title: "Przebiegnij 5 km poniżej 21:30", detail: "Tempo 4:18/km." },
  { level: 67, title: "Przebiegnij 10 km poniżej 44 minut", detail: "Tempo 4:24/km." },
  { level: 68, title: "Ukończ półmaraton poniżej 1:45", detail: "Tempo ~4:59/km — półmaraton w tempie poniżej 5 min/km." },
  { level: 69, title: "Przebiegnij 5 km poniżej 21 minut", detail: "Przedsionek elitarnego sub-20." },
  { level: 70, title: "Ukończ maraton poniżej 3:45", detail: "Tempo ~5:20/km przez 42 km." },
  { level: 71, title: "Przebiegnij 10 km poniżej 42 minut", detail: "Tempo 4:12/km." },
  { level: 72, title: "Przebiegnij 60 km łącznie w jednym tygodniu", detail: "Kilometraż z ambitnych planów maratońskich." },
  { level: 73, title: "Przebiegnij 5 km poniżej 20:30", detail: "O włos od legendy." },
  { level: 74, title: "Ukończ półmaraton poniżej 1:40", detail: "Tempo ~4:44/km." },
  { level: 75, title: "Przebiegnij 5 km poniżej 20 minut", detail: "Sub-20! W danych z 2,2 mln wyników 5 km w USA (2024) osiągnęło to tylko ~1,9% biegaczy." },
  { level: 76, title: "Ukończ maraton poniżej 3:30", detail: "Tempo ~4:58/km. Okolice kwalifikacji do Bostonu dla najmłodszych grup kobiet." },
  { level: 77, title: "Przebiegnij 10 km poniżej 41 minut", detail: "Tempo 4:06/km." },
  { level: 78, title: "Ukończ półmaraton poniżej 1:35", detail: "Tempo ~4:30/km." },
  { level: 79, title: "Przebiegnij 5 km poniżej 19:30", detail: "Tempo 3:54/km." },
  { level: 80, title: "Ukończ maraton poniżej 3:15", detail: "Tempo ~4:37/km. Okolice kwalifikacji do Bostonu dla najmłodszych grup mężczyzn." },
  { level: 81, title: "Przebiegnij 10 km poniżej 40 minut", detail: "Złamanie 40 minut — dyszka w tempie 4:00/km. Klubowy poziom." },
  { level: 82, title: "Przebiegnij 70 km łącznie w jednym tygodniu", detail: "Objętość półprofesjonalna — zwykle 6 dni biegania." },
  { level: 83, title: "Przebiegnij 5 km poniżej 19 minut", detail: "Tempo 3:48/km." },
  { level: 84, title: "Ukończ półmaraton poniżej 1:30", detail: "Tempo ~4:16/km — wynik z czołówki lokalnych biegów." },
  { level: 85, title: "Ukończ maraton poniżej 3:00", detail: "Sub-3! Osiąga to ~4% finisherów maratonów (ok. 1 na 25). Absolutna czołówka amatorów." },

  // ---- 86-99 · Elita ----
  { level: 86, title: "Przebiegnij 10 km poniżej 38 minut", detail: "Tempo 3:48/km." },
  { level: 87, title: "Przebiegnij 5 km poniżej 18 minut", detail: "Tempo 3:36/km — podium większości parkrunów." },
  { level: 88, title: "Ukończ półmaraton poniżej 1:25", detail: "Tempo ~4:02/km." },
  { level: 89, title: "Ukończ maraton poniżej 2:50", detail: "Wyraźnie poniżej sub-3 — ścisła czołówka amatorska." },
  { level: 90, title: "Przebiegnij 10 km poniżej 36 minut", detail: "Tempo 3:36/km." },
  { level: 91, title: "Przebiegnij 5 km poniżej 17 minut", detail: "Poziom elitarny kobiet wg klasyfikacji RunningLevel; bardzo mocny klubowy u mężczyzn." },
  { level: 92, title: "Ukończ półmaraton poniżej 1:20", detail: "Tempo ~3:47/km." },
  { level: 93, title: "Ukończ maraton poniżej 2:40", detail: "Okolice minimum na mistrzostwa kraju w kategoriach masters." },
  { level: 94, title: "Przebiegnij 10 km poniżej 34 minut", detail: "Tempo 3:24/km — poziom czołówki ogólnopolskich biegów ulicznych." },
  { level: 95, title: "Przebiegnij 5 km poniżej 16 minut", detail: "Tempo 3:12/km. Poziom reprezentowany na mistrzostwach kraju." },
  { level: 96, title: "Ukończ półmaraton poniżej 1:15", detail: "Tempo ~3:33/km." },
  { level: 97, title: "Ukończ maraton poniżej 2:30", detail: "Krajowa elita maratonu." },
  { level: 98, title: "Przebiegnij 5 km poniżej 15:30 lub 10 km poniżej 32 minut", detail: "Bardzo szybki, wieloletnio trenujący klubowicz — próg, który realnie osiąga garstka biegaczy amatorów." },
  { level: 99, title: "Poziom mistrzowski (amatorski szczyt): 10 km poniżej 31 minut lub półmaraton poniżej 1:10", detail: "Dojrzały, wieloletni warsztat biegowy zaangażowanego amatora. Dalsze, zawodowe wyniki (minima olimpijskie, rekordy) potwierdzają osobne certyfikaty." },
];

// Machine-readable criteria per level, evaluated by src/lib/milestone-engine.ts
// against the user's workout log ("proven only" auto-completion).
// tfd = time_for_distance (average-pace scaled), distances in km, times in minutes.
const d = (km: number): Criterion => ({ type: "single_distance", km });
const t = (minutes: number): Criterion => ({ type: "single_duration", minutes });
const tfd = (km: number, maxMinutes: number): Criterion => ({ type: "time_for_distance", km, maxMinutes });
const weekly = (km: number): Criterion => ({ type: "weekly_km", km });
const monthly = (km: number): Criterion => ({ type: "monthly_km", km });
const total = (km: number): Criterion => ({ type: "total_km", km });
const freq = (perWeek: number, weeks: number): Criterion => ({ type: "frequency", perWeek, weeks });

const HM = 21.1;
const M = 42.195;

export const criteriaByLevel: Record<number, Criterion> = {
  1: t(1), 2: t(3), 3: t(5), 4: d(1), 5: t(10),
  6: t(15), 7: d(2), 8: t(20), 9: d(3), 10: d(5),
  11: freq(2, 4), 12: tfd(5, 40), 13: total(50), 14: freq(3, 4), 15: tfd(5, 35),
  16: d(6), 17: weekly(15), 18: { type: "race" }, 19: d(8), 20: tfd(5, 32),
  21: weekly(20), 22: d(10), 23: tfd(5, 30), 24: total(200), 25: tfd(10, 70),
  26: freq(3, 12), 27: tfd(5, 28), 28: d(12), 29: tfd(10, 65), 30: weekly(25),
  31: tfd(5, 27), 32: tfd(10, 60), 33: d(15), 34: monthly(100), 35: tfd(5, 26),
  36: tfd(10, 55), 37: weekly(30), 38: d(18), 39: tfd(5, 25.5), 40: d(HM),
  41: tfd(10, 52), 42: tfd(HM, 140), 43: weekly(35), 44: tfd(HM, 135), 45: tfd(5, 24.5),
  46: tfd(10, 50), 47: total(1000), 48: tfd(HM, 130), 49: tfd(5, 24), 50: d(25),
  51: tfd(HM, 120), 52: tfd(10, 48), 53: weekly(40), 54: tfd(5, 23), 55: d(30),
  56: d(M), 57: tfd(10, 46), 58: tfd(M, 270), 59: tfd(5, 22), 60: tfd(HM, 115),
  61: weekly(50), 62: tfd(M, 255), 63: tfd(10, 45), 64: tfd(HM, 110), 65: tfd(M, 240),
  66: tfd(5, 21.5), 67: tfd(10, 44), 68: tfd(HM, 105), 69: tfd(5, 21), 70: tfd(M, 225),
  71: tfd(10, 42), 72: weekly(60), 73: tfd(5, 20.5), 74: tfd(HM, 100), 75: tfd(5, 20),
  76: tfd(M, 210), 77: tfd(10, 41), 78: tfd(HM, 95), 79: tfd(5, 19.5), 80: tfd(M, 195),
  81: tfd(10, 40), 82: weekly(70), 83: tfd(5, 19), 84: tfd(HM, 90), 85: tfd(M, 180),
  86: tfd(10, 38), 87: tfd(5, 18), 88: tfd(HM, 85), 89: tfd(M, 170), 90: tfd(10, 36),
  91: tfd(5, 17), 92: tfd(HM, 80), 93: tfd(M, 160), 94: tfd(10, 34), 95: tfd(5, 16),
  96: tfd(HM, 75), 97: tfd(M, 150),
  98: { type: "any_of", of: [tfd(5, 15.5), tfd(10, 32)] },
  99: { type: "any_of", of: [tfd(10, 31), tfd(HM, 70)] },
};

// ---------------------------------------------------------------------------
// Learning resources. Every URL below was fetched before it was written here:
// YouTube through the oEmbed endpoint (which returns the real title, and 404s on a
// wrong id), everything else with a plain GET that had to answer 200 with a page
// rather than a bot wall. Three candidates were rejected in the process — the NHS
// Couch-to-5K URL a research pass handed me was a 404, JOSPT and a PMC article
// answered 403/reCAPTCHA. Nothing here is a guess.
//
// On the injury levels (48, 62) the sources are the primary papers, deliberately:
// the "10% rule" that every running site repeats has no founding study, and the RCT
// linked at L62 found it made no difference to injuries (20.8% vs 20.3%, p=0.90).
// The defensible line is the one at L48: don't jump weekly volume by more than 30%.
import type { MilestoneResource } from "../../src/lib/milestone-resources";

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "article", title: "Couch to 5K — plan NHS, tydzień po tygodniu", url: "https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/couch-to-5k-running-plan/" },
    { kind: "video", title: "Technika biegu — czego uczą zawodowcy", url: yt("pofBa80GAwg") },
  ],
  8: [{ kind: "video", title: "Kadencja biegowa, prosto wyjaśniona", url: yt("LcHEM0LUako") }],
  18: [{ kind: "article", title: "parkrun Polska — darmowe 5 km w każdą sobotę", url: "https://www.parkrun.pl/" }],
  22: [{ kind: "video", title: "Popraw kadencję: szybciej i bez kontuzji", url: yt("oCUCKPRaoI0") }],
  35: [{ kind: "reference", title: "Gdzie jesteś na tle innych — kalkulator percentyli (35 mln wyników)", url: "https://runrepeat.com/how-do-you-masure-up-the-runners-percentile-calculator" }],
  48: [{ kind: "reference", title: "Nielsen 2014: ryzyko rośnie dopiero powyżej +30% objętości tygodniowo", url: "https://pubmed.ncbi.nlm.nih.gov/25155475/" }],
  62: [{ kind: "reference", title: "Buist 2008 (RCT): „zasada 10%” nie zmniejszyła liczby kontuzji", url: "https://pubmed.ncbi.nlm.nih.gov/17940147/" }],
  75: [{ kind: "reference", title: "Age grading — przelicz swój czas na % standardu światowego", url: "https://www.howardgrubb.co.uk/athletics/wmalookup15.html" }],
  96: [{ kind: "reference", title: "Minima kwalifikacyjne do maratonu bostońskiego", url: "https://www.baa.org/races/boston-marathon/qualify/" }],
};
