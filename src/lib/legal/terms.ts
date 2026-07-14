/**
 * The terms of service, as content rather than UI strings.
 *
 * NOT LEGAL ADVICE. This is a draft written by an AI from an audit of this
 * codebase. It describes what the code demonstrably does and what the owner has
 * decided the rules are, but it has not been reviewed by a lawyer. Have someone
 * who does this professionally read it before the app is opened to the public —
 * particularly the two items marked below, which are known weaknesses rather than
 * oversights.
 *
 * Polish is the source; English is the translation. DE and ES fall back to
 * English, and the page says so rather than pretending otherwise.
 *
 * ─── TERMS_AUDIT (2026-07-14) — every factual claim below traces to code ─────
 *  Free of charge ...... No payment code exists anywhere in src/: no Stripe, no
 *                        checkout, no subscription, no plan or entitlement column
 *                        in prisma/schema.prisma. Deliberately NOT phrased as
 *                        "free forever" — a paid plan is possible in about a year,
 *                        and that promise would not survive it. §2 reserves the
 *                        right to change the scope of the service with notice.
 *  Sign-up ............. actions/account.ts (e-mail + password, argon2id via
 *                        lib/passwords.ts) or Google (lib/auth.ts). Nothing else.
 *  E-mail verification . lib/verification.ts sends a link; an unverified account
 *                        still works and only sees a banner. So §3 says we send
 *                        the link — it does NOT claim verification is required,
 *                        because nothing enforces that.
 *  Private journal ..... Every journal query is scoped by userId (DayEntry, Note,
 *                        Habit, Workout, Milestone*, CalendarEventCheck). The
 *                        forum is the only unscoped read surface.
 *  Forum visibility .... /forum is NOT in PUBLIC_PATHS (src/proxy.ts), so posts
 *                        are visible to signed-in users, not to the open web.
 *                        §4 says exactly that and no more.
 *  Deleting posts ...... actions/forum.ts deletePost(): the author, or a user
 *                        whose role passes isAdminRole() — admin or owner. Both
 *                        halves of §4 are that one function.
 *  Suspension .......... lib/roles.ts ROLES includes "suspended";
 *                        isSuspendedRole() denies all access and app/suspended/
 *                        is the only page such a user can open. §6 is real, not
 *                        aspirational.
 *  Account deletion .... Self-service in Settings (actions/delete-account.ts).
 *                        Immediate, no grace period. Other users' replies to a
 *                        deleted user's posts SURVIVE (ForumPost.parent is
 *                        onDelete: SetNull) — §6 warns about this, because a user
 *                        deleting their account may expect the thread to go with
 *                        it, and it does not.
 *  Personal data ....... Governed by /privacy, which is a separate document with
 *                        its own audit. §8 links to it rather than restating it —
 *                        two documents describing the same processing would drift.
 *
 *  KNOWN WEAKNESSES — raise these with the lawyer:
 *   1. The service provider is "the operator of Vincendio" (CONTROLLER_NAME,
 *      shared with the privacy policy). That names a role, not a legal subject.
 *      Same deliberate compromise, same fix: replace with the registered entity
 *      the moment the business exists.
 *   2. The minimum age (lib/legal/age.ts) is DECLARED, NOT VERIFIED. The sign-up
 *      form states it and the user confirms it by creating an account, so §3 is a
 *      declaration the user actually makes rather than a rule buried in a document
 *      nobody opened — but nothing checks a date of birth, and nothing could, short
 *      of identity verification. Adequate at this scale; raise it with the lawyer
 *      before the app is opened to the public at any size.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { CONTROLLER_EMAIL, CONTROLLER_NAME } from "@/lib/legal/privacy";
import { documentFor, type LegalDocument } from "@/lib/legal/document";
import { MINIMUM_AGE } from "@/lib/legal/age";

/** The date these terms take effect. Bump it whenever the text below changes. */
export const TERMS_UPDATED = "2026-07-14";

