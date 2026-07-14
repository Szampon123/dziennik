/**
 * The privacy policy, as content rather than UI strings.
 *
 * NOT LEGAL ADVICE. This is a draft written by an AI from an audit of this
 * codebase. It describes what the code demonstrably does, but it has not been
 * reviewed by a lawyer. Before onboarding users at any scale, have someone who
 * does GDPR professionally read it — particularly the transfers section, which
 * is the weakest part (see PRIVACY_AUDIT below).
 *
 * Kept out of lib/i18n/messages.ts on purpose: that file is UI strings, and a
 * legal document is prose. Locale selection happens in app/privacy/page.tsx.
 * Polish is the source; English is the translation. DE and ES fall back to
 * English, and the page says so rather than pretending otherwise.
 *
 * ─── PRIVACY_AUDIT (2026-07-13) — every claim below traces to code ───────────
 *  Personal data ....... prisma/schema.prisma: User (email, name, passwordHash,
 *                        dudu*, notionToken), DayEntry (morningIntent,
 *                        reflection*, dayRating, energyLevel, todosJson), Note,
 *                        MilestoneEntry (note, photoPath), Workout, Habit,
 *                        HabitCheck, ForumPost (body, photoPath), ForumVote,
 *                        FavoriteQuote/Activity, CalendarEventCheck, OAuthToken,
 *                        Account, Session, RoleChange.
 *  Cookies ............. Auth.js session/csrf/callback-url (essential) +
 *                        `locale` (LOCALE_COOKIE, i18n/config.ts). Nothing else.
 *  localStorage ........ "theme", "customTheme" — device-local, never sent.
 *  Analytics / ads ..... NONE. No gtag/GA/Plausible/PostHog/ad script in src/.
 *  Processors .......... Vercel (hosting + Blob photos), Neon (Postgres),
 *                        Upstash (rate-limit counters), Resend (lib/email.ts —
 *                        transactional mail), Google (optional), Notion (optional).
 *  IP addresses ........ lib/client-ip.ts reads x-forwarded-for; used as part of
 *                        a rate-limit key in Upstash (rl:login:ip:<ip>), expiring
 *                        with the window (15 min / 1 h). Stored nowhere else by us.
 *  Regions ............. All storage and processing is in the EU:
 *                          Neon (Postgres) ...... eu-central-1, Frankfurt
 *                          Vercel functions ..... fra1, Frankfurt — pinned in
 *                            vercel.json; confirmed live via X-Vercel-Id
 *                            (`arn1::fra1::…`). Was iad1 (US) until 2026-07-13.
 *                          Vercel Blob (photos) . fra1, Frankfurt
 *                          Upstash (rate limits)  eu-central-1, Frankfurt
 *                        Upstash and Blob regions were reported by the owner from
 *                        the provider dashboards — they cannot be read from here,
 *                        as both credentials are marked Sensitive in Vercel.
 *                        Resend (transactional e-mail) is US infrastructure and is
 *                        NOT optional — every user gets a verification mail — so it
 *                        is the one transfer that touches everybody. It receives the
 *                        address and the link, never journal content.
 *  Retention ........... Nothing is auto-deleted except VerificationToken and
 *                        PasswordResetToken, which carry expiry columns.
 *  Account deletion .... Self-service, in Settings — actions/delete-account.ts.
 *                        Revokes the Google grant, deletes the Blob photos, then
 *                        deletes the User (the cascade covers every table that
 *                        references it; VerificationToken is keyed on the e-mail
 *                        string with no FK, so it is deleted explicitly).
 *                        Immediate, no grace period. The owner is refused: the
 *                        role is re-granted from OWNER_EMAIL on the next sign-in,
 *                        so deleting would only destroy their journal.
 *                        Other users' replies to a deleted user's forum posts
 *                        SURVIVE — ForumPost.parent is onDelete: SetNull, so an
 *                        orphaned reply is promoted to a top-level post rather
 *                        than being cascaded away. Deleting somebody's account
 *                        must not delete somebody else's words.
 *  Data export ......... Self-service, in Settings — app/api/export/route.ts and
 *                        lib/export.ts. One JSON file, everything the user wrote,
 *                        rate-limited to 3/h. Excludes passwordHash, the Auth.js
 *                        Account/Session rows, OAuthToken, notionToken and the
 *                        RoleChange log (the last names the admin who acted, which
 *                        is another user's data). Photos are referenced by URL, not
 *                        embedded — the file alone is therefore not a complete
 *                        archive, and section 7 says so. The e-mail channel stays
 *                        as the fallback it now is, rather than the only route.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { documentFor, type LegalDocument, type LegalSection } from "@/lib/legal/document";

export const PRIVACY_UPDATED = "2026-07-14";

/**
 * The data controller.
 *
 * DELIBERATE COMPROMISE, AND ITEM #1 FOR THE LEGAL REVIEW. The GDPR expects a
 * controller to be *identifiable* — a named natural person or a registered
 * entity, normally with an address. "The operator of Vincendio" is neither: it
 * names a role, not a subject. It is used here as a stopgap while the business
 * is unregistered, on the reasoning that a monitored contact address is what
 * actually lets a user exercise their rights, and that address is real.
 *
 * Replace this with the registered entity's details (legal name, registration
 * number, address) as soon as the business exists. Until then, this is the
 * weakest clause in the document, and the first thing to raise with a lawyer.
 *
 * The e-mail is load-bearing regardless: sections 7 and 8 promise erasure,
 * access and export *by hand* through it. If it stops being monitored, the
 * policy becomes a false statement rather than merely a stale one.
 */
