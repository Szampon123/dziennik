// Olympic weightlifting ladder 1-99. Manual — progression tracks: snatch (kg),
// clean & jerk (kg), technique, and competition level. Values = kg (male
// reference; women adjust with age/weight tables — noted at top levels).
import { ladderC, freq, prog } from "./helpers";
import type { MilestoneResource } from "../../src/lib/milestone-resources";

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const activity = {
  slug: "podnoszenie-ciezarow",
  name: "Podnoszenie ciężarów",
  icon: "🏋️",
  description:
    "Dwubój olimpijski — rwanie (snatch) i podrzut (clean & jerk). Progresja: ciężary w obu bojach, technika i poziom zawodów. Kilogramy w odniesieniu open.",
  sortOrder: 60,
  logKind: "manual" as const,
};

export const { milestones, criteriaByLevel } = ladderC([
  // 1-10 · Pierwsze kroki
  ["Opanuj pozycję overhead squat z gryfem", undefined, prog("technika", 1)],
  ["Wykonaj poprawny snatch z pozycji hang (z wiszenia)", undefined, prog("technika", 2)],
  ["Wykonaj poprawny clean & jerk techniczny z lekkim ciężarem", undefined, prog("technika", 3)],
  ["Wykonaj rwanie (snatch) 30 kg z podłogi", undefined, prog("snatch", 30)],
  ["Wykonaj podrzut (clean and jerk) 40 kg", undefined, prog("cj", 40)],
  ["Opanuj przejście pod gryf (turnaround w jerku)", undefined, prog("technika", 4)],
  ["Wykonaj rwanie (snatch) 40 kg", undefined, prog("snatch", 40)],
  ["Wykonaj podrzut (clean and jerk) 50 kg", undefined, prog("cj", 50)],
  ["Wykonaj snatch z pełnym siadem (squat snatch)", undefined, prog("technika", 5)],
  ["Wykonaj rwanie (snatch) 50 kg", undefined, prog("snatch", 50)],
  // 11-25 · Regularny
  ["Trenuj 2 razy w tygodniu przez 4 kolejne tygodnie", undefined, freq(2, 4)],
  ["Wykonaj podrzut (clean and jerk) 60 kg", undefined, prog("cj", 60)],
  ["Wykonaj rwanie (snatch) 55 kg", undefined, prog("snatch", 55)],
  ["Opanuj split jerk (nożyce)", undefined, prog("technika", 6)],
  ["Wykonaj podrzut (clean and jerk) 70 kg", undefined, prog("cj", 70)],
  ["Wykonaj rwanie (snatch) 60 kg", undefined, prog("snatch", 60)],
  ["Wystartuj w pierwszych zawodach", undefined, prog("liga", 1)],
  ["Wykonaj podrzut (clean and jerk) 80 kg", undefined, prog("cj", 80)],
  ["Wykonaj rwanie (snatch) 65 kg", undefined, prog("snatch", 65)],
  ["Utrzymaj technikę przy submaksymalnych ciężarach", undefined, prog("technika", 7)],
  ["Wykonaj podrzut (clean and jerk) 90 kg", undefined, prog("cj", 90)],
  ["Wykonaj rwanie (snatch) 70 kg", undefined, prog("snatch", 70)],
  ["Zaliczy dwubój 160 kg łącznie (total)", undefined, prog("total", 160)],
  ["Wykonaj podrzut (clean and jerk) 100 kg", "Setka w podrzucie sztangi (clean and jerk).", prog("cj", 100)],
  ["Wykonaj rwanie (snatch) 75 kg", undefined, prog("snatch", 75)],
  // 26-45 · Średniozaawansowany
  ["Trenuj 3 razy w tygodniu przez 12 kolejnych tygodni", undefined, freq(3, 12)],
  ["Wykonaj podrzut (clean and jerk) 105 kg", undefined, prog("cj", 105)],
  ["Wykonaj rwanie (snatch) 80 kg", undefined, prog("snatch", 80)],
  ["Zaliczy total 190 kg", undefined, prog("total", 190)],
  ["Opanuj timing drugiego pociągnięcia (triple extension)", undefined, prog("technika", 8)],
  ["Wykonaj podrzut (clean and jerk) 110 kg", undefined, prog("cj", 110)],
  ["Wykonaj rwanie (snatch) 85 kg", undefined, prog("snatch", 85)],
  ["Zajmij miejsce w pierwszej połowie zawodów regionalnych"],
  ["Wykonaj podrzut (clean and jerk) 120 kg", undefined, prog("cj", 120)],
  ["Wykonaj rwanie (snatch) 90 kg", undefined, prog("snatch", 90)],
  ["Zaliczy total 210 kg", undefined, prog("total", 210)],
  ["Utrzymaj powtarzalność techniki na 90% maksa", undefined, prog("technika", 9)],
  ["Wykonaj podrzut (clean and jerk) 130 kg", undefined, prog("cj", 130)],
  ["Wykonaj rwanie (snatch) 95 kg", undefined, prog("snatch", 95)],
  ["Zajmij miejsce na podium zawodów regionalnych"],
  ["Wykonaj podrzut (clean and jerk) 135 kg", undefined, prog("cj", 135)],
  ["Wykonaj rwanie (snatch) 100 kg", "Setka w rwaniu.", prog("snatch", 100)],
  ["Zaliczy total 235 kg", undefined, prog("total", 235)],
  ["Wykonaj podrzut (clean and jerk) 140 kg", undefined, prog("cj", 140)],
  ["Wykonaj rwanie (snatch) 105 kg", undefined, prog("snatch", 105)],
  // 46-65 · Zaawansowany
  ["Trenuj 4+ razy w tygodniu z periodyzacją przez sezon"],
  ["Wykonaj podrzut (clean and jerk) 145 kg", undefined, prog("cj", 145)],
  ["Wykonaj rwanie (snatch) 110 kg", undefined, prog("snatch", 110)],
  ["Zaliczy total 255 kg", undefined, prog("total", 255)],
  ["Zajmij miejsce w czołówce mistrzostw okręgu"],
  ["Wykonaj podrzut (clean and jerk) 150 kg", undefined, prog("cj", 150)],
  ["Wykonaj rwanie (snatch) 115 kg", undefined, prog("snatch", 115)],
  ["Utrzymaj perfekcyjną technikę na 95% maksa", undefined, prog("technika", 10)],
  ["Wykonaj podrzut (clean and jerk) 155 kg", undefined, prog("cj", 155)],
  ["Wykonaj rwanie (snatch) 120 kg", undefined, prog("snatch", 120)],
  ["Zaliczy total 275 kg", undefined, prog("total", 275)],
  ["Zajmij miejsce w pierwszej dziesiątce mistrzostw kraju (kategoria)"],
  ["Wykonaj podrzut (clean and jerk) 160 kg", undefined, prog("cj", 160)],
  ["Wykonaj rwanie (snatch) 125 kg", undefined, prog("snatch", 125)],
  ["Zdobądź minimum na mistrzostwa kraju seniorów"],
  ["Wykonaj podrzut (clean and jerk) 165 kg", undefined, prog("cj", 165)],
  ["Wykonaj rwanie (snatch) 130 kg", undefined, prog("snatch", 130)],
  ["Zaliczy total 295 kg", undefined, prog("total", 295)],
  ["Zdobądź medal mistrzostw kraju juniorów"],
  ["Wykonaj podrzut (clean and jerk) 170 kg", undefined, prog("cj", 170)],
  // 66-85 · Wyczynowy
  ["Wykonaj rwanie (snatch) 135 kg", undefined, prog("snatch", 135)],
  ["Zaliczy total 310 kg", undefined, prog("total", 310)],
  ["Zdobądź medal mistrzostw kraju seniorów"],
  ["Wykonaj podrzut (clean and jerk) 175 kg", undefined, prog("cj", 175)],
  ["Wykonaj rwanie (snatch) 140 kg", undefined, prog("snatch", 140)],
  ["Utrzymaj technikę mistrzowską pod presją zawodów", undefined, prog("technika", 11)],
  ["Zaliczy total 325 kg", undefined, prog("total", 325)],
  ["Wystartuj w zawodach międzynarodowych"],
  ["Wykonaj podrzut (clean and jerk) 180 kg", undefined, prog("cj", 180)],
  ["Wykonaj rwanie (snatch) 145 kg", undefined, prog("snatch", 145)],
  ["Zaliczy total 340 kg", undefined, prog("total", 340)],
  ["Zdobądź minimum na mistrzostwa kraju amatorów"],
  ["Wykonaj podrzut (clean and jerk) 190 kg", undefined, prog("cj", 190)],
  ["Wykonaj rwanie (snatch) 150 kg", undefined, prog("snatch", 150)],
  ["Zaliczy total 355 kg", undefined, prog("total", 355)],
  ["Zajmij miejsce w pierwszej ósemce mistrzostw regionu"],
  ["Wykonaj podrzut (clean and jerk) 200 kg", "Dwieście w podrzucie sztangi (clean and jerk).", prog("cj", 200)],
  ["Wykonaj rwanie (snatch) 160 kg", undefined, prog("snatch", 160)],
  ["Zaliczy total 375 kg", undefined, prog("total", 375)],
  ["Zdobądź medal mistrzostw regionu"],
  // 86-99 · Elita
  ["Wykonaj podrzut (clean and jerk) 210 kg", undefined, prog("cj", 210)],
  ["Wykonaj rwanie (snatch) 170 kg", undefined, prog("snatch", 170)],
  ["Zaliczy total 390 kg", undefined, prog("total", 390)],
  ["Weź udział w mistrzostwach kraju amatorów"],
  ["Wykonaj podrzut (clean and jerk) 220 kg", undefined, prog("cj", 220)],
  ["Wykonaj rwanie (snatch) 180 kg", undefined, prog("snatch", 180)],
  ["Zaliczy total 400 kg", "Bardzo wysoki, wieloletnio wypracowany total.", prog("total", 400)],
  ["Zajmij miejsce w pierwszej ósemce mistrzostw kraju amatorów"],
  ["Zdobądź medal mistrzostw kraju amatorów"],
  ["Poprowadź kogoś przez zaawansowaną technikę dwuboju"],
  ["Ustanów swój rekord życiowy w boju lub dwuboju", undefined, prog("technika", 12)],
  ["Zaliczy total 420 kg", undefined, prog("total", 420)],
  ["Zdobądź wielokrotne medale mistrzostw kraju amatorów"],
  ["Poziom mistrzowski (amatorski szczyt): wieloletni, dojrzały warsztat w dwuboju olimpijskim (snatch + clean and jerk)", "Dalsze, zawodowe osiągnięcia (mistrzostwa świata, igrzyska) potwierdzają osobne certyfikaty."],
]);

