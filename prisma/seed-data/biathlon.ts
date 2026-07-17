// Biathlon ladder 1-99. Cross-country skiing + rifle shooting. Manual —
// progression tracks: shooting accuracy (hits out of 5), rifle handling,
// skiing endurance milestones, and competition levels.
import type { Criterion } from "../../src/lib/milestone-criteria";
import type { MilestoneResource } from "../../src/lib/milestone-resources";
import { ladder, freq, prog } from "./helpers";

export const activity = {
  slug: "biathlon",
  name: "Biathlon",
  icon: "🎿",
  description:
    "Biegi narciarskie i strzelanie — od pierwszych kroków na nartach po tor strzelnicy zawodniczej. Progresja: celność, technika i wytrzymałość.",
  sortOrder: 27,
  logKind: "manual" as const,
};

export const milestones = ladder([
  // 1-10 · Pierwsze kroki
  ["Ustój i pokonaj kilka metrów na nartach biegowych"],
  ["Opanuj krok klasyczny na płaskim (diagonal)"],
  ["Pokonaj łagodne zejście w pozycji zjazdowej"],
  ["Podejdź pod górkę jodełką"],
  ["Pokonaj 2 km techniką klasyczną bez upadku"],
  ["Opanuj podstawy stylu łyżwowego (skating)"],
  ["Zajmij pozycję strzelecką leżącą z podpartym karabinkiem"],
  ["Oddaj pierwszy strzał do tarczy (pneumatyka lub .22)"],
  ["Trafij 1/5 na strzelnicy z pozycji leżącej"],
  ["Pokonaj 5 km na nartach biegowych", "Podstawowy dystans wytrzymałościowy."],
  // 11-25 · Regularny
  ["Trenuj raz w tygodniu przez 4 kolejne tygodnie w sezonie"],
  ["Trafij 2/5 z pozycji leżącej"],
  ["Pokonaj 8 km na nartach"],
  ["Opanuj sprawne zakładanie i zdejmowanie karabinka (biathlonowy chwyt)"],
  ["Trafij 3/5 z pozycji leżącej"],
  ["Zajmij pozycję strzelecką stojącą"],
  ["Trafij 1/5 z pozycji stojącej"],
  ["Pokonaj 10 km na nartach", "Dyszka na biegówkach."],
  ["Wykonaj serię: podjazd → strzelanie → zjazd (mini-tor)"],
  ["Trafij 4/5 z pozycji leżącej"],
  ["Pokonaj 12 km na nartach"],
  ["Trafij 2/5 z pozycji stojącej"],
  ["Zaliczy pierwsze zawody biathlonowe (amatorskie/klubowe)"],
  ["Przestrzelaj serię w tempie (5 strzałów w mniej niż minutę)"],
  ["Trafij 5/5 z pozycji leżącej", "Czysta seria na leżąco!"],
  // 26-45 · Średniozaawansowany
  ["Trenuj 2 razy w tygodniu przez 12 kolejnych tygodni"],
  ["Pokonaj 15 km na nartach"],
  ["Trafij 3/5 z pozycji stojącej"],
  ["Opanuj oddech i tętno przed strzelaniem (kontrola po wysiłku)"],
  ["Pokonaj 10 km stylem łyżwowym poniżej 40 minut"],
  ["Trafij 4/5 z pozycji stojącej"],
  ["Pokonaj 20 km na nartach"],
  ["Ukończ zawody z dwoma strzelaniami (sprint) bez pudła na leżąco"],
  ["Wykonaj rundę karną (150 m) i wróć do rytmu"],
  ["Trafij 5/5 z pozycji stojącej", "Czysta seria na stojąco — dużo trudniejsza."],
  ["Pokonaj 25 km na nartach"],
  ["Utrzymaj celność 8/10 w serii mieszanej (leżąc + stojąc)"],
  ["Ukończ bieg indywidualny (4 strzelania)"],
  ["Pokonaj 10 km stylem łyżwowym poniżej 35 minut"],
  ["Zajmij miejsce w pierwszej połowie zawodów regionalnych"],
  ["Skróć czas na strzelnicy do poniżej 45 s (5 strzałów + wejście/zejście)"],
  ["Pokonaj 30 km na nartach"],
  ["Utrzymaj celność 9/10 w serii mieszanej"],
  ["Ukończ bieg pościgowy (pursuit)"],
  ["Zajmij miejsce na podium zawodów regionalnych"],
  // 46-65 · Zaawansowany
  ["Trenuj 4+ razy w tygodniu przez cały sezon"],
  ["Pokonaj 10 km stylem łyżwowym poniżej 32 minut"],
  ["Utrzymaj celność 10/10 na leżąco i 8/10 na stojąco w zawodach"],
  ["Skróć czas strzelania do poniżej 35 s"],
  ["Ukończ bieg masowy (mass start) w stawce"],
  ["Pokonaj 40 km na nartach jednym ciągiem"],
  ["Zajmij miejsce w czołówce mistrzostw kraju (kategoria wiekowa)"],
  ["Utrzymaj celność 18/20 w czterech seriach zawodów"],
  ["Pokonaj 10 km stylem łyżwowym poniżej 30 minut"],
  ["Skróć czas strzelania do poniżej 30 s"],
  ["Ukończ sztafetę biathlonową jako zawodnik zespołu"],
  ["Utrzymaj celność 19/20 w zawodach"],
  ["Pokonaj 50 km na nartach jednym ciągiem"],
  ["Zajmij miejsce na podium mistrzostw kraju juniorów"],
  ["Utrzymaj wysoką prędkość biegu przy niskim tętnie spoczynkowym (baza tlenowa)"],
  ["Skróć czas strzelania do poniżej 28 s"],
  ["Osiągnij celność 20/20 (bez pudła) w całych zawodach", "Zerowy błąd — marzenie każdego biathlonisty."],
  ["Zajmij miejsce w pierwszej dziesiątce mistrzostw kraju seniorów"],
  ["Pokonaj 10 km stylem łyżwowym poniżej 28 minut"],
  ["Uzyskaj wynik kwalifikujący do zawodów międzynarodowych"],
  // 66-85 · Wyczynowy
  ["Wystąp w zawodach międzynarodowych juniorów (IBU Junior Cup)"],
  ["Utrzymaj celność 90%+ na przestrzeni sezonu"],
  ["Pokonaj 10 km stylem łyżwowym poniżej 27 minut"],
  ["Zdobądź medal mistrzostw kraju seniorów"],
  ["Skróć czas strzelania do poniżej 25 s"],
  ["Uzyskaj wynik na poziomie krajowej czołówki seniorów"],
  ["Ukończ zawody rangi IBU Cup w stawce"],
  ["Utrzymaj celność 92%+ w sezonie"],
  ["Pokonaj 10 km stylem łyżwowym poniżej 26 minut"],
  ["Zdobądź punkty w zawodach IBU Cup"],
  ["Skróć czas strzelania do poniżej 23 s"],
  ["Weź udział w zawodach o zasięgu ogólnokrajowym"],
  ["Ukończ bieg zawodów ogólnokrajowych w limicie czasowym"],
  ["Utrzymaj celność 93%+ w sezonie klubowym"],
  ["Zdobądź dobry wynik w klasyfikacji zawodów regionalnych"],
  ["Pokonaj 10 km stylem łyżwowym poniżej 25 minut"],
  ["Zajmij miejsce w czołówce zawodów regionalnych"],
  ["Skróć czas strzelania do poniżej 22 s"],
  ["Ukończ sztafetę w barwach swojego klubu"],
  ["Zajmij miejsce w czołówce zawodów o zasięgu ogólnokrajowym"],
  // 86-99 · Elita
  ["Utrzymaj celność 94%+ w sezonie klubowym"],
  ["Zajmij miejsce w pierwszej szóstce zawodów regionalnych"],
  ["Skróć czas strzelania do poniżej 20 s", "Bardzo szybki, wieloletnio trenowany strzał."],
  ["Ukończ sezon w czołówce klasyfikacji klubowej"],
  ["Stań na podium zawodów o zasięgu ogólnokrajowym"],
  ["Utrzymaj celność 95%+ przez cały sezon"],
  ["Weź udział w mistrzostwach kraju amatorów"],
  ["Zajmij miejsce w pierwszej dziesiątce mistrzostw kraju amatorów"],
  ["Wygraj zawody o zasięgu ogólnokrajowym"],
  ["Ukończ sezon w czołówce klasyfikacji ogólnokrajowej amatorów"],
  ["Zdobądź podium mistrzostw kraju amatorów"],
  ["Poprowadź kogoś przez podstawy biathlonu"],
  ["Wygraj mistrzostwa kraju amatorów"],
  ["Poziom mistrzowski (amatorski szczyt): 95%+ celności i wieloletni, dojrzały warsztat", "Dalsze, zawodowe osiągnięcia potwierdzają osobne certyfikaty."],
]);

