// Martial arts ladder 1-99 (discipline-agnostic: BJJ, boxing, muay thai,
// karate, judo…). Tracks: training count, sparring rounds, gradings (belt
// exams counted generically), competition experience. Manual check-offs.
import type { Criterion } from "../../src/lib/milestone-criteria";
import { ladder, freq, prog } from "./helpers";

export const activity = {
  slug: "sztuki-walki",
  name: "Sztuki walki",
  icon: "🥋",
  description:
    "Dowolna dyscyplina — boks, BJJ, muay thai, judo, karate… Od pierwszego treningu po zawody. Stopnie liczone neutralnie („kolejny egzamin”).",
  sortOrder: 14,
  logKind: "manual" as const,
};

export const milestones = ladder([
  // 1-10 · Pierwsze kroki
  ["Ukończ pierwszy trening sztuki walki", "Najtrudniejszy krok to wejście na matę/salę."],
  ["Opanuj pozycję walki (postawę) swojej dyscypliny"],
  ["Ukończ 3 treningi"],
  ["Opanuj podstawowy cios/rzut/technikę nr 1", "Jab, o-goto, mae-geri — zależnie od stylu."],
  ["Ukończ 5 treningów"],
  ["Opanuj prawidłowy sposób padania lub obrony podstawowej"],
  ["Ukończ 10 treningów"],
  ["Wykonaj kombinację 2 technik płynnie"],
  ["Przetrwaj pełny trening bez przerwy (całe zajęcia w pełnej intensywności)"],
  ["Ukończ 15 treningów"],
  // 11-25 · Regularny
  ["Trenuj 2 razy w tygodniu przez 4 kolejne tygodnie"],
  ["Opanuj 5 technik swojej dyscypliny"],
  ["Ukończ 25 treningów"],
  ["Weź udział w pierwszym sparingu zadaniowym (light)", "Kontrolowana walka — nauka, nie wojna."],
  ["Wykonaj kombinację 4 technik płynnie"],
  ["Ukończ 40 treningów"],
  ["Przetrwaj 3 rundy sparingu light"],
  ["Opanuj 10 technik"],
  ["Ukończ 60 treningów"],
  ["Zdaj pierwszy egzamin na stopień (lub odbierz pierwszy pas/szarfę)", "W BJJ: pierwsza belka. W boksie: zaliczenie okresu."],
  ["Trenuj 3 razy w tygodniu przez 8 kolejnych tygodni"],
  ["Ukończ 80 treningów"],
  ["Zaliczaj 10 sparingów łącznie"],
  ["Wykonaj technikę w sparingu (zaplanowaną, nie przypadkową)"],
  ["Ukończ 100 treningów", "Setka na macie/sali."],
  // 26-45 · Średniozaawansowany
  ["Opanuj 20 technik"],
  ["Przetrwaj 5 rund sparingu w jednym treningu"],
  ["Ukończ 125 treningów"],
  ["Zdaj drugi egzamin na stopień"],
  ["Zaliczaj 25 sparingów łącznie"],
  ["Trenuj z partnerem znacznie cięższym/lepszym i przetrwaj rundę"],
  ["Ukończ 150 treningów"],
  ["Poprowadź rozgrzewkę dla grupy"],
  ["Opanuj 30 technik"],
  ["Ukończ 200 treningów"],
  ["Zdaj trzeci egzamin na stopień"],
  ["Zaliczaj 50 sparingów łącznie", "Pół setki rund nauki w walce."],
  ["Wygraj sparing zadaniowy z równorzędnym partnerem (ocena trenera)"],
  ["Ukończ 250 treningów"],
  ["Weź udział w seminarium z zaproszonym mistrzem"],
  ["Opanuj 50 technik"],
  ["Ukończ 300 treningów"],
  ["Zdaj czwarty egzamin na stopień", "W wielu stylach — środek drogi do czarnego pasa."],
  ["Zaliczaj 100 sparingów łącznie"],
  ["Trenuj drugą dyscyplinę uzupełniającą (min. 10 treningów)"],
  // 46-65 · Zaawansowany
  ["Ukończ 400 treningów"],
  ["Zgłoś się na pierwsze zawody (dowolna formuła: interliga, first-timers)"],
  ["Stocz pierwszą walkę na zawodach", "Niezależnie od wyniku — to inny świat niż sparing."],
  ["Ukończ 500 treningów", "Pół tysiąca treningów."],
  ["Wygraj pierwszą walkę na zawodach"],
  ["Zdaj piąty egzamin na stopień"],
  ["Zaliczaj 150 sparingów łącznie"],
  ["Ukończ 600 treningów"],
  ["Stocz 5 walk na zawodach"],
  ["Zdobądź medal na zawodach lokalnych/interlidze"],
  ["Trenuj nieprzerwanie przez 2 lata (bez przerwy dłuższej niż miesiąc)"],
  ["Ukończ 750 treningów"],
  ["Zdaj szósty egzamin na stopień"],
  ["Stocz 10 walk na zawodach"],
  ["Zaliczaj 250 sparingów łącznie"],
  ["Zdobądź medal na zawodach rangi wojewódzkiej"],
  ["Ukończ 900 treningów"],
  ["Pomagaj regularnie w prowadzeniu grupy początkującej"],
  ["Wygraj turniej lokalny w swojej kategorii"],
  ["Ukończ 1000 treningów", "Cztery cyfry. Jesteś innym człowiekiem niż na poziomie 1."],
  // 66-85 · Wyczynowy
  ["Zdaj siódmy egzamin na stopień", "W stylach z systemem kyu — okolice brązowego pasa."],
  ["Stocz 15 walk na zawodach"],
  ["Zdobądź złoto na zawodach rangi wojewódzkiej"],
  ["Ukończ 1200 treningów"],
  ["Zaliczaj 400 sparingów łącznie"],
  ["Stocz walkę z zawodnikiem z wyższym stopniem i wygraj"],
  ["Weź udział w zawodach rangi ogólnopolskiej"],
  ["Ukończ 1400 treningów"],
  ["Zdaj ósmy egzamin na stopień"],
  ["Stocz 25 walk na zawodach"],
  ["Zdobądź medal na zawodach ogólnopolskich"],
  ["Ukończ 1600 treningów"],
  ["Ukończ kurs sędziowski lub instruktorski podstawowy"],
  ["Zaliczaj 600 sparingów łącznie"],
  ["Trenuj nieprzerwanie przez 5 lat"],
  ["Ukończ 1800 treningów"],
  ["Zdobądź stopień mistrzowski (czarny pas / odpowiednik)", "W BJJ: brązowy/czarny. Przeciętnie 8-12 lat praktyki."],
  ["Stocz 40 walk na zawodach"],
  ["Zdobądź złoto na zawodach ogólnopolskich"],
  ["Ukończ 2000 treningów"],
  // 86-99 · Elita
  ["Poprowadź własną grupę treningową przez pełny semestr"],
  ["Zaliczaj 800 sparingów łącznie"],
  ["Zdobądź podium mistrzostw regionu w swojej kategorii"],
  ["Ukończ 2500 treningów"],
  ["Stocz 60 walk na zawodach"],
  ["Zdobądź drugi stopień mistrzowski (2 dan / odpowiednik)"],
  ["Wygraj mistrzostwa regionu w swojej kategorii"],
  ["Ukończ 3000 treningów", "Około 10 lat przy 6 treningach tygodniowo."],
  ["Weź udział w zawodach o zasięgu ogólnopolskim"],
  ["Stocz 80 walk na zawodach"],
  ["Zdobądź podium na zawodach ogólnopolskich"],
  ["Zdobądź trzeci stopień mistrzowski (3 dan / odpowiednik)"],
  ["Poprowadź własną szkołę / klub przez dłuższy czas"],
  ["Poziom mistrzowski (amatorski szczyt): 3 dan i wieloletni, dojrzały warsztat", "Dalsze, zawodowe osiągnięcia potwierdzają osobne certyfikaty."],
]);

