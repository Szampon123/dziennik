// Shared 1-99 ladder factory for musical instruments. Each instrument supplies
// 20 instrument-specific technique milestones (the beginner→intermediate path)
// AND 16 concrete repertoire pieces ordered easiest→hardest. The factory weaves
// in a common progression arc (rare repertoire counts, practice hours, frequency,
// performances/recording/teaching) + a shared advanced→mastery technique tail,
// always producing exactly 99 contiguous levels. REALISTIC amateur scale (hours
// capped ~1100; top = "amatorski szczyt"; real professional feats left to a
// future certificate system).
//
// Named pieces are the heart of the ladder: they tell the learner WHAT to play
// at each level (a piece "defines" a level, e.g. simplified "Dla Elizy" caps the
// beginner tier). They are PLAIN milestones (no cascade) so they can be checked
// in any order — a suggestion, not an obligation (each note offers substitutes
// and allows simplified/slower versions). Repertoire counts stay rare and just
// nudge the learner to keep a memorised set.
//
// Tracks: umiejetnosci (technique 1-40), utwory (repertoire count), godziny (hours).
import { ladderC, freq, prog, type LadderEntry } from "./helpers";

export type InstrumentActivity = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  sortOrder: number;
  /** Verb for repertoire milestones. Default "Zagraj" (voice uses "Zaśpiewaj"). */
  verb?: string;
};

/** Learning videos: a curated YouTube video id (`yt` — a performance for a
 *  piece, a demonstration/lesson for a technique) + a tutorial SEARCH query
 *  (`tut` — the UI opens youtube.com/results, always current). */
export type PieceVideo = { yt: string; tut: string };

/** Stored per level: the video + which kind it is, so the UI can label it
 *  ("Wykonanie" for a piece vs "Lekcja" for a technique). */
export type LevelVideo = PieceVideo & { kind: "piece" | "technika" };

/** One concrete repertoire piece: the piece itself + a note (level meaning,
 *  substitutes, freedom to simplify) + optional learning videos. Ordered
 *  easiest→hardest, 16 per instrument. */
export type InstrumentPiece = { piece: string; note?: string; video?: PieceVideo };

/** A technique line may be a plain string or carry a demonstration video. */
export type TechLine = string | { title: string; video?: PieceVideo };

// Correct Polish grammar for "N utwór/utwory/utworów".
function utworyLabel(n: number): string {
  if (n === 1) return "1 utwór";
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return `${n} utwory`;
  return `${n} utworów`;
}

// Common advanced→expert technique milestones (umiejetnosci 21-39), shared by
// every instrument and kept instrument-agnostic (no grammatical-case pitfalls).
const GENERIC_TECH: string[] = [
  "Graj wymagającą technikę szybciej i pewniej",
  "Zagraj utwór wymagający pełnej niezależności rąk / oddechu",
  "Opanuj teorię potrzebną do świadomej gry",
  "Interpretuj utwór świadomie — dynamika, fraza, wyraz",
  "Ozdabiaj lub improwizuj własnymi pomysłami",
  "Opanuj zaawansowaną technikę wykonawczą",
  "Graj płynnie w kilku stylach muzycznych",
  "Graj wygodnie z akompaniamentem lub w zespole",
  "Zagraj trudny utwór od początku do końca bez błędu",
  "Nagraj porządne, dopracowane własne wykonanie",
  "Zbuduj rozpoznawalny, własny sposób grania",
  "Zagraj wirtuozowski fragment repertuaru",
  "Zagraj utwór na swoim najwyższym poziomie",
  "Graj ze słuchu niemal wszystko, co usłyszysz",
  "Rozwiń warsztat na tyle, by uczyć gry innych",
  "Opanuj każdą technikę na wysokim poziomie",
  "Twoja gra jest dojrzała i rozpoznawalna",
  "Nagraj ambitny, autorski materiał",
  "Zagraj koncert złożony wyłącznie z wymagającego repertuaru",
];