const pl: LegalDocument = {
  title: "Regulamin",
  updatedLabel: "Obowiązuje od",
  intro: [
    "Ten regulamin określa zasady korzystania z Vincendio — aplikacji do prowadzenia dziennika dnia, " +
      "śledzenia nawyków i rozwijania umiejętności. Zakładając konto, akceptujesz te zasady.",
    "Napisaliśmy go tak, żeby dało się go przeczytać. Jeśli coś jest niejasne, napisz na " +
      `${CONTROLLER_EMAIL} — odpowiemy.`,
  ],
  sections: [
    {
      heading: "1. Kto świadczy usługę",
      paragraphs: [
        `Usługodawcą jest ${CONTROLLER_NAME.pl}, kontakt: ${CONTROLLER_EMAIL}. Ten sam adres służy ` +
          "do wszystkich spraw związanych z kontem, treściami i danymi osobowymi.",
      ],
    },
    {
      heading: "2. Usługa i jej zakres",
      paragraphs: [
        "Vincendio jest bezpłatne. Nie pobieramy opłat, nie ma planów płatnych, nie prosimy o dane " +
          "karty i nie wyświetlamy reklam.",
        "Nie obiecujemy jednak, że tak będzie zawsze. Możemy zmienić zakres usługi — dodać lub " +
          "usunąć funkcje, a w przyszłości wprowadzić plan płatny. O każdej istotnej zmianie " +
          "uprzedzimy z wyprzedzeniem, a funkcje, z których korzystasz dziś, nie znikną z dnia na " +
          "dzień bez powiadomienia. Gdyby wprowadzenie opłat kiedykolwiek nastąpiło, korzystanie z " +
          "konta bez zgody na nie pozostanie możliwe albo dostaniesz czas na zabranie swoich danych.",
      ],
    },
    {
      heading: "3. Konto",
      paragraphs: [
        "Konto zakładasz adresem e-mail i hasłem albo przez logowanie Google. Na podany adres " +
          "wysyłamy link weryfikacyjny.",
        `Usługa nie jest przeznaczona dla osób poniżej ${MINIMUM_AGE} lat. Zakładając konto, ` +
          "oświadczasz, że masz co najmniej tyle lat.",
        "Odpowiadasz za swoje hasło i za to, co dzieje się na Twoim koncie. Jeśli podejrzewasz, że " +
          "ktoś uzyskał do niego dostęp, zmień hasło i napisz do nas.",
      ],
    },
    {
      heading: "4. Twoje treści",
      paragraphs: [
        "Treści, które tworzysz, należą do Ciebie. Nie rościmy sobie do nich praw własności i nie " +
          "wykorzystujemy ich do niczego poza świadczeniem usługi.",
        "Twój dziennik — intencje, notatki, refleksje, nawyki, treningi, postępy — jest prywatny. " +
          "Widzisz go tylko Ty.",
        "Forum jest inne: to, co tam napiszesz, zobaczą inni zalogowani użytkownicy. Nie jest to " +
          "publiczna strona w internecie, ale nie jest to też Twój prywatny zapis. Publikując na " +
          "forum, udzielasz nam ograniczonej licencji na wyświetlanie i przechowywanie tej treści " +
          "w ramach usługi — wyłącznie po to, żeby forum działało. Licencja wygasa, gdy usuniesz treść.",
        "Swoje posty na forum możesz usunąć w każdej chwili. Administrator może usunąć każdy post, " +
          "jeśli narusza ten regulamin.",
      ],
    },
    {
      heading: "5. Czego nie wolno",
      paragraphs: ["Korzystając z Vincendio, zobowiązujesz się nie:"],
      bullets: [
        "publikować treści bezprawnych, nawołujących do nienawiści, nękających innych ani naruszających cudze prawa,",
        "spamować, reklamować ani masowo publikować treści,",
        "podszywać się pod inne osoby,",
        "podejmować prób obejścia zabezpieczeń, dostępu do cudzych kont lub danych, ani zakłócać działania usługi,",
        "korzystać z usługi w sposób automatyczny w skali, która obciąża ją ponad zwykłe używanie.",
      ],
    },
    {
      heading: "6. Zawieszenie i zakończenie",
      paragraphs: [
        "Ty możesz zakończyć korzystanie w każdej chwili — konto usuwasz samodzielnie w Ustawieniach. " +
          "Usunięcie jest natychmiastowe i nieodwracalne: znikają dziennik, nawyki, treningi, postępy " +
          "i zdjęcia. Nie ma okresu karencji ani kosza.",
        "Jeden wyjątek warto znać: odpowiedzi innych użytkowników pod Twoimi postami na forum " +
          "zostają. Usunięcie Twojego konta nie usuwa cudzych słów — osierocone odpowiedzi stają się " +
          "samodzielnymi postami.",
        "My możemy zawiesić konto, które narusza regulamin. Konto zawieszone traci dostęp do " +
          "aplikacji; jego dane nie są kasowane. Jeśli uważasz, że zawieszenie jest błędem, napisz na " +
          `${CONTROLLER_EMAIL}.`,
      ],
    },
    {
      heading: "7. Odpowiedzialność",
      paragraphs: [
        "Usługa jest udostępniana taka, jaka jest. Staramy się, żeby działała, ale nie gwarantujemy " +
          "jej nieprzerwanej dostępności ani tego, że będzie wolna od błędów. Mogą wystąpić przerwy " +
          "techniczne i awarie.",
        "Vincendio jest narzędziem do zapisywania i porządkowania własnych spraw. Nie jest usługą " +
          "medyczną, terapeutyczną ani doradczą, i nie zastępuje kontaktu ze specjalistą.",
        "Rób kopie tego, co dla Ciebie ważne. Nie odpowiadamy za utratę danych w zakresie, w jakim " +
          "przepisy na to pozwalają — a przepisów bezwzględnie obowiązujących, w tym praw " +
          "konsumenckich, ten punkt nie ogranicza.",
      ],
    },
    {
      heading: "8. Dane osobowe",
      paragraphs: [
        "To, jakie dane zbieramy, po co i jakie masz wobec nich prawa, opisuje osobny dokument — " +
          "Polityka prywatności. Jest bardziej szczegółowa niż ten regulamin i to ona rozstrzyga w " +
          "sprawach danych osobowych.",
      ],
    },
    {
      heading: "9. Zmiany regulaminu",
      paragraphs: [
        "Możemy zmienić ten regulamin — na przykład gdy zmieni się usługa. O istotnych zmianach " +
          "poinformujemy z wyprzedzeniem, na adres e-mail przypisany do konta albo komunikatem w " +
          "aplikacji. Każda wersja ma datę wejścia w życie, widoczną na górze tej strony.",
        "Jeśli nie zgadzasz się ze zmianą, możesz usunąć konto — to Twoje prawo i nie wymaga " +
          "uzasadnienia.",
      ],
    },
    {
      heading: "10. Prawo właściwe i kontakt",
      paragraphs: [
        "Do regulaminu stosuje się prawo polskie. Nie ogranicza to praw, które przysługują Ci jako " +
          "konsumentowi na mocy bezwzględnie obowiązujących przepisów kraju Twojego zamieszkania.",
        `W każdej sprawie: ${CONTROLLER_EMAIL}.`,
      ],
    },
  ],
};

