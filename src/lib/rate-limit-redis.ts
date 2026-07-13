// Durable rate limiter for the security-critical budgets (login, registration,
// password reset, e-mail verification).
//
// Why this exists alongside lib/rate-limit.ts: that one keeps its counters in a
// per-process Map. On Vercel every serverless instance owns a separate Map and
// instances are ephemeral, so the effective limit is `limit x instance_count`
// and a cold start resets it to zero. A brute-force burst is precisely what
// makes Vercel scale out, so an attacker is handed fresh counters as a side
// effect of attacking. That is fine for the convenience budgets (forum posts,
// API calls) and useless for the ones that gate credentials.
//
// Counters here live in Upstash Redis, so they are shared across instances and
// survive cold starts. Node.js runtime only — the Edge proxy must not import
// this (it does not import lib/rate-limit either; keep it that way).

import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { rateLimit, type RateLimitResult } from "@/lib/rate-limit";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

// Built once per process. Absent in local dev (and in any deploy where the vars
// were never set), which is the fallback path below rather than a hard failure.
const redis = url && token ? new Redis({ url, token }) : null;

// A Ratelimit instance is bound to one (limit, window) pair, so cache them
// rather than constructing one per call.
const limiters = new Map<string, Ratelimit>();

function limiterFor(client: Redis, limit: number, windowSeconds: number): Ratelimit {
  const cacheKey = `${limit}:${windowSeconds}`;
  const cached = limiters.get(cacheKey);
  if (cached) return cached;

  const limiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s` as Duration),
    prefix: "rl",
    analytics: false,
  });
  limiters.set(cacheKey, limiter);
  return limiter;
}

let warnedUnconfigured = false;

function fallback(key: string, limit: number, windowSeconds: number): RateLimitResult {
  return rateLimit(key, limit, windowSeconds);
}

/**
 * Same contract as {@link rateLimit}, but the window is stored in Redis and so
 * is shared across instances.
 *
 * Degrades to the in-memory store in two cases, both deliberately fail-open:
 *   - Upstash is not configured (local dev) — warned once, not per call.
 *   - Upstash is unreachable — a Redis outage must not take sign-in down with
 *     it. Availability beats a perfectly enforced limit; the in-memory window
 *     still throttles a single instance while Redis is away.
 */
export async function rateLimitPersistent(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (!redis) {
    if (!warnedUnconfigured) {
      warnedUnconfigured = true;
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set — " +
          "auth rate limits fall back to the per-instance in-memory store."
      );
    }
    return fallback(key, limit, windowSeconds);
  }

  try {
    const result = await limiterFor(redis, limit, windowSeconds).limit(key);
    if (result.success) return { allowed: true };
    // `reset` is an absolute epoch-ms deadline; the caller wants a duration.
    const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    return { allowed: false, retryAfterSeconds };
  } catch (error) {
    console.error("[rate-limit] Upstash unreachable — falling back to in-memory", error);
    return fallback(key, limit, windowSeconds);
  }
}