export const resourcesByLevel: Record<number, MilestoneResource[]> = {
  1: [
    { kind: "video", title: "Overhead Squat Technique — Catalyst Athletics", url: yt("pn2dGUr-JgE") },
    { kind: "article", title: "Olympic weightlifting for beginners", url: "https://www.barbend.com/olympic-weightlifting-beginners-guide/" },
  ],
  2: [
    { kind: "video", title: "Hang Snatch — Torokhtiy Weightlifting", url: yt("CNVoHkB_pYk") },
  ],
  3: [
    { kind: "video", title: "Clean & Jerk — Full Tutorial — Catalyst Athletics", url: yt("EKnrR5LQLRY") },
  ],
  9: [
    { kind: "video", title: "Squat Snatch Technique — Torokhtiy", url: yt("_oP-UrDYrMw") },
    { kind: "article", title: "Snatch technique step by step", url: "https://www.catalystathletics.com/exercise/67/Snatch/" },
  ],
  14: [
    { kind: "video", title: "Split Jerk Technique — Catalyst Athletics", url: yt("_RYMBzNrdkI") },
  ],
  30: [
    { kind: "video", title: "Triple Extension — Second Pull — Torokhtiy", url: yt("txhAFaB-xRg") },
  ],
  41: [
    { kind: "article", title: "Snatch 100 kg club — training milestones", url: "https://www.barbend.com/snatch-training-program/" },
  ],
  53: [
    { kind: "reference", title: "IWF Technical Rules", url: "https://www.iwf.net/weightlifting_/rules/" },
  ],
  73: [
    { kind: "video", title: "Maintaining Perfect Technique Under Max Load — Torokhtiy", url: yt("F8Y-k0oJWdM") },
  ],
  99: [
    { kind: "reference", title: "Catalyst Athletics Exercise Library", url: "https://www.catalystathletics.com/exercises/" },
  ],
};