export const CONTROLLER_NAME = {
  pl: "operator serwisu Vincendio",
  en: "the operator of Vincendio",
} as const;

export const CONTROLLER_EMAIL = "contact@vincendio.com";

// The shape and the language rule are shared with the terms of service — see
// lib/legal/document.ts. These aliases keep the names this file already used.
export type PolicySection = LegalSection;
export type Policy = LegalDocument;

const pl: Policy = {
  title: "Polityka prywatności",
  updatedLabel: "Ostatnia aktualizacja",
  intro: [
    "Vincendio to dziennik osobisty. Wpisujesz tu rzeczy prywatne — refleksje, nastrój, " +
      "postępy. Traktujemy to poważnie, więc poniżej opisujemy dokładnie, jakie dane " +
      "przechowujemy, po co i komu je powierzamy. Bez prawniczego żargonu tam, gdzie da się " +
      "go uniknąć.",
    "Krótka wersja: Twój dziennik widzisz tylko Ty. Nie sprzedajemy danych, nie wyświetlamy " +
      "reklam i nie używamy analityki reklamowej ani śledzącej.",
  ],
  sections: [
    {
      heading: "1. Kto jest administratorem danych",
      paragraphs: [
        `Administratorem Twoich danych jest ${CONTROLLER_NAME.pl}. W sprawach dotyczących ` +
          `danych osobowych napisz na: ${CONTROLLER_EMAIL}. Odpowiadamy na każde zgłoszenie.`,
      ],
    },
    {
      heading: "2. Jakie dane zbieramy",
      paragraphs: ["Zbieramy tylko to, co jest potrzebne, żeby aplikacja działała:"],
      bullets: [
        "Dane konta: adres e-mail, opcjonalnie imię, oraz hash hasła (nigdy samo hasło — " +
          "przechowujemy wyłącznie nieodwracalny skrót).",
        "Treści dziennika: poranne intencje, priorytety, zadania, notatki, wieczorne " +
          "refleksje, ocena dnia i poziom energii.",
        "Postępy: ukończone kamienie milowe wraz z Twoimi notatkami i zdjęciami-dowodami, " +
          "wpisy treningowe (dystans, czas), nawyki i ich odhaczenia, ulubione aktywności i cytaty.",
        "Posty na forum: treść, opcjonalne zdjęcie i link, oraz Twoje głosy. To jedyna część " +
          "aplikacji widoczna dla innych zalogowanych użytkowników.",
        "Tokeny integracji: token Google (jeśli podłączysz Kalendarz) i token Notion (jeśli " +
          "podłączysz Notion). Podłączasz je sam i możesz je w każdej chwili odpiąć.",
        "Adres IP: przy próbach logowania, rejestracji i resetu hasła — wyłącznie po to, żeby " +
          "ograniczyć liczbę prób i chronić konta przed atakami. Szczegóły w sekcji 5.",
        "Ustawienia: motyw i język interfejsu.",
      ],
    },
    {
      heading: "3. Po co i na jakiej podstawie prawnej",
      bullets: [
        "Wykonanie umowy (art. 6 ust. 1 lit. b RODO) — żeby w ogóle świadczyć usługę: " +
          "prowadzić Twoje konto, zapisywać dziennik, liczyć postępy i pokazywać forum.",
        "Uzasadniony interes (art. 6 ust. 1 lit. f RODO) — bezpieczeństwo: ograniczanie liczby " +
          "prób logowania, ochrona przed atakami i nadużyciami na forum.",
        "Zgoda (art. 6 ust. 1 lit. a RODO) — opcjonalne integracje: Kalendarz Google i Notion. " +
          "Podłączasz je świadomie i możesz cofnąć zgodę, odpinając je w Ustawieniach.",
      ],
    },
    {
      heading: "4. Komu powierzamy dane",
      paragraphs: [
        "Nie sprzedajemy danych i nie udostępniamy ich reklamodawcom. Korzystamy natomiast " +
          "z dostawców technicznych, bez których aplikacja nie mogłaby działać:",
      ],
      bullets: [
        "Vercel — hosting aplikacji oraz przechowywanie zdjęć (Vercel Blob).",
        "Neon — baza danych PostgreSQL, w której zapisany jest Twój dziennik.",
        "Upstash — liczniki prób logowania (przechowują adres IP na czas okna limitu).",
        "Resend — wysyłka e-maili technicznych: potwierdzenie adresu i reset hasła.",
        "Google — tylko jeśli logujesz się przez Google lub podłączysz Kalendarz.",
        "Notion — tylko jeśli sam podłączysz swoją przestrzeń Notion.",
      ],
    },
    {
      heading: "5. Adres IP i limity logowania",
      paragraphs: [
        "Przy logowaniu, rejestracji i resecie hasła zapisujemy Twój adres IP jako element " +
          "licznika prób (w Upstash). Dzięki temu ktoś, kto zgaduje hasła, zostaje zablokowany " +
          "po kilku próbach. Licznik wygasa automatycznie — po 15 minutach przy logowaniu, po " +
          "godzinie przy rejestracji i resecie hasła — i wtedy adres znika. Nie budujemy z niego " +
          "profilu i nie łączymy go z treścią Twojego dziennika.",
        "Niezależnie od tego nasz dostawca hostingu (Vercel) prowadzi własne logi serwerowe, " +
          "które również zawierają adresy IP, zgodnie z jego polityką.",
      ],
    },
    {
      heading: "6. Przekazywanie danych poza EOG",
      paragraphs: [
        "Twój dziennik nie opuszcza Unii Europejskiej. We Frankfurcie stoi baza danych " +
          "(eu-central-1), we Frankfurcie działają serwery obsługujące żądania aplikacji (fra1), " +
          "we Frankfurcie leżą też Twoje zdjęcia-dowody (Vercel Blob) i liczniki prób logowania " +
          "(Upstash). Wszystko, co piszesz i wgrywasz — wpisy, refleksje, nawyki, postępy, " +
          "zdjęcia — jest przechowywane i przetwarzane na terenie UE.",
        "Poza EOG trafiają tylko dwie rzeczy, i mówimy o nich wprost:",
      ],
      bullets: [
        "E-maile techniczne (potwierdzenie adresu, reset hasła) wysyłamy przez Resend, którego " +
          "infrastruktura jest amerykańska. Trafia tam Twój adres e-mail i treść samego linku — " +
          "nigdy treść dziennika. To jedyny transfer, który dotyczy każdego użytkownika.",
        "Integracje opcjonalne — Kalendarz Google i Notion — działają na infrastrukturze tych " +
          "firm. Dotyczy Cię to wyłącznie wtedy, gdy sam je podepniesz, i przestaje dotyczyć, " +
          "gdy je odepniesz.",
      ],
    },
    {
      heading: "6a. Podstawa tych transferów",
      paragraphs: [
        "Wymienieni dostawcy opierają przekazywanie danych na standardowych klauzulach umownych " +
          "(SCC) lub na programie Data Privacy Framework.",
        "Vercel i Neon są spółkami amerykańskimi, mimo że wybrane przez nas regiony " +
          "przetwarzania leżą w UE — teoretyczny dostęp spółki-matki opiera się na tych samych " +
          "podstawach prawnych.",
      ],
    },
    {
      heading: "7. Jak długo przechowujemy dane i jak je usunąć",
      paragraphs: [
        "Twoje dane przechowujemy tak długo, jak istnieje Twoje konto. Nic nie kasuje się " +
          "samo — dziennik z zeszłego roku ma zostać dziennikiem z zeszłego roku. Wyjątkiem są " +
          "tokeny weryfikacji adresu i resetu hasła, które wygasają automatycznie.",
        "Konto możesz usunąć sam, w Ustawieniach. Usunięcie jest natychmiastowe i trwałe: " +
          "znikają wszystkie Twoje dane — dziennik, nawyki, treningi, postępy, zdjęcia oraz " +
          "posty i odpowiedzi na forum. Cofamy też dostęp, którego udzieliłeś nam w Google. " +
          "Nie ma okresu karencji i nie zostaje nam kopia, którą moglibyśmy Ci oddać.",
        "Odpowiedzi innych użytkowników pod Twoimi postami na forum zostają — to ich treści, " +
          "nie Twoje, i nie mamy prawa ich kasować.",
        `Swoje dane pobierzesz sam, w Ustawieniach — przycisk „Pobierz moje dane" oddaje ` +
          `wszystko, co o Tobie przechowujemy, w jednym pliku JSON. Zdjęcia są w nim podlinkowane, ` +
          `a nie wklejone: pobierzesz je, będąc zalogowanym. Nie ma w nim haseł ani tokenów do ` +
          `Google i Notion — to nie są dane, które są Ci do czegokolwiek potrzebne, a plik z nimi ` +
          `byłby niebezpieczny do przechowywania.`,
        `Jeśli wolisz albo coś nie działa, napisz na ${CONTROLLER_EMAIL} — przekażemy kopię ` +
          `ręcznie. Na ten sam adres możesz też napisać w sprawie usunięcia konta, jeśli z ` +
          `jakiegoś powodu nie możesz zrobić tego sam.`,
        "Po usunięciu danych z bazy mogą one jeszcze przez pewien czas znajdować się w kopiach " +
          "zapasowych naszych dostawców, które rotują się zgodnie z ich własnymi cyklami.",
      ],
    },
    {
      heading: "8. Twoje prawa",
      paragraphs: [
        "Zgodnie z RODO masz prawo do: dostępu do swoich danych, ich sprostowania, usunięcia, " +
          "ograniczenia przetwarzania, przenoszenia danych oraz sprzeciwu wobec przetwarzania " +
          "opartego na uzasadnionym interesie.",
        `Żeby skorzystać z któregokolwiek z nich, napisz na ${CONTROLLER_EMAIL}. Masz też prawo ` +
          "wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (PUODO), jeśli uznasz, że " +
          "przetwarzamy Twoje dane niezgodnie z prawem.",
      ],
    },
    {
      heading: "9. Pliki cookies",
      paragraphs: [
        "Używamy wyłącznie plików cookies niezbędnych do działania serwisu:",
      ],
      bullets: [
        "Cookies sesji (Auth.js) — utrzymują Twoje zalogowanie i chronią przed atakami CSRF.",
        "Cookie „locale” — pamięta wybrany język interfejsu.",
      ],
    },
    {
      heading: "9a. Czego NIE używamy",
      paragraphs: [
        "Nie stosujemy cookies analitycznych ani marketingowych. W kodzie aplikacji nie ma " +
          "Google Analytics, pikseli reklamowych ani żadnych narzędzi śledzących. Dlatego nie " +
          "zobaczysz u nas bannera zgody na cookies — nie ma na co się zgadzać.",
        "Motyw kolorystyczny zapisujemy w pamięci lokalnej przeglądarki (localStorage). Te dane " +
          "nigdy nie opuszczają Twojego urządzenia.",
      ],
    },
    {
      heading: "10. Forum",
      paragraphs: [
        "Forum to jedyna część Vincendio widoczna dla innych. Twoje posty, zdjęcia i linki, " +
          "które tam publikujesz, zobaczą inni zalogowani użytkownicy — razem z nazwą, którą " +
          "podałeś na koncie. Wszystko poza forum (dziennik, nawyki, treningi, postępy) jest " +
          "widoczne wyłącznie dla Ciebie.",
        "Swoje posty możesz usunąć samodzielnie w każdej chwili.",
      ],
    },
    {
      heading: "11. Zmiany polityki",
      paragraphs: [
        "Jeśli zmienimy sposób przetwarzania danych, zaktualizujemy ten dokument i zmienimy datę " +
          "na górze strony. Przy istotnych zmianach poinformujemy Cię e-mailem.",
      ],
    },
  ],
};

