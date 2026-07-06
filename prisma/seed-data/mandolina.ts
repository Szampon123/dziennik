import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "mandolina",
    name: "Mandolina",
    icon: "🪕",
    description:
      "Nauka gry na mandolinie — od czystego kostkowania i tremolo po grę w pozycjach i solówki. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 134,
  },
  [
    {
      title: "Nastrój mandolinę i poznaj chwyt instrumentu i kostki",
      video: { yt: "DvDDGN1h36s", tut: "how to play mandolin for beginners first lesson" },
    },
    "Zagraj czysto pojedyncze dźwięki (para strun)",
    {
      title: "Opanuj grę naprzemienną kostką (alternate picking)",
      video: { yt: "4pcukj9MTJ8", tut: "mandolin alternate picking lesson beginner" },
    },
    "Utrzymaj równy puls",
    "Zagraj pierwszą prostą melodię",
    {
      title: "Opanuj pierwsze akordy i zmiany",
      video: { yt: "_TQQSsp5Iys", tut: "mandolin first chords G C D beginner lesson" },
    },
    {
      title: "Zagraj tremolo na jednym dźwięku",
      video: { yt: "iT2d-g5mhZc", tut: "mandolin tremolo technique lesson" },
    },
    "Opanuj gamę durową w pierwszej pozycji",
    {
      title: "Zagraj melodię z akompaniamentem akordowym (chop)",
      video: { yt: "u1ZOv1-wc28", tut: "mandolin bluegrass chop chords lesson" },
    },
    {
      title: "Opanuj hammer-on, pull-off i slide",
      video: { yt: "SHwjDExpnWA", tut: "mandolin hammer-on pull-off slide lesson" },
    },
    "Graj równo z metronomem",
    "Zagraj utwór z pamięci",
    "Opanuj tremolo w dłuższych frazach",
    "Kontroluj dynamikę i barwę",
    "Zagraj pełny utwór (melodia + akordy)",
    "Opanuj grę w kilku tonacjach",
    "Opanuj gamy i pozycje po całym gryfie",
    "Improwizuj prostą solówkę",
    "Opanuj szybkie pasaże i podwójne dźwięki",
    "Zagraj wymagający utwór z tremolo i pasażami",
  ],
  [
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Prosta melodia kostkowana pojedynczymi dźwiękami — pierwszy utwór.",
      video: { yt: "xEYeeIc73sA", tut: "Ode to Joy mandolin tutorial" },
    },
    {
      piece: "«Boil Them Cabbage Down»",
      note: "Prosta melodia ludowa — zwieńczenie pierwszych kroków. Zamiennik: dowolna łatwa melodia bluegrassowa.",
      video: { yt: "mwShbLA0HiI", tut: "Boil Them Cabbage Down mandolin tutorial" },
    },
    {
      piece: "«Old Joe Clark»",
      video: { yt: "Vfno5_Yt0hs", tut: "Old Joe Clark mandolin tutorial" },
    },
    {
      piece: "«Angeline the Baker»",
      video: { yt: "nbBUGNCldjc", tut: "Angeline the Baker mandolin tutorial" },
    },
    {
      piece: "«You Are My Sunshine» — na mandolinie",
      note: "Zwieńczenie etapu regularnego: melodia z akompaniamentem.",
      video: { yt: "sUDSrVU6FZI", tut: "You Are My Sunshine mandolin tutorial" },
    },
    {
      piece: "«Ashokan Farewell» (Jay Ungar)",
      note: "Rzewna melodia — próba tremolo i wyrazu.",
      video: { yt: "kqJViDKCt4M", tut: "Ashokan Farewell mandolin tutorial" },
    },
    {
      piece: "«Whiskey Before Breakfast»",
      video: { yt: "OIq7oBLiLuQ", tut: "Whiskey Before Breakfast mandolin tutorial" },
    },
    {
      piece: "«Blackberry Blossom»",
      note: "Zwieńczenie etapu średniozaawansowanego: szybka melodia fiddle'owa — próba kostkowania.",
      video: { yt: "DRFX6DLz6C0", tut: "Blackberry Blossom mandolin tutorial" },
    },
    {
      piece: "«Salt Creek»",
      video: { yt: "1SqO-aLhZpw", tut: "Salt Creek mandolin tutorial" },
    },
    {
      piece: "«Jerusalem Ridge» (Bill Monroe)",
      video: { yt: "Fp_6VIRvnN4", tut: "Jerusalem Ridge mandolin tutorial" },
    },
    {
      piece: "«Rawhide» (Bill Monroe)",
      note: "Zwieńczenie etapu zaawansowanego: błyskawiczny popis stylu Billa Monroe.",
      video: { yt: "QbRXh6xA2hY", tut: "Rawhide Bill Monroe mandolin" },
    },
    {
      piece: "«Czardasza» (Monti)",
      video: { yt: "RLWqLhGPc_U", tut: "Monti Czardas mandolin tutorial" },
    },
    {
      piece: "«Bourrée e-moll» (Bach)",
      video: { yt: "Nfi1X7a_B4w", tut: "Bach Bourree E minor mandolin tutorial" },
    },
    {
      piece: "«Koncert mandolinowy C-dur, RV 425, cz. I» (Vivaldi)",
      note: "Zwieńczenie etapu eksperckiego: pełnowymiarowy koncert barokowy.",
      video: { yt: "GEyqOZU9T_o", tut: "Vivaldi mandolin concerto C major RV 425" },
    },
    {
      piece: "«Sonatę d-moll» (Scarlatti) — aranż. na mandolinę",
      video: { yt: "JzIOEv-aAVc", tut: "Scarlatti sonata K89 mandolin Carlo Aonzo" },
    },
    {
      piece: "«Chaconne z Partity d-moll» (Bach) — aranż. na mandolinę",
      note: "Repertuarowy szczyt mandolinisty — monumentalne dzieło (spopularyzowane przez Chrisa Thile'a).",
      video: { yt: "HtW6yvz1Dfw", tut: "Bach Chaconne mandolin Chris Thile" },
    },
  ]
);
