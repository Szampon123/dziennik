// The caller's IP, as seen through the platform proxy.
//
// On Vercel `x-forwarded-for` is set by the platform on every inbound request
// and a client cannot spoof it — the edge overwrites whatever the client sent.
// The leftmost entry is the originating client; the rest are proxy hops. If this
// app is ever self-hosted behind a *different* proxy, that trust assumption has
// to be re-checked: a proxy that appends rather than overwrites would let a
// client prepend an address of its choosing.
//
// Takes a Headers rather than calling next/headers itself, so it works both in
// server actions (`clientIp(await headers())`) and inside Auth.js `authorize()`,
// which is handed the raw Request instead of running in the next/headers scope.

/** Marks a request with no forwarded-for header — see UNKNOWN_IP note below. */
export const UNKNOWN_IP = "unknown";

/**
 * Rate-limit keys built on this must decide what to do with {@link UNKNOWN_IP}:
 * it is not an address, it is the *absence* of one, so every such caller shares
 * a single bucket. On Vercel it should never occur in production. Bucketing them
 * together and enforcing a limit would throttle unrelated callers as a group.
 */
export function clientIp(headers: { get(name: string): string | null }): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || UNKNOWN_IP;
}