const en: Policy = {
  title: "Privacy Policy",
  updatedLabel: "Last updated",
  intro: [
    "Vincendio is a personal journal. You write private things here — reflections, moods, " +
      "progress. We take that seriously, so below is exactly what we store, why, and who we " +
      "trust it to. Plain language wherever plain language will do.",
    "The short version: only you can see your journal. We do not sell your data, we show no " +
      "ads, and we run no advertising or tracking analytics.",
  ],
  sections: [
    {
      heading: "1. Who the data controller is",
      paragraphs: [
        `The controller of your personal data is ${CONTROLLER_NAME.en}. For anything concerning ` +
          `your data, write to ${CONTROLLER_EMAIL}. We answer every request.`,
      ],
    },
    {
      heading: "2. What we collect",
      paragraphs: ["Only what the app needs to work:"],
      bullets: [
        "Account data: your email address, an optional name, and a password hash — never the " +
          "password itself, only an irreversible hash of it.",
        "Journal content: morning intentions, priorities, todos, notes, evening reflections, " +
          "day rating and energy level.",
        "Progress: completed milestones together with your notes and proof photos, workout " +
          "entries (distance, duration), habits and their check-offs, favourite activities and quotes.",
        "Forum posts: the text, an optional photo and link, and your votes. This is the only " +
          "part of the app other signed-in users can see.",
        "Integration tokens: a Google token (if you connect Calendar) and a Notion token (if you " +
          "connect Notion). You connect these yourself and can disconnect them at any time.",
        "IP address: on sign-in, sign-up and password-reset attempts, solely to limit the number " +
          "of attempts and protect accounts from attack. Details in section 5.",
        "Preferences: your interface theme and language.",
      ],
    },
    {
      heading: "3. Why, and on what legal basis",
      bullets: [
        "Performance of a contract (GDPR Art. 6(1)(b)) — to provide the service at all: run your " +
          "account, store your journal, compute progress, and show the forum.",
        "Legitimate interest (GDPR Art. 6(1)(f)) — security: limiting sign-in attempts and " +
          "protecting against attacks and forum abuse.",
        "Consent (GDPR Art. 6(1)(a)) — optional integrations: Google Calendar and Notion. You " +
          "connect them deliberately and can withdraw consent by disconnecting them in Settings.",
      ],
    },
    {
      heading: "4. Who we share data with",
      paragraphs: [
        "We do not sell your data and we do not share it with advertisers. We do rely on " +
          "technical providers, without which the app could not run:",
      ],
      bullets: [
        "Vercel — application hosting and photo storage (Vercel Blob).",
        "Neon — the PostgreSQL database holding your journal.",
        "Upstash — sign-in attempt counters (these hold an IP address for the life of the limit window).",
        "Resend — transactional email: address confirmation and password resets.",
        "Google — only if you sign in with Google or connect Calendar.",
        "Notion — only if you connect your own Notion workspace.",
      ],
    },
    {
      heading: "5. IP addresses and sign-in limits",
      paragraphs: [
        "When you sign in, sign up, or reset a password, we store your IP address as part of an " +
          "attempt counter (in Upstash). This is what stops someone guessing passwords after a " +
          "handful of tries. The counter expires by itself — after 15 minutes for sign-in, after " +
          "an hour for sign-up and password reset — and the address goes with it. We do not build " +
          "a profile from it and we never join it to your journal content.",
        "Separately, our hosting provider (Vercel) keeps its own server logs, which also contain " +
          "IP addresses, under its own policy.",
      ],
    },
    {
      heading: "6. Transfers outside the EEA",
      paragraphs: [
        "Your journal does not leave the European Union. The database is in Frankfurt " +
          "(eu-central-1), the servers handling application requests are in Frankfurt (fra1), and " +
          "so are your proof photos (Vercel Blob) and the sign-in attempt counters (Upstash). " +
          "Everything you write and upload — entries, reflections, habits, progress, photos — is " +
          "stored and processed inside the EU.",
        "Only two things go outside the EEA, and we name them plainly:",
      ],
      bullets: [
        "Transactional email (address confirmation, password reset) is sent through Resend, whose " +
          "infrastructure is US-based. Your email address and the link itself go there — never " +
          "your journal content. This is the one transfer that affects every user.",
        "Optional integrations — Google Calendar and Notion — run on those companies' " +
          "infrastructure. This affects you only if you connect them, and stops affecting you " +
          "when you disconnect them.",
      ],
    },
    {
      heading: "6a. The basis for those transfers",
      paragraphs: [
        "These providers base such transfers on Standard Contractual Clauses (SCCs) or on the " +
          "Data Privacy Framework.",
        "Vercel and Neon are US companies, even though the processing regions we have chosen are " +
          "in the EU — any theoretical parent-company access rests on those same legal bases.",
      ],
    },
    {
      heading: "7. How long we keep data, and how to delete it",
      paragraphs: [
        "We keep your data for as long as your account exists. Nothing is deleted automatically " +
          "— last year's journal is meant to remain last year's journal. The exceptions are " +
          "email-verification and password-reset tokens, which expire on their own.",
        "You can delete your account yourself, in Settings. Deletion is immediate and " +
          "permanent: all of your data goes — journal, habits, workouts, progress, photos, and " +
          "your forum posts and replies. We also hand back the access you granted us in Google. " +
          "There is no grace period, and we keep no copy to give back to you.",
        "Replies other people wrote under your forum posts stay. They are their words, not " +
          "yours, and we have no right to delete them.",
        `You can download your data yourself, in Settings — "Download my data" hands you ` +
          `everything we hold about you as a single JSON file. Photos are linked from it rather ` +
          `than embedded: you fetch them while signed in. It contains no passwords and no Google ` +
          `or Notion tokens — those are of no use to you, and a file holding them would be ` +
          `dangerous to keep.`,
        `If you would rather not, or something is broken, write to ${CONTROLLER_EMAIL} and we ` +
          `will send a copy by hand. You can also write to that address about deleting your ` +
          `account, if for some reason you cannot do it yourself.`,
        "After deletion from the database, data may persist for a while in our providers' " +
          "backups, which rotate on their own schedules.",
      ],
    },
    {
      heading: "8. Your rights",
      paragraphs: [
        "Under the GDPR you have the right to access your data, to have it corrected or erased, " +
          "to restrict processing, to data portability, and to object to processing based on " +
          "legitimate interest.",
        `To exercise any of these, write to ${CONTROLLER_EMAIL}. You also have the right to lodge ` +
          "a complaint with the Polish supervisory authority (Prezes Urzędu Ochrony Danych " +
          "Osobowych, PUODO) if you believe we are handling your data unlawfully.",
      ],
    },
    {
      heading: "9. Cookies",
      paragraphs: ["We use only the cookies the site needs to function:"],
      bullets: [
        "Session cookies (Auth.js) — keep you signed in and protect against CSRF.",
        "A \"locale\" cookie — remembers your chosen interface language.",
      ],
    },
    {
      heading: "9a. What we do NOT use",
      paragraphs: [
        "We use no analytics or marketing cookies. There is no Google Analytics, no advertising " +
          "pixel, and no tracking tool of any kind in the application's code. That is why you " +
          "will not see a cookie-consent banner here — there is nothing to consent to.",
        "Your colour theme is stored in your browser's local storage. That never leaves your device.",
      ],
    },
    {
      heading: "10. The forum",
      paragraphs: [
        "The forum is the only part of Vincendio that others can see. The posts, photos and links " +
          "you publish there are visible to other signed-in users, along with the name on your " +
          "account. Everything outside the forum — journal, habits, workouts, progress — is " +
          "visible only to you.",
        "You can delete your own posts at any time.",
      ],
    },
    {
      heading: "11. Changes to this policy",
      paragraphs: [
        "If we change how we handle data, we will update this document and change the date at the " +
          "top of the page. For significant changes, we will tell you by email.",
      ],
    },
  ],
};

export const PRIVACY_POLICY = { pl, en } as const;

/** DE and ES have no translation yet and fall back to English — the page says so. */
export type PolicyLang = keyof typeof PRIVACY_POLICY;

export function policyFor(locale: string): { policy: Policy; fellBack: boolean } {
  const { document, fellBack } = documentFor(PRIVACY_POLICY, locale);
  return { policy: document, fellBack };
}
