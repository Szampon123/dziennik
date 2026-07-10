import Image from "next/image";
import type { ReactNode } from "react";

// Colours here are brand-ink / white / brand-violet, never the neutral-* or
// violet-* tokens the app uses: those are CSS variables that flip inside .dark,
// and a visitor browsing with a dark OS must still see the light sections light.
// See the brand-* block in globals.css.

/**
 * A real screenshot of the app, captured at 1440x900 (16:10) from a demo
 * account — see scripts/demo-seed.mjs. Sized to the slot rather than intrinsic
 * dimensions, so the row's height never depends on the image loading.
 */
function Screenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-ink/10 shadow-[0_12px_40px_-12px_rgba(10,10,10,0.25)]">
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={900}
        // Below lg the rows stack, so the image spans the container; above it
        // each row is half the 1100px grid.
        sizes="(max-width: 1024px) 100vw, 550px"
        className="aspect-[16/10] w-full object-cover"
      />
    </div>
  );
}

export type FeatureAccent =
  | { kind: "tags"; items: readonly string[] }
  | { kind: "dots"; items: readonly { color: string; label: string }[] };

function Accent({ accent }: { accent: FeatureAccent }) {
  if (accent.kind === "tags") {
    return (
      <ul className="mt-7 flex flex-wrap gap-2">
        {accent.items.map((item) => (
          <li
            key={item}
            className="rounded-full bg-brand-violet/10 px-3 py-1.5 text-[13px] font-medium text-brand-violet-strong"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="mt-7 flex flex-wrap items-center gap-4">
      {accent.items.map(({ color, label }) => (
        <li key={label} className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[13px] font-medium text-brand-ink/60">{label}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * One marketing row. `imageSide` only takes effect from `lg` up — below that
 * every row stacks image-then-text, so the reading order never depends on the
 * viewport.
 */
export function FeatureSection({
  title,
  body,
  image,
  imageSide,
  accent,
}: {
  title: ReactNode;
  body: string;
  image: { src: string; alt: string };
  imageSide: "left" | "right";
  accent: FeatureAccent;
}) {
  return (
    <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-6 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">
      <div className={imageSide === "right" ? "lg:order-2" : "lg:order-1"}>
        <Screenshot src={image.src} alt={image.alt} />
      </div>

      <div className={imageSide === "right" ? "lg:order-1" : "lg:order-2"}>
        <h2 className="text-balance text-3xl font-bold leading-[1.15] tracking-[-1px] text-brand-ink sm:text-4xl">
          {title}
        </h2>
        <p className="mt-5 text-pretty text-base leading-relaxed text-brand-ink/65 sm:text-lg">
          {body}
        </p>
        <Accent accent={accent} />
      </div>
    </div>
  );
}
