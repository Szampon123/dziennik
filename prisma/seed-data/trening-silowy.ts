// Strength training ladder 1-99. Standards based on StrengthLevel/ExRx
// population data (ratios of bodyweight, "BW"): e.g. bench 1×BW ≈ intermediate,
// 1.5×BW advanced, 2×BW elite; squat 1.25/1.75/2.25×BW; deadlift 1.5/2/2.5×BW.
// Manual ladder — check off what you've actually achieved; progression tracks
// let one check-off cascade within the same exercise only.
import type { Criterion } from "../../src/lib/milestone-criteria";
import { ladder, freq, prog } from "./helpers";

export const activity = {
  slug: "trening-silowy",
  name: "Trening siłowy",
  icon: "🏋️",
  description:
    "Od pierwszej pompki po wyniki z zawodów amatorskich. Progi względem masy ciała (BW), wg danych StrengthLevel.",
  sortOrder: 5,
  logKind: "manual" as const,
};

export const milestones = ladder([
  // 1-10 · Pierwsze kroki
  ["Zrób 1 pełną pompkę", "Klatka piersiowa do ziemi, pełny wyprost — bez kolan."],
  ["Utrzymaj deskę (plank) przez 30 sekund"],
  ["Zrób 5 przysiadów z pełnym zakresem", "Biodra poniżej kolan."],
  ["Zrób 5 pompek"],
  ["Zwis na drążku przez 20 sekund"],
  ["Zrób 10 przysiadów z pełnym zakresem"],
  ["Utrzymaj plank przez 60 sekund"],
  ["Zrób 10 pompek"],
  ["Przysiad ze sztangą — opanuj technikę z pustym gryfem (20 kg)"],
  ["Trenuj 2 razy w tygodniu przez 4 kolejne tygodnie", "Regularność przede wszystkim."],
  // 11-25 · Regularny
  ["Zrób 15 pompek"],
  ["Wyciskanie leżąc — opanuj technikę z pustym gryfem"],
  ["Zwis na drążku przez 45 sekund"],
  ["Martwy ciąg — opanuj technikę z obciążeniem 40 kg"],
  ["Zrób 1 podciągnięcie nachwytem", "Pełny zwis, broda nad drążkiem — pierwsza duża bariera."],
  ["Przysiad 0,5 × masy ciała na 5 powtórzeń"],
  ["Zrób 20 pompek"],
  ["Wyciskanie leżąc 0,5 × masy ciała na 5 powtórzeń"],
  ["Utrzymaj plank przez 2 minuty"],
  ["Zrób 1 pełny dip na poręczach"],
  ["Martwy ciąg 0,75 × masy ciała na 5 powtórzeń"],
  ["Zrób 3 podciągnięcia"],
  ["Trenuj 3 razy w tygodniu przez 4 kolejne tygodnie"],
  ["Przysiad 0,75 × masy ciała na 5 powtórzeń"],
  ["Zrób 25 pompek"],
  // 26-45 · Średniozaawansowany
  ["Wyciskanie żołnierskie (OHP) 0,35 × masy ciała na 5 powtórzeń"],
  ["Zrób 5 podciągnięć"],
  ["Martwy ciąg 1 × masy ciała na 5 powtórzeń", "Sztanga = Ty. Symboliczny moment."],
  ["Zrób 5 dipów"],
  ["Przysiad 1 × masy ciała (1RM)", "Poziom „novice+” wg StrengthLevel."],
  ["Zrób 30 pompek"],
  ["Trenuj 3 razy w tygodniu przez 12 kolejnych tygodni", "Kwartał bez wymówek."],
  ["Wyciskanie leżąc 0,75 × masy ciała (1RM)"],
  ["Zrób 8 podciągnięć"],
  ["Utrzymaj plank przez 3 minuty"],
  ["Martwy ciąg 1,25 × masy ciała (1RM)"],
  ["Zrób 10 dipów"],
  ["OHP 0,5 × masy ciała (1RM)"],
  ["Przysiad 1,25 × masy ciała (1RM)", "Wg StrengthLevel poziom średniozaawansowany."],
  ["Zrób 40 pompek"],
  ["Zrób 10 podciągnięć", "Okrągła dycha — solidna siła względna."],
  ["Wyciskanie leżąc 1 × masy ciała (1RM)", "Kultowy próg: własna masa na klatce. ~Top 30% trenujących."],
  ["Martwy ciąg 1,5 × masy ciała (1RM)", "Poziom średniozaawansowany."],
  ["Zrób 15 dipów"],
  ["Zrób 50 pompek"],
  // 46-65 · Zaawansowany
  ["Przysiad 1,5 × masy ciała (1RM)"],
  ["Zrób 12 podciągnięć"],
  ["OHP 0,65 × masy ciała (1RM)"],
  ["Utrzymaj plank przez 5 minut"],
  ["Wyciskanie leżąc 1,1 × masy ciała (1RM)"],
  ["Martwy ciąg 1,75 × masy ciała (1RM)"],
  ["Zrób podciągnięcie z obciążeniem +10 kg"],
  ["Zrób 20 dipów"],
  ["Przysiad 1,75 × masy ciała (1RM)", "Wg StrengthLevel poziom zaawansowany."],
  ["Zrób 15 podciągnięć"],
  ["Wyciskanie leżąc 1,25 × masy ciała (1RM)"],
  ["OHP 0,75 × masy ciała (1RM)"],
  ["Martwy ciąg 2 × masy ciała (1RM)", "Podwójna masa ciała z ziemi — poziom zaawansowany."],
  ["Zrób dipa z obciążeniem +20 kg"],
  ["Zrób 60 pompek"],
  ["Przysiad 2 × masy ciała (1RM)", "Dwukrotność masy ciała na plecach."],
  ["Zrób 18 podciągnięć"],
  ["Wyciskanie leżąc 1,4 × masy ciała (1RM)"],
  ["Zrób podciągnięcie z obciążeniem +20 kg"],
  ["OHP 0,85 × masy ciała (1RM)"],
  // 66-85 · Wyczynowy
  ["Martwy ciąg 2,25 × masy ciała (1RM)"],
  ["Zrób 20 podciągnięć", "Wynik z testów sprawnościowych jednostek specjalnych."],
  ["Wyciskanie leżąc 1,5 × masy ciała (1RM)", "Poziom zaawansowany — ~top 5-10% ćwiczących."],
  ["Przysiad 2,25 × masy ciała (1RM)"],
  ["Zrób muscle-up na drążku", "Podciągnięcie przechodzące w dip — combo siły i techniki."],
  ["OHP 0,95 × masy ciała (1RM)"],
  ["Zrób dipa z obciążeniem +40 kg"],
  ["Martwy ciąg 2,5 × masy ciała (1RM)", "Wg StrengthLevel pogranicze elite."],
  ["Zrób podciągnięcie z obciążeniem +30 kg"],
  ["Wyciskanie leżąc 1,6 × masy ciała (1RM)"],
  ["Przysiad 2,5 × masy ciała (1RM)", "Poziom elite StrengthLevel."],
  ["Zrób 25 podciągnięć"],
  ["OHP 1 × masy ciała (1RM)", "Własna masa nad głowę — rzadki widok na siłowni."],
  ["Weź udział w zawodach siłowych (trójbój, wyciskanie, crossfit…)"],
  ["Martwy ciąg 2,75 × masy ciała (1RM)"],
  ["Wyciskanie leżąc 1,75 × masy ciała (1RM)"],
  ["Zrób podciągnięcie z obciążeniem +40 kg"],
  ["Przysiad 2,75 × masy ciała (1RM)"],
  ["Zrób 30 podciągnięć"],
  ["Martwy ciąg 3 × masy ciała (1RM)", "Trzykrotność masy ciała — poziom wyczynowy."],
  // 86-99 · Elita
  ["Wyciskanie leżąc 1,9 × masy ciała (1RM)"],
  ["OHP 1,1 × masy ciała (1RM)"],
  ["Zrób muscle-up z obciążeniem"],
  ["Przysiad 3 × masy ciała (1RM)"],
  ["Zrób podciągnięcie z obciążeniem +50 kg"],
  ["Wyciskanie leżąc 2 × masy ciała (1RM)", "Podwójna masa ciała — poziom elite, top <1% trenujących."],
  ["Martwy ciąg 3,25 × masy ciała (1RM)"],
  ["Zdobądź klasyfikację w federacji trójboju (dowolna klasa)"],
  ["Przysiad 3,25 × masy ciała (1RM)"],
  ["OHP 1,2 × masy ciała (1RM)"],
  ["Wyciskanie leżąc 2,1 × masy ciała (1RM)"],
  ["Martwy ciąg 3,5 × masy ciała (1RM)"],
  ["Zdobądź II klasę sportową lub wyżej w trójboju siłowym"],
  ["Poziom mistrzowski: klasa I/M w federacji trójboju lub total 6 × masy ciała", "Total (przysiad+wyciskanie+martwy ciąg) sześciokrotności masy ciała to poziom mistrzostw kraju."],
]);

