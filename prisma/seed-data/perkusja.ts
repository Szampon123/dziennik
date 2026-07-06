import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "perkusja",
    name: "Perkusja",
    icon: "🥁",
    description:
      "Nauka gry na perkusji — od podstawowego groove'u i rudymentów po niezależność kończyn, fill-iny i solówki. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 123,
  },
  [
    "Poznaj zestaw i prawidłowy chwyt pałek",
    "Zagraj równe uderzenia każdą ręką osobno",
    {
      title: "Opanuj podstawowy rytm rockowy (stopa, werbel, hi-hat)",
      video: { yt: "3luRBeULH4Y", tut: "basic rock drum beat beginner lesson" },
    },
    "Utrzymaj równy puls z metronomem",
    "Zagraj do prostej piosenki",
    {
      title: "Opanuj podstawowe rudymenty (single/double stroke)",
      video: { yt: "kuCY61NRz3U", tut: "single double stroke roll drum rudiments lesson" },
    },
    {
      title: "Zagraj pierwsze proste przejścia (fill-iny)",
      video: { yt: "DKo7xBj0hE0", tut: "drum fills for beginners lesson" },
    },
    "Koordynuj cztery kończyny w jednym rytmie",
    "Opanuj groove z ósemkami na hi-hacie",
    {
      title: "Zagraj paradiddle płynnie",
      video: { yt: "h0OoVP6VgBE", tut: "how to play paradiddle drums lesson" },
    },
    "Graj z dynamiką (akcenty, ghost notes)",
    "Zagraj kilka rytmów w różnych stylach",
    "Opanuj grę stopą (ćwierćnuty i ósemki)",
    "Graj równo w różnych tempach z metronomem",
    "Zagraj utwór z fill-inami i zmianami",
    "Kontroluj dynamikę i głośność zestawu",
    "Opanuj shuffle i rytmy triolowe",
    "Improwizuj proste solo perkusyjne",
    "Opanuj groove'y funk / jazz (swing)",
    "Graj złożone koordynacje (niezależność kończyn)",
  ],
  [
    {
      piece: "«We Will Rock You» (Queen)",
      note: "Najprostszy możliwy beat (tup-tup-klap) do zagrania z nagraniem — pierwszy krok na zestawie.",
      video: { yt: "9X3TG0pUivA", tut: "We Will Rock You drum tutorial" },
    },
    {
      piece: "«Billie Jean» (Michael Jackson)",
      note: "Wzorcowy, równy groove 4/4 — zwieńczenie pierwszych kroków. Cała trudność to utrzymać go bez przyspieszania.",
      video: { yt: "V29FNfECL9k", tut: "Billie Jean drum tutorial" },
    },
    {
      piece: "«Back in Black» (AC/DC)",
      video: { yt: "KdLariwaeQ0", tut: "Back in Black drum tutorial" },
    },
    {
      piece: "«Seven Nation Army» (The White Stripes)",
      video: { yt: "5jR_mbL5uoM", tut: "Seven Nation Army drum tutorial" },
    },
    {
      piece: "«Highway to Hell» (AC/DC)",
      note: "Zwieńczenie etapu regularnego: solidny rockowy groove z akcentami i prostymi fill-inami.",
      video: { yt: "Z7UoBrkbzPE", tut: "Highway to Hell drum tutorial" },
    },
    {
      piece: "«Smells Like Teen Spirit» (Nirvana)",
      note: "Groove + charakterystyczne przejścia — próba dynamiki.",
      video: { yt: "JMgfv7NO47c", tut: "Smells Like Teen Spirit drum tutorial" },
    },
    {
      piece: "«Another One Bites the Dust» (Queen)",
      video: { yt: "ld7LnVNAVYc", tut: "Another One Bites the Dust drum tutorial" },
    },
    {
      piece: "«Enter Sandman» (Metallica)",
      note: "Zwieńczenie etapu średniozaawansowanego: wytrzymałość, groove i fill-iny w jednym utworze.",
      video: { yt: "bGG-OvilMsM", tut: "Enter Sandman drum tutorial" },
    },
    {
      piece: "«Superstition» (Stevie Wonder)",
      note: "Funk na szesnastkach z ghost notes — próba niezależności rąk.",
      video: { yt: "8XTBYPXiciw", tut: "Superstition drum tutorial" },
    },
    {
      piece: "«Rosanna» — „Rosanna shuffle” (Toto)",
      note: "Half-time shuffle Jeffa Porcaro — legendarny groove.",
      video: { yt: "vcZ8_3Zawf8", tut: "Rosanna shuffle drum tutorial Porcaro" },
    },
    {
      piece: "«Tom Sawyer» (Rush)",
      note: "Zwieńczenie etapu zaawansowanego: zmiany metrum i fill-iny Neila Pearta.",
      video: { yt: "JaPPVioejBw", tut: "Tom Sawyer Rush drum tutorial" },
    },
    {
      piece: "«Take Five» (Dave Brubeck)",
      note: "Jazz w 5/4 — swing i kontrola w nietypowym metrum.",
      video: { yt: "9tTyTc6FjjU", tut: "Take Five drum tutorial Joe Morello" },
    },
    {
      piece: "«Aja» (Steely Dan)",
      note: "Popisowy groove i solo Steve'a Gadda — bardzo zaawansowane.",
      video: { yt: "NnGFbCQ96IQ", tut: "Aja Steely Dan drum tutorial Steve Gadd" },
    },
    {
      piece: "«YYZ» (Rush)",
      note: "Zwieńczenie etapu eksperckiego: instrumentalny popis w metrum 10/8.",
      video: { yt: "omsB3dFLzjI", tut: "YYZ Rush drum tutorial" },
    },
    {
      piece: "«The Ocean» (Led Zeppelin)",
      note: "Groove Johna Bonhama w nietypowym metrum.",
      video: { yt: "iYBO44xTPQc", tut: "The Ocean Led Zeppelin drum tutorial" },
    },
    {
      piece: "«Moby Dick» — solo perkusyjne (Led Zeppelin)",
      note: "Repertuarowy szczyt perkusisty — rozbudowane solo w stylu Bonhama.",
      video: { yt: "UOSf9f5_qZ8", tut: "Moby Dick John Bonham drum solo" },
    },
  ]
);
