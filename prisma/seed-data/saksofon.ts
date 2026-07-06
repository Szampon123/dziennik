import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "saksofon",
    name: "Saksofon",
    icon: "🎷",
    description:
      "Nauka gry na saksofonie — od zadęcia i czystego dźwięku po pełen zakres, artykulację i improwizację. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 126,
  },
  [
    {
      title: "Złóż instrument, ustaw ustnik i zadbaj o zadęcie (embouchure)",
      video: { yt: "4Nilvdq_W1s", tut: "saxophone embouchure for beginners lesson" },
    },
    {
      title: "Wydobądź stabilny, czysty dźwięk",
      video: { yt: "GLc1oFucOio", tut: "saxophone good tone sound beginner lesson" },
    },
    "Zagraj pierwsze dźwięki gamy w środkowym rejestrze",
    "Kontroluj oddech i długość frazy",
    "Zagraj pierwszą prostą melodię",
    "Opanuj gamę C-dur / F-dur",
    "Graj czysto legato między dźwiękami",
    {
      title: "Opanuj artykulację języka (staccato)",
      video: { yt: "EqyAYTwpUM8", tut: "saxophone tonguing articulation lesson" },
    },
    "Zagraj dźwięki w niższym rejestrze",
    {
      title: "Opanuj dźwięki w wyższym rejestrze (przedmuch)",
      video: { yt: "fKDl_CnA8nY", tut: "saxophone overtones altissimo lesson" },
    },
    "Graj równo w stałym tempie z metronomem",
    "Zagraj krótki standard / melodię z pamięci",
    {
      title: "Opanuj gamy durowe do kilku znaków",
      video: { yt: "UoQ7v9B5axY", tut: "saxophone major scales lesson" },
    },
    "Kontroluj intonację i barwę dźwięku",
    "Zagraj utwór z akompaniamentem",
    "Kontroluj dynamikę i frazowanie",
    "Opanuj gamę chromatyczną i pełen zakres",
    {
      title: "Improwizuj na prostym podkładzie (blues)",
      video: { yt: "5Ozzr8nIhro", tut: "saxophone blues improvisation for beginners" },
    },
    "Opanuj szybkie pasaże i ozdobniki",
    "Zagraj wyrazisty solowy fragment",
  ],
  [
    {
      piece: "«When the Saints Go Marching In»",
      note: "Prosta, radosna melodia w środkowym rejestrze — idealny pierwszy utwór.",
      video: { yt: "OmD5i82QHnw", tut: "When the Saints saxophone tutorial" },
    },
    {
      piece: "«Careless Whisper» — główny motyw (George Michael)",
      note: "Najsłynniejszy riff saksofonu — motywujące zwieńczenie pierwszych kroków. Wolniej też się liczy.",
      video: { yt: "iZcWtrE33FI", tut: "Careless Whisper saxophone tutorial" },
    },
    {
      piece: "«Baker Street» — motyw (Gerry Rafferty)",
      video: { yt: "0XWmcY17uzA", tut: "Baker Street saxophone solo tutorial" },
    },
    {
      piece: "«Summertime» (Gershwin)",
      video: { yt: "kUFgge0cIQw", tut: "Summertime Gershwin saxophone tutorial" },
    },
    {
      piece: "«Autumn Leaves» — temat (Kosma)",
      note: "Zwieńczenie etapu regularnego: pierwszy standard jazzowy — świetny do nauki frazowania.",
      video: { yt: "vC-g9DsyfCo", tut: "Autumn Leaves saxophone tutorial" },
    },
    {
      piece: "«Fly Me to the Moon» (Bart Howard)",
      video: { yt: "gSVovdnuNHA", tut: "Fly Me to the Moon saxophone tutorial" },
    },
    {
      piece: "«The Pink Panther» — temat (Mancini)",
      video: { yt: "lLRxGPfxyLI", tut: "Pink Panther saxophone tutorial" },
    },
    {
      piece: "«Take Five» — temat (Paul Desmond)",
      note: "Zwieńczenie etapu średniozaawansowanego: klasyk saksofonu altowego w metrum 5/4.",
      video: { yt: "ekIJ7AC6kss", tut: "Take Five saxophone tutorial Paul Desmond" },
    },
    {
      piece: "«Blue Bossa» (Kenny Dorham)",
      note: "Standard do nauki improwizacji nad zmianami.",
      video: { yt: "2VEMpQyDZ8U", tut: "Blue Bossa saxophone tutorial" },
    },
    {
      piece: "«So What» (Miles Davis)",
      note: "Modalny standard — próba budowania solówki na dwóch skalach.",
      video: { yt: "2uTQQKU6ge0", tut: "So What Miles Davis saxophone tutorial" },
    },
    {
      piece: "«Now's the Time» (Charlie Parker)",
      note: "Zwieńczenie etapu zaawansowanego: bluesowy bebop — temat i improwizacja.",
      video: { yt: "0f3zsTtj2Sg", tut: "Now's the Time Charlie Parker saxophone tutorial" },
    },
    {
      piece: "«Song for My Father» (Horace Silver)",
      video: { yt: "hqSWBam3yPE", tut: "Song for My Father saxophone tutorial" },
    },
    {
      piece: "«Moanin'» (Bobby Timmons / Art Blakey)",
      video: { yt: "Cv9NSR-2DwM", tut: "Moanin Art Blakey saxophone tutorial" },
    },
    {
      piece: "«Ornithology» (Charlie Parker)",
      note: "Zwieńczenie etapu eksperckiego: szybki temat bebopowy — próba techniki i słuchu harmonicznego.",
      video: { yt: "LCedJOBvzds", tut: "Ornithology Charlie Parker saxophone tutorial" },
    },
    {
      piece: "«Giant Steps» (John Coltrane)",
      note: "Legendarnie trudne zmiany harmoniczne — probierz improwizatora.",
      video: { yt: "30FTr6G53VU", tut: "Giant Steps Coltrane saxophone tutorial" },
    },
    {
      piece: "«Body and Soul» (interpretacja jak Coleman Hawkins)",
      note: "Repertuarowy szczyt saksofonisty — ballada, w której improwizacja staje się kompozycją.",
      video: { yt: "f6bJ_1h9Mmk", tut: "Body and Soul Coleman Hawkins saxophone" },
    },
  ]
);
