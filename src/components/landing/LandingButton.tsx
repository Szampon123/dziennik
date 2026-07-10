import Link from "next/link";

// The app's Button is sized for dense forms (min-h-10, 14px text) and its
// violet flips in dark mode. The landing page needs a pill CTA that reads the
// same for every visitor, so it gets its own — see the brand-* tokens in
// globals.css for why the colour is not `violet-600`.
const BASE =
  "inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-semibold " +
  "transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-brand-violet";

const VARIANTS = {
  primary: "bg-brand-violet text-white hover:bg-brand-violet-strong focus-visible:ring-offset-black",
  onLight:
    "bg-brand-violet text-white hover:bg-brand-violet-strong focus-visible:ring-offset-white",
} as const;

export function LandingButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  return (
    <Link href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
      {children}
    </Link>
  );
}
