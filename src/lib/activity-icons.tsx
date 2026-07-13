import { createElement } from "react";
import {
  Accessibility,
  Anchor,
  AudioLines,
  AudioWaveform,
  Backpack,
  Banana,
  Beef,
  Bell,
  BellRing,
  Bike,
  Bird,
  Box,
  Brain,
  BrickWall,
  Brush,
  Cake,
  Camera,
  Car,
  CarFront,
  Carrot,
  ChefHat,
  Cherry,
  Circle,
  CircleDashed,
  CircleDot,
  Citrus,
  Clapperboard,
  CloudSnow,
  Coffee,
  Compass,
  CookingPot,
  Croissant,
  Crosshair,
  Cylinder,
  Diamond,
  Dice5,
  Dices,
  Disc,
  Disc2,
  Disc3,
  DiscAlbum,
  Drama,
  Drum,
  Drumstick,
  Dumbbell,
  EggFried,
  Feather,
  Fence,
  FileMusic,
  Film,
  Fish,
  Flag,
  FlagTriangleRight,
  Flame,
  Flower,
  Flower2,
  Footprints,
  Frame,
  Gamepad2,
  Gem,
  Goal,
  Grape,
  Grid2x2,
  Grip,
  GripHorizontal,
  Guitar,
  Ham,
  Hammer,
  Hand,
  HandFist,
  HandGrab,
  HandMetal,
  HandPlatter,
  Headphones,
  HeartPulse,
  HelpCircle,
  KeyboardMusic,
  LandPlot,
  Leaf,
  LifeBuoy,
  ListMusic,
  Mic,
  Monitor,
  MonitorSpeaker,
  Motorbike,
  Mountain,
  MountainSnow,
  Move,
  Music,
  Music2,
  Music3,
  Music4,
  Orbit,
  Origami,
  Palette,
  PawPrint,
  PenLine,
  PenTool,
  Pencil,
  PersonStanding,
  Piano,
  Pipette,
  Pizza,
  Radar,
  Radio,
  RadioReceiver,
  Repeat,
  Rocket,
  Route,
  Sailboat,
  Salad,
  Sandwich,
  Scale,
  Scissors,
  Shield,
  Ship,
  Shirt,
  Shovel,
  Snowflake,
  Soup,
  Spade,
  Sparkles,
  Spline,
  Sprout,
  Sword,
  Swords,
  Table,
  Target,
  TestTube,
  Timer,
  Tornado,
  Torus,
  TreePine,
  Users,
  Volleyball,
  Waves,
  WavesLadder,
  Waypoints,
  Weight,
  Wheat,
  Wind,
  Wine,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Design System v1.0 — lucide icons replace emoji (consistent rendering).
// Category icons are only a fallback for activities without a slug override.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
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

// A distinct, recognizable icon per activity. Every one of the 138 activities
// gets its own icon (no two share one), so sports and disciplines are easy to
// tell apart in the list. Where lucide has no literal match (many ball/racket
// sports), a distinct evocative stand-in is used (ball/court/gear/motion).
const SLUG_ICONS: Record<string, LucideIcon> = {
  // Wytrzymałościowe
  bieganie: Footprints,
  chodzenie: PersonStanding,
  "jazda-na-rowerze": Bike,
  plywanie: WavesLadder,
  "rolki-lyzwy": Disc3,
  wioslarstwo: Ship,
  triathlon: Route, // swim-bike-run: a multi-stage course, not a podium
  sprint: Zap,

  // Górskie i outdoor
  wspinaczka: Mountain,
  narciarstwo: MountainSnow,
  golf: FlagTriangleRight,
  "turystyka-gorska": Backpack,
  jezdziectwo: PawPrint,
  paralotniarstwo: Bird,
  "bieg-na-orientacje": Compass,
  parkour: Move,

  // Wodne
  kajakarstwo: Anchor,
  zeglarstwo: Sailboat,
  surfing: Waves,
  nurkowanie: Fish,
  windsurfing: Wind,
  kitesurfing: Tornado,
  sup: LifeBuoy,
  "pilka-wodna": Dice5,

  // Zimowe
  snowboard: Snowflake,
  "lyzwiarstwo-figurowe": Spline, // the traced curve of a figure
  biathlon: CloudSnow,
  "narciarstwo-biegowe": TreePine,
  "lyzwiarstwo-szybkie": Timer,
  "skoki-narciarskie": Rocket,
  curling: Cylinder, // the stone

  // Siła i ciało
  "trening-silowy": Dumbbell,
  joga: Flower,
  kalistenika: Accessibility,
  pilates: Flower2,
  gimnastyka: Sparkles,
  "podnoszenie-ciezarow": Weight,
  "trojboj-silowy": Scale,
  strongman: HandMetal,

  // Drużynowe
  "pilka-nozna": Goal,
  koszykowka: Torus, // the hoop
  siatkowka: Volleyball,
  "pilka-reczna": Hand,
  rugby: Swords,
  hokej: Disc,
  krykiet: LandPlot,
  baseball: Diamond,
  "futbol-amerykanski": Shield,
  "hokej-na-trawie": Sprout,
  lacrosse: Shovel, // the netted stick
  "ultimate-frisbee": Disc2,

  // Rakietowe
  tenis: CircleDot,
  "tenis-stolowy": Table,
  badminton: Feather,
  squash: BrickWall, // played off the wall
  padel: Fence,
  pickleball: Grid2x2,

  // Precyzyjne
  lucznictwo: Target,
  bilard: CircleDashed,
  kregle: Dices,
  dart: Radar,
  snooker: Frame, // the table, not a fourth ring
  petanka: Orbit,
  "strzelectwo-sportowe": Crosshair,

  // Fitness
  crossfit: Flame,
  skakanka: Repeat,
  spinning: HeartPulse,
  aerobik: Music2,

  // Motorowe
  karting: CarFront,
  motocross: Motorbike,
  zuzel: Flag,

  // Umysłowe
  szachy: Brain,
  "e-sport": Gamepad2,
  poker: Spade,

  // Taniec i sztuki walki
  taniec: Drama,
  "sztuki-walki": Sword,
  boks: HandFist,
  judo: Shirt,
  zapasy: HandGrab,
  "taniec-towarzyski": Music,

  // Sztuki wizualne
  rysowanie: Pencil,
  malarstwo: Palette,
  akwarela: Brush,
  kaligrafia: PenTool,

  // Rękodzieło
  garncarstwo: HandPlatter,
  dzianie: Grip,
  szydelkowanie: Waypoints,
  szycie: Scissors,
  stolarstwo: Hammer,
  bizuteria: Gem,
  origami: Origami,

  // Sztuki cyfrowe
  "grafika-cyfrowa": Monitor,
  fotografia: Camera,
  "montaz-wideo": Clapperboard,
  animacja: Film,
  "modelowanie-3d": Box,

  // Artyzm
  pisanie: PenLine,
  "produkcja-muzyczna": KeyboardMusic,

  // Instrumenty
  "gra-na-gitarze": Guitar,
  spiew: Mic,
  pianino: Piano,
  skrzypce: Music3,
  perkusja: Drum,
  "gitara-basowa": AudioWaveform,
  ukulele: Music4,
  saksofon: AudioLines,
  flet: Pipette, // a slim bore
  trabka: BellRing,
  klarnet: TestTube, // a tube with a bell
  wiolonczela: FileMusic,
  "harmonijka-ustna": GripHorizontal, // a row of holes
  akordeon: RadioReceiver,
  banjo: DiscAlbum,
  mandolina: ListMusic,
  keyboard: Radio,
  puzon: Bell,
  harfa: Headphones,
  organy: MonitorSpeaker,

  // Kuchnie świata
  "kuchnia-wloska": Pizza,
  "kuchnia-francuska": Croissant,
  "kuchnia-japonska": Soup,
  "kuchnia-chinska": CookingPot, // the wok
  "kuchnia-meksykanska": Sandwich,
  "kuchnia-indyjska": Salad,
  "kuchnia-tajska": Citrus,
  "kuchnia-hiszpanska": Wine,
  "kuchnia-grecka": Grape,
  "kuchnia-polska": Ham,
  "kuchnia-turecka": Coffee,
  "kuchnia-wietnamska": Leaf, // fresh herbs
  "kuchnia-koreanska": EggFried,
  "kuchnia-amerykanska": Beef,
  "kuchnia-libanska": Wheat,
  "kuchnia-marokanska": Drumstick,
  "kuchnia-brazylijska": Banana,
  "kuchnia-niemiecka": Cake,
  "kuchnia-wegierska": Carrot,
  "kuchnia-peruwianska": Cherry,
};

export function activityIcon(slug: string, category: string): LucideIcon {
  return SLUG_ICONS[slug] ?? CATEGORY_ICONS[category] ?? HelpCircle;
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
