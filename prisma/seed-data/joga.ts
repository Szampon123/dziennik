// Yoga ladder 1-99. Progression through practice consistency (sessions,
// streaks, session length) and classic asana milestones ordered by typical
// difficulty (forward fold → crow → headstand → arm balances → advanced).
// Manual ladder — asanas are separate tracks, so no false implications.
import type { Criterion } from "../../src/lib/milestone-criteria";
import { ladder, freq, prog } from "./helpers";

export const activity = {
  slug: "joga",
  name: "Joga",
  icon: "🧘",
  description:
    "Praktyka, oddech i asany — od pierwszej sesji po zaawansowane balanse. Kolejność asan wg typowej progresji trudności.",
  sortOrder: 6,
  logKind: "manual" as const,
};

export const milestones = ladder([
  // 1-10 · Pierwsze kroki
  ["Ukończ pierwszą sesję jogi (min. 15 minut)", "Studio, YouTube, aplikacja — bez znaczenia."],
  ["Wykonaj poprawnie powitanie słońca A", "Sekwencja-fundament vinyasy."],
  ["Utrzymaj psa z głową w dół przez 30 sekund"],
  ["Ukończ 5 sesji jogi"],
  ["Utrzymaj pozycję dziecka i złap w niej 10 spokojnych oddechów", "Joga to oddech — reszta to dodatki."],
  ["Ćwicz 2 razy w tygodniu przez 4 kolejne tygodnie"],
  ["Utrzymaj pozycję drzewa po 30 sekund na każdą nogę"],
  ["Ukończ 10 sesji jogi"],
  ["Ukończ sesję trwającą 30 minut"],
  ["Utrzymaj psa z głową w dół przez 2 minuty"],
  // 11-25 · Regularny
  ["Wykonaj powitanie słońca B"],
  ["Utrzymaj wojownika II po 45 sekund na stronę"],
  ["Ukończ 20 sesji jogi"],
  ["Dotknij dłońmi podłogi w skłonie z prostymi nogami", "Miara elastyczności tylnej taśmy."],
  ["Ćwicz 3 razy w tygodniu przez 4 kolejne tygodnie"],
  ["Utrzymaj krzesełko (utkatasana) przez 60 sekund"],
  ["Ukończ sesję trwającą 45 minut"],
  ["Utrzymaj deskę bokiem (vasisthasana) po 20 sekund na stronę"],
  ["Ukończ 30 sesji jogi"],
  ["Wykonaj pełny most (koło) z podłogi", "Urdhva dhanurasana — otwarcie klatki i barków."],
  ["Utrzymaj pozycję gołębia po 1 minucie na stronę"],
  ["Praktykuj 7 dni z rzędu", "Pierwszy streak."],
  ["Utrzymaj nawigasanę (łódkę) przez 30 sekund"],
  ["Ukończ 50 sesji jogi"],
  ["Usiądź w pełnym skłonie (paschimottanasana) z klatką na udach"],
  // 26-45 · Średniozaawansowany
  ["Ćwicz 3 razy w tygodniu przez 12 kolejnych tygodni"],
  ["Utrzymaj kruka (bakasana) przez 5 sekund", "Pierwszy balans na rękach — bariera mentalna."],
  ["Ukończ sesję trwającą 60 minut"],
  ["Wykonaj świecę (sarvangasana) i utrzymaj 1 minutę"],
  ["Ukończ 75 sesji jogi"],
  ["Utrzymaj kruka przez 15 sekund"],
  ["Wykonaj stanie na głowie przy ścianie (sirsasana)"],
  ["Praktykuj 14 dni z rzędu"],
  ["Utrzymaj wojownika III po 30 sekund na stronę"],
  ["Ukończ 100 sesji jogi", "Setka na macie."],
  ["Zrób szpagat poprzeczny do 20 cm od podłogi"],
  ["Utrzymaj stanie na głowie bez ściany przez 15 sekund"],
  ["Wykonaj pozycję koła i wytrzymaj 30 sekund"],
  ["Utrzymaj kruka przez 30 sekund"],
  ["Weź udział w zajęciach na sali ze znajomym nauczycielem stylu", "Vinyasa, hatha, ashtanga, yin — poznaj różnicę."],
  ["Praktykuj 30 dni z rzędu", "Miesiąc codziennej praktyki."],
  ["Utrzymaj stanie na głowie bez ściany przez 1 minutę"],
  ["Ukończ 150 sesji jogi"],
  ["Wykonaj boczny kruk (parsva bakasana)"],
  ["Zrób pełny szpagat wzdłużny (hanumanasana) na lepszą nogę", "Jeden z najbardziej wymagających celów mobilności."],
  // 46-65 · Zaawansowany
  ["Ukończ sesję trwającą 90 minut", "Pełna praktyka ashtangi lub warsztat."],
  ["Utrzymaj stanie na przedramionach (pincha) przy ścianie"],
  ["Ukończ 200 sesji jogi"],
  ["Wykonaj ośmiokąt (astavakrasana)"],
  ["Usiądź w pełnym lotosie (padmasana)", "Wymaga zdrowej, otwartej rotacji bioder — nigdy na siłę."],
  ["Praktykuj 60 dni z rzędu"],
  ["Utrzymaj pincha bez ściany przez 10 sekund"],
  ["Wykonaj EPK I (eka pada koundinyasana I)"],
  ["Ukończ 300 sesji jogi"],
  ["Wykonaj stanie na rękach przy ścianie i utrzymaj 30 sekund"],
  ["Zrób pełny szpagat wzdłużny na obie nogi"],
  ["Utrzymaj stanie na głowie przez 3 minuty"],
  ["Wykonaj pełną pozycję koła z wyprostowanymi ramionami i nogami"],
  ["Ukończ 400 sesji jogi"],
  ["Wykonaj tittibhasanę (świetlik)"],
  ["Praktykuj 100 dni z rzędu", "Setka dzień po dniu."],
  ["Utrzymaj stanie na rękach bez ściany przez 5 sekund", "Król balansów."],
  ["Ukończ 500 sesji jogi"],
  ["Wykonaj pełny skręt maryczjasana D z chwytem", "Wymaga lat pracy nad rotacją i lotosem."],
  ["Utrzymaj pincha bez ściany przez 30 sekund"],
  // 66-85 · Wyczynowy
  ["Utrzymaj stanie na rękach bez ściany przez 15 sekund"],
  ["Wykonaj upadek do koła ze stania (drop back)", "Kontrolowane przejście do mostu — praca całego ciała."],
  ["Ukończ 600 sesji jogi"],
  ["Wykonaj pełną drugą serię ashtangi lub odpowiednik u swojego nauczyciela"],
  ["Praktykuj 180 dni z rzędu"],
  ["Wykonaj kruka na prostych rękach (crane)"],
  ["Utrzymaj stanie na rękach przez 30 sekund"],
  ["Ukończ 750 sesji jogi"],
  ["Wstań z koła do pozycji stojącej (stand up from backbend)"],
  ["Wykonaj eka pada sirsasanę (noga za głową)"],
  ["Zrób szpagat poprzeczny w pełnym siadzie"],
  ["Ukończ 1000 sesji jogi", "Cztery cyfry na maciе."],
  ["Utrzymaj stanie na rękach przez 60 sekund"],
  ["Praktykuj 365 dni z rzędu", "Rok bez ani jednego dnia przerwy."],
  ["Wykonaj przejście kruk → stanie na rękach"],
  ["Wykonaj skorpiona (vrschikasana) w pinche"],
  ["Ukończ 1250 sesji jogi"],
  ["Wykonaj pełną kapotasanę (królewski gołąb w moście)"],
  ["Prowadź sesję jogi dla znajomych lub grupy"],
  ["Ukończ 1500 sesji jogi"],
  // 86-99 · Elita
  ["Wykonaj stanie na rękach z deski przez press (press handstand)", "Siła i kompresja zamiast zamachu."],
  ["Utrzymaj stanie na rękach przez 2 minuty"],
  ["Wykonaj dwie nogi za głową (dwi pada sirsasana)"],
  ["Ukończ 2000 sesji jogi"],
  ["Wykonaj pełną trzecią serię ashtangi lub odpowiednik"],
  ["Praktykuj 500 dni z rzędu"],
  ["Wykonaj one-arm elbow balance lub inną asymetryczną odmianę pinchy"],
  ["Ukończ kurs nauczycielski 200 h (RYT-200)", "Formalne przygotowanie do uczenia."],
  ["Ukończ 2500 sesji jogi"],
  ["Wykonaj press do stania na rękach ze szpagatu poprzecznego"],
  ["Utrzymaj stanie na rękach przez 5 minut"],
  ["Ukończ kurs nauczycielski 500 h (RYT-500)"],
  ["Ukończ 3000 sesji jogi", "Przy praktyce 5×/tydzień to ponad 11 lat."],
  ["Poziom mistrzowski: pełne opanowanie serii zaawansowanej i regularne nauczanie", "Poziom nauczycieli prowadzących własne warsztaty i szkolenia."],
]);

