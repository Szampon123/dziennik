import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLocale } from "@/lib/i18n/server";
import { policyFor, PRIVACY_UPDATED } from "@/lib/legal/privacy";

export const dynamic = "force-dynamic";

// Indexable now that this is a real policy rather than a placeholder. The
// previous `robots: { index: false }` was there only because the page was a stub
// ("nothing here is worth indexing yet") — that reason is gone, and a privacy
// policy is exactly the sort of page a person expects to find by searching for it.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { policy } = policyFor(locale);
  return {
    title: policy.title,
    alternates: { canonical: "/privacy" },
  };
}

/**
 * The privacy policy. Public (see PUBLIC_PATHS in src/proxy.ts) and reachable
 * both from the landing footer and from Settings, so a signed-in user can find
 * it without logging out.
 *
 * Content lives in lib/legal/privacy.ts, together with the audit that every
 * claim in it traces back to. Read that before changing a word here: the policy
 * describes what the code does, so editing the code can make the policy false.
 */
export default async function PrivacyPage() {
  const locale = await getLocale();
  const { policy, fellBack } = policyFor(locale);

  return (
    <div className="mx-auto max-w-[720px] px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-[-0.5px] text-neutral-900">{policy.title}</h1>

      <p className="mt-3 text-[13px] text-neutral-500">
        {policy.updatedLabel}: {PRIVACY_UPDATED}
      </p>

      {fellBack && (
        <p className="mt-6 rounded-card border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] text-neutral-600">
          This policy is not translated into your language yet, so it is shown in English. The
          Polish and English versions are the authoritative ones.
        </p>
      )}

      {policy.intro.map((paragraph) => (
        <p key={paragraph} className="mt-5 text-[15px] leading-relaxed text-neutral-800">
          {paragraph}
        </p>
      ))}

      {policy.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-lg font-semibold tracking-[-0.2px] text-neutral-900">
            {section.heading}
          </h2>

          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-[15px] leading-relaxed text-neutral-800">
              {paragraph}
            </p>
          ))}

          {section.bullets && (
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed text-neutral-800">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <Link
        href="/"
        className="group mt-12 inline-flex items-center gap-1 text-sm text-violet-600 hover:underline"
      >
        <ArrowLeft aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        {locale === "pl" ? "Powrót na stronę główną" : "Back to home"}
      </Link>
    </div>
  );
}
