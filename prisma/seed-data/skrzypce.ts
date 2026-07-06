import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "skrzypce",
    name: "Skrzypce",
    icon: "🎻",
    description:
      "Nauka gry na skrzypcach — od trzymania smyczka i czystej intonacji po zmiany pozycji i vibrato. Poziomy 1–99 to realna droga amatora.",
    sortOrder: 122,
  },
  [
    {
      title: "Trzymaj prawidłowo skrzypce i smyczek; nastrój instrument",
      video: { yt: "ZSd6HPk8_YQ", tut: "how to hold violin bow properly" },
    },
    "Wydobądź czysty, równy dźwięk na pustych strunach",
    {
      title: "Zagraj pierwsze dźwięki w pierwszej pozycji (palce 1–3)",
      video: { yt: "E1tOBmU71Fc", tut: "violin first position finger placement intonation" },
    },
    {
      title: "Prowadź smyczek równo (détaché) bez zgrzytów",
      video: { yt: "1D6FZGO7Pyo", tut: "violin detache bowing technique straight bow" },
    },
    "Zagraj pierwszą prostą melodię",
    {
      title: "Opanuj gamę G-dur w pierwszej pozycji",
      video: { yt: "CB0NllJbjZ0", tut: "violin G major scale one octave fingering" },
    },
    "Graj czysto (intonacja) w wolnym tempie",
    "Opanuj legato — kilka nut na jeden ruch smyczka",
    "Zagraj z użyciem czwartego palca",
    "Opanuj staccato i martelé",
    "Graj dwie struny naraz (dwudźwięki — podstawy)",
    "Zagraj krótki utwór z pamięci",
    "Opanuj płynne zmiany strun",
    "Graj równo z metronomem",
    "Zagraj utwór z akompaniamentem",
    "Kontroluj dynamikę i barwę dźwięku",
    {
      title: "Opanuj przejście do trzeciej pozycji (shifting)",
      video: { yt: "pJAPuB7WYaA", tut: "violin shifting to third position lesson" },
    },
    {
      title: "Zacznij vibrato",
      video: { yt: "PMd2_igyZ8s", tut: "violin vibrato tutorial for beginners" },
    },
    "Opanuj gamy przez kilka pozycji",
    "Zagraj vibrato swobodnie w utworze",
  ],
  [
    {
      piece: "«Twinkle, Twinkle» — temat z wariacji (Suzuki)",
      note: "Pierwszy utwór każdego skrzypka — na jednej-dwóch strunach. Zamiennik: dowolna melodia ludowa na pustych strunach.",
      video: { yt: "SOicDbL0vzA", tut: "Suzuki violin Twinkle variations performance" },
    },
    {
      piece: "«Odę do radości» (Beethoven)",
      note: "Prosta, rozpoznawalna melodia w pierwszej pozycji — zwieńczenie pierwszych kroków.",
      video: { yt: "T8OKkvu8OB8", tut: "Ode to Joy violin tutorial" },
    },
    {
      piece: "«Menuet» (Bach, z zeszytu Suzuki)",
      video: { yt: "n9mgsk_nAFs", tut: "Bach Minuet Suzuki violin tutorial" },
    },
    {
      piece: "«Gawota» (Gossec)",
      video: { yt: "2-eyvN3XEls", tut: "Gossec Gavotte violin tutorial" },
    },
    {
      piece: "«Kanon D-dur» — partię skrzypiec (Pachelbel)",
      note: "Zwieńczenie etapu regularnego: śpiewna, powtarzalna linia, świetna do gry z akompaniamentem.",
      video: { yt: "rfZiQi-Z458", tut: "Pachelbel Canon in D violin tutorial" },
    },
    {
      piece: "«Menuet» (Boccherini)",
      video: { yt: "S72g3PcSxNA", tut: "Boccherini Minuet violin tutorial" },
    },
    {
      piece: "«Ave Maria» (Bach / Gounod)",
      note: "Długie, śpiewne frazy — próba prowadzenia smyczka i intonacji. Wersja wolniejsza się liczy.",
      video: { yt: "MZKKeKTa-cU", tut: "Bach Gounod Ave Maria violin tutorial" },
    },
    {
      piece: "«Wiosnę» z „Czterech pór roku” — temat (Vivaldi)",
      note: "Zwieńczenie etapu średniozaawansowanego: barok w pierwszej i trzeciej pozycji.",
      video: { yt: "3LiztfE1X7E", tut: "Vivaldi Spring Four Seasons violin tutorial" },
    },
    {
      piece: "«Czardasza» (Monti)",
      note: "Klasyczny popisowy utwór amatora — od rzewnego lassan po szybki friss. Tempo buduj stopniowo.",
      video: { yt: "qdK5z2SPUsw", tut: "Monti Csardas violin tutorial" },
    },
    {
      piece: "«Méditation z „Thaïs”» (Massenet)",
      note: "Próba vibrata i długiej, kantylenowej frazy.",
      video: { yt: "7QtGOWemQhY", tut: "Massenet Meditation Thais violin tutorial" },
    },
    {
      piece: "«Koncert skrzypcowy a-moll, cz. I» (Bach, BWV 1041)",
      note: "Zwieńczenie etapu zaawansowanego: pełnowymiarowy koncert barokowy z pasażami.",
      video: { yt: "XnBjBds4It4", tut: "Bach violin concerto A minor BWV 1041 tutorial" },
    },
    {
      piece: "«Liebesleid» (Kreisler)",
      video: { yt: "2XR0u2pO6LY", tut: "Kreisler Liebesleid violin tutorial" },
    },
    {
      piece: "«Introdukcję i Rondo Capriccioso» (Saint-Saëns)",
      note: "Popisowy utwór — od lirycznego wstępu po wirtuozowski finał.",
      video: { yt: "8UTq1eZrDkI", tut: "Saint-Saens Introduction Rondo Capriccioso violin tutorial" },
    },
    {
      piece: "«Koncert skrzypcowy e-moll, cz. I» (Mendelssohn)",
      note: "Zwieńczenie etapu eksperckiego — jeden z filarów repertuaru romantycznego.",
      video: { yt: "vzbC39utkTw", tut: "Mendelssohn violin concerto E minor tutorial" },
    },
    {
      piece: "«Zigeunerweisen» (Sarasate)",
      note: "Wirtuozowski popis: flażolety, pizzicato lewej ręki, szybkie pasaże.",
      video: { yt: "o9FSeWvfKWk", tut: "Sarasate Zigeunerweisen violin tutorial" },
    },
    {
      piece: "«Chaconne z II Partity d-moll» (Bach, BWV 1004)",
      note: "Repertuarowy szczyt — jedno z najtrudniejszych i najgłębszych dzieł na skrzypce solo.",
      video: { yt: "7y4lcQ7BTLw", tut: "Bach Chaconne violin tutorial" },
    },
  ]
);
