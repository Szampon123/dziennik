import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "flet",
    name: "Flet poprzeczny",
    icon: "🎶",
    description:
      "Nauka gry na flecie poprzecznym — od zadęcia i czystego dźwięku po trzy oktawy, artykulację i ozdobniki. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 127,
  },
  [
    {
      title: "Ustaw zadęcie i wydobądź dźwięk z główki fletu",
      video: { yt: "AhO4viOGGTw", tut: "flute embouchure headjoint how to make a sound" },
    },
    {
      title: "Zagraj stabilny dźwięk na złożonym flecie",
      video: { yt: "Yyg4wGY2MXI", tut: "flute good tone sound beginner lesson" },
    },
    "Zagraj pierwsze dźwięki gamy",
    "Kontroluj oddech i równy strumień powietrza",
    "Zagraj pierwszą prostą melodię",
    "Opanuj gamę D-dur / G-dur",
    "Graj legato płynnie między dźwiękami",
    {
      title: "Opanuj artykulację języka (staccato)",
      video: { yt: "mMA-_lp9viM", tut: "flute tonguing articulation lesson" },
    },
    "Zagraj dźwięki w drugiej oktawie",
    "Kontroluj intonację w różnych rejestrach",
    "Graj równo z metronomem",
    "Zagraj krótki utwór z pamięci",
    "Opanuj gamy durowe do kilku znaków",
    {
      title: "Kontroluj barwę i dynamikę dźwięku",
      video: { yt: "hRCWrD090qw", tut: "flute vibrato how to lesson" },
    },
    "Zagraj utwór z akompaniamentem",
    {
      title: "Opanuj frazowanie i oddech w dłuższych frazach",
      video: { yt: "LlJ41h5OLv8", tut: "flute breath control support lesson" },
    },
    {
      title: "Opanuj trzecią oktawę",
      video: { yt: "miMF-O2d4D0", tut: "flute high notes third octave lesson" },
    },
    "Zagraj ozdobniki (tryl, mordent)",
    "Opanuj szybkie pasaże i gamę chromatyczną",
    "Zagraj wymagający utwór z pełną kontrolą",
  ],
  [
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Prosta melodia w pierwszej oktawie — pierwszy utwór na flecie.",
      video: { yt: "aiRc_a6hg3Y", tut: "Ode to Joy flute tutorial" },
    },
    {
      piece: "«Greensleeves»",
      note: "Śpiewna, powolna melodia — zwieńczenie pierwszych kroków. Próba równego oddechu.",
      video: { yt: "tfMD7itFBEA", tut: "Greensleeves flute tutorial" },
    },
    {
      piece: "«Menuet» (Boccherini)",
      video: { yt: "nx6ZGhz-UGY", tut: "Boccherini Minuet flute tutorial" },
    },
    {
      piece: "«Ave Maria» (Schubert)",
      video: { yt: "qe79oeUGNCw", tut: "Schubert Ave Maria flute tutorial" },
    },
    {
      piece: "«Kanon D-dur» (Pachelbel)",
      note: "Zwieńczenie etapu regularnego: długie frazy do gry z akompaniamentem.",
      video: { yt: "PTRCfn77BbE", tut: "Pachelbel Canon in D flute tutorial" },
    },
    {
      piece: "«Menuet z Suity h-moll» (Bach)",
      video: { yt: "XhmDm2Y6As8", tut: "Bach Menuet Suite B minor flute tutorial" },
    },
    {
      piece: "«Sonatę F-dur» — część (Handel)",
      video: { yt: "8bV9Ja1BVYM", tut: "Handel flute sonata F major tutorial" },
    },
    {
      piece: "«Syrinx» (Debussy)",
      note: "Zwieńczenie etapu średniozaawansowanego: utwór na flet solo — cała ekspresja w barwie i frazie.",
      video: { yt: "RNjroFNi7mA", tut: "Debussy Syrinx flute tutorial" },
    },
    {
      piece: "«Badinerie z Suity h-moll» (Bach)",
      note: "Szybki, wirtuozowski popis — próba palców i języka.",
      video: { yt: "64GkmRcoAZ4", tut: "Bach Badinerie flute tutorial" },
    },
    {
      piece: "«Koncert fletowy G-dur, cz. I» (Mozart, KV 313)",
      video: { yt: "0ExqsbrOPN4", tut: "Mozart flute concerto G major K 313 tutorial" },
    },
    {
      piece: "«Fantaisie» op. 79 (Fauré)",
      note: "Zwieńczenie etapu zaawansowanego: od lirycznego wstępu po błyskotliwy finał.",
      video: { yt: "md7FtZ_OEEE", tut: "Faure Fantaisie flute op 79 tutorial" },
    },
    {
      piece: "«Danse de la chèvre» (Honegger)",
      video: { yt: "pH6X6aL8s4A", tut: "Honegger Danse de la chevre flute tutorial" },
    },
    {
      piece: "«Sonatę na flet» — część (Poulenc)",
      video: { yt: "2zxkh9JZ_VE", tut: "Poulenc flute sonata tutorial" },
    },
    {
      piece: "«Fantaisie brillante sur Carmen» (Borne)",
      note: "Zwieńczenie etapu eksperckiego: wariacje na tematy z „Carmen” — sztandarowy popis flecisty.",
      video: { yt: "C3rmdOXG80o", tut: "Borne Carmen Fantasy flute tutorial" },
    },
    {
      piece: "«Koncert fletowy» — część (Ibert)",
      video: { yt: "8NVnPEsT__Y", tut: "Ibert flute concerto tutorial" },
    },
    {
      piece: "«Concertino D-dur» op. 107 (Chaminade)",
      note: "Repertuarowy szczyt flecisty — błyskotliwy utwór spinający cały warsztat.",
      video: { yt: "RFPE-a-UlH8", tut: "Chaminade Concertino flute tutorial" },
    },
  ]
);
