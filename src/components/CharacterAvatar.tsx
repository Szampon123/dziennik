// The Dudu doodle — a very simple hand-drawn blob whose form grows with the
// stage (0 = "Iskra" egg, 7 = "Legenda"). Colours use theme CSS vars so the
// character adapts to every theme (light/dark/colorful/custom).
import { DUDU_COLORS, normalizeDuduColor, type DuduColor } from "@/lib/dudu";

export function CharacterAvatar({
  stage,
  size = 104,
  className = "",
  color,
}: {
  stage: number;
  size?: number;
  className?: string;
  color?: DuduColor | string;
}) {
  const outline = "var(--neutral-900)";
  const palette = DUDU_COLORS[normalizeDuduColor(color)];
  const body = palette.body;
  const accent = palette.accent;

  // Stage 0 — an unhatched spark/egg (no face yet).
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
  const showSprout = stage >= 1 && stage < 6; // replaced by the crown later
  const showBlush = stage >= 3;
  const bigSmile = stage >= 3;
  const showHeadband = stage >= 4;
  const showCape = stage >= 5;
  const showCrown = stage >= 6;
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
      </g>
    </svg>
  );
}
