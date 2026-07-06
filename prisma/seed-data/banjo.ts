import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "banjo",
    name: "Banjo",
    icon: "🪕",
    description:
      "Nauka gry na banjo — od pierwszych rolli po clawhammer/Scruggs i bluegrassowe solówki. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 133,
  },
  [
    {
      title: "Nastrój banjo i poznaj chwyt instrumentu",
      video: { yt: "fn4YhHdhhUU", tut: "how to play banjo for beginners first lesson" },
    },
    {
      title: "Zagraj czysto pierwsze akordy",
      video: { yt: "Hzqx_v5_88U", tut: "banjo first chords G C D beginner lesson" },
    },
    {
      title: "Opanuj podstawowy roll prawą ręką (np. forward roll)",
      video: { yt: "5zncbxur154", tut: "banjo forward roll lesson beginner" },
    },
    "Utrzymaj równy puls",
    "Zagraj pierwszą prostą melodię / piosenkę",
    "Opanuj kilka akordów i płynne zmiany",
    "Zagraj rolle w stałym tempie",
    {
      title: "Opanuj technikę clawhammer lub Scruggs (podstawy)",
      video: { yt: "ebAJaaqPA1Y", tut: "banjo Scruggs three finger picking lesson" },
    },
    "Zagraj melodię z rollami (up-picking / drop-thumb)",
    {
      title: "Opanuj hammer-on, pull-off i slide",
      video: { yt: "aJoMCFWorKc", tut: "banjo hammer-on pull-off slide lesson" },
    },
    "Graj równo z metronomem",
    "Zagraj utwór z pamięci",
    {
      title: "Opanuj różne wzory rolli",
      video: { yt: "GLOPtNFwTHM", tut: "banjo roll patterns bluegrass lesson" },
    },
    "Kontroluj dynamikę i akcenty",
    "Zagraj pełny utwór z melodią i rollami",
    "Opanuj grę w kilku tonacjach",
    "Opanuj gamy i pozycje na gryfie",
    "Improwizuj prostą solówkę (bluegrass)",
    "Opanuj szybkie rolle i przejścia",
    "Zagraj wymagający utwór bluegrassowy",
  ],
  [
    {
      piece: "«Boil Them Cabbage Down»",
      note: "Prosta melodia z jednym rollem — pierwszy utwór na banjo.",
      video: { yt: "Gu7b4yphZ2U", tut: "Boil Them Cabbage Down banjo tutorial" },
    },
    {
      piece: "«Cripple Creek»",
      note: "Sztandarowa pierwsza melodia bluegrassowa — zwieńczenie pierwszych kroków.",
      video: { yt: "QnLJ_7HkCgk", tut: "Cripple Creek banjo tutorial" },
    },
    {
      piece: "«Cumberland Gap»",
      video: { yt: "kpenMfIr6-k", tut: "Cumberland Gap banjo tutorial" },
    },
    {
      piece: "«Old Joe Clark»",
      video: { yt: "s70IAkoMdL0", tut: "Old Joe Clark banjo tutorial" },
    },
    {
      piece: "«You Are My Sunshine» — na banjo",
      note: "Zwieńczenie etapu regularnego: melodia z rollami i zmianami akordów.",
      video: { yt: "BT8DLc93uj8", tut: "You Are My Sunshine banjo tutorial" },
    },
    {
      piece: "«Angeline the Baker»",
      video: { yt: "n1_GDK1Oz1c", tut: "Angeline the Baker clawhammer banjo tutorial" },
    },
    {
      piece: "«Salt Creek»",
      video: { yt: "lN7nZF7MW1M", tut: "Salt Creek banjo tutorial" },
    },
    {
      piece: "«Foggy Mountain Breakdown» (Earl Scruggs)",
      note: "Zwieńczenie etapu średniozaawansowanego: hymn banjo w stylu Scruggsa.",
      video: { yt: "z_Y3mnj-8lA", tut: "Foggy Mountain Breakdown banjo tutorial" },
    },
    {
      piece: "«Blackberry Blossom»",
      video: { yt: "OeB3zVhjOqM", tut: "Blackberry Blossom banjo tutorial" },
    },
    {
      piece: "«Bury Me Beneath the Willow»",
      video: { yt: "Gcc4fqhvrzw", tut: "Bury Me Beneath the Willow banjo tutorial" },
    },
    {
      piece: "«Dueling Banjos» (z „Wybawienia”)",
      note: "Zwieńczenie etapu zaawansowanego: kultowy pojedynek — próba tempa i pewności.",
      video: { yt: "pDlZLsJJkVA", tut: "Dueling Banjos banjo tutorial" },
    },
    {
      piece: "«Ground Speed» (Earl Scruggs)",
      video: { yt: "uhG9b2nvsVY", tut: "Ground Speed Earl Scruggs banjo tutorial" },
    },
    {
      piece: "«Flint Hill Special» (Earl Scruggs)",
      video: { yt: "BZ5SzHd8-gY", tut: "Flint Hill Special banjo tutorial" },
    },
    {
      piece: "«Earl's Breakdown» (Earl Scruggs)",
      note: "Zwieńczenie etapu eksperckiego: popisowy standard z podciąganiem strun.",
      video: { yt: "ZhcqOob0iA8", tut: "Earl's Breakdown banjo tutorial" },
    },
    {
      piece: "«Whitewater» (Béla Fleck)",
      note: "Nowoczesny, wymagający utwór — wyjście poza klasyczny bluegrass.",
      video: { yt: "3QfJfYxV-Qs", tut: "Whitewater Bela Fleck banjo" },
    },
    {
      piece: "«Flight of the Cosmic Hippo» (Béla Fleck)",
      note: "Repertuarowy szczyt bandżysty — wirtuozeria w nowoczesnym stylu.",
      video: { yt: "1iYgf6PWYK8", tut: "Flight of the Cosmic Hippo Bela Fleck" },
    },
  ]
);
