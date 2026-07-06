import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "klarnet",
    name: "Klarnet",
    icon: "🎶",
    description:
      "Nauka gry na klarnecie — od zadęcia i czystego dźwięku po pełen zakres, przejście rejestrów i ozdobniki. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 129,
  },
  [
    {
      title: "Złóż instrument, ustaw stroik i zadęcie",
      video: { yt: "9WcvrTqE-yk", tut: "clarinet embouchure how to make a sound beginner" },
    },
    {
      title: "Wydobądź stabilny, czysty dźwięk",
      video: { yt: "rqfpWhFjcrA", tut: "clarinet tone production lesson" },
    },
    "Zagraj pierwsze dźwięki w dolnym rejestrze (chalumeau)",
    {
      title: "Kontroluj oddech i długość frazy",
      video: { yt: "gOE7nbpK86Q", tut: "clarinet breathing air support lesson" },
    },
    "Zagraj pierwszą prostą melodię",
    "Opanuj gamę C-dur / F-dur",
    "Graj legato płynnie",
    {
      title: "Opanuj artykulację języka",
      video: { yt: "ShHxwBmUHRw", tut: "clarinet tonguing articulation beginner lesson" },
    },
    {
      title: "Przejdź przez rejestr (klapa oktawowa) czysto",
      video: { yt: "ZPtr_S04pGg", tut: "clarinet crossing the break lesson" },
    },
    "Zagraj w górnym rejestrze (clarino)",
    "Graj równo z metronomem",
    "Zagraj krótki utwór z pamięci",
    "Opanuj gamy durowe do kilku znaków",
    "Kontroluj intonację i barwę",
    "Zagraj utwór z akompaniamentem",
    "Kontroluj dynamikę i frazowanie",
    {
      title: "Opanuj pełen zakres instrumentu",
      video: { yt: "3OxfS8fHKiU", tut: "clarinet altissimo high notes upper register lesson" },
    },
    "Zagraj ozdobniki i glissando (podstawy)",
    "Opanuj szybkie pasaże i gamę chromatyczną",
    "Zagraj wymagający utwór z pełną kontrolą",
  ],
  [
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Prosta melodia w rejestrze chalumeau — pierwszy utwór.",
      video: { yt: "OpUYSwcHUwM", tut: "Ode to Joy clarinet tutorial" },
    },
    {
      piece: "«Greensleeves»",
      note: "Powolna, śpiewna melodia — zwieńczenie pierwszych kroków. Próba równego legato.",
      video: { yt: "pv_7OvGf4Q8", tut: "Greensleeves clarinet tutorial" },
    },
    {
      piece: "«Menuet» (Bach)",
      video: { yt: "OAkXu7UIZhg", tut: "Bach Minuet clarinet tutorial" },
    },
    {
      piece: "«Amazing Grace»",
      video: { yt: "wGuGbYgxg0k", tut: "Amazing Grace clarinet tutorial" },
    },
    {
      piece: "«Kanon D-dur» (Pachelbel)",
      note: "Zwieńczenie etapu regularnego: długie frazy do gry z akompaniamentem.",
      video: { yt: "Yk-uByky4gU", tut: "Pachelbel Canon in D clarinet tutorial" },
    },
    {
      piece: "«Summertime» (Gershwin)",
      video: { yt: "EiJ02bpDFdg", tut: "Summertime Gershwin clarinet tutorial" },
    },
    {
      piece: "«The Pink Panther» — temat (Mancini)",
      video: { yt: "W31_K9UB61o", tut: "Pink Panther clarinet tutorial" },
    },
    {
      piece: "«Rhapsody in Blue» — glissando otwierające (Gershwin)",
      note: "Zwieńczenie etapu średniozaawansowanego: legendarne glissando — wizytówka klarnetu.",
      video: { yt: "aEDq3ej7wjE", tut: "Rhapsody in Blue clarinet glissando tutorial" },
    },
    {
      piece: "«Hava Nagila» (klezmer)",
      note: "Żywiołowa melodia — próba artykulacji i tempa.",
      video: { yt: "np2Oc9RSMZ8", tut: "Hava Nagila klezmer clarinet tutorial" },
    },
    {
      piece: "«Petite pièce» (Debussy)",
      video: { yt: "xdgy7Zv2Ttk", tut: "Debussy Petite Piece clarinet tutorial" },
    },
    {
      piece: "«Koncert klarnetowy A-dur, cz. II Adagio» (Mozart, KV 622)",
      note: "Zwieńczenie etapu zaawansowanego: jedna z najpiękniejszych wolnych części w repertuarze.",
      video: { yt: "VpDq4Wu2f0A", tut: "Mozart clarinet concerto Adagio tutorial" },
    },
    {
      piece: "«Première Rhapsodie» (Debussy)",
      video: { yt: "YgfMzkh2ltU", tut: "Debussy Premiere Rhapsodie clarinet tutorial" },
    },
    {
      piece: "«Koncert klarnetowy A-dur, cz. I» (Mozart)",
      video: { yt: "iZbZ2CRDIhc", tut: "Mozart clarinet concerto first movement tutorial" },
    },
    {
      piece: "«Koncert klarnetowy nr 1 f-moll, cz. I» (Weber)",
      note: "Zwieńczenie etapu eksperckiego: romantyczny popis techniki i wyrazu.",
      video: { yt: "95gL5U4ILFc", tut: "Weber clarinet concerto no 1 F minor tutorial" },
    },
    {
      piece: "«Rhapsody in Blue» — pełną partię klarnetu (Gershwin)",
      video: { yt: "s5RnxMyjhfA", tut: "Rhapsody in Blue clarinet solo tutorial" },
    },
    {
      piece: "«Introdukcję, temat i wariacje» (Rossini)",
      note: "Repertuarowy szczyt klarnecisty — błyskotliwe wariacje spinające cały warsztat.",
      video: { yt: "rOp9aYQ09lU", tut: "Rossini Introduction Theme Variations clarinet" },
    },
  ]
);
