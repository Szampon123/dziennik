// Google Calendar integration (read-only), per user.
// Calendar access is incremental consent, separate from login: each user
// connects their own calendar in Settings. Tokens live in the OAuthToken
// table keyed by [userId, provider]; client credentials come from .env.local.
// Derive auth types from the google.auth.OAuth2 constructor itself —
// node_modules contains two copies of google-auth-library with structurally
// incompatible private fields, so named type imports would mismatch.
import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";
import { toDayKey, dayKeyToDate } from "@/lib/dates";

type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;
type Credentials = Parameters<OAuth2Client["setCredentials"]>[0];

const PROVIDER = "google";
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

export type CalendarEvent = {
  id: string;
  summary: string;
  start: string; // ISO datetime, or YYYY-MM-DD for all-day events
  end: string;
  allDay: boolean;
  dayKey: string; // local day the event starts on
};

export type GoogleStatus =
  | { state: "not_configured" }
  | { state: "not_connected" }
  | { state: "connected"; email: string | null };

export function isGoogleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function createOAuthClient(): OAuth2Client {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI ?? "http://localhost:3000/api/auth/google/callback"
  );
}

/** `state` is the CSRF token minted in src/lib/oauth-state.ts; Google echoes it back. */
export function getAuthUrl(state: string): string {
  return createOAuthClient().generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // always return a refresh token
    scope: SCOPES,
    state,
  });
}

async function saveCredentials(userId: string, creds: Credentials, email?: string | null) {
  // Encrypt the bearer secrets before they ever touch the database.
  const encryptedRefresh =
    typeof creds.refresh_token === "string" ? encrypt(creds.refresh_token) : undefined;
  const data = {
    accessToken: encrypt(creds.access_token ?? ""),
    refreshToken: encryptedRefresh, // undefined → keep existing on update
    expiryDate: creds.expiry_date ? BigInt(creds.expiry_date) : null,
    scope: creds.scope ?? null,
    ...(email !== undefined ? { accountEmail: email } : {}),
  };
  await prisma.oAuthToken.upsert({
    where: { userId_provider: { userId, provider: PROVIDER } },
    update: data,
    create: {
      userId,
      provider: PROVIDER,
      ...data,
      refreshToken: encryptedRefresh ?? null,
    },
  });
}

/** Exchange the OAuth callback code for tokens and persist them for the user. */
export async function handleOAuthCallback(userId: string, code: string): Promise<void> {
  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  let email: string | null = null;
  try {
    const oauth2 = google.oauth2({ version: "v2", auth: client });
    const { data } = await oauth2.userinfo.get();
    email = data.email ?? null;
  } catch {
    // email is cosmetic — ignore failures
  }

  await saveCredentials(userId, tokens, email);
}

/** OAuth client with the user's stored tokens, or null when not connected. */
export async function getAuthorizedClient(userId: string): Promise<OAuth2Client | null> {
  if (!isGoogleConfigured()) return null;
  const stored = await prisma.oAuthToken.findUnique({
    where: { userId_provider: { userId, provider: PROVIDER } },
  });
  if (!stored) return null;

  const client = createOAuthClient();
  client.setCredentials({
    access_token: stored.accessToken ? decrypt(stored.accessToken) : undefined,
    refresh_token: stored.refreshToken ? decrypt(stored.refreshToken) : undefined,
    expiry_date: stored.expiryDate ? Number(stored.expiryDate) : undefined,
  });
  // Persist refreshed access tokens so restarts don't re-trigger refresh.
  client.on("tokens", (tokens) => {
    void saveCredentials(userId, { ...tokens, refresh_token: tokens.refresh_token ?? undefined });
  });
  return client;
}

export async function getGoogleStatus(userId: string): Promise<GoogleStatus> {
  if (!isGoogleConfigured()) return { state: "not_configured" };
  const stored = await prisma.oAuthToken.findUnique({
    where: { userId_provider: { userId, provider: PROVIDER } },
  });
  if (!stored) return { state: "not_connected" };
  return { state: "connected", email: stored.accountEmail };
}

export async function disconnectGoogle(userId: string): Promise<void> {
  await prisma.oAuthToken.deleteMany({ where: { userId, provider: PROVIDER } });
}