const en: LegalDocument = {
  title: "Terms of Service",
  updatedLabel: "Effective from",
  intro: [
    "These terms govern your use of Vincendio — an app for keeping a daily journal, tracking habits " +
      "and building skills. By creating an account, you accept them.",
    "They are written to be read. If anything is unclear, write to " + `${CONTROLLER_EMAIL} and we will answer.`,
  ],
  sections: [
    {
      heading: "1. Who provides the service",
      paragraphs: [
        `The service is provided by ${CONTROLLER_NAME.en}, contact: ${CONTROLLER_EMAIL}. That address ` +
          "handles everything to do with your account, your content and your personal data.",
      ],
    },
    {
      heading: "2. The service and its scope",
      paragraphs: [
        "Vincendio is free. We charge nothing, there are no paid plans, we never ask for card " +
          "details, and we show no ads.",
        "We do not promise it will always be so. We may change what the service offers — add or " +
          "remove features, and possibly introduce a paid plan in future. We will give notice before " +
          "any significant change, and features you rely on today will not vanish overnight without " +
          "warning. Were charging ever introduced, you would either be able to keep using your " +
          "account without agreeing to it, or be given time to take your data with you.",
      ],
    },
    {
      heading: "3. Your account",
      paragraphs: [
        "You create an account with an email address and a password, or by signing in with Google. " +
          "We send a verification link to the address you give us.",
        `The service is not intended for anyone under ${MINIMUM_AGE}. By creating an account you ` +
          "confirm that you are at least that old.",
        "You are responsible for your password and for what happens on your account. If you think " +
          "someone else has got into it, change your password and tell us.",
      ],
    },
    {
      heading: "4. Your content",
      paragraphs: [
        "What you write belongs to you. We claim no ownership of it and use it for nothing beyond " +
          "running the service.",
        "Your journal — intentions, notes, reflections, habits, workouts, progress — is private. " +
          "You are the only one who sees it.",
        "The forum is different: what you post there is visible to other signed-in users. It is not " +
          "a public web page, but neither is it your private record. By posting, you grant us a " +
          "limited licence to store and display that content within the service — for the sole " +
          "purpose of making the forum work. The licence ends when you delete the content.",
        "You can delete your own posts at any time. An administrator can delete any post that breaks " +
          "these terms.",
      ],
    },
    {
      heading: "5. What you must not do",
      paragraphs: ["In using Vincendio, you agree not to:"],
      bullets: [
        "post unlawful content, hate speech, harassment, or anything that infringes someone else's rights,",
        "spam, advertise, or post in bulk,",
        "impersonate anyone,",
        "attempt to bypass security, reach other people's accounts or data, or disrupt the service,",
        "use the service automatically at a scale beyond ordinary use.",
      ],
    },
    {
      heading: "6. Suspension and ending your account",
      paragraphs: [
        "You can leave whenever you like — delete your account yourself in Settings. Deletion is " +
          "immediate and irreversible: the journal, habits, workouts, progress and photos all go. " +
          "There is no grace period and no bin.",
        "One exception is worth knowing. Other users' replies to your forum posts stay. Deleting " +
          "your account does not delete somebody else's words — orphaned replies are promoted to " +
          "posts of their own.",
        "We may suspend an account that breaks these terms. A suspended account loses access to the " +
          "app; its data is not deleted. If you think a suspension is a mistake, write to " +
          `${CONTROLLER_EMAIL}.`,
      ],
    },
    {
      heading: "7. Liability",
      paragraphs: [
        "The service is provided as is. We do our best to keep it running, but we do not guarantee " +
          "uninterrupted availability or freedom from bugs. Outages and failures can happen.",
        "Vincendio is a tool for recording and ordering your own affairs. It is not a medical, " +
          "therapeutic or advisory service, and it is no substitute for a professional.",
        "Keep your own copies of anything that matters to you. We are not liable for data loss to the " +
          "extent the law permits — and nothing here limits mandatory legal rights, including your " +
          "rights as a consumer.",
      ],
    },
    {
      heading: "8. Personal data",
      paragraphs: [
        "What we collect, why, and what rights you have over it is set out in a separate document — " +
          "the Privacy Policy. It is more detailed than these terms, and it governs anything to do " +
          "with personal data.",
      ],
    },
    {
      heading: "9. Changes to these terms",
      paragraphs: [
        "We may change these terms — for instance when the service itself changes. We will give " +
          "notice of significant changes, by email to the address on your account or in the app. " +
          "Every version carries an effective date, shown at the top of this page.",
        "If you do not agree with a change, you can delete your account. That is your right and " +
          "needs no explanation.",
      ],
    },
    {
      heading: "10. Governing law and contact",
      paragraphs: [
        "These terms are governed by Polish law. This does not limit the rights you have as a " +
          "consumer under the mandatory law of the country you live in.",
        `For anything at all: ${CONTROLLER_EMAIL}.`,
      ],
    },
  ],
};

export const TERMS = { pl, en } as const;

export function termsFor(locale: string): { terms: LegalDocument; fellBack: boolean } {
  const { document, fellBack } = documentFor(TERMS, locale);
  return { terms: document, fellBack };
}
