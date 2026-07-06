import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "trabka",
    name: "Trąbka",
    icon: "🎺",
    description:
      "Nauka gry na trąbce — od zadęcia i pewnego dźwięku po szeroki zakres, wytrzymałość i solówki. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 128,
  },
  [
    {
      title: "Ustaw zadęcie (embouchure) i wydobądź pierwszy dźwięk",
      video: { yt: "3o1ONiR5WDs", tut: "trumpet embouchure buzzing beginner lesson" },
    },
    {
      title: "Zagraj stabilny, czysty dźwięk",
      video: { yt: "-DyxI7_PeNs", tut: "trumpet good sound tone lesson" },
    },
    "Zagraj pierwsze dźwięki gamy z wykorzystaniem wentyli",
    {
      title: "Kontroluj oddech i podparcie dźwięku",
      video: { yt: "HBsuqkhKsPQ", tut: "trumpet breathing air support lesson" },
    },
    "Zagraj pierwszą prostą melodię",
    "Opanuj gamę C-dur / F-dur",
    "Graj legato płynnie między dźwiękami",
    {
      title: "Opanuj artykulację języka (staccato)",
      video: { yt: "1ZWO6BVoVSk", tut: "trumpet tonguing articulation beginner lesson" },
    },
    "Rozszerz zakres w dół i w górę",
    {
      title: "Ćwicz alikwoty i pewne trafianie dźwięków",
      video: { yt: "B1IXrFoACdg", tut: "trumpet lip slurs flexibility exercises" },
    },
    "Graj równo z metronomem",
    "Zagraj krótki utwór z pamięci",
    "Opanuj gamy durowe do kilku znaków",
    "Kontroluj intonację i barwę",
    "Zagraj utwór z akompaniamentem",
    "Kontroluj dynamikę i wytrzymałość zadęcia",
    {
      title: "Opanuj wyższy rejestr pewnie",
      video: { yt: "h0qmKaB7F30", tut: "trumpet high notes upper register lesson" },
    },
    "Improwizuj na prostym podkładzie",
    "Opanuj szybkie pasaże i ozdobniki",
    "Zagraj wyrazisty solowy fragment",
  ],
  [
    {
      piece: "«When the Saints Go Marching In»",
      note: "Radosna melodia w wygodnym rejestrze — pierwszy utwór.",
      video: { yt: "EMO-Ku60Hsk", tut: "When the Saints trumpet tutorial" },
    },
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Prosta, rozpoznawalna melodia — zwieńczenie pierwszych kroków.",
      video: { yt: "dOWPq7INajI", tut: "Ode to Joy trumpet tutorial" },
    },
    {
      piece: "«Amazing Grace»",
      video: { yt: "UvEWVqFPlHI", tut: "Amazing Grace trumpet tutorial" },
    },
    {
      piece: "«Hejnał mariacki»",
      note: "Klasyka polskiej trąbki — próba czystego zadęcia i wyrazu.",
      video: { yt: "AGiOGPSa4Tc", tut: "hejnał mariacki trąbka nuty" },
    },
    {
      piece: "«Marsz triumfalny z „Aidy”» — temat (Verdi)",
      note: "Zwieńczenie etapu regularnego: fanfarowa, uroczysta melodia.",
      video: { yt: "CbJtHvr85vY", tut: "Aida triumphal march trumpet tutorial" },
    },
    {
      piece: "«What a Wonderful World» (Louis Armstrong)",
      video: { yt: "lhQaE9NeHYc", tut: "What a Wonderful World trumpet tutorial" },
    },
    {
      piece: "«The Pink Panther» — temat (Mancini)",
      video: { yt: "9vwB9S-4h0g", tut: "Pink Panther trumpet tutorial" },
    },
    {
      piece: "«Il Silenzio» (Nini Rosso)",
      note: "Zwieńczenie etapu średniozaawansowanego: śpiewny solo z długimi frazami.",
      video: { yt: "gNXwPvzmxVE", tut: "Il Silenzio trumpet tutorial" },
    },
    {
      piece: "«Fly Me to the Moon»",
      video: { yt: "Y3piNE03LN8", tut: "Fly Me to the Moon trumpet tutorial" },
    },
    {
      piece: "«Feeling Good» (Bricusse / Newley)",
      video: { yt: "GxjoAv0Ea74", tut: "Feeling Good trumpet tutorial" },
    },
    {
      piece: "«Trumpet Voluntary» (Jeremiah Clarke)",
      note: "Zwieńczenie etapu zaawansowanego: uroczysty utwór barokowy (często grany na ślubach).",
      video: { yt: "tYqdLvnVilA", tut: "Trumpet Voluntary Clarke tutorial" },
    },
    {
      piece: "«Koncert trąbkowy Es-dur, cz. I» (Haydn)",
      video: { yt: "ZUZYoVw7moc", tut: "Haydn trumpet concerto E flat tutorial" },
    },
    {
      piece: "«Koncert trąbkowy Es-dur, cz. III» (Hummel)",
      video: { yt: "H1zqQ1aZMs0", tut: "Hummel trumpet concerto rondo tutorial" },
    },
    {
      piece: "«Karnawał wenecki» (Arban)",
      note: "Zwieńczenie etapu eksperckiego: wariacje — sztandarowy popis trębacza.",
      video: { yt: "D_EjQi_vxrU", tut: "Arban Carnival of Venice trumpet tutorial" },
    },
    {
      piece: "«Lot trzmiela» (Rimski-Korsakow) — aranż. na trąbkę",
      note: "Błyskawiczne pasaże — próba techniki.",
      video: { yt: "Ku3qNVh890w", tut: "Flight of the Bumblebee trumpet tutorial" },
    },
    {
      piece: "«II Koncert brandenburski, cz. I» — trąbka piccolo (Bach)",
      note: "Repertuarowy szczyt trębacza — morderczo wysoki rejestr i wytrzymałość.",
      video: { yt: "p_1jmoSvOBs", tut: "Bach Brandenburg 2 piccolo trumpet" },
    },
  ]
);
