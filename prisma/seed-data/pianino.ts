import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "pianino",
    name: "Pianino",
    icon: "🎹",
    description:
      "Nauka gry na pianinie — od pierwszych dźwięków i pięciopalcówki po niezależność rąk, pedalizację i dojrzałą interpretację. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 121,
  },
  [
    {
      title: "Poznaj klawiaturę i prawidłową postawę oraz ułożenie rąk",
      video: { yt: "c76LPWPdFsI", tut: "piano posture and hand position for beginners" },
    },
    "Zagraj czysto pojedyncze dźwięki każdą ręką osobno",
    {
      title: "Zagraj pięciopalcową pozycję (C–G) obiema rękami",
      video: { yt: "prbwu-jbEsc", tut: "piano five finger position exercise beginner" },
    },
    "Utrzymaj równy puls grając prawą ręką",
    "Zagraj pierwszą prostą melodię obiema rękami",
    {
      title: "Opanuj gamę C-dur jedną ręką",
      video: { yt: "0Hphvu_hJRQ", tut: "C major scale piano fingering one hand" },
    },
    {
      title: "Zagraj podkład akordowy (triady) lewą ręką",
      video: { yt: "OfqEkswUw1U", tut: "piano triads left hand tutorial" },
    },
    "Zagraj proste ręce razem (melodia + akompaniament)",
    {
      title: "Opanuj gamy durowe do 2 znaków przykluczowych",
      video: { yt: "8rb2JHTQAHM", tut: "piano major scales fingering tutorial" },
    },
    {
      title: "Używaj pedału sustain w prostym utworze",
      video: { yt: "koJVelJdnZE", tut: "how to use sustain pedal piano" },
    },
    {
      title: "Zagraj akordy z przewrotami płynnie",
      video: { yt: "SxTWdMVzi2A", tut: "piano chord inversions tutorial" },
    },
    {
      title: "Czytaj nuty z obu pięciolinii (klucz wiolinowy i basowy)",
      video: { yt: "5kHcZBguKo8", tut: "how to read piano sheet music both hands" },
    },
    {
      title: "Opanuj artykulację: legato i staccato",
      video: { yt: "sfty1bjShBI", tut: "legato and staccato piano technique" },
    },
    "Graj równo z metronomem w stałym tempie",
    {
      title: "Zagraj utwór z niezależnością obu rąk",
      video: { yt: "G78DQpEDDWE", tut: "piano hand independence exercises" },
    },
    {
      title: "Kontroluj dynamikę (piano–forte) i frazowanie",
      video: { yt: "A2bUrYZaFoE", tut: "piano dynamics and phrasing lesson" },
    },
    "Opanuj gamy i pasaże przez całą klawiaturę",
    {
      title: "Zagraj z rubato i świadomą interpretacją",
      video: { yt: "cefBG5aYozo", tut: "rubato piano lesson expressive playing" },
    },
    {
      title: "Opanuj arpeggia i szybsze pasaże",
      video: { yt: "xbYIArqfwSQ", tut: "piano arpeggios tutorial" },
    },
    "Zagraj utwór z krzyżowaniem rąk i skokami",
  ],
  [
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Pierwsza melodia, którą każdy rozpozna — najpierw prawą ręką, potem obiema. Zamiennik o podobnej trudności: kolęda lub «Twinkle Twinkle».",
      video: { yt: "t1f_cDQDEYY", tut: "Ode to Joy piano tutorial easy" },
    },
    {
      piece: "«Dla Elizy» — temat główny (Beethoven)",
      note: "Klasyczny kamień milowy początkującego. Wystarczy pierwsza, powracająca część, wolniej — reszta przyjdzie później (poziom ~42).",
      video: { yt: "s71I_EWJk7I", tut: "Fur Elise piano tutorial easy main theme" },
    },
    {
      piece: "«Menuet G-dur» (Petzold, z Notatnika A.M. Bach)",
      note: "Pierwszy utwór z prawdziwą niezależnością rąk. Zamiennik: łatwy utwór z Burgmüllera op. 100.",
      video: { yt: "p1gGxpitLO8", tut: "Minuet in G major Bach BWV Anh 114 piano tutorial" },
    },
    {
      piece: "«Preludium C-dur» z I tomu „Das wohltemperierte Klavier” (Bach)",
      note: "Rozłożone akordy przez cały utwór — świetne na równość i pedał. Zamiennik: «Arabesque» Burgmüllera.",
      video: { yt: "7ZNXBpO-uEo", tut: "Bach Prelude in C major BWV 846 piano tutorial" },
    },
    {
      piece: "«Gymnopédie nr 1» (Satie)",
      note: "Zwieńczenie etapu regularnego: wolno, nastrojowo, z pedałem. Uczy słuchania brzmienia, nie tylko nut.",
      video: { yt: "Mo9ndTg3ako", tut: "Satie Gymnopedie No 1 piano tutorial" },
    },
    {
      piece: "«Preludium e-moll» op. 28 nr 4 (Chopin)",
      note: "Pierwszy Chopin w zasięgu — wolne tempo, ale prawdziwa muzyczna dojrzałość we frazie.",
      video: { yt: "CU9RgI9j7Do", tut: "Chopin Prelude E minor Op 28 No 4 piano tutorial" },
    },
    {
      piece: "«Sonatę „Księżycową”» — część I, Adagio (Beethoven)",
      note: "Powolne triole i melodia ponad nimi. Wersja w wolniejszym tempie w pełni się liczy.",
      video: { yt: "sbTVZMJ9Z2I", tut: "Moonlight Sonata 1st movement piano tutorial" },
    },
    {
      piece: "«Dla Elizy» — pełną wersję z częścią środkową (Beethoven)",
      note: "Zwieńczenie etapu średniozaawansowanego: teraz z burzliwym epizodem w środku i pasażami.",
      video: { yt: "s71I_EWJk7I", tut: "Fur Elise full piano tutorial" },
    },
    {
      piece: "«Walca a-moll» op. posth. (Chopin)",
      note: "Króciutki, śpiewny walc — pierwszy „duży” Chopin. Zamiennik: «Marzenie» Schumanna („Träumerei”).",
      video: { yt: "eN5z1mu6j4M", tut: "Chopin Waltz in A minor B 150 posthumous piano tutorial" },
    },
    {
      piece: "«Preludium Des-dur „Deszczowe”» op. 28 nr 15 (Chopin)",
      note: "Powtarzane „krople” i dramatyczna część środkowa — próba kontroli brzmienia i pedału.",
      video: { yt: "HVau-JRGirg", tut: "Chopin Raindrop Prelude Op 28 No 15 piano tutorial" },
    },
    {
      piece: "«Clair de lune» (Debussy)",
      note: "Zwieńczenie etapu zaawansowanego — marzenie wielu amatorów. Wymaga dojrzałego pedału i cierpliwości nad kolorem.",
      video: { yt: "c977QdbTImU", tut: "Debussy Clair de Lune piano tutorial" },
    },
    {
      piece: "«Nokturn Es-dur» op. 9 nr 2 (Chopin)",
      note: "Śpiewna prawa ręka z ozdobnikami nad falującym basem — kwintesencja stylu Chopina.",
      video: { yt: "QR10Od1cLaM", tut: "Chopin Nocturne Op 9 No 2 piano tutorial" },
    },
    {
      piece: "«Marzenie miłosne nr 3» („Liebestraum”, Liszt)",
      note: "Melodia „schowana” między rękami, z rozłożonymi akordami — próba kantyleny i wyrazu.",
      video: { yt: "DxNXyoQ38tE", tut: "Liszt Liebestraum No 3 piano tutorial" },
    },
    {
      piece: "«Fantaisie-Impromptu» cis-moll op. 66 (Chopin)",
      note: "Zwieńczenie etapu eksperckiego: szybkie pasaże i polirytmia 4:3. Możesz zacząć od wolnej, śpiewnej części środkowej.",
      video: { yt: "Gy5UHK4EeM8", tut: "Chopin Fantaisie Impromptu Op 66 piano tutorial" },
    },
    {
      piece: "«Sonatę „Księżycową”» — część III, Presto agitato (Beethoven)",
      note: "Burzliwy finał — arpeggia, skoki i wytrzymałość. Buduj tempo stopniowo, fragmentami.",
      video: { yt: "zucBfXpCA6s", tut: "Moonlight Sonata 3rd movement Presto agitato piano tutorial" },
    },
    {
      piece: "«Balladę g-moll» op. 23 (Chopin)",
      note: "Repertuarowy szczyt zaangażowanego amatora — wielki, wymagający utwór, który spina cały warsztat w jedno.",
      video: { yt: "BSFNl4roGlI", tut: "Chopin Ballade No 1 G minor Op 23 piano tutorial" },
    },
  ]
);
