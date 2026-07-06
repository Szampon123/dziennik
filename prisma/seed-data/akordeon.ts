import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "akordeon",
    name: "Akordeon",
    icon: "🪗",
    description:
      "Nauka gry na akordeonie — od prowadzenia miecha i basów po niezależność rąk i wyrazistą artykulację. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 132,
  },
  [
    {
      title: "Poznaj instrument, pasy i prowadzenie miecha",
      video: { yt: "91aurMH3bo4", tut: "how to play accordion for beginners first lesson" },
    },
    {
      title: "Zagraj czysto pojedyncze dźwięki prawą ręką",
      video: { yt: "jK8bN2x7Thw", tut: "accordion right hand beginner lesson" },
    },
    "Prowadź miech równo (kontrola powietrza)",
    "Utrzymaj równy puls",
    "Zagraj pierwszą prostą melodię prawą ręką",
    {
      title: "Opanuj basy standardowe lewą ręką (bas + akord)",
      video: { yt: "joeLeDhPVBE", tut: "accordion Stradella bass buttons lesson" },
    },
    "Zagraj ręce razem (melodia + akompaniament basowy)",
    "Opanuj gamę C-dur prawą ręką",
    {
      title: "Graj z płynną zmianą kierunku miecha",
      video: { yt: "jK6o_-s6Rec", tut: "accordion bellows control technique lesson" },
    },
    {
      title: "Opanuj układ basów (koło kwintowe)",
      video: { yt: "Wi84Vokog78", tut: "accordion bass buttons layout lesson" },
    },
    "Graj równo z metronomem",
    "Zagraj krótki utwór z pamięci",
    {
      title: "Opanuj artykulację i akcenty miechem",
      video: { yt: "TIBlT4N88v4", tut: "accordion bellows articulation dynamics lesson" },
    },
    "Kontroluj dynamikę prowadzeniem miecha",
    "Zagraj utwór z niezależnością obu rąk",
    "Opanuj gamy durowe i molowe",
    "Opanuj basy melodyczne / przejścia",
    "Zagraj ozdobniki i tremolo miechowe",
    "Opanuj szybsze pasaże prawą ręką",
    "Zagraj wymagający utwór z pełną kontrolą",
  ],
  [
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Prosta melodia prawą ręką z prostym basem — pierwszy utwór.",
      video: { yt: "CwoWYUb5gQ8", tut: "Ode to Joy accordion tutorial" },
    },
    {
      piece: "«Kalinkę» (melodia ludowa)",
      note: "Żywiołowy klasyk akordeonu — zwieńczenie pierwszych kroków. Wolniej się liczy.",
      video: { yt: "8drPfxc5qwU", tut: "Kalinka accordion tutorial" },
    },
    {
      piece: "«Oczy czarne» (Ochi chyornye)",
      video: { yt: "AzO8aYnZmUw", tut: "Dark Eyes Ochi Chornye accordion tutorial" },
    },
    {
      piece: "«Hava Nagila»",
      video: { yt: "uWwze-0TrSU", tut: "Hava Nagila accordion tutorial" },
    },
    {
      piece: "«Hej, sokoły!»",
      note: "Zwieńczenie etapu regularnego: melodia znana każdemu — próba niezależności rąk.",
      video: { yt: "mxssXCARIys", tut: "Hej Sokoly akordeon" },
    },
    {
      piece: "«La vie en rose» (Édith Piaf)",
      video: { yt: "iytBcgt43AY", tut: "La vie en rose accordion tutorial" },
    },
    {
      piece: "«Sous le ciel de Paris»",
      video: { yt: "dlQMxkdWcSo", tut: "Sous le ciel de Paris accordion tutorial" },
    },
    {
      piece: "«Beer Barrel Polka („Rosamunde”)»",
      note: "Zwieńczenie etapu średniozaawansowanego: energiczna polka — próba tempa i miecha.",
      video: { yt: "U2zeEY-8jQc", tut: "Beer Barrel Polka accordion tutorial" },
    },
    {
      piece: "«Czardasza» (Monti)",
      note: "Popisowy utwór akordeonisty — od rzewnego wstępu po szybki finał.",
      video: { yt: "NrFe5HatQ-o", tut: "Monti Czardas accordion tutorial" },
    },
    {
      piece: "«Libertango» (Piazzolla)",
      video: { yt: "LNvphPSvQiI", tut: "Libertango Piazzolla accordion tutorial" },
    },
    {
      piece: "«Tico-Tico no Fubá» (Zequinha de Abreu)",
      note: "Zwieńczenie etapu zaawansowanego: błyskawiczne pasaże prawej ręki.",
      video: { yt: "YPvBkcOc8Lg", tut: "Tico-Tico accordion tutorial" },
    },
    {
      piece: "«Oblivion» (Piazzolla)",
      video: { yt: "DIZ-mgQDe8Q", tut: "Oblivion Piazzolla accordion tutorial" },
    },
    {
      piece: "«Taniec z szablami» (Chaczaturian)",
      video: { yt: "bnlMpOZRYm0", tut: "Sabre Dance Khachaturian accordion tutorial" },
    },
    {
      piece: "«Lot trzmiela» (Rimski-Korsakow)",
      note: "Zwieńczenie etapu eksperckiego: morderczo szybki popis techniki.",
      video: { yt: "_ELEUsbypyI", tut: "Flight of the Bumblebee accordion tutorial" },
    },
    {
      piece: "«Małą fugę g-moll» (Bach) — aranż. na akordeon",
      note: "Polifonia i niezależność głosów.",
      video: { yt: "iYbTXIXfp8w", tut: "Bach Little Fugue G minor accordion" },
    },
    {
      piece: "«Toccatę i fugę d-moll» (Bach) — aranż. na akordeon",
      note: "Repertuarowy szczyt akordeonisty — monumentalny utwór organowy przeniesiony na miech.",
      video: { yt: "CqMA-N1ggds", tut: "Bach Toccata and Fugue D minor accordion" },
    },
  ]
);