export const criteriaByLevel: Record<number, Criterion> = {
  1: prog("treningi", 1), 3: prog("treningi", 3), 5: prog("treningi", 5), 7: prog("treningi", 10),
  10: prog("treningi", 15), 13: prog("treningi", 25), 16: prog("treningi", 40), 19: prog("treningi", 60),
  22: prog("treningi", 80), 25: prog("treningi", 100), 28: prog("treningi", 125), 32: prog("treningi", 150),
  35: prog("treningi", 200), 39: prog("treningi", 250), 42: prog("treningi", 300), 46: prog("treningi", 400),
  49: prog("treningi", 500), 53: prog("treningi", 600), 57: prog("treningi", 750), 62: prog("treningi", 900),
  65: prog("treningi", 1000), 69: prog("treningi", 1200), 73: prog("treningi", 1400), 77: prog("treningi", 1600),
  81: prog("treningi", 1800), 85: prog("treningi", 2000), 89: prog("treningi", 2500), 93: prog("treningi", 3000),
  4: prog("techniki", 1), 8: prog("techniki", 2), 12: prog("techniki", 5), 15: prog("techniki", 7),
  18: prog("techniki", 10), 26: prog("techniki", 20), 34: prog("techniki", 30), 41: prog("techniki", 50),
  14: prog("sparingi", 1), 17: prog("sparingi", 3), 23: prog("sparingi", 10), 30: prog("sparingi", 25),
  37: prog("sparingi", 50), 44: prog("sparingi", 100), 52: prog("sparingi", 150), 60: prog("sparingi", 250),
  70: prog("sparingi", 400), 79: prog("sparingi", 600), 87: prog("sparingi", 800),
  20: prog("egzaminy", 1), 29: prog("egzaminy", 2), 36: prog("egzaminy", 3), 43: prog("egzaminy", 4),
  51: prog("egzaminy", 5), 58: prog("egzaminy", 6), 66: prog("egzaminy", 7), 74: prog("egzaminy", 8),
  82: prog("egzaminy", 9), 91: prog("egzaminy", 10), 97: prog("egzaminy", 11),
  48: prog("walki", 1), 54: prog("walki", 5), 59: prog("walki", 10), 67: prog("walki", 15),
  75: prog("walki", 25), 83: prog("walki", 40), 90: prog("walki", 60), 95: prog("walki", 80),
  11: freq(2, 4), 21: freq(3, 8),
  // pozostałe: medale, kursy, tytuły — manualne.
};

