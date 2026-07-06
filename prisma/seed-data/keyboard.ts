import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "keyboard",
    name: "Keyboard",
    icon: "🎹",
    description:
      "Nauka gry na keyboardzie — od pięciopalcówki i akordów po aranżacje z brzmieniami i automatycznym akompaniamentem. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 135,
  },
  [
    {
      title: "Poznaj klawiaturę, brzmienia i funkcje instrumentu",
      video: { yt: "ISBZoVhxHjk", tut: "keyboard for beginners first lesson getting started" },
    },
    "Zagraj czysto pojedyncze dźwięki każdą ręką",
    "Zagraj pięciopalcową pozycję obiema rękami",
    "Utrzymaj równy puls (użyj rytmu / metronomu)",
    "Zagraj pierwszą prostą melodię obiema rękami",
    {
      title: "Opanuj gamę C-dur jedną ręką",
      video: { yt: "IAAUcj7nngI", tut: "C major scale piano right hand fingering lesson" },
    },
    {
      title: "Zagraj akordy triady lewą ręką",
      video: { yt: "cbrbHHsqpSo", tut: "piano left hand triad chords fingering lesson" },
    },
    {
      title: "Użyj automatycznego akompaniamentu (auto-accompaniment)",
      video: { yt: "1Ii5IRaNNvs", tut: "keyboard auto accompaniment how to use tutorial" },
    },
    "Zagraj melodię prawą + akordy lewą ręką",
    {
      title: "Opanuj podstawowe brzmienia i przełączanie ich",
      video: { yt: "PV_GZLjI0m0", tut: "how to change voice sounds on keyboard tutorial" },
    },
    {
      title: "Zagraj akordy z przewrotami płynnie",
      video: { yt: "KU4YLMlN5hk", tut: "piano chord inversions lesson beginner" },
    },
    "Zagraj piosenkę z pamięci",
    "Opanuj gamy durowe do 2 znaków",
    "Graj równo z rytmem / metronomem",
    "Zagraj utwór z niezależnością obu rąk",
    "Kontroluj dynamikę (touch response) i frazowanie",
    "Opanuj gamy i pasaże po klawiaturze",
    "Improwizuj melodię na akordach",
    "Twórz własne aranżacje z brzmieniami i rytmami",
    "Zagraj wymagający utwór z pełną kontrolą",
  ],
  [
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Prosta melodia obiema rękami — pierwszy utwór.",
      video: { yt: "NfT2jGMWQOM", tut: "Ode to Joy piano tutorial" },
    },
    {
      piece: "«Dla Elizy» — temat główny (Beethoven)",
      note: "Klasyczny kamień milowy początkującego — zwieńczenie pierwszych kroków. Wolniej się liczy.",
      video: { yt: "2LHpQdJRNg8", tut: "Fur Elise piano tutorial main theme" },
    },
    {
      piece: "«Let It Be» (The Beatles)",
      note: "Akordy + melodia — idealne na keyboard.",
      video: { yt: "ScPyv8dfHAw", tut: "Let It Be piano tutorial" },
    },
    {
      piece: "«Imagine» (John Lennon)",
      video: { yt: "rRc2-nTWNq8", tut: "Imagine John Lennon piano tutorial" },
    },
    {
      piece: "«Someone Like You» (Adele)",
      note: "Zwieńczenie etapu regularnego: rozłożone akordy prawą ręką pod melodią.",
      video: { yt: "z5pW-WSScNw", tut: "Someone Like You Adele piano tutorial" },
    },
    {
      piece: "«Clocks» (Coldplay)",
      note: "Charakterystyczny, powtarzalny motyw — próba równości.",
      video: { yt: "Y4IS549HX5Q", tut: "Clocks Coldplay piano tutorial" },
    },
    {
      piece: "«All of Me» (John Legend)",
      video: { yt: "b3E6E6hYSSI", tut: "All of Me John Legend piano tutorial" },
    },
    {
      piece: "«A Thousand Miles» (Vanessa Carlton)",
      note: "Zwieńczenie etapu średniozaawansowanego: energiczny motyw fortepianowy przez cały utwór.",
      video: { yt: "WT48RUMvKGM", tut: "A Thousand Miles piano tutorial" },
    },
    {
      piece: "«Piano Man» (Billy Joel)",
      video: { yt: "jtFDklau8o0", tut: "Piano Man Billy Joel piano tutorial" },
    },
    {
      piece: "«Don't Stop Believin'» (Journey)",
      note: "Kultowy wstęp klawiszowy.",
      video: { yt: "yknkAoHRSjI", tut: "Don't Stop Believin piano tutorial" },
    },
    {
      piece: "«November Rain» (Guns N' Roses)",
      note: "Zwieńczenie etapu zaawansowanego: rozbudowana partia fortepianu w balladzie rockowej.",
      video: { yt: "NlKYTyxSC8k", tut: "November Rain piano tutorial" },
    },
    {
      piece: "«Jump» (Van Halen)",
      note: "Legendarny riff syntezatorowy — świetny do brzmień keyboardu.",
      video: { yt: "rhsbYM2axOU", tut: "Jump Van Halen keyboard synth cover" },
    },
    {
      piece: "«The Final Countdown» (Europe)",
      video: { yt: "GK7VhcJgSCU", tut: "The Final Countdown keyboard cover" },
    },
    {
      piece: "«Bohemian Rhapsody» (Queen)",
      note: "Zwieńczenie etapu eksperckiego: cały utwór z partiami fortepianu i zmianami charakteru.",
      video: { yt: "p3K5DAWIDEc", tut: "Bohemian Rhapsody piano cover" },
    },
    {
      piece: "«Nuvole Bianche» (Einaudi)",
      note: "Zamiennik o podobnym nastroju: «River Flows in You» (Yiruma).",
      video: { yt: "4VR-6AS0-l4", tut: "Nuvole Bianche Einaudi piano" },
    },
    {
      piece: "«Rhapsody in Blue» (Gershwin) — aranż. na keyboard",
      note: "Repertuarowy szczyt — utwór łączący klasykę i jazz, spinający cały warsztat.",
      video: { yt: "nH9pU7z1NVk", tut: "Rhapsody in Blue Gershwin piano solo" },
    },
  ]
);
