// UI message catalogue. `pl` is the source of truth; en/de/es must have the
// same keys (enforced by the Dict type). Look up with the t() helpers
// (src/lib/i18n/server.ts for server components, useT() for client).
//
// Only UI chrome is translated here — user content (notes, forum posts, habit
// names) and seeded domain data (activity/level text, quotes) stay as authored.

const pl = {
  // Navigation
  "nav.today": "Dziś",
  "nav.history": "Historia",
  "nav.activities": "Aktywności",
  "nav.habits": "Nawyki",
  "nav.hero": "Bohater",
  "nav.forum": "Forum",
  "nav.quotes": "Cytaty",
  "nav.settings": "Ustawienia",

  // User menu
  "user.logout": "Wyloguj",
  "user.loggedInAs": "Zalogowano",

  // Common actions
  "common.save": "Zapisz",
  "common.cancel": "Anuluj",
  "common.add": "Dodaj",
  "common.delete": "Usuń",
  "common.edit": "Edytuj",
  "common.close": "Zamknij",
  "common.retry": "Ponów",
  "common.back": "Wróć",
  "common.loading": "Ładowanie…",
  "common.saving": "Zapisywanie…",
  "common.saved": "Zapisano ✓",

  // Page headers
  "page.today.title": "Dziś",
  "page.history.title": "Historia",
  "page.activities.title": "Aktywności",
  "page.activities.subtitle":
    "Realne, mierzalne poziomy od 1 do 99 — odhaczaj kolejne kamienie milowe.",
  "page.habits.title": "Nawyki",
  "page.habits.subtitle":
    "Określ nawyki i ich cel na tydzień (np. 3×/tydz), a potem odklikuj dowolne dni.",
  "page.hero.title": "Bohater",
  "page.hero.subtitle":
    "Twój towarzysz rośnie wraz z postępem w aktywnościach — tu dostosujesz jego wygląd.",
  "page.forum.title": "Forum",
  "page.forum.subtitle":
    "Każda umiejętność ma własną przestrzeń dyskusji. Wejdź, wybierz poziom i zobacz, co napisali inni.",
  "page.quotes.title": "Cytaty",
  "page.quotes.subtitle":
    "Przeglądaj i filtruj po dziedzinie, języku lub treści; zapisuj ulubione sercem.",
  "page.settings.title": "Ustawienia",

  // Settings — cards
  "settings.account.title": "Konto",
  "settings.account.subtitle": "Twoja tożsamość w aplikacji",
  "settings.account.loggedIn": "Zalogowano",
  "settings.account.privacy":
    "Twój dziennik oraz połączenia Google i Notion są prywatne — inni użytkownicy ich nie widzą.",
  "settings.google.title": "Google Calendar",
  "settings.google.subtitle": "Odczyt wydarzeń z Twojego głównego kalendarza",
  "settings.notion.title": "Notion",
  "settings.notion.subtitle": "Publikacja Twoich zamkniętych dni jako daily brief",
  "settings.appearance.title": "Wygląd",
  "settings.appearance.subtitle": "Motyw: jasny, ciemny, kolorowy lub własny",
  "settings.language.title": "Język",
  "settings.language.subtitle": "Język interfejsu aplikacji",
} as const;

export type MessageKey = keyof typeof pl;
type Dict = Record<MessageKey, string>;

const en: Dict = {
  "nav.today": "Today",
  "nav.history": "History",
  "nav.activities": "Activities",
  "nav.habits": "Habits",
  "nav.hero": "Hero",
  "nav.forum": "Forum",
  "nav.quotes": "Quotes",
  "nav.settings": "Settings",

  "user.logout": "Log out",
  "user.loggedInAs": "Signed in",

  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.add": "Add",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.close": "Close",
  "common.retry": "Retry",
  "common.back": "Back",
  "common.loading": "Loading…",
  "common.saving": "Saving…",
  "common.saved": "Saved ✓",

  "page.today.title": "Today",
  "page.history.title": "History",
  "page.activities.title": "Activities",
  "page.activities.subtitle":
    "Real, measurable levels from 1 to 99 — tick off milestone after milestone.",
  "page.habits.title": "Habits",
  "page.habits.subtitle":
    "Define habits and a weekly target (e.g. 3×/week), then check off any days you like.",
  "page.hero.title": "Hero",
  "page.hero.subtitle":
    "Your companion grows with your activity progress — customise its look here.",
  "page.forum.title": "Forum",
  "page.forum.subtitle":
    "Every skill has its own discussion space. Step in, pick a level and see what others wrote.",
  "page.quotes.title": "Quotes",
  "page.quotes.subtitle":
    "Browse and filter by domain, language or text; save favourites with the heart.",
  "page.settings.title": "Settings",

  "settings.account.title": "Account",
  "settings.account.subtitle": "Your identity in the app",
  "settings.account.loggedIn": "Signed in",
  "settings.account.privacy":
    "Your journal and your Google and Notion connections are private — other users can't see them.",
  "settings.google.title": "Google Calendar",
  "settings.google.subtitle": "Read events from your primary calendar",
  "settings.notion.title": "Notion",
  "settings.notion.subtitle": "Publish your closed days as a daily brief",
  "settings.appearance.title": "Appearance",
  "settings.appearance.subtitle": "Theme: light, dark, colourful or custom",
  "settings.language.title": "Language",
  "settings.language.subtitle": "App interface language",
};

