import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "wiolonczela",
    name: "Wiolonczela",
    icon: "🎻",
    description:
      "Nauka gry na wiolonczeli — od prowadzenia smyczka i czystej intonacji po zmiany pozycji i vibrato. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 130,
  },
  [
    {
      title: "Ustaw instrument i trzymaj prawidłowo smyczek",
      video: { yt: "goB7AADtmFI", tut: "how to hold the cello bow beginner lesson" },
    },
    {
      title: "Wydobądź czysty dźwięk na pustych strunach",
      video: { yt: "jz35BK54N7Y", tut: "cello good tone open strings beginner lesson" },
    },
    "Zagraj pierwsze dźwięki w pierwszej pozycji",
    {
      title: "Prowadź smyczek równo (détaché)",
      video: { yt: "FwDUPW_Mpwc", tut: "cello detache bow stroke lesson" },
    },
    "Zagraj pierwszą prostą melodię",
    "Opanuj gamę C-dur / G-dur w pierwszej pozycji",
    {
      title: "Graj czysto (intonacja) w wolnym tempie",
      video: { yt: "5eNC0F-Fn3Q", tut: "cello first position intonation lesson" },
    },
    "Opanuj legato smyczkiem",
    "Zagraj z użyciem czwartego palca",
    "Opanuj staccato i martelé",
    "Graj dwie struny naraz (dwudźwięki)",
    "Zagraj krótki utwór z pamięci",
    "Opanuj płynne zmiany strun",
    "Graj równo z metronomem",
    "Zagraj utwór z akompaniamentem",
    "Kontroluj dynamikę i barwę dźwięku",
    {
      title: "Opanuj przejście do czwartej pozycji (shifting)",
      video: { yt: "jZdZJQjmtmg", tut: "cello shifting positions lesson" },
    },
    {
      title: "Zacznij vibrato",
      video: { yt: "gd9ufBsbBqU", tut: "cello vibrato for beginners lesson" },
    },
    "Opanuj gamy przez kilka pozycji",
    "Zagraj vibrato swobodnie w utworze",
  ],
  [
    {
      piece: "«Twinkle, Twinkle» — wariacje (Suzuki)",
      note: "Pierwszy utwór wiolonczelisty na pojedynczych dźwiękach w pierwszej pozycji.",
      video: { yt: "OPC7G0nvMEg", tut: "Suzuki cello Twinkle variations tutorial" },
    },
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Rozpoznawalna melodia — zwieńczenie pierwszych kroków.",
      video: { yt: "-HfYYMqGLD8", tut: "Ode to Joy cello tutorial" },
    },
    {
      piece: "«Menuet» (Bach, z zeszytu Suzuki)",
      video: { yt: "VaZkTmMvFnA", tut: "Bach Minuet Suzuki cello tutorial" },
    },
    {
      piece: "«Musette» (Bach)",
      video: { yt: "BytuUYgowtU", tut: "Bach Musette cello tutorial" },
    },
    {
      piece: "«Ave Maria» (Bach / Gounod)",
      note: "Zwieńczenie etapu regularnego: długie, śpiewne frazy — próba smyczka.",
      video: { yt: "z6XlcF0VZRA", tut: "Bach Gounod Ave Maria cello tutorial" },
    },
    {
      piece: "«Menuet» (Boccherini)",
      video: { yt: "vlkXdi5ux7E", tut: "Boccherini Minuet cello tutorial" },
    },
    {
      piece: "«Łabędzia» z „Karnawału zwierząt” (Saint-Saëns)",
      note: "Kultowa wiolonczelowa melodia — kantylena i vibrato.",
      video: { yt: "xPsOt6fLDFY", tut: "Saint-Saens The Swan cello tutorial" },
    },
    {
      piece: "«Preludium z I Suity wiolonczelowej G-dur» (Bach, BWV 1007)",
      note: "Zwieńczenie etapu średniozaawansowanego: najsłynniejszy fragment repertuaru wiolonczeli.",
      video: { yt: "1prweT95Mo0", tut: "Bach Cello Suite 1 Prelude tutorial" },
    },
    {
      piece: "«Vocalise» (Rachmaninow)",
      video: { yt: "hiT_v5DOsUw", tut: "Rachmaninoff Vocalise cello tutorial" },
    },
    {
      piece: "«Après un rêve» (Fauré)",
      video: { yt: "XAPgC-C8tkw", tut: "Faure Apres un reve cello tutorial" },
    },
    {
      piece: "«I Suitę wiolonczelową G-dur — w całości» (Bach)",
      note: "Zwieńczenie etapu zaawansowanego: wszystkie części suity — od Preludium po Gigue.",
      video: { yt: "Rx_IibJH4rA", tut: "Bach Cello Suite No 1 complete Yo-Yo Ma" },
    },
    {
      piece: "«Koncert wiolonczelowy a-moll» — część (Saint-Saëns)",
      video: { yt: "hSVdg2q1oB0", tut: "Saint-Saens cello concerto A minor tutorial" },
    },
    {
      piece: "«Wariacje na temat rokokowy» — fragment (Czajkowski)",
      video: { yt: "tFehxU1ZSu0", tut: "Tchaikovsky Rococo Variations cello tutorial" },
    },
    {
      piece: "«Koncert wiolonczelowy h-moll, cz. I» (Dvořák)",
      note: "Zwieńczenie etapu eksperckiego: jeden z najważniejszych koncertów wiolonczelowych.",
      video: { yt: "190faUQ7xJg", tut: "Dvorak cello concerto B minor tutorial" },
    },
    {
      piece: "«Sonatę g-moll» — część (Rachmaninow)",
      video: { yt: "r5eHprbZlIM", tut: "Rachmaninoff cello sonata G minor Andante" },
    },
    {
      piece: "«Koncert wiolonczelowy e-moll» (Elgar)",
      note: "Repertuarowy szczyt wiolonczelisty — głęboki, wymagający koncert spinający cały warsztat.",
      video: { yt: "OPhkZW_jwc0", tut: "Elgar cello concerto E minor du Pre" },
    },
  ]
);
