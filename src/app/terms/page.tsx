import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLocale } from "@/lib/i18n/server";
import { termsFor, TERMS_UPDATED } from "@/lib/legal/terms";

export const dynamic = "force-dynamic";

// Indexable now that this is a real document rather than a placeholder. The old
// `robots: { index: false }` said "nothing here is worth indexing yet" — that
// reason is gone, and terms are exactly what someone reads before signing up.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { terms } = termsFor(locale);
  return {
    title: terms.title,
    alternates: { canonical: "/terms" },
  };
}

/**
 * The terms of service. Public (see PUBLIC_PATHS in src/proxy.ts) and linked from
 * the landing footer and the sign-up form, so nobody has to accept them unread.
 *
 * Content lives in lib/legal/terms.ts, together with the audit that every factual
 * claim in it traces back to. Read that before changing a word here: the terms
 * describe what the code does, so editing the code can make them false.
 */
export default async function TermsPage() {
  const locale = await getLocale();
  const { terms, fellBack } = termsFor(locale);

  return (
    <div className="mx-auto max-w-[720px] px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-[-0.5px] text-neutral-900">{terms.title}</h1>

      <p className="mt-3 text-[13px] text-neutral-500">
        {terms.updatedLabel}: {TERMS_UPDATED}
      </p>

      {fellBack && (
        <p className="rounded-card mt-6 border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] text-neutral-600">
          These terms are not translated into your language yet, so they are shown in English. The
          Polish and English versions are the authoritative ones.
        </p>
      )}

      {terms.intro.map((paragraph) => (
        <p key={paragraph} className="mt-5 text-[15px] leading-relaxed text-neutral-800">
          {paragraph}
        </p>
      ))}

      {terms.sections.map((section) => (
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

      {/* Section 8 hands anything about personal data to the policy, so the reader
          has to be able to get there without hunting for it. */}
      <p className="mt-10 text-[15px] leading-relaxed">
        <Link href="/privacy" className="text-violet-600 hover:underline">
          {locale === "pl" ? "Polityka prywatności" : "Privacy Policy"}
        </Link>
      </p>

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
