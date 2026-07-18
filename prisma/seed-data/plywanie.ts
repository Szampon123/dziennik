// Swimming ladder 1-99. Distances logged in km (0,1 km = 100 m — said again in the
// activity description, because a swimmer thinks in metres and the form asks for km).
//
// ─── WHY THIS LADDER WAS REBUILT (2026-07-14) ───────────────────────────────
// The old ladder put timed swims from level 13 (100 m under 3:00) and leaned on them
// the whole way up: 51 of its 99 levels were time-for-distance. Those mid-ladder
// thresholds came from the pace bands every swimming site publishes — "beginner
// 2:30-3:00/100 m, club 1:15-1:40" — and an audit of the sources found nothing
// underneath them. There is **no published distribution of recreational swimmers'
// 100 m times**. The sites agree because they copy each other. We could not have
// defended a single number between L13 and L70 if anyone had asked where it came from.
//
// So the ladder now stands on what *is* published:
//
//   1-10   Swim England's Learn to Swim stages 1-7 — the national competence
//          framework, and the only real beginner ladder swimming has. Its milestones
//          are distances and water skills, not times: 5 m unaided (S2), 10 m front
//          and back (S3), all four strokes over 10 m + tread water 30 s (S5), 25 m
//          (S6), 100 m continuous (S7).
//          https://www.swimming.org/learntoswim/swim-england-learn-to-swim-awards-1-7/
//   11-70  Continuous distance, volume, and named skills (bilateral breathing, the
//          flip turn, each of the four strokes, open water). All objective, all
//          checkable, none invented.
//   71-99  Times — kept, because at the top they *do* have a source. The ceiling is
//          anchored on USMS National Qualifying Times, which are derived by a stated
//          method (3-yr average of the 10th-place time, +10-15%): 1650 free 20:09
//          and 100 free 53.0 SCY for men 25-29 (≈ 20:10 / 1:00 in metres), 100 free
//          1:01.36 for women. L96 and L97 are those two, to the second.
//          https://www.usms.org/events/national-championships/pool-national-championships/national-qualifying-times
//
// The trade: a swimmer no longer gets a level for being fast at 100 m until they are
// genuinely fast. Below L70 the ladder rewards distance and craft, which is what a
// recreational swimmer actually builds, and what we can prove we did not make up.
//
// Skill levels carry `prog()` criteria rather than none: they never auto-complete
// (the engine cannot see a flip turn), but they let the cascade work — claiming
// "400 m medley" checks off "100 m backstroke" beneath it.
import { ladderC, d, tfd, weekly, monthly, total, freq, race, anyOf, prog } from "./helpers";