// ---------------------------------------------------------------------------
// Learning resources. Every URL fetched before it was written here.
//
// Breakfalls first, and at level one, because that is the order the sport itself uses:
// ukemi is the first thing a judo beginner is taught, and the only technique whose
// absence gets people hurt.
//
// On grading: judo and BJJ have real ladders, but they are time-in-grade and
// teacher-gated rather than performance-measured — IBJJF publishes explicit minimums
// (blue 2 years, purple 1.5, brown 1), which is the most transparent set in the sport
// and is linked at L50. Boxing, by contrast, has NO skill ladder at all: amateur boxing
// splits only Novice (≤10 bouts) from Open, and beyond that ranks only people who
// compete. This ladder therefore counts training and sparring rather than pretending a
// universal grade exists.
import type { MilestoneResource } from "../../src/lib/milestone-resources";

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  // — Rozszerzenie zasobów Tier 1 (wszystkie linki zweryfikowane jako aktywne) —
  2: [{ kind: "video", title: "Postawa bokserska krok po kroku — fundament każdej techniki", url: yt("SjLXzCpRS8U") }],
  3: [{ kind: "video", title: "Uderzać czy walczyć w parterze — który styl sztuk walki wybrać", url: yt("3_Hy4hz2HVk") }],
  6: [{ kind: "video", title: "Jak bezpiecznie padać — trzy techniki na każdą stronę", url: yt("ZVzzJ4xDgoE") }],
  7: [{ kind: "video", title: "Rozgrzewka i rozciąganie przed treningiem — sesja do powtarzania", url: yt("h_VjN6bzgwU") }],
  8: [{ kind: "video", title: "Pięć kombinacji, które musi znać każdy początkujący", url: yt("kzOuIDYXCHg") }],
  12: [{ kind: "video", title: "Jak nauczyć się i opanować dowolną technikę — pełny proces", url: yt("8wsErcCTRyo") }],
  14: [{ kind: "video", title: "Twardy czy lekki sparing — dlaczego zaczynać na lekko", url: yt("hvGZNDWNfqk") }],
  18: [{ kind: "article", title: "Jak studiować technikę z nagrań — dziesięć wskazówek", url: "https://brianejohns.com/2024/02/14/top-ten-tips-for-watching-martial-arts-instructional-videos/" }],
  30: [{ kind: "article", title: "Po co trenować drugą dyscyplinę — korzyści z cross-treningu", url: "https://jitsmagazine.com/the-benefits-of-cross-training-in-martial-arts/" }],
  40: [{ kind: "video", title: "Jak przygotować się do walki — obóz startowy krok po kroku", url: yt("by-wgyePRos") }],
  45: [{ kind: "video", title: "Jak opanować nerwy przed walką — mentalność zawodnika", url: yt("-4kSEJnWCXo") }],
  1: [
    { kind: "video", title: "Padanie (ukemi) — pierwsza rzecz, której się uczysz", url: yt("q6FBYGpUsY8") },
    { kind: "video", title: "Jak wybrać sztukę walki — przegląd stylów", url: yt("Aaebn1eAdYs") },
  ],
  4: [{ kind: "video", title: "Podstawy boksu — jab, prosty, gardé", url: yt("rjJNo2MG0fY") }],
  5: [
    { kind: "video", title: "Ukemi w judo — jak padać bezpiecznie", url: yt("mONxdnLk53M") },
    { kind: "article", title: "Podstawy judo — lekcje dla początkujących", url: "https://judoinfo.com/judo-basics-beginners/" },
  ],
  10: [{ kind: "video", title: "BJJ — guard i podstawowe pozycje", url: yt("bDVO4bqp27c") }],
  15: [{ kind: "article", title: "Pięć technik, od których zaczyna każdy judoka", url: "https://www.kokakids.co.uk/judo-techniques-for-beginners" }],
  20: [{ kind: "video", title: "Muay Thai — kopnięcia i kolana podstawy", url: yt("QVov2TEYJ8k") }],
  25: [{ kind: "video", title: "Padanie w cztery strony — komplet ukemi", url: yt("5n_Qjeia2n8") }, { kind: "article", title: "Jak przełamać zastój (plateau) w treningu", url: "https://www.grapplearts.com/how-to-get-past-a-plateau-in-bjj/" }],
  35: [{ kind: "video", title: "Sparing — jak zacząć bezpiecznie", url: yt("9q-BTnG0gSU") }],
  50: [{ kind: "reference", title: "IBJJF — minimalne okresy między pasami", url: "https://ibjjf.com/news/ibjjf-minimum-graduation-period-update" }],
  60: [{ kind: "article", title: "Jak przygotować się do pierwszych zawodów", url: "https://www.wikihow.com/Prepare-for-a-Martial-Arts-Tournament" }],
  70: [{ kind: "reference", title: "System kyu/dan w judo — droga do czarnego pasa", url: "https://en.wikipedia.org/wiki/Rank_in_judo" }],
  85: [{ kind: "reference", title: "BJJ — system pasów i czas na każdy stopień", url: "https://en.wikipedia.org/wiki/Brazilian_jiu-jitsu_ranking_system" }],
};
