import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "harfa",
    name: "Harfa",
    icon: "🎼",
    description:
      "Nauka gry na harfie — od czystego dźwięku i arpeggiów po glissanda, pedalizację i dojrzałą interpretację. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 137,
  },
  [
    {
      title: "Ustaw harfę i poznaj prawidłowe ułożenie rąk",
      video: { yt: "AfYkuZtE9iw", tut: "harp first lesson basic hand position beginner" },
    },
    {
      title: "Wydobądź czysty dźwięk (prawidłowe szarpnięcie struny)",
      video: { yt: "cpGNSvTENoI", tut: "basic harp hand position technique plucking lesson" },
    },
    "Zagraj pierwsze dźwięki obiema rękami osobno",
    "Utrzymaj równy puls",
    "Zagraj pierwszą prostą melodię",
    "Opanuj gamę C-dur",
    {
      title: "Zagraj akordy i proste rozłożenia (arpeggia)",
      video: { yt: "t_VT444isgo", tut: "harp arpeggios technique lesson" },
    },
    "Graj ręce razem (melodia + akompaniament)",
    {
      title: "Opanuj tłumienie strun (muffling)",
      video: { yt: "h_-HWNwlbeY", tut: "harp muffling damping technique lesson" },
    },
    {
      title: "Używaj pedałów / dźwigni do zmiany tonacji",
      video: { yt: "NpvPEgs8-nY", tut: "harp moving levers pedals change key lesson" },
    },
    "Graj równo z metronomem",
    "Zagraj krótki utwór z pamięci",
    {
      title: "Opanuj płynne glissanda",
      video: { yt: "C1N7WRAzc4E", tut: "harp glissando technique lesson" },
    },
    "Kontroluj dynamikę i barwę",
    "Zagraj utwór z niezależnością obu rąk",
    "Opanuj gamy durowe i molowe",
    "Opanuj szybkie arpeggia i pasaże",
    "Zagraj ozdobniki i harmoniczne (flażolety)",
    "Opanuj zmiany tonacji w utworze",
    "Zagraj wymagający utwór z pełną kontrolą",
  ],
  [
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Prosta melodia z prostym akompaniamentem — pierwszy utwór.",
      video: { yt: "r7CiRLXHWB4", tut: "Ode to Joy harp tutorial" },
    },
    {
      piece: "«Greensleeves»",
      note: "Śpiewna melodia z rozłożonymi akordami — zwieńczenie pierwszych kroków.",
      video: { yt: "tEoRi9BUyrc", tut: "Greensleeves harp tutorial" },
    },
    {
      piece: "«Amazing Grace»",
      video: { yt: "hJCXXqwXODw", tut: "Amazing Grace harp tutorial" },
    },
    {
      piece: "«Scarborough Fair»",
      video: { yt: "7d8qIQ2AoWw", tut: "Scarborough Fair harp tutorial" },
    },
    {
      piece: "«Kanon D-dur» (Pachelbel)",
      note: "Zwieńczenie etapu regularnego: rozłożone akordy idealnie leżą na harfie.",
      video: { yt: "-aHQn93UCVQ", tut: "Pachelbel Canon in D harp Silke Aichhorn" },
    },
    {
      piece: "«Ave Maria» (Schubert)",
      video: { yt: "ddo7BO6CaOU", tut: "Schubert Ave Maria solo harp tutorial" },
    },
    {
      piece: "«Salut d'Amour» (Elgar)",
      video: { yt: "3RMv34H7-Go", tut: "Elgar Salut d'Amour harp tutorial" },
    },
    {
      piece: "«Preludium C-dur» (Bach) — aranż. na harfę",
      note: "Zwieńczenie etapu średniozaawansowanego: cały utwór z rozłożonych akordów.",
      video: { yt: "YijYQPY_ac0", tut: "Bach Prelude in C major BWV 846 harp" },
    },
    {
      piece: "«Gymnopédie nr 1» (Satie)",
      video: { yt: "PpAUJa1khiY", tut: "Satie Gymnopedie No 1 harp Amy Turk" },
    },
    {
      piece: "«Arabeskę nr 1» (Debussy)",
      video: { yt: "A3BDKU2oqC8", tut: "Debussy Arabesque No 1 harp Josh Layne" },
    },
    {
      piece: "«Clair de lune» (Debussy) — aranż. na harfę",
      note: "Zwieńczenie etapu zaawansowanego — marzenie wielu harfistów. Wymaga dojrzałej dynamiki.",
      video: { yt: "Nz15gbUa-k4", tut: "Debussy Clair de lune harp Amy Turk" },
    },
    {
      piece: "«La Source» (Zabel)",
      note: "Popisowy utwór harfowy — szybkie arpeggia po całej skali.",
      video: { yt: "M-PRmXjmlAg", tut: "Zabel La Source harp" },
    },
    {
      piece: "«Impromptu-Caprice» (Pierné)",
      video: { yt: "Gi0n-ct6hVc", tut: "Pierne Impromptu-Caprice harp Kondonassis" },
    },
    {
      piece: "«Koncert na harfę B-dur» — część (Handel)",
      note: "Zwieńczenie etapu eksperckiego: pełnowymiarowy koncert klasyczny.",
      video: { yt: "N0ApD6p6IaU", tut: "Handel Harp Concerto B flat Langlamet Berliner" },
    },
    {
      piece: "«Danse sacrée et danse profane» (Debussy)",
      video: { yt: "eOOIQ5UwI-g", tut: "Debussy Danse sacree et danse profane harp" },
    },
    {
      piece: "«Introduction et Allegro» (Ravel)",
      note: "Repertuarowy szczyt harfisty — sztandarowe dzieło pokazujące pełnię możliwości harfy.",
      video: { yt: "ATWLm_UxC34", tut: "Ravel Introduction et Allegro harp" },
    },
  ]
);
