import { buildInstrument } from "./instrument";

export const { activity, milestones, criteriaByLevel, videoByLevel } = buildInstrument(
  {
    slug: "spiew",
    name: "Śpiew",
    icon: "🎤",
    description:
      "Nauka śpiewu — od oddechu i czystej intonacji po pełną kontrolę głosu na scenie. Poziomy 1–99 to realna droga amatora, a nazwane utwory pokazują, co warto zaśpiewać na każdym etapie.",
    sortOrder: 99,
    verb: "Zaśpiewaj",
  },
  [
    {
      title: "Opanuj oddech przeponowy (podparcie oddechowe)",
      video: { yt: "ZxB2792Gq6w", tut: "diaphragmatic breathing for singing lesson" },
    },
    "Trafiaj w pojedyncze dźwięki (czysta intonacja)",
    "Zaśpiewaj prostą gamę w skupieniu na czystości",
    {
      title: "Rozgrzej głos (warm-up) przed śpiewaniem",
      video: { yt: "Plm0T4xQWFw", tut: "best vocal warm up exercises for singers" },
    },
    "Utrzymaj równy dźwięk przez całą frazę",
    "Śpiewaj w rytm i tempo utworu",
    "Dopasuj tonację do swojej skali (transpozycja)",
    "Rozszerz skalę o kilka dźwięków w górę i w dół",
    {
      title: "Opanuj przejście między rejestrami (piersiowy–głowowy)",
      video: { yt: "qn_LPVJHjTk", tut: "chest voice to head voice transition singing lesson" },
    },
    "Śpiewaj czysto trudniejsze interwały i skoki",
    "Kontroluj dynamikę (cicho–głośno w kontrolowany sposób)",
    "Śpiewaj z emocją i interpretacją tekstu",
    {
      title: "Opanuj podstawy dykcji i artykulacji",
      video: { yt: "cTy9LYqX-cU", tut: "singing diction articulation lesson" },
    },
    "Utrzymaj intonację bez akompaniamentu (a cappella fraza)",
    "Opanuj wybrzmienie i legato (płynne prowadzenie głosu)",
    "Wyrównaj rejestry (jednolite brzmienie w całej skali)",
    {
      title: "Opanuj mix voice (łączenie rejestrów)",
      video: { yt: "DzXkKKPPQ1k", tut: "how to sing mix voice lesson" },
    },
    "Śpiewaj ozdobniki (melizmaty, riffy, runs)",
    {
      title: "Kontroluj vibrato świadomie",
      video: { yt: "gXVVQ-5o5YE", tut: "how to sing with vibrato lesson" },
    },
    "Śpiewaj drugim głosem / w harmonii",
  ],
  [
    {
      piece: "«Let It Be» (The Beatles)",
      note: "Wygodna skala i prosta melodia — idealna pierwsza piosenka. Zamiennik: dowolny lubiany, spokojny utwór.",
      video: { yt: "egCy1KoE1Ss", tut: "Let It Be Beatles" },
    },
    {
      piece: "«Stand by Me» (Ben E. King)",
      note: "Równa, umiarkowana skala — zwieńczenie pierwszych kroków. Próba utrzymania dźwięku.",
      video: { yt: "z5i9vT8wGY8", tut: "Stand by Me Ben E King" },
    },
    {
      piece: "«Imagine» (John Lennon)",
      video: { yt: "YkgkThdzX-8", tut: "Imagine John Lennon" },
    },
    {
      piece: "«Hallelujah» (Leonard Cohen)",
      video: { yt: "YrLk4vdY28Q", tut: "Hallelujah Leonard Cohen live London 2008" },
    },
    {
      piece: "«Someone Like You» (Adele)",
      note: "Zwieńczenie etapu regularnego: budowanie napięcia od cichej zwrotki po mocny refren.",
      video: { yt: "qemWRToNYJY", tut: "Someone Like You Adele BRIT Awards 2011 live" },
    },
    {
      piece: "«Can't Help Falling in Love» (Elvis Presley)",
      video: { yt: "ttuVUynl5SU", tut: "Can't Help Falling in Love Elvis 68 Comeback Special" },
    },
    {
      piece: "«Zombie» (The Cranberries)",
      video: { yt: "8MuhFxaT7zo", tut: "Zombie Cranberries Dolores O'Riordan live" },
    },
    {
      piece: "«Rolling in the Deep» (Adele)",
      note: "Zwieńczenie etapu średniozaawansowanego: mocny głos i kontrola w wyższej części skali.",
      video: { yt: "kkFmaCTRb6w", tut: "Rolling in the Deep Adele live Letterman" },
    },
    {
      piece: "«Killing Me Softly» (Roberta Flack)",
      video: { yt: "mrudT410TAI", tut: "Killing Me Softly Roberta Flack" },
    },
    {
      piece: "«At Last» (Etta James)",
      note: "Ballada soul — próba frazowania i barwy.",
      video: { yt: "1qJU8G7gR_g", tut: "At Last Etta James" },
    },
    {
      piece: "«I Will Always Love You» (Whitney Houston)",
      note: "Zwieńczenie etapu zaawansowanego: ogromny zakres i kulminacja — wersja w niższej tonacji się liczy.",
      video: { yt: "3JWTaaS7LdU", tut: "I Will Always Love You Whitney Houston" },
    },
    {
      piece: "«Ave Maria» (Schubert)",
      note: "Wejście w śpiew klasyczny — długie, czyste frazy.",
      video: { yt: "ja5hQH9USIU", tut: "Schubert Ave Maria soprano Aida Garifullina" },
    },
    {
      piece: "«Con te partirò» (Andrea Bocelli)",
      video: { yt: "TdWEhMOrRpQ", tut: "Con te partiro Andrea Bocelli live 1997" },
    },
    {
      piece: "«Bohemian Rhapsody» (Queen)",
      note: "Zwieńczenie etapu eksperckiego: skrajne rejestry, harmonie i zmiany charakteru.",
      video: { yt: "fJ9rUzIMcZQ", tut: "Bohemian Rhapsody Queen official" },
    },
    {
      piece: "«O mio babbino caro» (Puccini)",
      video: { yt: "Sf-tjXevlyQ", tut: "O mio babbino caro Puccini Renee Fleming Berliner" },
    },
    {
      piece: "«Nessun dorma» (Puccini)",
      note: "Repertuarowy szczyt wokalisty — arię wieńczy jedno z najtrudniejszych, kulminacyjnych „Vincerò!”.",
      video: { yt: "cWc7vYjgnTs", tut: "Nessun dorma Pavarotti Three Tenors 1994" },
    },
  ]
);