export const criteriaByLevel: Record<number, Criterion> = {
  1: prog("pompki", 1), 4: prog("pompki", 5), 8: prog("pompki", 10), 11: prog("pompki", 15),
  17: prog("pompki", 20), 25: prog("pompki", 25), 31: prog("pompki", 30), 40: prog("pompki", 40),
  45: prog("pompki", 50), 60: prog("pompki", 60),
  2: prog("plank", 30), 7: prog("plank", 60), 19: prog("plank", 120), 35: prog("plank", 180), 49: prog("plank", 300),
  3: prog("przysiad-bw", 5), 6: prog("przysiad-bw", 10),
  5: prog("zwis", 20), 13: prog("zwis", 45),
  9: prog("przysiad", 20), 16: prog("przysiad", 50), 24: prog("przysiad", 75), 30: prog("przysiad", 100),
  39: prog("przysiad", 125), 46: prog("przysiad", 150), 54: prog("przysiad", 175), 61: prog("przysiad", 200),
  69: prog("przysiad", 225), 76: prog("przysiad", 250), 83: prog("przysiad", 275), 89: prog("przysiad", 300),
  94: prog("przysiad", 325),
  10: freq(2, 4), 23: freq(3, 4), 32: freq(3, 12),
  12: prog("wyciskanie", 20), 18: prog("wyciskanie", 50), 33: prog("wyciskanie", 75), 42: prog("wyciskanie", 100),
  50: prog("wyciskanie", 110), 56: prog("wyciskanie", 125), 63: prog("wyciskanie", 140), 68: prog("wyciskanie", 150),
  75: prog("wyciskanie", 160), 81: prog("wyciskanie", 175), 86: prog("wyciskanie", 190), 91: prog("wyciskanie", 200),
  96: prog("wyciskanie", 210),
  14: prog("ciag", 40), 21: prog("ciag", 75), 28: prog("ciag", 100), 36: prog("ciag", 125),
  43: prog("ciag", 150), 51: prog("ciag", 175), 58: prog("ciag", 200), 66: prog("ciag", 225),
  73: prog("ciag", 250), 80: prog("ciag", 275), 85: prog("ciag", 300), 92: prog("ciag", 325),
  97: prog("ciag", 350),
  15: prog("podciaganie", 1), 22: prog("podciaganie", 3), 27: prog("podciaganie", 5), 34: prog("podciaganie", 8),
  41: prog("podciaganie", 10), 47: prog("podciaganie", 12), 55: prog("podciaganie", 15), 62: prog("podciaganie", 18),
  67: prog("podciaganie", 20), 77: prog("podciaganie", 25), 84: prog("podciaganie", 30),
  52: prog("podciaganie-ciezar", 10), 64: prog("podciaganie-ciezar", 20), 74: prog("podciaganie-ciezar", 30),
  82: prog("podciaganie-ciezar", 40), 90: prog("podciaganie-ciezar", 50),
  20: prog("dipy", 1), 29: prog("dipy", 5), 37: prog("dipy", 10), 44: prog("dipy", 15), 53: prog("dipy", 20),
  59: prog("dipy-ciezar", 20), 72: prog("dipy-ciezar", 40),
  26: prog("ohp", 35), 38: prog("ohp", 50), 48: prog("ohp", 65), 57: prog("ohp", 75),
  65: prog("ohp", 85), 71: prog("ohp", 95), 78: prog("ohp", 100), 87: prog("ohp", 110), 95: prog("ohp", 120),
  // 70 (muscle-up), 79 (zawody), 88, 93, 98, 99 — manual, bez kryteriów.
};

