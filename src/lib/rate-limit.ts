// In-memory sliding-window rate limiter. Zero dependencies, Node.js runtime only
// — the Map lives in one process, so this must NOT be used from the Edge proxy
// (each isolate would keep its own counters). Call it from server actions and
// API route handlers instead.
//
// A multi-instance deployment gives each instance its own window; the effective
// limit scales with the instance count. Swap the store for Redis if that matters.

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

/** key → timestamps (ms) of the requests still inside their window. */
const hits = new Map<string, number[]>();

const CLEANUP_INTERVAL_MS = 60_000;

// Longest window any caller uses decides how long a stale key may linger; we
// prune per-key against its own window on access, so the sweep only needs to
// drop keys nobody has touched recently.
const MAX_WINDOW_MS = 60 * 60 * 1000;

const sweep = setInterval(() => {
  const cutoff = Date.now() - MAX_WINDOW_MS;
  for (const [key, timestamps] of hits) {
    if (timestamps.length === 0 || timestamps[timestamps.length - 1] <= cutoff) {
      hits.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

// Keeps the timer from holding the process open (tests, scripts, graceful exit).
sweep.unref?.();

/**
 * Check whether an action is allowed for `key`, and record it if so.
 *
 * @param key           unique identifier — e.g. `login:user@example.com`, `api:notion:{userId}`
 * @param limit         max requests permitted within the window
 * @param windowSeconds sliding window duration, in seconds
 */
export function rateLimit(key: string, limit: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= limit) {
    hits.set(key, recent);
    // The oldest hit is the first to fall out of the window; that's when a slot frees up.
    const retryAfterSeconds = Math.max(1, Math.ceil((recent[0] - windowStart) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true };
}
