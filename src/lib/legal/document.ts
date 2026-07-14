/**
 * The shape a legal document has here, and the one rule for picking its language.
 *
 * Extracted when the terms of service arrived and turned out to need exactly what
 * the privacy policy already had: prose in sections, a Polish source, an English
 * translation, and an honest admission when the reader's language is neither.
 *
 * Kept out of lib/i18n/messages.ts on purpose: that file is UI strings, and a legal
 * document is prose. Locale selection happens in the page.
 */

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  updatedLabel: string;
  intro: string[];
  sections: LegalSection[];
};

/**
 * Polish is the source and English the translation; DE and ES have neither yet.
 *
 * `fellBack` is returned rather than swallowed so the page can say "this is not in
 * your language" out loud. Quietly serving English to a German reader would look
 * like a rendering bug, and on a document that binds them it would be worse than
 * that — they would not know they were reading a version they never agreed to.
 */
export function documentFor<T extends LegalDocument>(
  versions: { pl: T; en: T },
  locale: string
): { document: T; fellBack: boolean } {
  if (locale === "pl") return { document: versions.pl, fellBack: false };
  if (locale === "en") return { document: versions.en, fellBack: false };
  return { document: versions.en, fellBack: true };
}
