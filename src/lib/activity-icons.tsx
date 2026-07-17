import { createElement, type ComponentType } from "react";
import {
  Activity,
  Anchor,
  AudioLines,
  AudioWaveform,
  Bell,
  BellRing,
  Brain,
  Car,
  ChefHat,
  Circle,
  CircleDotDashed,
  DiscAlbum,
  Dumbbell,
  FileMusic,
  Flame,
  Footprints,
  Headphones,
  ListMusic,
  Monitor,
  MonitorSpeaker,
  Mountain,
  Music,
  Music3,
  Music4,
  Palette,
  PenLine,
  Piano,
  Radio,
  RadioReceiver,
  Scissors,
  Snowflake,
  Swords,
  Target,
  Users,
  Volume,
  Volume1,
  Volume2,
  Waves,
} from "lucide-react";
import {
  faArrowsSpin,
  faBaseball,
  faBaseballBatBall,
  faBasketball,
  faBeerMugEmpty,
  faBezierCurve,
  faBicycle,
  faBolt,
  faBowlFood,
  faBowlRice,
  faBowlingBall,
  faBroom,
  faBullseye,
  faBurger,
  faCameraRetro,
  faCarSide,
  faCarrot,
  faChampagneGlasses,
  faCheese,
  faChessKnight,
  faChildReaching,
  faCircle,
  faCircleDot,
  faCircleHalfStroke,
  faCircleNotch,
  faClapperboard,
  faCompactDisc,
  faCompass,
  faCrosshairs,
  faCubes,
  faDiamond,
  faDrum,
  faDrumstickBite,
  faDumbbell,
  faFeather,
  faFilm,
  faFire,
  faFireBurner,
  faFish,
  faFishFins,
  faFlagCheckered,
  faFootball,
  faFutbol,
  faGamepad,
  faGem,
  faGolfBallTee,
  faGuitar,
  faGun,
  faHammer,
  faHandBackFist,
  faHandFist,
  faHandsHoldingCircle,
  faHeartPulse,
  faHockeyPuck,
  faHorse,
  faInfinity,
  faJar,
  faLeaf,
  faLemon,
  faLifeRing,
  faMartiniGlassCitrus,
  faMedal,
  faMicrophoneLines,
  faMitten,
  faMortarPestle,
  faMotorcycle,
  faMountain,
  faMugSaucer,
  faPaintbrush,
  faPalette,
  faPaperPlane,
  faParachuteBox,
  faPenFancy,
  faPenNib,
  faPencil,
  faPeopleArrows,
  faPepperHot,
  faPersonArrowUpFromLine,
  faPersonBiking,
  faPersonFalling,
  faPersonHiking,
  faPersonRunning,
  faPersonSkating,
  faPersonSkiing,
  faPersonSkiingNordic,
  faPersonSnowboarding,
  faPersonSwimming,
  faPersonWalking,
  faPizzaSlice,
  faPlateWheat,
  faRibbon,
  faRocket,
  faSailboat,
  faScissors,
  faSeedling,
  faShieldHalved,
  faShip,
  faShirt,
  faShoePrints,
  faShrimp,
  faSliders,
  faSnowflake,
  faSpa,
  faSquareFull,
  faStar,
  faStopwatch,
  faTableCellsLarge,
  faTableTennisPaddleBall,
  faTornado,
  faTrophy,
  faUserNinja,
  faVolleyball,
  faWater,
  faWaterLadder,
  faWeightHanging,
  faWeightScale,
  faWheatAwn,
  faWind,
  faWineGlass,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

// Design System v1.1 — activity icons come from Font Awesome Free (solid) where
// a literal icon exists (sports silhouettes, real balls, cuisine dishes), with
// lucide kept for the gaps (instruments and a few others — FA has those only in
// the paid Pro set). Category fallback icons and the rest of the app stay on
// lucide. No runtime dependency on @fortawesome/react-fontawesome: FA ships raw
// SVG path data, rendered by the tiny fa() wrapper below (fill=currentColor, so
// Tailwind text-* color classes keep working exactly like with lucide).

export type ActivityIconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

// Module-level factory → stable component identity per icon (lint heuristic).
function fa(def: IconDefinition): ActivityIconComponent {
  const [width, height, , , pathData] = def.icon;
  const paths = Array.isArray(pathData) ? pathData : [pathData];
  function FaIcon({ className, "aria-hidden": ariaHidden = true }: { className?: string; "aria-hidden"?: boolean }) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        aria-hidden={ariaHidden}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    );
  }
  FaIcon.displayName = `Fa${def.iconName}`;
  return FaIcon;
}

