import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "gitara-basowa",
    name: "Gitara basowa",
    icon: "🎸",
    description:
      "Nauka gry na gitarze basowej — od solidnego groove'u i podążania za akordami po slap i swobodne budowanie linii basu. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 124,
  },
  [
    "Poznaj gryf, struny i prawidłową postawę",
    "Zagraj czysto pojedyncze dźwięki (gra palcami)",
    {
      title: "Opanuj grę naprzemienną dwoma palcami",
      video: { yt: "CR8yQCZX2HQ", tut: "bass two finger plucking technique lesson" },
    },
    "Utrzymaj równy puls z metronomem",
    "Zagraj pierwszą prostą linię basu do piosenki",
    "Opanuj gamę durową w jednej pozycji",
    "Graj równe ósemki w stałym tempie",
    {
      title: "Opanuj podstawy grania kostką",
      video: { yt: "vaQL21UL7Wc", tut: "how to play bass with a pick lesson" },
    },
    "Zagraj linię basu podążającą za akordami (root notes)",
    {
      title: "Opanuj pentatonikę molową",
      video: { yt: "hhnf8nVUgDM", tut: "bass minor pentatonic scale lesson" },
    },
    {
      title: "Zagraj z tłumieniem strun (muting) czysto",
      video: { yt: "VPlseI98oxQ", tut: "bass string muting technique lesson" },
    },
    "Zagraj groove z synkopą",
    {
      title: "Opanuj hammer-on, pull-off i slide",
      video: { yt: "2fUhq1ojGYA", tut: "bass hammer on pull off slide lesson" },
    },
    "Trzymaj równy time z perkusją / metronomem",
    "Zagraj pełną piosenkę z pamięci",
    "Buduj linie basu z pasażami i ozdobnikami",
    "Opanuj gamy i arpeggia po całym gryfie",
    "Improwizuj linię basu na podkładzie",
    {
      title: "Opanuj technikę slap i pop (podstawy)",
      video: { yt: "MN7TJl_xN9M", tut: "how to slap bass for beginners lesson" },
    },
    "Zagraj wymagającą linię z groove'em i fillami",
  ],
  [
    {
      piece: "«Another One Bites the Dust» — linię basu (Queen)",
      note: "Najsłynniejsza linia basu dla początkujących — jeden riff przez cały utwór.",
      video: { yt: "5J-TBvv_nzg", tut: "Another One Bites the Dust bass tutorial" },
    },
    {
      piece: "«Billie Jean» — linię basu (Michael Jackson)",
      note: "Wzorcowy, równy groove — zwieńczenie pierwszych kroków. Trudność to utrzymać puls.",
      video: { yt: "Yrm5RBG6S7c", tut: "Billie Jean bass tutorial" },
    },
    {
      piece: "«Come as You Are» — linię basu (Nirvana)",
      video: { yt: "rWHkrYRhOzw", tut: "Come as You Are bass tutorial" },
    },
    {
      piece: "«Seven Nation Army» — riff (The White Stripes)",
      video: { yt: "PhaQbeQwQ7g", tut: "Seven Nation Army bass tutorial" },
    },
    {
      piece: "«Under Pressure» (Queen & David Bowie)",
      note: "Zwieńczenie etapu regularnego: kultowy, synkopowany riff — próba czasu i tłumienia strun.",
      video: { yt: "IGVdZMGpQ-s", tut: "Under Pressure bass tutorial" },
    },
    {
      piece: "«With or Without You» (U2)",
      video: { yt: "oBkY7JwrOFY", tut: "With or Without You bass tutorial" },
    },
    {
      piece: "«Sunshine of Your Love» (Cream)",
      video: { yt: "BNOgvPVPCmg", tut: "Sunshine of Your Love bass tutorial" },
    },
    {
      piece: "«Money» (Pink Floyd)",
      note: "Zwieńczenie etapu średniozaawansowanego: charakterystyczna linia w metrum 7/4.",
      video: { yt: "19FgY3o09Ng", tut: "Money Pink Floyd bass tutorial" },
    },
    {
      piece: "«Good Times» (Chic)",
      note: "Disco-funkowy klasyk — fundament wielu późniejszych hitów.",
      video: { yt: "T29X0da8-kU", tut: "Good Times Chic bass tutorial Bernard Edwards" },
    },
    {
      piece: "«Roundabout» (Yes)",
      note: "Wymagająca, ruchliwa linia basu z flażoletami.",
      video: { yt: "xOjqmfUG8cg", tut: "Roundabout Yes bass tutorial Chris Squire" },
    },
    {
      piece: "«Higher Ground» (Red Hot Chili Peppers)",
      note: "Zwieńczenie etapu zaawansowanego: pierwszy poważny slap w tempie.",
      video: { yt: "E73LB0vp420", tut: "Higher Ground bass tutorial Flea" },
    },
    {
      piece: "«Hysteria» (Muse)",
      note: "Szybka, kostkowana linia — próba precyzji i wytrzymałości.",
      video: { yt: "a77aTtGmRNk", tut: "Hysteria Muse bass tutorial" },
    },
    {
      piece: "«Can't Stop» (Red Hot Chili Peppers)",
      note: "Slap i pop w wykonaniu Flei — bardzo zaawansowane.",
      video: { yt: "EQwC4ILuTTs", tut: "Can't Stop bass tutorial Flea" },
    },
    {
      piece: "«Portrait of Tracy» (Jaco Pastorius)",
      note: "Zwieńczenie etapu eksperckiego: utwór zbudowany z flażoletów — kamień milowy basisty.",
      video: { yt: "jiU5wbWcsfA", tut: "Portrait of Tracy Jaco Pastorius bass tutorial" },
    },
    {
      piece: "«Teen Town» (Weather Report / Jaco Pastorius)",
      note: "Szybka, melodyczna linia — wirtuozeria fretless.",
      video: { yt: "MxShpw-pko0", tut: "Teen Town Jaco Pastorius bass tutorial" },
    },
    {
      piece: "«Donna Lee» (Jaco Pastorius)",
      note: "Repertuarowy szczyt basisty — bebopowy temat zagrany na basie z pełną swobodą.",
      video: { yt: "cpBK-U3a3co", tut: "Donna Lee Jaco Pastorius bass tutorial" },
    },
  ]
);