export function buildInstrument(
  activity: InstrumentActivity,
  tech: TechLine[],
  pieces: InstrumentPiece[]
) {
  if (tech.length !== 20) {
    throw new Error(`${activity.slug}: need exactly 20 technique lines, got ${tech.length}`);
  }
  // A technique line may carry a demonstration video; split titles from videos.
  const techTitles = tech.map((t) => (typeof t === "string" ? t : t.title));
  const techVideoByTitle = new Map<string, PieceVideo>();
  for (const t of tech) if (typeof t !== "string" && t.video) techVideoByTitle.set(t.title, t.video);
  if (pieces.length !== 16) {
    throw new Error(`${activity.slug}: need exactly 16 repertoire pieces, got ${pieces.length}`);
  }
  const verb = activity.verb ?? "Zagraj";
  const T = [...techTitles, ...GENERIC_TECH]; // 39 technique titles (umiejetnosci 1-39)
  const C = [3, 8, 20, 45, 90]; // rare repertoire counts (utwory track)
  const H = [10, 25, 45, 70, 100, 150, 220, 320, 450, 700, 1100]; // practice hours

  const tg = (i: number): LadderEntry => [T[i], undefined, prog("umiejetnosci", i + 1)];
  const piece = (i: number): LadderEntry => [`${verb} ${pieces[i].piece}`, pieces[i].note];
  const rep = (i: number, detail: string): LadderEntry => [
    `Miej w repertuarze ${utworyLabel(C[i])}, które umiesz na pamięć`,
    detail,
    prog("utwory", C[i]),
  ];
  const hr = (i: number): LadderEntry => [
    `Ćwicz łącznie przez ${H[i]} godzin`,
    undefined,
    prog("godziny", H[i]),
  ];
  const fq = (weeks: number, label: string): LadderEntry => [label, undefined, freq(3, weeks)];
  const pl = (title: string, detail?: string): LadderEntry => [title, detail];

  const entries: LadderEntry[] = [
    // 1-10 · Pierwsze kroki
    tg(0), tg(1), tg(2), tg(3), piece(0), tg(4), hr(0), tg(5),
    rep(0, "Twoje pierwsze trzy utwory — te, które właśnie ćwiczysz. Graj je na pamięć."),
    piece(1),
    // 11-25 · Regularny
    fq(4, "Ćwicz kilka razy w tygodniu przez 4 kolejne tygodnie"),
    tg(6), tg(7), piece(2), tg(8), hr(1), tg(9),
    rep(1, "Zbierz zestaw ośmiu utworów — mieszaj to, czego się właśnie uczysz."),
    tg(10), piece(3), tg(11), hr(2), tg(12), piece(4), tg(13),
    // 26-45 · Średniozaawansowany
    fq(8, "Ćwicz regularnie przez 8 kolejnych tygodni"),
    tg(14), tg(15), piece(5), hr(3), tg(16),
    pl("Zagraj publicznie pierwszy raz"),
    tg(17), piece(6), hr(4), tg(18),
    rep(2, "Dwadzieścia utworów w palcach — z tego repertuaru zagrasz krótki występ bez nut."),
    tg(19),
    pl("Nagraj i opublikuj własne wykonanie"),
    tg(20), hr(5), piece(7), tg(21),
    pl("Zagraj z akompaniamentem lub w duecie"),
    tg(22),
    // 46-65 · Zaawansowany (amator)
    fq(12, "Ćwicz regularnie przez 12 kolejnych tygodni"),
    tg(23), tg(24), piece(8), hr(6),
    pl("Zagraj koncert / na scenie przed publicznością"),
    tg(25), piece(9), tg(26), hr(7),
    pl("Wygraj lub wyróżnij się w konkursie / przeglądzie"),
    rep(3, "Czterdzieści utworów — pełnowymiarowy własny repertuar koncertowy."),
    tg(27),
    pl("Zdobądź pierwsze płatne granie / lekcje"),
    tg(28), hr(8), piece(10), tg(29),
    pl("Poprowadź kogoś przez pierwsze kroki na instrumencie"),
    tg(30),
    // 66-85 · Ekspert (poziom amatorski wysoki)
    pl("Ćwicz regularnie przez pełny sezon (6 miesięcy)"),
    tg(31), piece(11), hr(9),
    pl("Graj regularnie koncerty / na scenie"),
    tg(32),
    pl("Zbuduj rozpoznawalny, własny repertuar i styl"),
    tg(33), piece(12),
    pl("Nagraj dłuższy materiał / EP"),
    rep(4, "Dziewięćdziesiąt utworów — repertuar, z którym zagrasz niemal każdą okazję."),
    tg(34),
    pl("Zdobądź wyróżnienie lub uznanie w społeczności muzycznej"),
    hr(10), tg(35), piece(13),
    pl("Poprowadź warsztaty lub mentoring dla muzyków"),
    tg(36),
    pl("Zbuduj grono odbiorców swojej muzyki"),
    tg(37),
    // 86-99 · Mistrzostwo osobiste (realny szczyt zaangażowanego amatora)
    pl("Utrzymuj wysoki, powtarzalny poziom w każdym wykonaniu"),
    piece(14),
    pl("Zbuduj bogaty, spójny repertuar o autorskim charakterze"),
    pl("Twój styl inspiruje innych muzyków w Twoim otoczeniu"),
    tg(38),
    pl("Regularnie koncertujesz lub wydajesz muzykę"),
    pl("Twoja gra zdobywa uznanie poza lokalną społecznością"),
    pl("Uczysz i kształtujesz kolejnych muzyków"),
    pl("Masz repertuar, z którym zagrasz niemal każdy koncert"),
    pl("Zagrasz niemal wszystko, co sobie zaplanujesz"),
    pl("Nagraj osobisty „opus” — duży autorski projekt"),
    pl("Twoja muzyka ma słuchaczy i naśladowców"),
    piece(15),
    [
      "Poziom mistrzowski (amatorski szczyt): dojrzały, własny styl gry",
      "Dalsze, „zawodowe” osiągnięcia potwierdzają osobne certyfikaty.",
      prog("umiejetnosci", 40),
    ],
  ];

  if (entries.length !== 99) {
    throw new Error(`${activity.slug}: template produced ${entries.length} levels, expected 99`);
  }

  // Map videos onto their milestone levels by matching the built title. Piece
  // performances and technique demonstrations are tagged so the UI can label them.
  const pieceVideoByTitle = new Map<string, PieceVideo>();
  for (const p of pieces) if (p.video) pieceVideoByTitle.set(`${verb} ${p.piece}`, p.video);
  const videoByLevel: Record<number, LevelVideo> = {};
  entries.forEach(([title], i) => {
    const pv = pieceVideoByTitle.get(title);
    if (pv) {
      videoByLevel[i + 1] = { ...pv, kind: "piece" };
      return;
    }
    const tv = techVideoByTitle.get(title);
    if (tv) videoByLevel[i + 1] = { ...tv, kind: "technika" };
  });

  const { milestones, criteriaByLevel } = ladderC(entries);
  return {
    activity: { ...activity, logKind: "manual" as const },
    milestones,
    criteriaByLevel,
    videoByLevel,
  };
}
