// The Dudu doodle — a very simple hand-drawn blob whose form grows with the
// stage (0 = "Iskra" egg, 7 = "Legenda"). Colours use theme CSS vars so the
// character adapts to every theme (light/dark/colorful/custom). On top of the
// stage form the user can dress it up: 7 accessory slots (hat, glasses, outfit,
// pants, shoes, held item, background) — see src/lib/dudu.ts.
import type { ReactNode } from "react";
import {
  DUDU_COLORS,
  normalizeDuduColor,
  normalizeDuduConfig,
  type DuduColor,
  type DuduConfig,
} from "@/lib/dudu";

export function CharacterAvatar({
  stage,
  size = 104,
  className = "",
  color,
  config,
}: {
  stage: number;
  size?: number;
  className?: string;
  color?: DuduColor | string;
  config?: DuduConfig | string | null;
}) {
  const outline = "var(--neutral-900)";
  const palette = DUDU_COLORS[normalizeDuduColor(color)];
  const body = palette.body;
  const accent = palette.accent;
  const cfg = normalizeDuduConfig(config ?? undefined);

  const background = renderBackground(cfg.background);

  // Stage 0 — an unhatched spark/egg (no face or outfit yet).
  if (stage <= 0) {
    return (
      <svg
        viewBox="0 0 120 140"
        width={size}
        height={(size * 140) / 120}
        className={className}
        role="img"
        aria-label="Iskra — postać jeszcze się nie wykluła"
        fill="none"
      >
        {background}
        <ellipse cx="60" cy="82" rx="26" ry="30" fill={body} stroke={outline} strokeWidth="3.2" />
        <path
          d="M60 30 L60 44 M52 37 L68 37"
          stroke="var(--azure-500)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const scale = Math.min(1, 0.86 + stage * 0.02);
  const hasHat = cfg.hat !== "none";
  const showSprout = stage >= 1 && stage < 6 && !hasHat; // replaced by the crown/hat later
  const showBlush = stage >= 3;
  const bigSmile = stage >= 3;
  const showHeadband = stage >= 4 && cfg.hat === "none"; // headband clashes with hats
  const showCape = stage >= 5;
  const showCrown = stage >= 6 && !hasHat;
  const showSparkles = stage >= 7;

  return (
    <svg
      viewBox="0 0 120 140"
      width={size}
      height={(size * 140) / 120}
      className={className}
      role="img"
      aria-label={`Dudu — forma ${stage + 1} z ${8}`}
      fill="none"
    >
      {background}
      <g transform={`translate(60 88) scale(${scale}) translate(-60 -88)`}>
        {showSparkles && (
          <g fill="var(--azure-500)">
            <path d="M16 44 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z" />
            <path d="M104 34 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5z" />
            <path d="M98 74 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" />
          </g>
        )}

        {showCape && (
          <path
            d="M42 66 L28 122 L60 110 L92 122 L78 66 Z"
            fill={accent}
            stroke={outline}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        )}

        {/* Arms */}
        <path
          d="M26 88 C 16 90, 12 98, 12 105"
          stroke={outline}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M94 88 C 104 90, 108 98, 108 105"
          stroke={outline}
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Legs */}
        <path d="M49 118 L47 133" stroke={outline} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M71 118 L73 133" stroke={outline} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M40 133 L49 133" stroke={outline} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M71 133 L80 133" stroke={outline} strokeWidth="3.2" strokeLinecap="round" />

        {showSprout && (
          <g>
            <path d="M60 40 L60 26" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" />
            <ellipse
              cx="67"
              cy="25"
              rx="7"
              ry="4"
              fill="var(--success)"
              transform="rotate(-25 67 25)"
            />
          </g>
        )}

        {/* Body blob */}
        <path
          d="M60 38 C 90 38, 100 60, 98 84 C 96 108, 80 120, 60 120 C 40 120, 24 108, 22 84 C 20 60, 30 38, 60 38 Z"
          fill={body}
          stroke={outline}
          strokeWidth="3.2"
        />

        {/* Pants + shoes sit over the lower body / legs */}
        {renderPants(cfg.pants, outline, accent)}
        {renderShoes(cfg.shoes, outline, accent, body)}

        {/* Outfit on the torso */}
        {renderOutfit(cfg.outfit, outline, accent)}

        {showBlush && (
          <g fill="#f4a6c0" opacity="0.75">
            <ellipse cx="38" cy="94" rx="6" ry="3.5" />
            <ellipse cx="82" cy="94" rx="6" ry="3.5" />
          </g>
        )}

        {showHeadband && (
          <g>
            <path
              d="M23 73 Q 60 68, 97 73"
              stroke={accent}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M97 73 l9 -4 M97 73 l8 5"
              stroke={accent}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Eyes */}
        <circle cx="49" cy="84" r="3.6" fill={outline} />
        <circle cx="71" cy="84" r="3.6" fill={outline} />

        {/* Glasses over the eyes */}
        {renderGlasses(cfg.glasses, outline)}

        {/* Mouth */}
        <path
          d={bigSmile ? "M47 96 Q 60 110, 73 96" : "M51 97 Q 60 104, 69 97"}
          stroke={outline}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {showCrown && (
          <path
            d="M41 40 L45 26 L53 35 L60 23 L67 35 L75 26 L79 40 Z"
            fill="var(--warning)"
            stroke={outline}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}

        {/* Hat on top of everything on the head */}
        {renderHat(cfg.hat, outline, accent, body)}

        {/* Held item near the right hand, in front */}
        {renderItem(cfg.item, outline, accent)}
      </g>
    </svg>
  );
}

// ---------- Accessory renderers (doodle style, 120x140 space) ----------

function renderBackground(id: string): ReactNode {
  if (id === "dots") {
    return (
      <g fill="var(--neutral-200)">
        {[
          [14, 24],
          [104, 20],
          [24, 60],
          [98, 58],
          [12, 100],
          [108, 96],
          [30, 128],
          [92, 130],
          [60, 12],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" />
        ))}
      </g>
    );
  }
  if (id === "rays") {
    return (
      <g stroke="var(--neutral-200)" strokeWidth="6" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          const x1 = 60 + Math.cos(a) * 40;
          const y1 = 70 + Math.sin(a) * 40;
          const x2 = 60 + Math.cos(a) * 66;
          const y2 = 70 + Math.sin(a) * 66;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
    );
  }
  if (id === "stars") {
    return (
      <g fill="var(--azure-300)">
        {[
          [16, 20],
          [102, 26],
          [22, 116],
          [100, 110],
          [58, 8],
        ].map(([x, y], i) => (
          <path
            key={i}
            transform={`translate(${x} ${y})`}
            d="M0 -6 L1.8 -1.8 6 -1.8 2.4 1.4 3.6 6 0 3 -3.6 6 -2.4 1.4 -6 -1.8 -1.8 -1.8z"
          />
        ))}
      </g>
    );
  }
  return null;
}

function renderHat(id: string, outline: string, accent: string, body: string): ReactNode {
  switch (id) {
    case "beanie":
      return (
        <g stroke={outline} strokeWidth="2.6" strokeLinejoin="round">
          <path d="M33 45 Q 60 12, 87 45 Z" fill={accent} />
          <path d="M31 45 Q 60 53, 89 45" fill="none" strokeWidth="5" stroke={accent} />
          <path d="M31 45 Q 60 53, 89 45" fill="none" />
          <circle cx="60" cy="14" r="5" fill={body} />
        </g>
      );
    case "tophat":
      return (
        <g stroke={outline} strokeWidth="2.6" strokeLinejoin="round">
          <ellipse cx="60" cy="45" rx="30" ry="6" fill={accent} />
          <rect x="44" y="16" width="32" height="29" rx="2" fill={accent} />
          <rect x="44" y="36" width="32" height="5" fill={body} stroke="none" />
        </g>
      );
    case "straw":
      return (
        <g stroke={outline} strokeWidth="2.6" strokeLinejoin="round">
          <ellipse cx="60" cy="46" rx="34" ry="7" fill="var(--warning)" />
          <ellipse cx="60" cy="35" rx="18" ry="13" fill="var(--warning)" />
          <path d="M43 45 Q 60 40, 77 45" fill="none" stroke={accent} strokeWidth="3" />
        </g>
      );
    case "wizard":
      return (
        <g stroke={outline} strokeWidth="2.6" strokeLinejoin="round">
          <path d="M60 4 L43 46 L77 46 Z" fill={accent} />
          <g fill="var(--warning)" stroke="none">
            <circle cx="60" cy="24" r="2.4" />
            <circle cx="55" cy="36" r="2" />
            <circle cx="66" cy="34" r="2" />
          </g>
        </g>
      );
    case "party":
      return (
        <g stroke={outline} strokeWidth="2.4" strokeLinejoin="round">
          <path d="M60 8 L47 45 L73 45 Z" fill={accent} />
          <path d="M50 38 L70 38 M52 30 L68 30" stroke={body} strokeWidth="3" />
          <circle cx="60" cy="8" r="4" fill="var(--warning)" stroke="none" />
        </g>
      );
    default:
      return null;
  }
}

function renderGlasses(id: string, outline: string): ReactNode {
  switch (id) {
    case "round":
      return (
        <g stroke={outline} strokeWidth="2.4" fill="none">
          <circle cx="49" cy="84" r="8" />
          <circle cx="71" cy="84" r="8" />
          <path d="M57 84 L63 84 M41 82 L34 80 M79 82 L86 80" strokeLinecap="round" />
        </g>
      );
    case "sun":
      return (
        <g stroke={outline} strokeWidth="2.4" strokeLinejoin="round">
          <path d="M41 79 h16 v6 q -8 6, -16 0 z" fill={outline} />
          <path d="M63 79 h16 v6 q -8 6, -16 0 z" fill={outline} />
          <path d="M57 81 L63 81 M41 80 L34 78 M79 80 L86 78" fill="none" strokeLinecap="round" />
        </g>
      );
    case "nerd":
      return (
        <g stroke={outline} strokeWidth="2.8" fill="none">
          <rect x="41" y="77" width="16" height="14" rx="2" />
          <rect x="63" y="77" width="16" height="14" rx="2" />
          <path d="M57 82 L63 82" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M41 80 L34 79 M79 80 L86 79" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

function renderOutfit(id: string, outline: string, accent: string): ReactNode {
  switch (id) {
    case "shirt":
      return (
        <path
          d="M40 106 Q 60 100, 80 106 L 78 119 Q 60 124, 42 119 Z"
          fill={accent}
          stroke={outline}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      );
    case "tie":
      return (
        <g stroke={outline} strokeWidth="2" strokeLinejoin="round">
          <path d="M55 101 L65 101 L62 106 L64 118 L60 122 L56 118 L58 106 Z" fill={accent} />
        </g>
      );
    case "bowtie":
      return (
        <g stroke={outline} strokeWidth="2" strokeLinejoin="round" fill={accent}>
          <path d="M60 104 L50 99 L50 111 Z" />
          <path d="M60 104 L70 99 L70 111 Z" />
          <rect x="57" y="101" width="6" height="7" rx="1.5" />
        </g>
      );
    case "scarf":
      return (
        <g stroke={outline} strokeWidth="2.2" strokeLinejoin="round">
          <path d="M40 102 Q 60 110, 80 102 L 80 108 Q 60 116, 40 108 Z" fill={accent} />
          <rect x="72" y="106" width="8" height="16" rx="2" fill={accent} />
        </g>
      );
    default:
      return null;
  }
}

function renderPants(id: string, outline: string, accent: string): ReactNode {
  const fill = id === "jeans" ? "var(--azure-500)" : accent;
  if (id === "none") return null;
  if (id === "shorts") {
    return (
      <path
        d="M45 114 L75 114 L74 124 L63 124 L60 118 L57 124 L46 124 Z"
        fill={fill}
        stroke={outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    );
  }
  // long / jeans — cover the legs down to the ankles
  return (
    <g fill={fill} stroke={outline} strokeWidth="2.4" strokeLinejoin="round">
      <path d="M44 114 L76 114 L75 120 L62 120 L60 116 L58 120 L45 120 Z" />
      <rect x="44" y="118" width="9" height="15" rx="2" />
      <rect x="67" y="118" width="9" height="15" rx="2" />
      {id === "jeans" && (
        <path d="M48.5 120 L48.5 131 M71.5 120 L71.5 131" stroke="var(--azure-100)" strokeWidth="1.4" />
      )}
    </g>
  );
}

function renderShoes(id: string, outline: string, accent: string, body: string): ReactNode {
  if (id === "none") return null;
  if (id === "boots") {
    return (
      <g fill={accent} stroke={outline} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M43 122 L52 122 L52 131 L57 131 L57 136 L43 136 Z" />
        <path d="M68 122 L77 122 L77 131 L63 131 L63 136 L68 136 Z" />
      </g>
    );
  }
  // sneakers
  return (
    <g stroke={outline} strokeWidth="2.4" strokeLinejoin="round">
      <path d="M38 130 L50 130 L54 136 L38 136 Z" fill={body} />
      <path d="M70 130 L82 130 L82 136 L66 136 Z" fill={body} />
      <path d="M38 136 L54 136 M66 136 L82 136" stroke={accent} strokeWidth="3" />
    </g>
  );
}

function renderItem(id: string, outline: string, accent: string): ReactNode {
  switch (id) {
    case "book":
      return (
        <g stroke={outline} strokeWidth="2.2" strokeLinejoin="round">
          <rect x="100" y="98" width="17" height="13" rx="1.5" fill={accent} />
          <path d="M108.5 99 L108.5 110" stroke={outline} strokeWidth="1.6" />
        </g>
      );
    case "dumbbell":
      return (
        <g stroke={outline} strokeWidth="2.2">
          <path d="M101 104 L117 104" strokeWidth="3" strokeLinecap="round" />
          <rect x="98" y="99" width="6" height="10" rx="1.5" fill={accent} />
          <rect x="114" y="99" width="6" height="10" rx="1.5" fill={accent} />
        </g>
      );
    case "brush":
      return (
        <g stroke={outline} strokeWidth="2" strokeLinejoin="round">
          <path d="M118 92 L104 106" stroke="var(--warning)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M104 106 L99 111 L101 103 Z" fill={accent} />
        </g>
      );
    case "balloon":
      return (
        <g stroke={outline} strokeWidth="2.2">
          <path d="M110 70 L108 104" fill="none" strokeWidth="1.4" strokeLinecap="round" />
          <ellipse cx="110" cy="60" rx="12" ry="14" fill={accent} />
          <path d="M110 74 L107 78 L113 78 Z" fill={accent} strokeLinejoin="round" />
        </g>
      );
    default:
      return null;
  }
}
