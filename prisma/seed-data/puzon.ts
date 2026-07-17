import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "puzon",
    name: "Puzon",
    icon: "🎺",
    description:
      "Nauka gry na puzonie — od pozycji suwaka i pewnego dźwięku po glissando, szeroki zakres i solówki. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 136,
  },
  [
    {
      title: "Ustaw zadęcie i poznaj pozycje suwaka",
      video: { yt: "TflgyCIZEYM", tut: "trombone slide positions for beginners lesson" },
    },
    {
      title: "Wydobądź stabilny, czysty dźwięk",
      video: { yt: "7EAYBJ4lR2A", tut: "trombone mouthpiece buzzing first notes lesson" },
    },
    "Zagraj pierwsze dźwięki w kilku pozycjach suwaka",
    "Kontroluj oddech i podparcie dźwięku",
    "Zagraj pierwszą prostą melodię",
    {
      title: "Opanuj gamę B-dur / F-dur",
      video: { yt: "54psXhBglxE", tut: "trombone Bb major scale lesson" },
    },
    {
      title: "Graj legato (płynne łączenie pozycji)",
      video: { yt: "VmQZtvQZ2sA", tut: "trombone natural slur legato lesson" },
    },
    {
      title: "Opanuj artykulację języka (staccato)",
      video: { yt: "sJvhx5dBOiM", tut: "trombone tonguing articulation staccato lesson" },
    },
    "Trafiaj pewnie dźwięki między pozycjami",
    "Rozszerz zakres w dół i w górę",
    "Graj równo z metronomem",
    "Zagraj krótki utwór z pamięci",
    "Opanuj gamy durowe do kilku znaków",
    "Kontroluj intonację (korekta suwakiem)",
    "Zagraj utwór z akompaniamentem",
    "Kontroluj dynamikę i wytrzymałość",
    {
      title: "Opanuj glissando i pełen zakres",
      video: { yt: "4UiVuIf208c", tut: "trombone glissando how to lesson" },
    },
    "Improwizuj na prostym podkładzie",
    "Opanuj szybkie zmiany pozycji",
    "Zagraj wyrazisty solowy fragment",
  ],
  [
    {
      piece: "«When the Saints Go Marching In»",
      note: "Radosna melodia w wygodnych pozycjach suwaka — pierwszy utwór.",
      video: { yt: "9GXhbcxCFCA", tut: "When the Saints Go Marching In trombone" },
    },
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Prosta, rozpoznawalna melodia — zwieńczenie pierwszych kroków.",
      video: { yt: "8-fkvWFSeYc", tut: "Ode to Joy trombone" },
    },
    {
      piece: "«Amazing Grace»",
      video: { yt: "kQsibgZ5vr0", tut: "Amazing Grace trombone solo" },
    },
    {
      piece: "«Go Down Moses»",
      note: "Spiritual w niskim rejestrze — próba głębokiego, pełnego dźwięku.",
      video: { yt: "fHB6RjnaXrk", tut: "Go Down Moses trombone" },
    },
    {
      piece: "«Marsz triumfalny z „Aidy”» — temat (Verdi)",
      note: "Zwieńczenie etapu regularnego: uroczysta, fanfarowa melodia.",
      video: { yt: "f53LAGWz7cs", tut: "Aida Triumphal March trombone brass" },
    },
    {
      piece: "«What a Wonderful World»",
      video: { yt: "xN--yTnS45Q", tut: "What a Wonderful World trombone Delfeayo Marsalis" },
    },
    {
      piece: "«St. Louis Blues» (W.C. Handy)",
      video: { yt: "CVgpTl4a-jQ", tut: "St. Louis Blues trombone solo" },
    },
    {
      piece: "«In the Mood» — partię puzonu (Glenn Miller)",
      note: "Zwieńczenie etapu średniozaawansowanego: swingowy klasyk big-bandowy.",
      video: { yt: "x-Jk_EPxx8Q", tut: "In the Mood Glenn Miller trombone solo" },
    },
    {
      piece: "«Basin Street Blues»",
      video: { yt: "c8YZSmu_NNw", tut: "Basin Street Blues trombone solo" },
    },
    {
      piece: "«A Night in Tunisia» — temat (Dizzy Gillespie)",
      video: { yt: "QcN5UPnW8TI", tut: "A Night in Tunisia trombone solo" },
    },
    {
      piece: "«Concertino Es-dur, cz. I» (Ferdinand David)",
      note: "Zwieńczenie etapu zaawansowanego: pierwszy pełnowymiarowy koncert puzonowy.",
      video: { yt: "YDf4-TRM2Us", tut: "Ferdinand David trombone concertino" },
    },
    {
      piece: "«Morceau Symphonique» (Guilmant)",
      video: { yt: "qv-IB6sDG-A", tut: "Guilmant Morceau Symphonique trombone" },
    },
    {
      piece: "«Cavatine» (Saint-Saëns)",
      video: { yt: "bDAjhht36qM", tut: "Saint-Saens Cavatine trombone Joseph Alessi" },
    },
    {
      piece: "«Koncert na puzon, cz. I» (Rimski-Korsakow)",
      note: "Zwieńczenie etapu eksperckiego: popisowy koncert z wojskowej tradycji.",
      video: { yt: "PYjmt4XDVl4", tut: "Rimsky-Korsakov trombone concerto Lindberg" },
    },
    {
      piece: "«The Blue Bells of Scotland» (Arthur Pryor)",
      note: "Wariacje — wirtuozowski popis suwaka.",
      video: { yt: "NTB2aR_wjVI", tut: "Blue Bells of Scotland Pryor trombone" },
    },
    {
      piece: "«Koncert na puzon, cz. I» (Grøndahl)",
      note: "Repertuarowy szczyt puzonisty — najważniejszy koncert w repertuarze instrumentu.",
      video: { yt: "bUIcglnCijI", tut: "Grondahl trombone concerto" },
    },
  ]
);
