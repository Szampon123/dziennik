import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "organy",
    name: "Organy",
    icon: "🎹",
    description:
      "Nauka gry na organach — od manuałów i pedału po rejestrację i polifonię. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 138,
  },
  [
    {
      title: "Poznaj manuały, rejestry i ławę organową",
      video: { yt: "XLSLHfCdm5E", tut: "how to play the pipe organ introduction Jonathan Scott" },
    },
    "Zagraj czysto pojedyncze dźwięki na manuale",
    "Zagraj pięciopalcową pozycję obiema rękami",
    "Utrzymaj równy, legatowy puls",
    "Zagraj pierwszą prostą melodię obiema rękami",
    "Opanuj gamę C-dur",
    "Zagraj akordy i płynne prowadzenie głosów",
    {
      title: "Zagraj pierwsze dźwięki w pedale (nogami)",
      video: { yt: "7P3wreXOtXE", tut: "organ pedal technique lesson beginner" },
    },
    {
      title: "Opanuj podstawową rejestrację (dobór głosów)",
      video: { yt: "KJ9OlO804Zc", tut: "organ registration how to choose stops lesson" },
    },
    "Graj manuał + prosta linia w pedale",
    "Graj równo z metronomem",
    "Zagraj krótki utwór z pamięci",
    {
      title: "Opanuj legato organowe (płynne łączenie)",
      video: { yt: "LKrXM_q3xW0", tut: "organ articulate legato finger substitution lesson" },
    },
    {
      title: "Kontroluj artykulację i frazowanie",
      video: { yt: "tCQ3K36RWSU", tut: "phrasing in organ playing lesson" },
    },
    "Zagraj utwór z niezależnością rąk i pedału",
    {
      title: "Opanuj grę na dwóch manuałach",
      video: { yt: "Nra0mlaIYak", tut: "organ manuals swell great couplers explained" },
    },
    "Opanuj bardziej złożoną rejestrację",
    "Zagraj prostą polifonię (kilka głosów)",
    "Opanuj szybsze pasaże i ozdobniki",
    "Zagraj wymagający utwór z pełną kontrolą",
  ],
  [
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Prosta melodia na manuale — pierwszy utwór.",
      video: { yt: "cZPVd7LOgJU", tut: "Ode to Joy organ Jonathan Scott" },
    },
    {
      piece: "«Amazing Grace» (hymn)",
      note: "Chorałowe brzmienie z prostą rejestracją — zwieńczenie pierwszych kroków.",
      video: { yt: "2CA-zzbhuzM", tut: "Amazing Grace organ Hereford Cathedral" },
    },
    {
      piece: "«Preludium C-dur» z „Das wohltemperierte Klavier” (Bach)",
      video: { yt: "PfROGLKTQlk", tut: "Bach Prelude in C major BWV 846 organ" },
    },
    {
      piece: "«Menuet» (Bach)",
      video: { yt: "aJJiINAcfNs", tut: "Bach Minuet in G major organ" },
    },
    {
      piece: "«Kanon D-dur» (Pachelbel)",
      note: "Zwieńczenie etapu regularnego: dwa manuały i prosta linia w pedale.",
      video: { yt: "ukA2xvsA1qg", tut: "Pachelbel Canon in D organ Jonathan Scott" },
    },
    {
      piece: "«Ave Maria» (Bach / Gounod)",
      video: { yt: "7vsP1pkC3Rk", tut: "Bach Gounod Ave Maria organ Jonathan Scott" },
    },
    {
      piece: "«Jezu, radości ludzkich pragnień» (Bach)",
      video: { yt: "T7gJWl-iNy0", tut: "Jesu Joy of Man's Desiring Bach organ" },
    },
    {
      piece: "«Trumpet Voluntary» (Clarke) — z pedałem",
      note: "Zwieńczenie etapu średniozaawansowanego: uroczysty utwór z prawdziwą grą pedałem.",
      video: { yt: "S3-rkkcVxp0", tut: "Clarke Trumpet Voluntary Prince of Denmark March organ" },
    },
    {
      piece: "«Marsz weselny» (Mendelssohn)",
      video: { yt: "UxUsmAL2HO0", tut: "Mendelssohn Wedding March organ solo" },
    },
    {
      piece: "«Małą fugę g-moll» (Bach, BWV 578)",
      note: "Pierwsza pełna fuga z niezależnym pedałem.",
      video: { yt: "JWYpYgiQ-m0", tut: "Bach Little Fugue G minor BWV 578 organ" },
    },
    {
      piece: "«Toccatę i fugę d-moll» (Bach, BWV 565)",
      note: "Zwieńczenie etapu zaawansowanego: najsłynniejszy utwór organowy w historii.",
      video: { yt: "8tpzyYFqJWM", tut: "Bach Toccata and Fugue D minor BWV 565 organ" },
    },
    {
      piece: "«Wielką fugę g-moll» (Bach, BWV 542)",
      video: { yt: "tgDE3klkmtQ", tut: "Bach Fantasia and Fugue G minor BWV 542 organ Netherlands Bach Society" },
    },
    {
      piece: "«Passacaglię i fugę c-moll» (Bach, BWV 582)",
      video: { yt: "I8A4vyLvO4M", tut: "Bach Passacaglia and Fugue C minor BWV 582 organ" },
    },
    {
      piece: "«Toccatę z V Symfonii organowej» (Widor)",
      note: "Zwieńczenie etapu eksperckiego: błyskotliwy finał (znany z uroczystości weselnych).",
      video: { yt: "0YhYfgmRNoA", tut: "Widor Toccata Symphony 5 organ" },
    },
    {
      piece: "«Preludium i fugę na temat B-A-C-H» (Liszt)",
      video: { yt: "hjdjbsWt24w", tut: "Liszt Prelude and Fugue on BACH organ" },
    },
    {
      piece: "«Carillon de Westminster» (Vierne)",
      note: "Repertuarowy szczyt organisty — monumentalny popis pełnej rejestracji i pedału.",
      video: { yt: "LMoNZ_7B7iE", tut: "Vierne Carillon de Westminster organ Jonathan Scott" },
    },
  ]
);
