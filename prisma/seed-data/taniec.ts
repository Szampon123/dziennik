// Dance ladder 1-99 (style-agnostic: salsa, bachata, hip-hop, standard…).
// Tracks: classes/practice count, choreography length, social/performance
// experience. Manual check-offs.
import type { Criterion } from "../../src/lib/milestone-criteria";
import type { MilestoneResource } from "../../src/lib/milestone-resources";
import { ladder, freq, prog } from "./helpers";

export const activity = {
  slug: "taniec",
  name: "Taniec",
  icon: "💃",
  description:
    "Dowolny styl — od pierwszego kroku podstawowego po scenę i turnieje. Liczy się rytm, pamięć ruchowa i odwaga.",
  sortOrder: 13,
  logKind: "manual" as const,
};

export const milestones = ladder([
  // 1-10 · Pierwsze kroki
  ["Opanuj krok podstawowy wybranego stylu", "Salsa, bachata, hip-hop, walc — Twój wybór."],
  ["Utrzymaj krok podstawowy w rytmie przez całą piosenkę"],
  ["Weź udział w pierwszych zajęciach tanecznych"],
  ["Opanuj drugi krok/figurę Twojego stylu"],
  ["Zatańcz sekwencję 2 figur płynnie połączonych"],
  ["Ukończ 5 zajęć tanecznych"],
  ["Klaskaniem lub krokiem trafiaj w rytm dowolnego utworu", "Słyszenie beatu to fundament."],
  ["Opanuj 5 figur/kroków"],
  ["Zatańcz 8-taktową sekwencję z pamięci"],
  ["Ukończ 10 zajęć tanecznych"],
  // 11-25 · Regularny
  ["Tańcz raz w tygodniu przez 4 kolejne tygodnie"],
  ["Zatańcz z partnerem/partnerką pełną piosenkę (lub solo przed lustrem)"],
  ["Opanuj 10 figur"],
  ["Zatańcz 16-taktową choreografię z pamięci"],
  ["Ukończ 20 zajęć"],
  ["Zatańcz na imprezie/potańcówce po raz pierwszy", "Wyjście z sali prób do ludzi."],
  ["Opanuj obrót (spin/pivot) w obie strony"],
  ["Zatańcz z 3 różnymi partnerami/partnerkami (lub 3 różne utwory solo)"],
  ["Ukończ 30 zajęć"],
  ["Zatańcz 32-taktową choreografię z pamięci"],
  ["Tańcz 2 razy w tygodniu przez 8 kolejnych tygodni"],
  ["Opanuj 20 figur"],
  ["Przetańcz całą imprezę (3+ godziny)"],
  ["Ukończ 50 zajęć", "Pół setki na parkiecie treningowym."],
  ["Zatańcz choreografię 1-minutową z pamięci"],
  // 26-45 · Średniozaawansowany
  ["Ukończ kurs poziomu podstawowego (P1/beginner) z certyfikatem/zaliczeniem"],
  ["Prowadź lub podążaj w parze z osobą poznaną na imprezie", "Uniwersalny język ciała."],
  ["Opanuj 30 figur"],
  ["Zatańcz do muzyki na żywo"],
  ["Ukończ 75 zajęć"],
  ["Zaimprowizuj 30 sekund tańca bez przygotowania"],
  ["Zatańcz choreografię 2-minutową z pamięci"],
  ["Weź udział w warsztatach z instruktorem spoza swojej szkoły"],
  ["Ukończ 100 zajęć", "Trzycyfrowy licznik."],
  ["Opanuj drugi styl taneczny na poziomie kroku podstawowego"],
  ["Zatańcz w jam circle / rueda / formacji grupowej"],
  ["Tańcz na 5 różnych imprezach w jednym miesiącu"],
  ["Opanuj 50 figur"],
  ["Zatańcz choreografię 3-minutową (cały utwór) z pamięci"],
  ["Ukończ 150 zajęć"],
  ["Wystąp publicznie w pokazie grupowym", "Pierwsza scena."],
  ["Zaimprowizuj pełną piosenkę z interpretacją muzyki (musicality)"],
  ["Ukończ kurs poziomu średniego (P2/intermediate)"],
  ["Ukończ 200 zajęć"],
  ["Zatańcz społecznie 50 imprez łącznie"],
  // 46-65 · Zaawansowany
  ["Opanuj 75 figur"],
  ["Wystąp w pokazie w duecie lub solo"],
  ["Ukończ 250 zajęć"],
  ["Opanuj drugi styl na poziomie średnim"],
  ["Przygotuj własną 1-minutową choreografię od zera"],
  ["Weź udział w konkursie/turnieju tańca (dowolna ranga)"],
  ["Ukończ 300 zajęć"],
  ["Przejdź eliminacje w konkursie (nie odpaść w pierwszej rundzie)"],
  ["Zatańcz 100 imprez łącznie"],
  ["Opanuj 100 figur", "Setka figur w pamięci mięśniowej."],
  ["Ukończ kurs poziomu zaawansowanego (P3/advanced)"],
  ["Wystąp na scenie przed 100+ widzami"],
  ["Ukończ 400 zajęć"],
  ["Przygotuj własną choreografię na pełny utwór"],
  ["Zdobądź wyróżnienie lub finał w konkursie"],
  ["Ukończ 500 zajęć", "Pół tysiąca treningów."],
  ["Poprowadź mini-warsztat dla początkujących (np. dla znajomych)"],
  ["Opanuj trzeci styl na poziomie podstawowym"],
  ["Zatańcz 200 imprez łącznie"],
  ["Zdobądź medal/podium w konkursie lokalnym"],
  // 66-85 · Wyczynowy
  ["Ukończ 600 zajęć"],
  ["Wystąp w pokazie na festiwalu tanecznym"],
  ["Zdobądź podium w konkursie rangi wojewódzkiej"],
  ["Ukończ 750 zajęć"],
  ["Zatańcz w formacji na zawodach"],
  ["Poprowadź regularne zajęcia jako instruktor pomocniczy"],
  ["Weź udział w zawodach rangi ogólnopolskiej"],
  ["Ukończ 900 zajęć"],
  ["Wygraj konkurs lokalny"],
  ["Przetańcz festiwal weekendowy (10+ godzin warsztatów i imprez)"],
  ["Zdobądź klasę taneczną w systemie turniejowym (np. klasa H/E)", "Formalna klasyfikacja par turniejowych."],
  ["Ukończ 1000 zajęć", "Cztery cyfry na liczniku treningów."],
  ["Wystąp jako demo z instruktorem na imprezie"],
  ["Awansuj do wyższej klasy tanecznej (np. D)"],
  ["Zdobądź podium na zawodach ogólnopolskich"],
  ["Ukończ kurs instruktorski lub sędziowski"],
  ["Zatańcz 500 imprez łącznie"],
  ["Awansuj do klasy C lub wyżej"],
  ["Poprowadź własną grupę/kurs przez pełny semestr"],
  ["Wygraj zawody rangi wojewódzkiej"],
  // 86-99 · Elita
  ["Ukończ 1500 zajęć"],
  ["Awansuj do klasy B"],
  ["Zdobądź finał na zawodach regionalnych"],
  ["Wystąp na scenie lokalnego festiwalu tanecznego"],
  ["Awansuj do klasy A", "Druga najwyższa klasa turniejowa."],
  ["Wygraj zawody regionalne"],
  ["Ukończ 2000 zajęć"],
  ["Zdobądź podium mistrzostw regionu w swojej kategorii"],
  ["Awansuj do klasy S (mistrzowskiej)", "Najwyższa klasa taneczna w Polsce."],
  ["Weź udział w zawodach o zasięgu ogólnopolskim"],
  ["Zdobądź finał mistrzostw regionu w swojej kategorii"],
  ["Poprowadź własną grupę taneczną / szkołę przez sezon"],
  ["Zdobądź uznanie w lokalnej społeczności tanecznej"],
  ["Poziom mistrzowski (amatorski szczyt): klasa S i wieloletni, dojrzały warsztat taneczny", "Dalsze, zawodowe osiągnięcia potwierdzają osobne certyfikaty."],
]);

