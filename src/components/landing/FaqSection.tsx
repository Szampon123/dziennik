/**
 * The FAQ, and the FAQPage structured data Google reads, from one array.
 *
 * Every claim below is checked against the code, not the pitch:
 *  - "add it to your home screen"  — app/manifest.ts declares display: "standalone".
 *  - "English, Polish, German, Spanish" — LOCALES in lib/i18n/config.ts.
 *  - "made up on Wednesday"        — habits are weekly-goal based, not daily streaks.
 *  - "only the forum is shared"    — forum posts are queried by activity + level with
 *                                    no user scoping; everything else is scoped to the
 *                                    owner's userId.
 *  - "No ads"                      — no analytics or ad script anywhere in src/.
 *  - "email and password"          — the Credentials provider in lib/auth.ts; Google,
 *                                    Calendar and Notion are all optional.
 * If any of those change, the answer here is now a lie. Re-check before editing.
 *
 * Answers are plain strings, deliberately: the UI renders them and the JSON-LD
 * embeds them verbatim, so the two cannot drift apart. Keep them prose — no JSX,
 * no markup — or the schema will carry tags.
 */
const FAQ_ITEMS = [
  {
    question: "How much does it cost?",
    answer:
      "Vincendio is completely free — all 138 activities, journaling, habit tracking, and the " +
      "community forum. No locked features, no credit card.",
  },
  {
    question: "Does it work on my phone?",
    answer:
      "Yes. Vincendio runs in any browser on any device. On your phone you can add it to your " +
      "home screen and use it like an app.",
  },
  {
    question: "Is my journal private?",
    answer:
      "Yes. Your journal, habits, and progress are visible only to you. The only shared space is " +
      "the community forum, where you choose what to post. No ads, and your data is never sold.",
  },
  {
    question: "What happens if I miss a day?",
    answer:
      "Nothing breaks. Habits use weekly goals, so a missed Monday can be made up on Wednesday. " +
      "The system is built to survive real life, not punish you for it.",
  },
  {
    question: "Where do the 99 levels come from?",
    answer:
      "Every ladder is hand-crafted from real progression data for that skill — from couch-to-5k " +
      "plans to piano repertoire — not generated XP curves.",
  },
  {
    question: "Do I need a Google account?",
    answer:
      "No. You can sign up with just an email and password. Google sign-in, Google Calendar, and " +
      "Notion sync are optional extras.",
  },
  {
    question: "What languages does it support?",
    answer: "The app is available in English, Polish, German, and Spanish.",
  },
] as const;

/** https://schema.org/FAQPage — one Question per entry, each with its acceptedAnswer. */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export function FaqSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[820px] px-6 py-20 sm:px-8 sm:py-28">
        <h2 className="text-center text-3xl font-bold tracking-[-1px] text-brand-ink sm:text-4xl">
          Questions? Answers.
        </h2>

        {/* Native <details>: the accordion works with zero client JS, and <summary>
            is focusable and Enter/Space-toggleable for free. Same trick as UserMenu. */}
        <div className="mt-14 flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-card border border-neutral-200 bg-white px-5 open:border-neutral-300 sm:px-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-[17px] font-semibold text-brand-ink outline-none focus-visible:ring-2 focus-visible:ring-violet-200 [&::-webkit-details-marker]:hidden">
                {item.question}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 shrink-0 text-brand-ink/40 transition-transform duration-200 group-open:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="pb-5 pr-9 text-pretty text-[15px] leading-relaxed text-brand-ink/65">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        // The value is a JSON.stringify of a literal we control — no user input
        // reaches it, so there is nothing here to escape.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