export const criteriaByLevel: Record<number, Criterion> = {
  1: prog("sesje", 1), 4: prog("sesje", 5), 8: prog("sesje", 10), 13: prog("sesje", 20),
  19: prog("sesje", 30), 24: prog("sesje", 50), 30: prog("sesje", 75), 35: prog("sesje", 100),
  44: prog("sesje", 150), 48: prog("sesje", 200), 54: prog("sesje", 300), 59: prog("sesje", 400),
  63: prog("sesje", 500), 68: prog("sesje", 600), 73: prog("sesje", 750), 77: prog("sesje", 1000),
  82: prog("sesje", 1250), 85: prog("sesje", 1500), 89: prog("sesje", 2000), 94: prog("sesje", 2500),
  98: prog("sesje", 3000),
  6: freq(2, 4), 15: freq(3, 4), 26: freq(3, 12),
  22: prog("streak", 7), 33: prog("streak", 14), 41: prog("streak", 30), 51: prog("streak", 60),
  61: prog("streak", 100), 70: prog("streak", 180), 79: prog("streak", 365), 91: prog("streak", 500),
  9: prog("sesja-min", 30), 17: prog("sesja-min", 45), 28: prog("sesja-min", 60), 46: prog("sesja-min", 90),
  3: prog("pies", 30), 10: prog("pies", 120),
  27: prog("kruk", 5), 31: prog("kruk", 15), 39: prog("kruk", 30),
  32: prog("sirsasana", 1), 37: prog("sirsasana", 15), 42: prog("sirsasana", 60), 57: prog("sirsasana", 180),
  47: prog("pincha", 1), 52: prog("pincha", 10), 65: prog("pincha", 30),
  55: prog("handstand", 1), 62: prog("handstand", 5), 66: prog("handstand", 15), 72: prog("handstand", 30),
  78: prog("handstand", 60), 87: prog("handstand", 120), 96: prog("handstand", 300),
  // pozostałe poziomy: pojedyncze asany/wydarzenia — manualne, bez kaskady.
};