// ---------------------------------------------------------------------------
// Learning resources. Every URL fetched before it was written here — YouTube via
// oEmbed, the rest with a real GET. ExRx's strength-standards page was a candidate
// and is not here: it answers 403 to anything that is not a browser, and a link that
// only works for some readers is not a resource.
//
// The standards at L30 and L75 are bodyweight-relative on purpose: that is how every
// recognised system (Strength Level, ExRx, Barbell Medicine) expresses them, and how
// this ladder's own thresholds are written.
import type { MilestoneResource } from "../../src/lib/milestone-resources";

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "article", title: "r/Fitness Basic Beginner Routine — od czego zacząć", url: "https://thefitness.wiki/routines/r-fitness-basic-beginner-routine/" },
    { kind: "reference", title: "The Fitness Wiki — baza wiedzy o treningu", url: "https://thefitness.wiki/" },
  ],
  12: [
    { kind: "video", title: "Przysiad — każda odmiana, krok po kroku", url: yt("UFs6E3Ti1jg") },
    { kind: "article", title: "Squat University: jak nauczyć się poprawnego przysiadu", url: "https://squatuniversity.com/2016/02/05/how-to-teach-a-perfect-squat/" },
  ],
  20: [{ kind: "video", title: "Przysiad wysoki i niski drążek — Untamed Strength", url: yt("bs_Ej32IYgo") }],
  30: [{ kind: "reference", title: "Standardy siłowe wg masy ciała (początkujący → elita)", url: "https://strengthlevel.com/strength-standards" }],
  45: [{ kind: "video", title: "Trzy poprawki, które naprawiają przysiad", url: yt("4b4_ZT0yB1I") }],
  60: [{ kind: "article", title: "Trening siły i masy — jak układać progresję", url: "https://thefitness.wiki/routines/strength-training-muscle-building/" }],
  75: [{ kind: "article", title: "Barbell Medicine: co naprawdę znaczą „standardy siłowe”", url: "https://www.barbellmedicine.com/blog/strength-standards/" }],
  85: [{ kind: "reference", title: "Overcoming Gravity — 16-stopniowe drabinki progresji kalisteniki", url: "https://stevenlow.org/overcoming-gravity/" }],
};
