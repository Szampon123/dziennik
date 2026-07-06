import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "harmonijka-ustna",
    name: "Harmonijka ustna",
    icon: "🎶",
    description:
      "Nauka gry na harmonijce ustnej — od czystych pojedynczych dźwięków po bendy, grę w drugiej pozycji i bluesowe improwizacje. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 131,
  },
  [
    {
      title: "Poznaj układ dźwięków i trzymanie harmonijki",
      video: { yt: "Zc-EcRFrxcA", tut: "how to play harmonica for beginners first lesson" },
    },
    {
      title: "Zagraj czysto pojedyncze dźwięki (single notes)",
      video: { yt: "9w8QYW5Wsh0", tut: "harmonica clean single notes lesson" },
    },
    "Graj wdech i wydech równo i czysto",
    "Utrzymaj równy puls",
    "Zagraj pierwszą prostą melodię",
    "Opanuj grę na sąsiednich dziurkach płynnie",
    "Zagraj prosty rytm akordowy (chugging)",
    {
      title: "Opanuj technikę dłoni (tremolo, wah)",
      video: { yt: "Mpq4fP-Oqa0", tut: "harmonica hand vibrato wah technique lesson" },
    },
    "Zagraj melodię w pierwszej pozycji",
    {
      title: "Opanuj podstawy bendowania dźwięku (draw bend)",
      video: { yt: "67ZbI4S-hTQ", tut: "harmonica bending draw bends lesson" },
    },
    "Graj równo z podkładem / metronomem",
    "Zagraj krótki utwór z pamięci",
    {
      title: "Opanuj grę w drugiej pozycji (cross harp / blues)",
      video: { yt: "ZGHE1NhFYhU", tut: "harmonica second position cross harp lesson" },
    },
    "Kontroluj barwę i dynamikę",
    "Zagraj utwór z akompaniamentem",
    "Opanuj czyste bendy na kilku dziurkach",
    {
      title: "Zagraj skalę bluesową pewnie",
      video: { yt: "AAQYcBZqYrU", tut: "harmonica blues scale lesson" },
    },
    "Improwizuj prostą solówkę bluesową",
    "Opanuj artykulację i frazowanie bluesowe",
    "Zagraj wyrazisty solowy fragment",
  ],
  [
    {
      piece: "«Oh! Susanna»",
      note: "Prosta melodia na pojedynczych dźwiękach — pierwszy utwór. Zamiennik: dowolna melodia ludowa.",
      video: { yt: "K7uu-ZD8RvA", tut: "Oh Susanna harmonica tutorial" },
    },
    {
      piece: "«Amazing Grace»",
      note: "Powolna melodia — zwieńczenie pierwszych kroków. Próba czystych single notes.",
      video: { yt: "-9tvB9rO4dg", tut: "Amazing Grace harmonica tutorial" },
    },
    {
      piece: "«When the Saints Go Marching In»",
      video: { yt: "YbLoPtPt04A", tut: "When the Saints harmonica tutorial" },
    },
    {
      piece: "«You Are My Sunshine»",
      video: { yt: "hrhxIbdPhvI", tut: "You Are My Sunshine harmonica tutorial" },
    },
    {
      piece: "«Love Me Do» — partię harmonijki (The Beatles)",
      note: "Zwieńczenie etapu regularnego: kultowy riff harmonijki w popie.",
      video: { yt: "xTWCif4dbbo", tut: "Love Me Do harmonica tutorial" },
    },
    {
      piece: "«Piano Man» — partię harmonijki (Billy Joel)",
      video: { yt: "0ksXtQTWf-U", tut: "Piano Man harmonica tutorial" },
    },
    {
      piece: "«Heart of Gold» — partię harmonijki (Neil Young)",
      video: { yt: "_n1AvLoEEKY", tut: "Heart of Gold harmonica tutorial" },
    },
    {
      piece: "«Mannish Boy» (Muddy Waters)",
      note: "Zwieńczenie etapu średniozaawansowanego: wejście w bluesa i grę w drugiej pozycji.",
      video: { yt: "UQc2NNy906k", tut: "Mannish Boy harmonica tutorial" },
    },
    {
      piece: "«Juke» (Little Walter)",
      note: "Wzorcowy bluesowy instrumental — próba bendów i frazowania.",
      video: { yt: "kWLQSplVP3Y", tut: "Juke Little Walter harmonica tutorial" },
    },
    {
      piece: "«Hoochie Coochie Man» (Muddy Waters)",
      video: { yt: "JeRF37gAFM8", tut: "Hoochie Coochie Man harmonica tutorial" },
    },
    {
      piece: "«On the Road Again» (Canned Heat)",
      note: "Zwieńczenie etapu zaawansowanego: charakterystyczne riffy i pełny bluesowy groove.",
      video: { yt: "C3JU0VZp5JY", tut: "On the Road Again Canned Heat harmonica tutorial" },
    },
    {
      piece: "«Whammer Jammer» (J. Geils Band)",
      note: "Popisowy instrumental — szybkie bendy i artykulacja.",
      video: { yt: "yZUZHjSPYKY", tut: "Whammer Jammer harmonica tutorial" },
    },
    {
      piece: "«Key to the Highway» (standard bluesowy)",
      video: { yt: "Tsq-CQXpP6w", tut: "Key to the Highway blues harmonica tutorial" },
    },
    {
      piece: "«Orange Blossom Special» (Charlie McCoy)",
      note: "Zwieńczenie etapu eksperckiego: błyskawiczny popis — efekty pociągu i wirtuozeria.",
      video: { yt: "MdNjDC4yBIo", tut: "Orange Blossom Special harmonica Charlie McCoy" },
    },
    {
      piece: "«Moon River» — na harmonijce chromatycznej (Mancini)",
      note: "Wejście w harmonijkę chromatyczną i pełną skalę.",
      video: { yt: "NsA7JESv0Jk", tut: "Moon River chromatic harmonica tutorial" },
    },
    {
      piece: "«Isn't She Lovely» — solo na harmonijce chromatycznej (Stevie Wonder)",
      note: "Repertuarowy szczyt harmonijkarza — melodyjne, wirtuozowskie solo chromatyczne.",
      video: { yt: "-WElzS0aJmM", tut: "Isn't She Lovely chromatic harmonica solo" },
    },
  ]
);