export const activity = {
  slug: "plywanie",
  name: "Pływanie",
  icon: "🏊",
  description:
    "Od pierwszych 5 metrów do progu kwalifikacji masters. Dolna połowa drabinki to dystans i technika, górna to czasy. Dystanse wpisuj w km (100 m = 0,1).",
  sortOrder: 4,
  logKind: "distance" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // ---- 1-10 · Nauka pływania (etapy Swim England 1-7) ----
  ["Zanurz twarz i zrób wydech pod wodę", "Pierwsza rzecz, której uczy każdy kurs. Bez tego nie ma oddechu, a bez oddechu nie ma pływania.", prog("technika", 1)],
  ["Przepłyń 5 m bez pomocy", "Bez deski, bez makaronu, bez dotykania dna. Etap 2 Swim England.", d(0.005)],
  ["Utrzymaj się na wodzie przez 30 sekund", "Treading water — umiejętność, która ratuje życie, a nie zdobywa medali.", prog("technika", 2)],
  ["Przepłyń 10 m na piersiach", "Etap 3.", d(0.01)],
  ["Przepłyń 10 m na plecach", "Ten sam etap, druga strona. Pływanie na plecach to najprostszy sposób na odpoczynek w wodzie.", prog("technika", 3)],
  ["Przepłyń 25 m bez zatrzymania", "Długość krótkiego basenu, od ściany do ściany. Etap 6.", d(0.025)],
  ["Przepłyń 10 m każdym z czterech stylów", "Kraul, grzbiet, klasyk, motyl. Etap 5 — nie chodzi o piękno, tylko o to, żeby każdy styl w ogóle działał.", prog("styl", 4)],
  ["Skocz do głębokiej wody i wróć bezpiecznie do brzegu", "Etap 7. Moment, w którym woda przestaje być groźna.", prog("technika", 4)],
  ["Przepłyń 50 m bez zatrzymania", undefined, d(0.05)],
  ["Przepłyń 100 m bez zatrzymania", "Cel etapu 7 — koniec nauki pływania. Od tej chwili już pływasz, tylko jeszcze niedaleko.", d(0.1)],

  // ---- 11-25 · Pierwszy kilometr ----
  ["Pływaj raz w tygodniu przez 4 kolejne tygodnie", "Regularność buduje formę mocniej niż pojedyncze zrywy.", freq(1, 4)],
  ["Przepłyń 150 m bez zatrzymania", undefined, d(0.15)],
  ["Oddychaj obustronnie (co 3 ruchy) przez 50 m", "Oddech na obie strony prostuje kraula i ratuje w wodach otwartych, gdzie fala potrafi przyjść tylko z jednej strony.", prog("oddech", 3)],
  ["Przepłyń 200 m bez zatrzymania", undefined, d(0.2)],
  ["Pływaj 2 razy w tygodniu przez 4 kolejne tygodnie", undefined, freq(2, 4)],
  ["Przepłyń 300 m bez zatrzymania", undefined, d(0.3)],
  ["Przepłyń 1 km łącznie w jednym tygodniu", "Suma treningów, nie jeden odcinek.", weekly(1)],
  ["Wykonaj nawrót koziołkowy", "Pierwszy koziołek. Wygląda na ozdobnik, a jest różnicą między pływaniem a przerywanym pływaniem.", prog("nawrot", 1)],
  ["Przepłyń 400 m bez zatrzymania", undefined, d(0.4)],
  ["Przepłyń łącznie 10 km", undefined, total(10)],
  ["Przepłyń 500 m bez zatrzymania", undefined, d(0.5)],
  ["Przepłyń 100 m stylem grzbietowym bez zatrzymania", "Drugi styl przestaje być awaryjny, a zaczyna być używany.", prog("styl", 5)],
  ["Przepłyń 2 km łącznie w jednym tygodniu", undefined, weekly(2)],
  ["Przepłyń 750 m bez zatrzymania", undefined, d(0.75)],
  ["Przepłyń 1000 m bez zatrzymania", "Kilometr. Odtąd liczysz dystanse jak pływak, a nie jak ktoś, kto chodzi na basen.", d(1)],

  // ---- 26-40 · Regularny pływak ----
  ["Pływaj 2 razy w tygodniu przez 12 kolejnych tygodni", "Kwartał regularności — moment, w którym technika przestaje się rozjeżdżać między treningami.", freq(2, 12)],
  ["Przepłyń 100 m stylem klasycznym poprawnie technicznie", "Klasyk jest najwolniejszy i najtrudniejszy do zrobienia dobrze.", prog("styl", 6)],
  ["Przepłyń 1200 m bez zatrzymania", undefined, d(1.2)],
  ["Przepłyń 3 km łącznie w jednym tygodniu", undefined, weekly(3)],
  ["Przepłyń 1500 m bez zatrzymania", "Dystans olimpijski „na długim”. Dla amatora — pierwszy naprawdę długi ciągły odcinek.", d(1.5)],
  ["Wykonaj 10 nawrotów koziołkowych w jednym treningu", "Nawrót przestaje być sztuczką, a staje się nawykiem.", prog("nawrot", 10)],
  ["Przepłyń łącznie 50 km", undefined, total(50)],
  ["Przepłyń 1800 m bez zatrzymania", undefined, d(1.8)],
  ["Przepłyń 12 km w jednym miesiącu", undefined, monthly(12)],
  ["Przepłyń 100 m stylem motylkowym", "Najtrudniejszy styl. Sto metrów motyla to dla większości amatorów szczyt, a nie etap.", prog("styl", 7)],
  ["Przepłyń 2000 m bez zatrzymania", undefined, d(2)],
  ["Pływaj 3 razy w tygodniu przez 8 kolejnych tygodni", undefined, freq(3, 8)],
  ["Przepłyń 4 km łącznie w jednym tygodniu", undefined, weekly(4)],
  ["Przepłyń 2500 m bez zatrzymania", undefined, d(2.5)],
  ["Przepłyń 400 m stylem zmiennym (cztery style po 100 m)", "Wszystkie cztery style, jeden po drugim, bez wychodzenia z wody. Test kompletności warsztatu.", prog("styl", 8)],

  // ---- 41-55 · Długodystansowiec ----
  ["Przepłyń 3000 m bez zatrzymania", undefined, d(3)],
  ["Przepłyń łącznie 100 km", undefined, total(100)],
  ["Przepłyń 5 km łącznie w jednym tygodniu", undefined, weekly(5)],
  ["Przepłyń 3500 m bez zatrzymania", undefined, d(3.5)],
  ["Przepłyń 25 km w jednym miesiącu", undefined, monthly(25)],
  ["Przepłyń 4000 m bez zatrzymania", undefined, d(4)],
  ["Pływaj 3 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(3, 12)],
  ["Przepłyń 6 km łącznie w jednym tygodniu", undefined, weekly(6)],
  ["Przepłyń 4500 m bez zatrzymania", undefined, d(4.5)],
  ["Przepłyń 5000 m bez zatrzymania", "Połowa drabinki i klasyczny dystans wód otwartych. Ponad godzina ciągłego pływania.", d(5)],
  ["Przepłyń 1500 m w wodach otwartych", "Jezioro, morze, rzeka. Bez ścian, bez linii na dnie, z falą i zimną wodą — to zupełnie inny sport niż basen.", prog("otwarte", 1)],
  ["Przepłyń 8 km łącznie w jednym tygodniu", undefined, weekly(8)],
  ["Przepłyń łącznie 250 km", undefined, total(250)],
  ["Przepłyń 6000 m bez zatrzymania", undefined, d(6)],
  ["Przepłyń 40 km w jednym miesiącu", undefined, monthly(40)],

  // ---- 56-70 · Wody otwarte i objętość ----
  ["Przepłyń 3 km w wodach otwartych", undefined, prog("otwarte", 3)],
  ["Przepłyń 7000 m bez zatrzymania", undefined, d(7)],
  ["Przepłyń 10 km łącznie w jednym tygodniu", undefined, weekly(10)],
  ["Pływaj 4 razy w tygodniu przez 8 kolejnych tygodni", undefined, freq(4, 8)],
  ["Przepłyń 8000 m bez zatrzymania", undefined, d(8)],
  ["Weź udział w zawodach pływackich lub przeprawie", "Zaznacz trening jako zawody. Start mierzy coś, czego trening nie zmierzy.", race],
  ["Przepłyń 5 km w wodach otwartych", undefined, prog("otwarte", 5)],
  ["Przepłyń łącznie 500 km", undefined, total(500)],
  ["Przepłyń 12 km łącznie w jednym tygodniu", undefined, weekly(12)],
  ["Przepłyń 9000 m bez zatrzymania", undefined, d(9)],
  ["Przepłyń 60 km w jednym miesiącu", undefined, monthly(60)],
  ["Pływaj 4 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(4, 12)],
  ["Przepłyń 15 km łącznie w jednym tygodniu", undefined, weekly(15)],
  ["Przepłyń 10 km w wodach otwartych", "Maraton pływacki wód otwartych — dystans olimpijski.", prog("otwarte", 10)],
  ["Przepłyń 10 000 m bez zatrzymania", "Dziesięć kilometrów jednym ciągiem. Od tego poziomu drabinka przestaje pytać, jak daleko, a zaczyna pytać, jak szybko.", d(10)],

  // ---- 71-85 · Czasy: od sprawnego do klubowego ----
  ["Przepłyń 400 m poniżej 8:00", "Tempo 2:00/100 m utrzymane przez 400 m.", tfd(0.4, 8)],
  ["Przepłyń 100 m poniżej 1:45", undefined, tfd(0.1, 1.75)],
  ["Przepłyń 1500 m poniżej 35:00", undefined, tfd(1.5, 35)],
  ["Przepłyń 400 m poniżej 7:30", undefined, tfd(0.4, 7.5)],
  ["Przepłyń 100 m poniżej 1:35", undefined, tfd(0.1, 1.5833)],
  ["Przepłyń 1500 m poniżej 32:00", undefined, tfd(1.5, 32)],
  ["Przepłyń 400 m poniżej 7:00", undefined, tfd(0.4, 7)],
  ["Przepłyń 100 m poniżej 1:30", "Próg, który trenerzy nazywają klubowym. Pierwsza liczba w tej drabince, przy której tempo zaczyna mieć znaczenie.", tfd(0.1, 1.5)],
  ["Przepłyń 1500 m poniżej 30:00", "Tempo 2:00/100 m przez półtora kilometra.", tfd(1.5, 30)],
  ["Przepłyń 400 m poniżej 6:30", undefined, tfd(0.4, 6.5)],
  ["Przepłyń 100 m poniżej 1:25", undefined, tfd(0.1, 1.4167)],
  ["Przepłyń 1500 m poniżej 28:00", undefined, tfd(1.5, 28)],
  ["Przepłyń 400 m poniżej 6:00", undefined, tfd(0.4, 6)],
  ["Przepłyń 100 m poniżej 1:20", undefined, tfd(0.1, 1.3333)],
  ["Przepłyń 1500 m poniżej 26:00", undefined, tfd(1.5, 26)],

  // ---- 86-99 · Masters i próg kwalifikacji ----
  ["Przepłyń 400 m poniżej 5:40", undefined, tfd(0.4, 5.6667)],
  ["Przepłyń 100 m poniżej 1:15", "Mocny poziom masters.", tfd(0.1, 1.25)],
  ["Przepłyń 1500 m poniżej 24:00", undefined, tfd(1.5, 24)],
  ["Przepłyń 400 m poniżej 5:20", undefined, tfd(0.4, 5.3333)],
  ["Przepłyń 100 m poniżej 1:10", undefined, tfd(0.1, 1.1667)],
  ["Przepłyń 1500 m poniżej 22:30", undefined, tfd(1.5, 22.5)],
  ["Przepłyń 400 m poniżej 5:00", "Tempo 1:15/100 m przez 400 m.", tfd(0.4, 5)],
  ["Przepłyń 100 m poniżej 1:05", undefined, tfd(0.1, 1.0833)],
  ["Przepłyń 1500 m poniżej 21:00", undefined, tfd(1.5, 21)],
  ["Przepłyń 400 m poniżej 4:45", undefined, tfd(0.4, 4.75)],
  ["Przepłyń 1500 m poniżej 20:10", "Próg kwalifikacji do mistrzostw USMS na 1650 jardów (20:09) — mężczyźni 25-29 lat. Pierwszy poziom w tej drabince, który odpowiada realnemu, opublikowanemu standardowi zawodniczemu.", tfd(1.5, 20.1667)],
  ["Przepłyń 100 m poniżej 1:01", "Próg kwalifikacji USMS na 100 jardów kraulem — kobiety 25-29 lat (1:01,36).", tfd(0.1, 1.0167)],
  ["Przepłyń 100 m poniżej 0:58", "Okolice progu kwalifikacji USMS dla mężczyzn (53,0 na 100 jardów).", tfd(0.1, 0.9667)],
  ["Poziom mistrzowski (amatorski szczyt): 100 m poniżej 0:56 lub 1500 m poniżej 19:00", "Dojrzały, wieloletni warsztat zaangażowanego amatora — powyżej progów kwalifikacyjnych masters. Wyniki zawodowe potwierdzają osobne certyfikaty.", anyOf(tfd(0.1, 0.9333), tfd(1.5, 19))],
]);

// ---------------------------------------------------------------------------
// Learning resources. Every URL fetched before it was written here — YouTube via
// oEmbed, the rest with a real GET.
//
// L1 and L96 carry the two documents this ladder is actually built on: Swim England's
// Learn to Swim stages, which the bottom ten levels follow, and the USMS qualifying
// times, which the top ones are set to. A reader who wants to know where a number came
// from can click it.
import type { MilestoneResource } from "../../src/lib/milestone-resources";

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  // — Rozszerzenie zasobów Tier 1 (wszystkie linki zweryfikowane jako aktywne) —
  3: [{ kind: "video", title: "Jak utrzymać się na wodzie — nauka dla początkujących", url: yt("7m8dzlVEPvI") }],
  5: [{ kind: "video", title: "Styl grzbietowy dla początkujących — technika krok po kroku", url: yt("rpjOiXerg0E") }],
  6: [{ kind: "video", title: "Oddychanie w kraulu — ćwiczenia dla początkujących", url: yt("Gq2asyrI0MI") }],
  7: [{ kind: "video", title: "Motyl krok po kroku — prosty przewodnik po technice", url: yt("x-CB6aD4S2s") }],
  8: [{ kind: "video", title: "Jak pokonać strach przed głęboką wodą", url: yt("yW31bm0Lj2E") }],
  14: [{ kind: "video", title: "Jak zbudować wytrzymałość w pływaniu", url: yt("ogW23_DdVzQ") }],
  20: [{ kind: "video", title: "Jak zaplanować trening pływacki — struktura sesji", url: yt("oM4sHl1hTEE") }],
  22: [{ kind: "video", title: "5 najlepszych ćwiczeń na styl grzbietowy", url: yt("-hayxgpNw6s") }],
  27: [{ kind: "video", title: "Styl klasyczny dla początkujących — dokładna technika", url: yt("ppuDgfdk9y8") }],
  31: [{ kind: "video", title: "Nawrót koziołkowy — od początkującego do zawodowca", url: yt("dDfs74Gxl6g") }],
  35: [{ kind: "video", title: "Motyl jak u najlepszych — technika na wyższym poziomie", url: yt("9pmnD4ah-0M") }],
  40: [{ kind: "video", title: "Jak przetrwać styl zmienny (IM) — taktyka i tempo", url: yt("v-k4kSldI3k") }],
  45: [{ kind: "article", title: "Periodyzacja treningu — jak rozplanować sezon pływacki", url: "https://www.usms.org/fitness-and-training/articles-and-videos/articles/periodization" }],
  50: [{ kind: "video", title: "9 wskazówek na wody otwarte dla początkujących", url: yt("BEmR9jZ6m2U") }],
  56: [{ kind: "video", title: "Orientacja w wodach otwartych — technika sightingu", url: yt("w7iIf192S4w") }],
  60: [{ kind: "article", title: "Jak przygotować się do pierwszych zawodów pływackich", url: "https://www.usms.org/fitness-and-training/articles-and-videos/articles/how-to-prepare-for-your-first-swim-meet" }],
  65: [{ kind: "article", title: "Odżywianie na długich dystansach — jak jeść w czasie pływania", url: "https://www.usms.org/fitness-and-training/articles-and-videos/articles/open-water-101-nutrition-on-long-swims" }],
  80: [{ kind: "article", title: "Trening tempa: interwały CSS (Critical Swim Speed)", url: "https://www.usms.org/fitness-and-training/articles-and-videos/articles/how-to-train-with-critical-swim-speed-intervals" }],
  1: [{ kind: "reference", title: "Swim England — etapy nauki pływania 1–7", url: "https://www.swimming.org/learntoswim/swim-england-learn-to-swim-awards-1-7/" }],
  10: [{ kind: "article", title: "Pierwsze treningi na basenie — plany dla początkujących (USMS)", url: "https://www.usms.org/fitness-and-training/articles-and-videos/articles/best-swimming-workouts-for-beginners" }],
  13: [{ kind: "video", title: "Oddychanie obustronne — jak się go nauczyć", url: yt("IeUUuAyVu9s") }],
  18: [
    { kind: "video", title: "Nawrót koziołkowy w pięciu krokach", url: yt("xlwY4TnU6rY") },
    { kind: "article", title: "Nawrót koziołkowy — opis krok po kroku (MySwimPro)", url: "https://blog.myswimpro.com/2018/09/25/how-to-do-a-freestyle-flip-turn/" },
  ],
  25: [{ kind: "article", title: "8-tygodniowy plan na wytrzymałość (do 3 km)", url: "https://blog.myswimpro.com/2017/10/22/8-week-swim-training-plan-to-improve-endurance/" }],
  30: [{ kind: "article", title: "Sześciotygodniowe plany treningowe USMS", url: "https://www.usms.org/fitness-and-training/six-week-swim-training-plans/six-week-swim-training-plan-information" }],
  51: [{ kind: "article", title: "12-tygodniowy plan na 1500 m w wodach otwartych", url: "https://blog.myswimpro.com/2017/10/22/12-week-open-water-swim-training-plan/" }],
  70: [{ kind: "reference", title: "Biblioteka treningów USMS", url: "https://www.usms.org/workout-library" }],
  96: [{ kind: "reference", title: "Czasy kwalifikacyjne USMS — źródło progów z poziomów 96–99", url: "https://www.usms.org/events/national-championships/pool-national-championships/national-qualifying-times" }],
};
