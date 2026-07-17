// Strava integration, per user. Mirrors the Google Calendar pattern: each user
// connects their own Strava account in Settings (incremental consent, separate
// from login), tokens live in OAuthToken keyed by [userId, provider], client
// credentials come from .env.local.
//
// Data flow: activities arrive either through the app-level webhook
// (/api/strava/webhook — Strava pushes create/update/delete events) or through
// an explicit sync (initial import after connect, "sync now" in Settings).
// Either way an activity becomes a Workout row (source: "strava", externalId =
// Strava activity id for dedup) and recomputeAutoMilestones runs for the
// affected activity — the same pipeline a manually logged workout goes through.
//
// Strava API terms (2026): activity data may only ever be shown to its owner.
// Workouts are per-user everywhere in the app, so this holds by construction —
// but imported data must never leak into the shared forum.
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";
import { recomputeAutoMilestones } from "@/lib/milestone-engine";

const PROVIDER = "strava";
const TOKEN_URL = "https://www.strava.com/oauth/token";
const API_BASE = "https://www.strava.com/api/v3";

// Same ceilings as the manual workout form (src/actions/workouts.ts): a Strava
// activity beyond them is corrupt GPS data, not training.
const MAX_DISTANCE_KM = 1000;
const MAX_DURATION_MIN = 3000;

/** How far back the initial import after connecting reaches. */
const INITIAL_IMPORT_DAYS = 90;

// Strava sport_type → activity slug. Only distance-logged activities are
// mapped; anything else (WeightTraining, Yoga, ...) is skipped on import.
const SPORT_TO_SLUG: Record<string, string> = {
  Run: "bieganie",
  TrailRun: "bieganie",
  VirtualRun: "bieganie",
  Ride: "jazda-na-rowerze",
  VirtualRide: "jazda-na-rowerze",
  GravelRide: "jazda-na-rowerze",
  MountainBikeRide: "jazda-na-rowerze",
  Swim: "plywanie",
  Walk: "chodzenie",
  Hike: "turystyka-gorska",
  Rowing: "wioslarstwo",
  VirtualRow: "wioslarstwo",
  Kayaking: "kajakarstwo",
  Canoeing: "kajakarstwo",
  NordicSki: "narciarstwo-biegowe",
  InlineSkate: "rolki-lyzwy",
  IceSkate: "rolki-lyzwy",
  StandUpPaddling: "sup",
};

export type StravaStatus =
  | { state: "not_configured" }
  | { state: "not_connected" }
  | { state: "connected"; athleteName: string | null };

export type StravaSyncResult = { imported: number; skipped: number };

/** Shape of an activity as Strava returns it (list and detail endpoints). */
type StravaActivity = {
  id: number;
  sport_type?: string;
  start_date_local?: string; // ISO, local to the athlete
  distance?: number; // metres
  moving_time?: number; // seconds
  workout_type?: number | null; // 1 = run race, 11 = ride race
};

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch seconds
  athlete?: { id: number; firstname?: string | null; lastname?: string | null };
};

export function isStravaConfigured(): boolean {
  return Boolean(process.env.STRAVA_CLIENT_ID && process.env.STRAVA_CLIENT_SECRET);
}

function redirectUri(): string {
  return (
    process.env.STRAVA_REDIRECT_URI ?? "http://localhost:3000/api/auth/strava/callback"
  );
}

/** `state` is the CSRF token minted in src/lib/oauth-state.ts; Strava echoes it back. */
export function getStravaAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID ?? "",
    redirect_uri: redirectUri(),
    response_type: "code",
    approval_prompt: "auto",
    // activity:read_all includes private activities — without it a user whose
    // activities default to "only me" would sync nothing and blame the app.
    scope: "read,activity:read_all",
    state,
  });
  return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