// Category icons are only a fallback for activities without a slug override.
const CATEGORY_ICONS: Record<string, ActivityIconComponent> = {
  wytrzymalosciowe: Footprints,
  outdoor: Mountain,
  wodne: Waves,
  zimowe: Snowflake,
  sila: Dumbbell,
  fitness: Flame,
  druzynowe: Users,
  rakietowe: Circle,
  precyzyjne: Target,
  "taniec-walki": Swords,
  motorowe: Car,
  umyslowe: Brain,
  wizualne: Palette,
  rekodzielo: Scissors,
  cyfrowe: Monitor,
  artyzm: PenLine,
  instrumenty: Music,
  kuchnie: ChefHat,
};

// A distinct, recognizable icon per activity — no two activities share one.
// FA Free covers 119/138; the rest keeps lucide until we add custom SVGs
// (or FA Pro). See: przeglad-ikon-dziennik.html.
const SLUG_ICONS: Record<string, ActivityIconComponent> = {
  // Wytrzymałościowe
  bieganie: fa(faPersonRunning),
  chodzenie: fa(faPersonWalking),
  "jazda-na-rowerze": fa(faPersonBiking),
  plywanie: fa(faPersonSwimming),
  "rolki-lyzwy": fa(faPersonSkating),
  wioslarstwo: fa(faShip),
  triathlon: fa(faMedal),
  sprint: fa(faBolt),

  // Górskie i outdoor
  wspinaczka: fa(faMountain),
  narciarstwo: fa(faPersonSkiing),
  golf: fa(faGolfBallTee),
  "turystyka-gorska": fa(faPersonHiking),
  jezdziectwo: fa(faHorse),
  paralotniarstwo: fa(faParachuteBox),
  "bieg-na-orientacje": fa(faCompass),
  parkour: fa(faPersonFalling),

  // Wodne
  kajakarstwo: Anchor, // FA Free brak (Pro: kayak)
  zeglarstwo: fa(faSailboat),
  surfing: fa(faWater),
  nurkowanie: fa(faFishFins),
  windsurfing: fa(faWind),
  kitesurfing: fa(faTornado),
  sup: fa(faLifeRing),
  "pilka-wodna": fa(faWaterLadder),

  // Zimowe
  snowboard: fa(faPersonSnowboarding),
  "lyzwiarstwo-figurowe": fa(faStar),
  biathlon: fa(faSnowflake),
  "narciarstwo-biegowe": fa(faPersonSkiingNordic),
  "lyzwiarstwo-szybkie": fa(faStopwatch),
  "skoki-narciarskie": fa(faRocket),
  curling: fa(faBroom),

  // Siła i ciało
  "trening-silowy": fa(faDumbbell),
  joga: fa(faSpa),
  kalistenika: fa(faPersonArrowUpFromLine),
  pilates: fa(faInfinity),
  gimnastyka: fa(faChildReaching),
  "podnoszenie-ciezarow": fa(faWeightHanging),
  "trojboj-silowy": fa(faWeightScale),
  strongman: fa(faHandBackFist),

  // Drużynowe
  "pilka-nozna": fa(faFutbol),
  koszykowka: fa(faBasketball),
  siatkowka: fa(faVolleyball),
  "pilka-reczna": fa(faHandsHoldingCircle),
  rugby: fa(faShieldHalved),
  hokej: fa(faHockeyPuck),
  krykiet: fa(faBaseballBatBall),
  baseball: fa(faBaseball),
  "futbol-amerykanski": fa(faFootball),
  "hokej-na-trawie": fa(faSeedling),
  lacrosse: fa(faTrophy),
  "ultimate-frisbee": fa(faCompactDisc),

  // Rakietowe
  tenis: fa(faCircleDot),
  "tenis-stolowy": fa(faTableTennisPaddleBall),
  badminton: fa(faFeather),
  squash: fa(faSquareFull),
  padel: fa(faTableCellsLarge),
  pickleball: fa(faCircleNotch),

  // Precyzyjne
  lucznictwo: fa(faBullseye),
  bilard: fa(faCircle),
  kregle: fa(faBowlingBall),
  dart: fa(faCrosshairs),
  snooker: CircleDotDashed, // FA Free brak (Pro: pool-8-ball)
  petanka: fa(faCircleHalfStroke),
  "strzelectwo-sportowe": fa(faGun),

  // Fitness i cardio
  crossfit: fa(faFire),
  skakanka: fa(faArrowsSpin),
  spinning: fa(faBicycle),
  aerobik: fa(faHeartPulse),

  // Motorowe
  karting: fa(faCarSide),
  motocross: fa(faMotorcycle),
  zuzel: fa(faFlagCheckered),

  // Umysłowe
  szachy: fa(faChessKnight),
  "e-sport": fa(faGamepad),
  poker: fa(faDiamond),

  // Taniec i sztuki walki
  taniec: fa(faShoePrints),
  "sztuki-walki": fa(faUserNinja),
  boks: fa(faHandFist),
  judo: fa(faShirt),
  zapasy: fa(faPeopleArrows),
  "taniec-towarzyski": fa(faChampagneGlasses),

  // Sztuki wizualne
  rysowanie: fa(faPencil),
  malarstwo: fa(faPalette),
  akwarela: fa(faPaintbrush),
  kaligrafia: fa(faPenNib),

  // Rękodzieło
  garncarstwo: fa(faJar),
  dzianie: fa(faMitten),
  szydelkowanie: fa(faRibbon),
  szycie: fa(faScissors),
  stolarstwo: fa(faHammer),
  bizuteria: fa(faGem),
  origami: fa(faPaperPlane),

  // Sztuki cyfrowe
  "grafika-cyfrowa": fa(faBezierCurve),
  fotografia: fa(faCameraRetro),
  "montaz-wideo": fa(faClapperboard),
  animacja: fa(faFilm),
  "modelowanie-3d": fa(faCubes),

  // Artyzm
  pisanie: fa(faPenFancy),
  "produkcja-muzyczna": fa(faSliders),

  // Instrumenty
  "gra-na-gitarze": fa(faGuitar),
  spiew: fa(faMicrophoneLines),
  pianino: Piano, // FA Free brak (Pro: piano)
  skrzypce: Music3, // FA Free brak (Pro: violin)
  perkusja: fa(faDrum),
  "gitara-basowa": AudioWaveform, // FA Free brak (Pro: guitar-electric)
  ukulele: Music4, // FA Free brak (Pro: guitars)
  saksofon: AudioLines, // FA Free brak (Pro: saxophone)
  flet: Volume1, // FA Free brak (Pro: flute)
  trabka: BellRing, // FA Free brak (Pro: trumpet)
  klarnet: Volume2, // FA Free brak (Pro: clarinet)
  wiolonczela: FileMusic, // FA Free brak (Pro: violin)
  "harmonijka-ustna": Volume, // FA brak — własne SVG w przyszłości
  akordeon: RadioReceiver, // FA Free brak (Pro: accordion)
  banjo: DiscAlbum, // FA Free brak (Pro: banjo)
  mandolina: ListMusic, // FA Free brak (Pro: mandolin)
  keyboard: Radio, // FA Free brak (Pro: piano-keyboard)
  puzon: Bell, // FA Free brak (Pro: trombone)
  harfa: Headphones, // FA Free brak (Pro: harp)
  organy: MonitorSpeaker, // FA brak — własne SVG w przyszłości

  // Kuchnie świata
  "kuchnia-wloska": fa(faPizzaSlice),
  "kuchnia-francuska": fa(faCheese),
  "kuchnia-japonska": fa(faBowlRice),
  "kuchnia-chinska": fa(faBowlFood),
  "kuchnia-meksykanska": fa(faPepperHot),
  "kuchnia-indyjska": fa(faMortarPestle),
  "kuchnia-tajska": fa(faLemon),
  "kuchnia-hiszpanska": fa(faWineGlass),
  "kuchnia-grecka": fa(faLeaf),
  "kuchnia-polska": fa(faPlateWheat),
  "kuchnia-turecka": fa(faMugSaucer),
  "kuchnia-wietnamska": fa(faShrimp),
  "kuchnia-koreanska": fa(faFireBurner),
  "kuchnia-amerykanska": fa(faBurger),
  "kuchnia-libanska": fa(faWheatAwn),
  "kuchnia-marokanska": fa(faDrumstickBite),
  "kuchnia-brazylijska": fa(faMartiniGlassCitrus),
  "kuchnia-niemiecka": fa(faBeerMugEmpty),
  "kuchnia-wegierska": fa(faCarrot),
  "kuchnia-peruwianska": fa(faFish),
};

export function activityIcon(slug: string, category: string): ActivityIconComponent {
  return SLUG_ICONS[slug] ?? CATEGORY_ICONS[category] ?? Activity;
}

export function ActivityIcon({
  slug,
  category,
  className = "h-5 w-5 text-neutral-600",
}: {
  slug: string;
  category: string;
  className?: string;
}) {
  // Icons come from module-level maps, so component identity is stable;
  // createElement keeps the static-components lint heuristic happy.
  return createElement(activityIcon(slug, category), { "aria-hidden": true, className });
}