// ---------------------------------------------------------------------------
// Learning resources. Every URL fetched before it was written here.
//
// A thing worth saying out loud, because the industry does not: yoga has NO recognised
// student proficiency ladder. Yoga Alliance's RYT-200/500 credentials grade *teacher
// training hours*, not a practitioner's skill, and the organisation says as much. There
// is no belt, no grade, no test.
//
// The one real progression in the tradition is Ashtanga Vinyasa's six fixed series,
// taught posture by posture, where the teacher grants the next asana only when the
// current one is solid — lineage-gated rather than federated, but a genuine ordered
// ladder, and the one this ladder's upper levels lean on. It is linked at L50 so a
// reader can see where the structure comes from.
import type { MilestoneResource } from "../../src/lib/milestone-resources";

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [{ kind: "article", title: "Joga dla zupełnie początkujących", url: "https://yogawithadriene.com/yoga-complete-beginners/" }],
  5: [{ kind: "article", title: "Podstawy: oddech, pozycje, o co w tym chodzi", url: "https://yogawithadriene.com/yoga-for-beginners-the-basics/" }],
  10: [{ kind: "video", title: "Poranna praktyka — 15 minut", url: yt("r7xsYgTeM2Q") }],
  20: [
    { kind: "video", title: "Powitanie słońca — praktyka 10 minut", url: yt("8AakYeM23sI") },
    { kind: "reference", title: "Surya Namaskara A — sekwencja krok po kroku", url: "https://yogawithadriene.com/sun-salutation-a-surya-namaskara-a/" },
  ],
  50: [{ kind: "reference", title: "Ashtanga vinyasa — sześć serii, jedyna prawdziwa drabinka w jodze", url: "https://en.wikipedia.org/wiki/Ashtanga_vinyasa_yoga" }],
};
