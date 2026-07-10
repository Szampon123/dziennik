import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup",
  // Behind the auth gate and useless to a crawler.
  robots: { index: false, follow: false },
};

/**
 * The wizard supplies its own frame. The root layout already skips the app Nav
 * and the 760px container for anything under /onboarding (it reads the proxy's
 * x-pathname header), so this only needs to fill the height.
 */
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-full flex-1 flex-col bg-neutral-50">{children}</div>;
}