export const criteriaByLevel: Record<number, Criterion> = {
  // technika (skiing/handling basics), values rise with level.
  1: prog("technika", 1), 2: prog("technika", 2), 3: prog("technika", 3), 4: prog("technika", 4),
  6: prog("technika", 5), 7: prog("technika", 6), 14: prog("technika", 7), 16: prog("technika", 8),
  // celnosc (shooting), one cumulative track: 1/5 leżąc → 20/20 (values 1..16 in level order).
  9: prog("celnosc", 1), 12: prog("celnosc", 2), 15: prog("celnosc", 3), 17: prog("celnosc", 4),
  20: prog("celnosc", 5), 22: prog("celnosc", 6), 25: prog("celnosc", 7), 28: prog("celnosc", 8),
  31: prog("celnosc", 9), 35: prog("celnosc", 10), 37: prog("celnosc", 11), 43: prog("celnosc", 12),
  48: prog("celnosc", 13), 53: prog("celnosc", 14), 57: prog("celnosc", 15), 62: prog("celnosc", 16),
  // dystans (ski distance covered, km = value).
  5: prog("dystans", 2), 10: prog("dystans", 5), 13: prog("dystans", 8), 18: prog("dystans", 10),
  21: prog("dystans", 12), 27: prog("dystans", 15), 32: prog("dystans", 20), 36: prog("dystans", 25),
  42: prog("dystans", 30), 51: prog("dystans", 40), 58: prog("dystans", 50),
  11: freq(1, 4), 26: freq(2, 12),
  // pozostałe: bieg-czasy, zawody, poziomy PŚ, celność sezonowa — manualne (wymagają startu/pomiaru).
};

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "video", title: "Cross-Country Skiing Basics — Classic Technique", url: yt("vsUBrNwE9ps") },
  ],
  6: [
    { kind: "video", title: "Skating Technique for Cross-Country Skiing", url: yt("6yzV0Pvalhk") },
  ],
  8: [
    { kind: "video", title: "Biathlon Shooting — Prone Position Basics", url: yt("oV5WJpCHvL0") },
  ],
  14: [
    { kind: "video", title: "Biathlon Rifle Handling — Carry and Setup", url: yt("rxCEGIQM9lA") },
  ],
  25: [
    { kind: "article", title: "IBU — International Biathlon Union Rules", url: "https://www.biathlonworld.com/about-biathlon" },
  ],
  29: [
    { kind: "video", title: "Biathlon Heart Rate Control — Shooting After Effort", url: yt("U0yVvCwbhbY") },
  ],
  35: [
    { kind: "video", title: "Standing Shooting Technique in Biathlon", url: yt("fJ1Vhz7BKKY") },
  ],
  46: [
    { kind: "article", title: "Biathlon Training — Building Aerobic Base", url: "https://www.verywellfit.com/cross-country-skiing-workouts-3120523" },
  ],
  66: [
    { kind: "reference", title: "IBU — Biathlon World Cup Standings and Results", url: "https://www.biathlonworld.com/standings" },
  ],
  86: [
    { kind: "video", title: "Best Biathlon Races — IBU World Championships Highlights", url: yt("0rCZhQh3sXs") },
  ],
};
