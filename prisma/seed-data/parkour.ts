// Parkour ladder 1-99. Manual — progression tracks: movement skill line
// (roll → vaults → precisions → cat leaps → big jumps → flips), gap distance
// (cm), and experience/competition level.
import { ladderC, freq, prog } from "./helpers";
import type { MilestoneResource } from "../../src/lib/milestone-resources";
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const activity = {
  slug: "parkour",
  name: "Parkour",
  icon: "🧗",
  description:
    "Płynne pokonywanie przeszkód miasta — skoki, przewroty, precyzje i saltowanie. Progresja: umiejętności ruchowe, dystans skoków i doświadczenie.",
  sortOrder: 74,
  logKind: "manual" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // 1-10 · Pierwsze kroki
  ["Wyląduj bezpiecznie i cicho (soft landing)", undefined, prog("ruch", 1)],
  ["Wykonaj przewrót parkourowy (roll) z rozbiegu", undefined, prog("ruch", 2)],
  ["Wykonaj balans na wąskiej krawędzi (rail balance)", undefined, prog("ruch", 3)],
  ["Wykonaj safety vault (przejście przez przeszkodę)", undefined, prog("ruch", 4)],
  ["Wykonaj precyzję (precision jump) na 1 m", undefined, prog("skok", 100)],
  ["Wykonaj lazy vault", undefined, prog("ruch", 5)],
  ["Wykonaj cat leap (chwyt ściany po skoku) na niską ścianę", undefined, prog("ruch", 6)],
  ["Wykonaj precyzję na 1,5 m", undefined, prog("skok", 150)],
  ["Trenuj ground movement (QM, poruszanie na czworaka) płynnie", undefined, prog("ruch", 7)],
  ["Wykonaj 10 sesji treningowych", undefined, prog("sesje", 10)],
  // 11-25 · Regularny
  ["Trenuj 2 razy w tygodniu przez 4 kolejne tygodnie", undefined, freq(2, 4)],
  ["Wykonaj kong vault (przeskok z rękami przez przeszkodę)", undefined, prog("ruch", 8)],
  ["Wykonaj precyzję na 2 m", undefined, prog("skok", 200)],
  ["Wykonaj wall run (wybieg na ścianę) i chwyt", undefined, prog("ruch", 9)],
  ["Wykonaj 25 sesji", undefined, prog("sesje", 25)],
  ["Wykonaj dash vault", undefined, prog("ruch", 10)],
  ["Wykonaj precyzję na 2,5 m", undefined, prog("skok", 250)],
  ["Wykonaj cat leap na wyższą ścianę i podciągnięcie (climb-up)", undefined, prog("ruch", 11)],
  ["Połącz 3 ruchy w płynną sekwencję (flow)", undefined, prog("ruch", 12)],
  ["Wykonaj 40 sesji", undefined, prog("sesje", 40)],
  ["Wykonaj precyzję na 3 m", undefined, prog("skok", 300)],
  ["Wykonaj kong vault przez dłuższą przeszkodę", undefined, prog("ruch", 13)],
  ["Wykonaj drop (zeskok) z 2 m z rollem", undefined, prog("ruch", 14)],
  ["Weź udział w spotkaniu społeczności parkour (parkour jam)"],
  ["Wykonaj 60 sesji", undefined, prog("sesje", 60)],
  // 26-45 · Średniozaawansowany
  ["Trenuj 3 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(3, 12)],
  ["Wykonaj precyzję na 3,5 m", undefined, prog("skok", 350)],
  ["Wykonaj double kong (podwójny kong przez długą przeszkodę)", undefined, prog("ruch", 15)],
  ["Wykonaj precyzję rail-to-rail (na barierkę)", undefined, prog("ruch", 16)],
  ["Wykonaj 80 sesji", undefined, prog("sesje", 80)],
  ["Wykonaj cat-to-cat (skok ze ściany na ścianę)", undefined, prog("ruch", 17)],
  ["Wykonaj precyzję na 4 m", undefined, prog("skok", 400)],
  ["Wykonaj wall spin lub tic-tac (odbicie od ściany)", undefined, prog("ruch", 18)],
  ["Wykonaj 100 sesji", undefined, prog("sesje", 100)],
  ["Wykonaj drop z 3 m z kontrolowanym rollem", undefined, prog("ruch", 19)],
  ["Wykonaj precyzję na 4,5 m", undefined, prog("skok", 450)],
  ["Wykonaj pierwszy front flip lub backflip (na trawie/macie)", undefined, prog("ruch", 20)],
  ["Połącz 6 ruchów w płynny run bez zatrzymania", undefined, prog("ruch", 21)],
  ["Wykonaj 150 sesji", undefined, prog("sesje", 150)],
  ["Wykonaj precyzję na 5 m", undefined, prog("skok", 500)],
  ["Wykonaj kash vault (kong + dash)", undefined, prog("ruch", 22)],
  ["Wykonaj backflip na płaskim (bez podwyższenia)", undefined, prog("ruch", 23)],
  ["Wykonaj gap jump między dachami/podwyższeniami (bezpieczny)", undefined, prog("ruch", 24)],
  ["Wykonaj 200 sesji", undefined, prog("sesje", 200)],
  ["Wykonaj precyzję na 5,5 m", undefined, prog("skok", 550)],
  // 46-65 · Zaawansowany
  ["Trenuj jak zawodnik freerun przez sezon"],
  ["Wykonaj precyzję na 6 m", undefined, prog("skok", 600)],
  ["Wykonaj wallflip (salto od ściany)", undefined, prog("ruch", 25)],
  ["Wykonaj palm flip / aerial (salto bez rąk lub z jedną)", undefined, prog("ruch", 26)],
  ["Wykonaj 250 sesji", undefined, prog("sesje", 250)],
  ["Wykonaj precyzję na 6,5 m", undefined, prog("skok", 650)],
  ["Wykonaj double kong precision (przelot z lądowaniem na precyzję)", undefined, prog("ruch", 27)],
  ["Zajmij miejsce w pierwszej połowie zawodów freerun/speed"],
  ["Wykonaj precyzję na 7 m", undefined, prog("skok", 700)],
  ["Wykonaj cork lub raiz (salto boczne z rotacją)", undefined, prog("ruch", 28)],
  ["Wykonaj 300 sesji", undefined, prog("sesje", 300)],
  ["Wykonaj drop z 4 m z perfekcyjnym rollem", undefined, prog("ruch", 29)],
  ["Wykonaj precyzję na 7,5 m", undefined, prog("skok", 750)],
  ["Wykonaj kombinację flip + vault + precision w jednym flow", undefined, prog("ruch", 30)],
  ["Zajmij miejsce na podium zawodów regionalnych"],
  ["Wykonaj precyzję na 8 m", undefined, prog("skok", 800)],
  ["Wykonaj double backflip (na macie/foam)", undefined, prog("ruch", 31)],
  ["Wykonaj 400 sesji", undefined, prog("sesje", 400)],
  ["Wykonaj big gap jump (duży przeskok między obiektami)", undefined, prog("ruch", 32)],
  ["Uzyskaj wynik kwalifikujący do zawodów międzynarodowych"],
  // 66-85 · Wyczynowy
  ["Wykonaj precyzję na 8,5 m", undefined, prog("skok", 850)],
  ["Wystartuj w zawodach międzynarodowych (FIG Parkour World Cup / Red Bull)"],
  ["Wykonaj corked flip w kombinacji z vaultem", undefined, prog("ruch", 33)],
  ["Zajmij miejsce w pierwszej połowie zawodów międzynarodowych"],
  ["Wykonaj precyzję na 9 m", undefined, prog("skok", 900)],
  ["Wykonaj 600 sesji", undefined, prog("sesje", 600)],
  ["Wykonaj gainer / spider flip (zaawansowana rotacja)", undefined, prog("ruch", 34)],
  ["Zdobądź punkty w zawodach międzynarodowych"],
  ["Wykonaj precyzję na 9,5 m", undefined, prog("skok", 950)],
  ["Zajmij miejsce w pierwszej ósemce zawodów międzynarodowych"],
  ["Wykonaj double cork lub najtrudniejszy element freerun", undefined, prog("ruch", 35)],
  ["Wykonaj precyzję na 10 m", undefined, prog("skok", 1000)],
  ["Wykonaj 800 sesji", undefined, prog("sesje", 800)],
  ["Wygraj konkurencję speed lub freestyle na zawodach krajowych"],
  ["Wykonaj kombinację 3 saltów/rotacji w jednym runie", undefined, prog("ruch", 36)],
  ["Zdobądź podium na zawodach o zasięgu ogólnokrajowym"],
  ["Wykonaj precyzję na 10,5 m", undefined, prog("skok", 1050)],
  ["Zajmij miejsce w czołówce zawodów o zasięgu ogólnokrajowym"],
  ["Wykonaj przełomowy, autorski element ruchowy", undefined, prog("ruch", 37)],
  ["Zostań czołowym zawodnikiem freerun w swoim regionie"],
  // 86-99 · Elita
  ["Weź udział w mistrzostwach kraju amatorów"],
  ["Wykonaj precyzję na 11 m", "Bardzo rzadki, wieloletnio wypracowany skok.", prog("skok", 1100)],
  ["Zajmij miejsce w pierwszej ósemce mistrzostw kraju amatorów"],
  ["Wykonaj najtrudniejszą znaną sobie kombinację flip+precision", undefined, prog("ruch", 38)],
  ["Wykonaj 1000 sesji", undefined, prog("sesje", 1000)],
  ["Zdobądź medal mistrzostw kraju amatorów (speed lub freestyle)"],
  ["Zostań rozpoznawalny w krajowym środowisku parkour"],
  ["Awansuj do finału zawodów o zasięgu ogólnokrajowym"],
  ["Wykonaj element uznany za jeden z najtrudniejszych w swoim środowisku", undefined, prog("ruch", 39)],
  ["Zdobądź złoto zawodów o zasięgu ogólnokrajowym"],
  ["Zostań mistrzem kraju amatorów w konkurencji"],
  ["Ustanów swój rekord życiowy dystansu skoku lub trudności elementu", undefined, prog("skok", 1200)],
  ["Poprowadź kogoś przez zaawansowaną technikę parkour", undefined, prog("ruch", 40)],
  ["Poziom mistrzowski (amatorski szczyt): wieloletni, dojrzały warsztat parkour", "Dalsze, zawodowe osiągnięcia (mistrzostwa świata FIG) potwierdzają osobne certyfikaty."],
]);

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "video", title: "Ronnie Shalvis — How to Land Safely in Parkour", url: yt("RgPd29MlMDo") },
  ],
  2: [
    { kind: "video", title: "Tapp Brothers — Parkour Roll Tutorial for Beginners", url: yt("RgPd29MlMDo") },
  ],
  4: [
    { kind: "video", title: "Safety Vault Tutorial — Basic Parkour Movement", url: yt("NZOaBkfrh-E") },
  ],
  12: [
    { kind: "video", title: "Kong Vault Tutorial — Step by Step Parkour", url: yt("RNW9hb0Tl-4") },
  ],
  14: [
    { kind: "video", title: "Wall Run Tutorial — How to Run Up Walls", url: yt("UEpKD7PQLSE") },
  ],
  27: [
    { kind: "video", title: "Double Kong Vault — Advanced Parkour Movement", url: yt("YaxFBrOHn1s") },
  ],
  36: [
    { kind: "video", title: "How to Backflip on Flat Ground — Parkour Tutorial", url: yt("LNHoaiyx3QE") },
  ],
  48: [
    { kind: "video", title: "Ronnie Shalvis — Wallflip Tutorial Step by Step", url: yt("ZDPpEhkkOJ8") },
  ],
  67: [
    { kind: "article", title: "FIG Parkour — Competition Rules and Formats", url: "https://www.gymnastics.sport/site/pages/disciplines/pres-parkour.php" },
  ],
  86: [
    { kind: "video", title: "Best Parkour and Freerunning — World Championship Highlights", url: yt("Unl1S5vkxi8") },
  ],
};