/**
 * Tell Google to invalidate the grant, then drop the row.
 *
 * Dropping the row alone (disconnectGoogle) only makes *us* forget the token —
 * the grant stays listed under "Third-party apps with account access" in the
 * user's Google account, and the refresh token keeps working. That is untidy
 * when they disconnect and unacceptable when they delete their account: we would
 * be leaving a live grant behind for an app that no longer holds an account for
 * them, and they would have to go and clean it up by hand.
 *
 * Best-effort by design. Revocation talks to a third party over the network and
 * the account deletion that calls this must not be held hostage by Google being
 * slow or the token already being dead. A failure here is logged and swallowed:
 * the local token row is deleted either way, so we never keep a credential we
 * failed to revoke.
 *
 * Revoking either token of a pair invalidates both, so the refresh token is
 * preferred — it is the long-lived one and the one still worth killing if the
 * access token has already expired.
 */
export async function revokeGoogleAccess(userId: string): Promise<void> {
  const stored = await prisma.oAuthToken.findUnique({
    where: { userId_provider: { userId, provider: PROVIDER } },
  });

  if (stored) {
    const encrypted = stored.refreshToken ?? stored.accessToken;
    if (encrypted) {
      try {
        const token = decrypt(encrypted);
        const res = await fetch("https://oauth2.googleapis.com/revoke", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ token }),
        });
        // 400 is the ordinary "already revoked / expired" answer, not a problem.
        if (!res.ok && res.status !== 400) {
          console.error("[GOOGLE] revoke failed:", res.status, await res.text());
        }
      } catch (error) {
        console.error("[GOOGLE] revoke threw:", error);
      }
    }
  }

  await prisma.oAuthToken.deleteMany({ where: { userId, provider: PROVIDER } });
}

/**
 * Fetch the user's events from their primary calendar: `pastDays` days back
 * through `days` days ahead (both relative to today). Live fetch, never
 * persisted (caching lives in calendar-cache.ts).
 */
export async function fetchCalendarEvents(
  userId: string,
  days: number,
  pastDays = 0
): Promise<CalendarEvent[]> {
  const client = await getAuthorizedClient(userId);
  if (!client) throw new Error("NOT_CONNECTED");

  const timeMin = new Date();
  timeMin.setHours(0, 0, 0, 0);
  timeMin.setDate(timeMin.getDate() - pastDays);
  const timeMax = new Date();
  timeMax.setHours(0, 0, 0, 0);
  timeMax.setDate(timeMax.getDate() + days + 1);

  return listEventsInRange(client, timeMin, timeMax);
}

/**
 * Fetch the user's events for a single local day (`dayKey`). Unlike
 * fetchCalendarEvents this takes an absolute day, so it works for any past day
 * regardless of how far back it is — used to review a historical day's tasks.
 */
export async function fetchCalendarEventsForDay(
  userId: string,
  dayKey: string
): Promise<CalendarEvent[]> {
  const client = await getAuthorizedClient(userId);
  if (!client) throw new Error("NOT_CONNECTED");

  const timeMin = dayKeyToDate(dayKey);
  const timeMax = dayKeyToDate(dayKey);
  timeMax.setDate(timeMax.getDate() + 1);

  const events = await listEventsInRange(client, timeMin, timeMax);
  // An all-day event ending on `dayKey` (its exclusive end date) can leak in —
  // keep only events whose local start day is this day.
  return events.filter((e) => e.dayKey === dayKey);
}

async function listEventsInRange(
  client: OAuth2Client,
  timeMin: Date,
  timeMax: Date
): Promise<CalendarEvent[]> {
  const calendar = google.calendar({ version: "v3", auth: client });
  const { data } = await calendar.events.list({
    calendarId: "primary",
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 250,
  });

  return (data.items ?? [])
    .filter((e) => e.status !== "cancelled")
    .map((e) => {
      const allDay = Boolean(e.start?.date);
      const start = e.start?.dateTime ?? e.start?.date ?? "";
      const end = e.end?.dateTime ?? e.end?.date ?? "";
      const dayKey = allDay ? (e.start?.date ?? "") : toDayKey(new Date(start));
      return {
        id: e.id ?? `${start}-${e.summary}`,
        // Fallback for an event with no title. A plain English literal, not a
        // localized string: this runs in the calendar data layer, which isn't
        // always request-scoped, so getLocale() can't be relied on here.
        summary: e.summary ?? "(untitled)",
        start,
        end,
        allDay,
        dayKey,
      };
    });
}