const de: Dict = {
  "nav.today": "Heute",
  "nav.history": "Verlauf",
  "nav.activities": "Aktivitäten",
  "nav.habits": "Gewohnheiten",
  "nav.hero": "Held",
  "nav.forum": "Forum",
  "nav.quotes": "Zitate",
  "nav.settings": "Einstellungen",

  "user.logout": "Abmelden",
  "user.loggedInAs": "Angemeldet",

  "common.save": "Speichern",
  "common.cancel": "Abbrechen",
  "common.add": "Hinzufügen",
  "common.delete": "Löschen",
  "common.edit": "Bearbeiten",
  "common.close": "Schließen",
  "common.retry": "Erneut",
  "common.back": "Zurück",
  "common.loading": "Laden…",
  "common.saving": "Speichern…",
  "common.saved": "Gespeichert ✓",

  "page.today.title": "Heute",
  "page.history.title": "Verlauf",
  "page.activities.title": "Aktivitäten",
  "page.activities.subtitle":
    "Echte, messbare Stufen von 1 bis 99 — hake Meilenstein für Meilenstein ab.",
  "page.habits.title": "Gewohnheiten",
  "page.habits.subtitle":
    "Lege Gewohnheiten und ein Wochenziel fest (z. B. 3×/Woche) und hake beliebige Tage ab.",
  "page.hero.title": "Held",
  "page.hero.subtitle":
    "Dein Begleiter wächst mit deinem Fortschritt — hier passt du sein Aussehen an.",
  "page.forum.title": "Forum",
  "page.forum.subtitle":
    "Jede Fähigkeit hat einen eigenen Diskussionsbereich. Tritt ein, wähle eine Stufe und sieh, was andere schrieben.",
  "page.quotes.title": "Zitate",
  "page.quotes.subtitle":
    "Durchsuchen und filtern nach Bereich, Sprache oder Text; Favoriten mit dem Herz speichern.",
  "page.settings.title": "Einstellungen",

  "settings.account.title": "Konto",
  "settings.account.subtitle": "Deine Identität in der App",
  "settings.account.loggedIn": "Angemeldet",
  "settings.account.privacy":
    "Dein Tagebuch sowie deine Google- und Notion-Verbindungen sind privat — andere sehen sie nicht.",
  "settings.google.title": "Google Kalender",
  "settings.google.subtitle": "Termine aus deinem Hauptkalender lesen",
  "settings.notion.title": "Notion",
  "settings.notion.subtitle": "Veröffentliche deine abgeschlossenen Tage als Daily Brief",
  "settings.appearance.title": "Darstellung",
  "settings.appearance.subtitle": "Thema: hell, dunkel, bunt oder eigenes",
  "settings.language.title": "Sprache",
  "settings.language.subtitle": "Sprache der App-Oberfläche",
};

const es: Dict = {
  "nav.today": "Hoy",
  "nav.history": "Historial",
  "nav.activities": "Actividades",
  "nav.habits": "Hábitos",
  "nav.hero": "Héroe",
  "nav.forum": "Foro",
  "nav.quotes": "Citas",
  "nav.settings": "Ajustes",

  "user.logout": "Cerrar sesión",
  "user.loggedInAs": "Sesión iniciada",

  "common.save": "Guardar",
  "common.cancel": "Cancelar",
  "common.add": "Añadir",
  "common.delete": "Eliminar",
  "common.edit": "Editar",
  "common.close": "Cerrar",
  "common.retry": "Reintentar",
  "common.back": "Volver",
  "common.loading": "Cargando…",
  "common.saving": "Guardando…",
  "common.saved": "Guardado ✓",

  "page.today.title": "Hoy",
  "page.history.title": "Historial",
  "page.activities.title": "Actividades",
  "page.activities.subtitle":
    "Niveles reales y medibles del 1 al 99: ve marcando cada hito.",
  "page.habits.title": "Hábitos",
  "page.habits.subtitle":
    "Define hábitos y un objetivo semanal (p. ej. 3×/semana) y marca los días que quieras.",
  "page.hero.title": "Héroe",
  "page.hero.subtitle":
    "Tu compañero crece con tu progreso en las actividades: personaliza su aspecto aquí.",
  "page.forum.title": "Foro",
  "page.forum.subtitle":
    "Cada habilidad tiene su propio espacio de debate. Entra, elige un nivel y mira qué escribieron otros.",
  "page.quotes.title": "Citas",
  "page.quotes.subtitle":
    "Explora y filtra por ámbito, idioma o texto; guarda favoritas con el corazón.",
  "page.settings.title": "Ajustes",

  "settings.account.title": "Cuenta",
  "settings.account.subtitle": "Tu identidad en la aplicación",
  "settings.account.loggedIn": "Sesión iniciada",
  "settings.account.privacy":
    "Tu diario y tus conexiones con Google y Notion son privados: otros usuarios no los ven.",
  "settings.google.title": "Google Calendar",
  "settings.google.subtitle": "Leer eventos de tu calendario principal",
  "settings.notion.title": "Notion",
  "settings.notion.subtitle": "Publica tus días cerrados como resumen diario",
  "settings.appearance.title": "Apariencia",
  "settings.appearance.subtitle": "Tema: claro, oscuro, colorido o personalizado",
  "settings.language.title": "Idioma",
  "settings.language.subtitle": "Idioma de la interfaz de la app",
};

import type { Locale } from "./config";

export const MESSAGES: Record<Locale, Dict> = { pl, en, de, es };
