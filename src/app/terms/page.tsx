import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  // A stub, not terms of service — nothing here is worth indexing yet.
  robots: { index: false, follow: false },
};

// Placeholder so the landing-page footer links somewhere real. Reachable signed
// out (see PUBLIC_PATHS in src/proxy.ts); replace with the actual terms.
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[680px] px-6 py-20">
      <h1 className="text-3xl font-bold tracking-[-0.5px] text-neutral-900">Terms</h1>
      <p className="mt-5 text-[15px] leading-relaxed text-neutral-600">
        The terms of service are being written and will be published here before the app is opened
        to the public.
      </p>
      <Link href="/" className="mt-8 inline-block text-sm text-violet-600 hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
