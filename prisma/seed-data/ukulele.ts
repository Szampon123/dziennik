import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "ukulele",
    name: "Ukulele",
    icon: "🪕",
    description:
      "Nauka gry na ukulele — od pierwszych akordów i bicia po fingerstyle i swobodne granie piosenek. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 125,
  },
  [
    "Nastrój ukulele i poznaj chwyt instrumentu",
    {
      title: "Zagraj czysto pierwsze akordy (C, Am, F)",
      video: { yt: "QLdjWjv9A34", tut: "ukulele first chords C Am F beginner lesson" },
    },
    "Zmieniaj między dwoma akordami płynnie",
    "Opanuj równe bicie prawej ręki",
    "Zagraj pierwszą piosenkę na 3 akordach",
    "Opanuj akordy G, C, D, Em, Am, F",
    "Zmieniaj akordy w tempie piosenki",
    {
      title: "Opanuj różne wzory bicia (strumming patterns)",
      video: { yt: "vlqb8vzk5uE", tut: "ukulele strumming patterns for beginners" },
    },
    "Zagraj prostą melodię pojedynczymi dźwiękami",
    {
      title: "Opanuj pierwsze fingerpickingowe wzory",
      video: { yt: "TbKrDtJHL6I", tut: "ukulele fingerpicking for beginners lesson" },
    },
    {
      title: "Zagraj akord barowy (np. Bb)",
      video: { yt: "dPu5TRRHoLg", tut: "ukulele Bb barre chord lesson" },
    },
    "Zagraj piosenkę z pamięci od początku do końca",
    {
      title: "Opanuj technikę tłumienia (chnk / palm mute)",
      video: { yt: "QBL3gBA-Uwo", tut: "ukulele chunk chuck palm mute strum lesson" },
    },
    "Graj równo z metronomem",
    "Zagraj utwór łączący bicie i melodię",
    "Kontroluj dynamikę i rytm",
    "Opanuj gamy durowe i pentatonikę",
    "Improwizuj prostą melodię na akordach",
    {
      title: "Zagraj fingerstyle z melodią i basem naraz",
      video: { yt: "zq5Q0IsMn5Y", tut: "ukulele fingerstyle melody and chords lesson" },
    },
    "Opanuj szybsze zmiany i ozdobniki",
  ],
  [
    {
      piece: "«You Are My Sunshine»",
      note: "Trzy akordy i prosta melodia — idealna pierwsza piosenka. Zamiennik: dowolny przebój na C-F-G.",
      video: { yt: "irpjSOA93p8", tut: "You Are My Sunshine ukulele tutorial" },
    },
    {
      piece: "«Somewhere Over the Rainbow / What a Wonderful World» (IZ Kamakawiwoʻole)",
      note: "Sztandarowa piosenka ukulele — zwieńczenie pierwszych kroków. Wersja tylko z biciem w pełni się liczy.",
      video: { yt: "V1bFr2SWP1I", tut: "Over the Rainbow ukulele tutorial IZ" },
    },
    {
      piece: "«Riptide» (Vance Joy)",
      video: { yt: "dsIJZwYpr0k", tut: "Riptide ukulele tutorial" },
    },
    {
      piece: "«I'm Yours» (Jason Mraz)",
      video: { yt: "hGUltlW9MzM", tut: "I'm Yours ukulele tutorial" },
    },
    {
      piece: "«Can't Help Falling in Love» (Elvis Presley)",
      note: "Zwieńczenie etapu regularnego: pierwszy fingerpicking z melodią.",
      video: { yt: "0Atiss1Utjw", tut: "Can't Help Falling in Love ukulele fingerstyle tutorial" },
    },
    {
      piece: "«Hey, Soul Sister» (Train)",
      video: { yt: "p4T3svF2frg", tut: "Hey Soul Sister ukulele tutorial" },
    },
    {
      piece: "«Stand by Me» (Ben E. King)",
      video: { yt: "Jv14JTSn_vU", tut: "Stand by Me ukulele tutorial" },
    },
    {
      piece: "«Hallelujah» (Leonard Cohen)",
      note: "Zwieńczenie etapu średniozaawansowanego: fingerstyle łączący melodię z akompaniamentem.",
      video: { yt: "JiEaz54z7ik", tut: "Hallelujah ukulele fingerstyle tutorial" },
    },
    {
      piece: "«Blackbird» (The Beatles) — aranż. na ukulele",
      video: { yt: "soRgqY6bXKc", tut: "Blackbird ukulele fingerstyle tutorial" },
    },
    {
      piece: "«Kanon D-dur» (Pachelbel) — aranż. fingerstyle solo",
      video: { yt: "mmlo18dit4k", tut: "Pachelbel Canon in D ukulele fingerstyle tutorial" },
    },
    {
      piece: "«While My Guitar Gently Weeps» — aranż. Jake'a Shimabukuro",
      note: "Zwieńczenie etapu zaawansowanego: popisowa aranżacja solowa, która rozsławiła ukulele.",
      video: { yt: "x8m97D0AVcY", tut: "While My Guitar Gently Weeps ukulele Jake Shimabukuro" },
    },
    {
      piece: "«Africa» (Toto) — aranż. solowa",
      video: { yt: "aHcioiqgBec", tut: "Africa Toto ukulele fingerstyle tutorial" },
    },
    {
      piece: "«Nuvole Bianche» (Einaudi) — aranż. na ukulele",
      video: { yt: "HDjSPO_nZnU", tut: "Nuvole Bianche ukulele fingerstyle tutorial" },
    },
    {
      piece: "«Bohemian Rhapsody» — aranż. solowa (Queen)",
      note: "Zwieńczenie etapu eksperckiego: cały utwór na jednym ukulele — melodia, akordy i dynamika.",
      video: { yt: "PB3RbO7updc", tut: "Bohemian Rhapsody ukulele solo tutorial" },
    },
    {
      piece: "«Europa» (Santana) — aranż. solowa",
      note: "Śpiewna, „gitarowa” fraza z bendami i wyrazem.",
      video: { yt: "-vPKNL0-ZjE", tut: "Europa Santana ukulele fingerstyle tutorial" },
    },
    {
      piece: "«Spain» (Chick Corea) — aranż. Jake'a Shimabukuro",
      note: "Repertuarowy szczyt ukulelisty — szybkie pasaże i wymagająca rytmika.",
      video: { yt: "v4Y_wBxPZjQ", tut: "Spain Chick Corea ukulele tutorial" },
    },
  ]
);
