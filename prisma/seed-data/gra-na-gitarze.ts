import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "gra-na-gitarze",
    name: "Gra na gitarze",
    icon: "🎸",
    description:
      "Nauka gry na gitarze — od pierwszych akordów po swobodną improwizację i fingerstyle. Poziomy 1–99 to realna droga amatora, a nazwane utwory pokazują, co warto zagrać na każdym etapie.",
    sortOrder: 98,
  },
  [
    {
      title: "Nastrój gitarę i poznaj nazwy strun",
      video: { yt: "tIaN4NU62nQ", tut: "guitar tuning for beginners string names lesson" },
    },
    {
      title: "Zagraj czysto pierwsze akordy otwarte (np. Em, A, D)",
      video: { yt: "jO8c4CVzJcs", tut: "how to play first open chords guitar beginner lesson" },
    },
    "Zmieniaj między dwoma akordami płynnie",
    "Opanuj równe bicie / rytm prawej ręki",
    "Opanuj akordy G, C, D, E, A, Em, Am, Dm",
    "Zagraj z płynnymi zmianami w tempie piosenki",
    "Zagraj prostą melodię pojedynczymi nutami",
    {
      title: "Opanuj różne wzory bicia i palcowania (fingerpicking podstawy)",
      video: { yt: "rcBTxDUvtDs", tut: "guitar fingerpicking for beginners first lesson" },
    },
    {
      title: "Zagraj pierwszy akord barowy (F lub Bm)",
      video: { yt: "u09wlsjaJr0", tut: "F major barre chord for beginners guitar lesson" },
    },
    {
      title: "Opanuj gamę pentatoniczną w jednej pozycji",
      video: { yt: "eEJpypexUDg", tut: "E minor pentatonic scale guitar beginner lesson" },
    },
    "Graj czysto akordy barowe w kilku pozycjach",
    "Zagraj pierwszy solówkowy riff / lick",
    "Opanuj hammer-on i pull-off",
    "Graj z metronomem w stałym tempie",
    "Zagraj pełną piosenkę z solówką",
    {
      title: "Opanuj bendy i vibrato",
      video: { yt: "EDMG__m3LsU", tut: "guitar string bending vibrato lesson" },
    },
    "Opanuj gamę pentatoniczną w 5 pozycjach (cały gryf)",
    "Improwizuj prostą solówkę na podkładzie (backing track)",
    "Opanuj gamy durowe i molowe po całym gryfie",
    "Zagraj utwór fingerstyle z melodią i basem naraz",
  ],
  [
    {
      piece: "«Knockin' on Heaven's Door» (Dylan)",
      note: "Cztery akordy (G-D-Am-C) przez cały utwór — idealna pierwsza piosenka.",
      video: { yt: "c1jICsUtWUs", tut: "Knockin on Heaven's Door acoustic guitar cover" },
    },
    {
      piece: "«Wonderwall» (Oasis)",
      note: "Hymn początkujących gitarzystów — z kapodastrem i łatwymi chwytami. Zwieńczenie pierwszych kroków.",
      video: { yt: "Ee0RRdkw2bo", tut: "Wonderwall Oasis acoustic guitar cover" },
    },
    {
      piece: "«Zombie» (The Cranberries)",
      video: { yt: "XxCfaRR3QDo", tut: "Zombie Cranberries acoustic guitar cover Kfir Ochaion" },
    },
    {
      piece: "«House of the Rising Sun» (The Animals)",
      note: "Pierwsze arpeggia w metrum 6/8.",
      video: { yt: "_WJavaW-lcY", tut: "House of the Rising Sun fingerstyle Tommy Emmanuel" },
    },
    {
      piece: "«Nothing Else Matters» — intro (Metallica)",
      note: "Zwieńczenie etapu regularnego: kultowy fingerpicking na pustych strunach.",
      video: { yt: "4lVKlHCd4_g", tut: "Nothing Else Matters intro fingerstyle guitar cover" },
    },
    {
      piece: "«Come as You Are» — riff (Nirvana)",
      video: { yt: "wRH_90Tbak8", tut: "Come as You Are riff guitar Nirvana" },
    },
    {
      piece: "«Stairway to Heaven» — intro (Led Zeppelin)",
      note: "Klasyczny fingerstyle — próba palców prawej ręki.",
      video: { yt: "2MWwobtzaMw", tut: "Stairway to Heaven intro fingerstyle guitar cover" },
    },
    {
      piece: "«Hotel California» — akordy i intro (Eagles)",
      note: "Zwieńczenie etapu średniozaawansowanego: barré, arpeggia i słynne solo do rozwijania.",
      video: { yt: "NLN7sDkth4w", tut: "Hotel California intro solo acoustic guitar" },
    },
    {
      piece: "«Blackbird» (The Beatles)",
      note: "Fingerstyle z melodią i basem naraz — kciuk plus palce.",
      video: { yt: "iQ5dkN1_qBc", tut: "Blackbird Beatles fingerstyle guitar Kelly Valleau" },
    },
    {
      piece: "«Tears in Heaven» (Eric Clapton)",
      video: { yt: "FKNNe0UWhFc", tut: "Tears in Heaven Eric Clapton acoustic guitar cover" },
    },
    {
      piece: "«Sweet Child O' Mine» — riff i solo (Guns N' Roses)",
      note: "Zwieńczenie etapu zaawansowanego: precyzyjny riff i pełne solo.",
      video: { yt: "hcv06If8jXE", tut: "Sweet Child O Mine full guitar cover" },
    },
    {
      piece: "«Romanza» (Hiszpańska romanca, anon.)",
      note: "Wejście w gitarę klasyczną — arpeggia w prawej ręce.",
      video: { yt: "YJEarbgTlO8", tut: "Spanish Romance Romanza classical guitar" },
    },
    {
      piece: "«Cavatina» (Myers, z „Łowcy jeleni”)",
      video: { yt: "wu8cLRUNt3k", tut: "Cavatina Stanley Myers Deer Hunter classical guitar" },
    },
    {
      piece: "«Asturias (Leyenda)» (Albéniz)",
      note: "Zwieńczenie etapu eksperckiego: sztandarowy popis gitary klasycznej.",
      video: { yt: "inBKFMB-yPg", tut: "Asturias Leyenda Albeniz Ana Vidovic classical guitar" },
    },
    {
      piece: "«Classical Gas» (Mason Williams)",
      video: { yt: "3NE6X4IQNA4", tut: "Classical Gas Mason Williams 1968" },
    },
    {
      piece: "«Recuerdos de la Alhambra» (Tárrega)",
      note: "Repertuarowy szczyt gitarzysty — utwór oparty w całości na tremolo, marzenie wielu amatorów.",
      video: { yt: "fwjX-m4LkYk", tut: "Recuerdos de la Alhambra Tarrega Ana Vidovic" },
    },
  ]
);