export const criteriaByLevel: Record<number, Criterion> = {
  3: prog("zajecia", 1), 6: prog("zajecia", 5), 10: prog("zajecia", 10), 15: prog("zajecia", 20),
  19: prog("zajecia", 30), 24: prog("zajecia", 50), 30: prog("zajecia", 75), 34: prog("zajecia", 100),
  40: prog("zajecia", 150), 44: prog("zajecia", 200), 48: prog("zajecia", 250), 52: prog("zajecia", 300),
  58: prog("zajecia", 400), 61: prog("zajecia", 500), 66: prog("zajecia", 600), 69: prog("zajecia", 750),
  73: prog("zajecia", 900), 77: prog("zajecia", 1000), 86: prog("zajecia", 1500), 92: prog("zajecia", 2000),
  1: prog("figury", 1), 4: prog("figury", 2), 8: prog("figury", 5), 13: prog("figury", 10),
  22: prog("figury", 20), 28: prog("figury", 30), 38: prog("figury", 50), 46: prog("figury", 75),
  55: prog("figury", 100),
  9: prog("choreo", 8), 14: prog("choreo", 16), 20: prog("choreo", 32), 25: prog("choreo", 60),
  32: prog("choreo", 120), 39: prog("choreo", 180),
  45: prog("imprezy", 50), 54: prog("imprezy", 100), 64: prog("imprezy", 200), 82: prog("imprezy", 500),
  11: freq(1, 4), 21: freq(2, 8),
  // klasy taneczne, występy i konkursy — manualne.
};

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "video", title: "How to Dance for Beginners — Basic Rhythm & Bounce", url: yt("KhEhySda34c") },
  ],
  5: [
    { kind: "video", title: "STEEZY: How to Hear & Count Music for Dancing", url: yt("TQ8MxaxpCgI") },
  ],
  12: [
    { kind: "article", title: "WikiHow — How to Dance at a Party", url: "https://www.wikihow.com/Dance-at-a-Party" },
  ],
  16: [
    { kind: "video", title: "How to Salsa Dance for Beginners — Basic Steps", url: yt("bMSPNLuEBbo") },
  ],
  25: [
    { kind: "video", title: "Musicality in Dance — How to Interpret Music", url: yt("Jr3mxftKzcg") },
  ],
  35: [
    { kind: "article", title: "How to Improve Your Freestyle Dancing", url: "https://www.steezy.co/posts/how-to-freestyle-dance" },
  ],
  41: [
    { kind: "video", title: "MihranTV — How to Choreograph a Dance", url: yt("Ws6AAhTaWHI") },
  ],
  51: [
    { kind: "video", title: "How to Win Your First Dance Competition", url: yt("VpIhXzV1yFg") },
  ],
  62: [
    { kind: "article", title: "How to Become a Dance Instructor", url: "https://www.wikihow.com/Become-a-Dance-Instructor" },
  ],
  77: [
    { kind: "video", title: "Get Dance — What Makes a Great Dancer", url: yt("MTOdAMb8gwo") },
  ],
};