async function tokenRequest(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.STRAVA_CLIENT_ID ?? "",
      client_secret: process.env.STRAVA_CLIENT_SECRET ?? "",
      ...body,
    }),
  });
  if (!res.ok) {
    throw new Error(`Strava token request failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as TokenResponse;
}

async function saveTokens(userId: string, tokens: TokenResponse): Promise<void> {
  const athlete = tokens.athlete;
  const athleteName = athlete
    ? [athlete.firstname, athlete.lastname].filter(Boolean).join(" ").trim() || null
    : undefined;
  const data = {
    accessToken: encrypt(tokens.access_token),
    refreshToken: encrypt(tokens.refresh_token),
    expiryDate: BigInt(tokens.expires_at) * BigInt(1000), // store ms like Google
    scope: "read,activity:read_all",
    ...(athlete ? { providerAccountId: String(athlete.id) } : {}),
    ...(athleteName !== undefined ? { accountEmail: athleteName } : {}),
  };
  await prisma.oAuthToken.upsert({
    where: { userId_provider: { userId, provider: PROVIDER } },
    update: data,
    create: { userId, provider: PROVIDER, ...data },
  });
}

/** Exchange the OAuth callback code for tokens and persist them for the user. */
export async function handleStravaCallback(userId: string, code: string): Promise<void> {
  const tokens = await tokenRequest({ grant_type: "authorization_code", code });
  await saveTokens(userId, tokens);
}

/**
 * Valid access token for the user, refreshing (and persisting) when the stored
 * one is expired or about to be. Null when Strava isn't connected.
 */
async function getAccessToken(userId: string): Promise<string | null> {
  const stored = await prisma.oAuthToken.findUnique({
    where: { userId_provider: { userId, provider: PROVIDER } },
  });
  if (!stored) return null;

  const expiresAtMs = stored.expiryDate ? Number(stored.expiryDate) : 0;
  if (expiresAtMs - 60_000 > Date.now()) {
    return decrypt(stored.accessToken);
  }
  if (!stored.refreshToken) return null;

  const tokens = await tokenRequest({
    grant_type: "refresh_token",
    refresh_token: decrypt(stored.refreshToken),
  });
  await saveTokens(userId, tokens);
  return tokens.access_token;
}

export async function getStravaStatus(userId: string): Promise<StravaStatus> {
  if (!isStravaConfigured()) return { state: "not_configured" };
  const stored = await prisma.oAuthToken.findUnique({
    where: { userId_provider: { userId, provider: PROVIDER } },
  });
  if (!stored) return { state: "not_connected" };
  return { state: "connected", athleteName: stored.accountEmail };
}

/** Webhook routing: which local user owns this Strava athlete id? */
export async function getUserIdByAthleteId(athleteId: string): Promise<string | null> {
  const row = await prisma.oAuthToken.findFirst({
    where: { provider: PROVIDER, providerAccountId: athleteId },
    select: { userId: true },
  });
  return row?.userId ?? null;
}

/**
 * Tell Strava to invalidate the grant, then drop the row. Best-effort by
 * design, same reasoning as revokeGoogleAccess: the disconnect (or account
 * deletion) must not be held hostage by Strava being slow or the token already
 * being dead. Imported workouts stay — they are the user's training history.
 */
export async function disconnectStrava(userId: string): Promise<void> {
  try {
    const token = await getAccessToken(userId);
    if (token) {
      const res = await fetch("https://www.strava.com/oauth/deauthorize", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ access_token: token }),
      });
      if (!res.ok && res.status !== 401) {
        console.error("[STRAVA] deauthorize failed:", res.status, await res.text());
      }
    }
  } catch (error) {
    console.error("[STRAVA] deauthorize threw:", error);
  }
  await prisma.oAuthToken.deleteMany({ where: { userId, provider: PROVIDER } });
}

/** Webhook deauthorization (user revoked access on strava.com): just drop the row. */
export async function forgetStravaAthlete(athleteId: string): Promise<void> {
  await prisma.oAuthToken.deleteMany({
    where: { provider: PROVIDER, providerAccountId: athleteId },
  });
}

/**
 * Map one Strava activity onto a Workout upsert. Returns the ids of local
 * activities whose milestones need a recompute (usually one; two when an edit
 * on Strava moved the activity to a different sport), or null when the
 * activity doesn't map to anything we track.
 *
 * Deliberately does NOT recompute milestones itself — callers batch that, so a
 * 200-activity initial import runs the engine once per affected activity
 * instead of 200 times.
 */
export async function importStravaActivity(
  userId: string,
  raw: StravaActivity
): Promise<string[] | null> {
  const slug = raw.sport_type ? SPORT_TO_SLUG[raw.sport_type] : undefined;
  if (!slug || !raw.start_date_local) return null;

  const distanceKm = Math.round(((raw.distance ?? 0) / 1000) * 100) / 100;
  const durationMin = Math.round(((raw.moving_time ?? 0) / 60) * 10) / 10;
  if (distanceKm <= 0 || durationMin <= 0) return null;
  if (distanceKm > MAX_DISTANCE_KM || durationMin > MAX_DURATION_MIN) return null;

  const activity = await prisma.activity.findUnique({ where: { slug } });
  if (!activity || activity.logKind !== "distance") return null;

  const externalId = String(raw.id);
  const date = raw.start_date_local.slice(0, 10); // athlete-local "YYYY-MM-DD"
  const isRace = raw.workout_type === 1 || raw.workout_type === 11;

  const existing = await prisma.workout.findUnique({
    where: { userId_externalId: { userId, externalId } },
    select: { activityId: true },
  });

  await prisma.workout.upsert({
    where: { userId_externalId: { userId, externalId } },
    update: { activityId: activity.id, date, distanceKm, durationMin, isRace },
    create: {
      userId,
      activityId: activity.id,
      date,
      distanceKm,
      durationMin,
      isRace,
      source: "strava",
      externalId,
    },
  });

  const affected = [activity.id];
  if (existing && existing.activityId !== activity.id) affected.push(existing.activityId);
  return affected;
}

/**
 * Webhook delete event: drop the imported workout and recompute.
 *
 * Trust-but-verify: Strava does not sign webhook events, so a delete is a
 * destructive claim from an unauthenticated caller. Before acting on it we ask
 * Strava whether the activity is actually gone (404) — a forged event for an
 * activity that still exists is ignored, and when Strava can't be reached we
 * refuse to delete rather than guess. Worst case of refusing: a stale workout
 * that the next real event or sync cleans up.
 */
export async function deleteStravaActivity(userId: string, stravaId: string): Promise<void> {
  const workout = await prisma.workout.findUnique({
    where: { userId_externalId: { userId, externalId: stravaId } },
    select: { id: true, activityId: true },
  });
  if (!workout) return;

  const token = await getAccessToken(userId);
  if (!token) return; // can't verify → don't delete
  const res = await fetch(`${API_BASE}/activities/${stravaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 404) return; // still exists (or unverifiable) → forged or flaky, ignore

  await prisma.workout.delete({ where: { id: workout.id } });
  await recomputeAutoMilestones(userId, workout.activityId);
}

/**
 * Is the user's Strava grant actually dead? Called before honouring a webhook
 * deauthorization event, which — like every webhook POST — is unauthenticated
 * and could be forged to force-disconnect someone. A live /athlete call proves
 * the grant still works, so the event was fake. Only a definite auth failure
 * (401/403, or a refresh rejected by Strava's token endpoint) counts as
 * deauthorized; network trouble keeps the token.
 */
export async function verifyStravaDeauthorized(userId: string): Promise<boolean> {
  try {
    const token = await getAccessToken(userId);
    if (!token) return true; // no stored grant — nothing to protect
    const res = await fetch(`${API_BASE}/athlete`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.status === 401 || res.status === 403;
  } catch (error) {
    // getAccessToken throws when the refresh request fails; a revoked grant is
    // rejected by the token endpoint with 400/401. Anything else (timeouts,
    // 5xx) is Strava having a bad day, not evidence of deauthorization.
    return /failed: (400|401|403) /.test(error instanceof Error ? error.message : "");
  }
}

/** Webhook create/update event: fetch the activity detail, import, recompute. */
export async function syncSingleActivity(userId: string, stravaId: string): Promise<void> {
  const token = await getAccessToken(userId);
  if (!token) return;
  const res = await fetch(`${API_BASE}/activities/${stravaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error("[STRAVA] activity fetch failed:", stravaId, res.status);
    return;
  }
  const affected = await importStravaActivity(userId, (await res.json()) as StravaActivity);
  for (const activityId of affected ?? []) {
    await recomputeAutoMilestones(userId, activityId);
  }
}

/**
 * Pull sync: pages through /athlete/activities since `sinceMs` (default: the
 * initial-import window) and imports everything that maps. Used for the
 * initial import after connect and the "sync now" button — the webhook keeps
 * things current in between.
 */
export async function syncStravaActivities(
  userId: string,
  sinceMs?: number
): Promise<StravaSyncResult> {
  const token = await getAccessToken(userId);
  if (!token) throw new Error("NOT_CONNECTED");

  const after = Math.floor(
    (sinceMs ?? Date.now() - INITIAL_IMPORT_DAYS * 24 * 60 * 60 * 1000) / 1000
  );

  const affected = new Set<string>();
  let imported = 0;
  let skipped = 0;

  // 4 pages × 100 = 400 activities per sync — same ceiling as the workout list
  // query, and far below the 200 req/15 min API budget (this is 4 requests).
  for (let page = 1; page <= 4; page++) {
    const res = await fetch(
      `${API_BASE}/athlete/activities?per_page=100&page=${page}&after=${after}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) {
      throw new Error(`Strava activities fetch failed: ${res.status}`);
    }
    const items = (await res.json()) as StravaActivity[];
    for (const item of items) {
      const ids = await importStravaActivity(userId, item);
      if (ids) {
        imported++;
        for (const id of ids) affected.add(id);
      } else {
        skipped++;
      }
    }
    if (items.length < 100) break;
  }

  for (const activityId of affected) {
    await recomputeAutoMilestones(userId, activityId);
  }
  return { imported, skipped };
}
