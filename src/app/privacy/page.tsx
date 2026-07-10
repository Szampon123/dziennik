import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  // A stub, not a policy — nothing here is worth indexing yet.
  robots: { index: false, follow: false },
};

// Placeholder so the landing-page footer links somewhere real. Reachable signed
// out (see PUBLIC_PATHS in src/proxy.ts); replace with the actual policy.
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[680px] px-6 py-20">
      <h1 className="text-3xl font-bold tracking-[-0.5px] text-neutral-900">Privacy</h1>
      <p className="mt-5 text-[15px] leading-relaxed text-neutral-600">
        The privacy policy is being written. Until it is published here, the short version: your
        journal entries, habits and notes are yours, they are scoped to your account, and they are
        never shared with anyone else.
      </p>
      <Link href="/" className="mt-8 inline-block text-sm text-violet-600 hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
