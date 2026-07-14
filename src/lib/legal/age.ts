/**
 * The age below which the service is not offered.
 *
 * Its own module, tiny on purpose: the sign-up form is a client component, and
 * importing it from lib/legal/terms.ts would drag the entire text of the terms —
 * both languages of it — into the client bundle to fetch one number.
 *
 * 16 because GDPR Art. 8 puts the consent age there absent a lower national floor,
 * and because a private journal is not a thing to hand a child unattended.
 *
 * The number is stated in two places that must agree: §3 of the terms, and the
 * declaration the user makes at sign-up. They agree because both read this.
 */
export const MINIMUM_AGE = 16;
