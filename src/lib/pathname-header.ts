/**
 * Header the proxy attaches to every pass-through request, carrying the request
 * path into the React tree.
 *
 * A server component cannot read the pathname: `usePathname` is client-only and
 * nothing in `headers()` survives a rewrite reliably. The root layout reads this
 * to decide whether to render the app chrome (Nav + the 760px container) or hand
 * the landing page a bare, full-width canvas.
 *
 * Its own module so the layout does not have to import src/proxy.ts, which
 * pulls next-auth/jwt and the Edge runtime into the server bundle.
 */
export const PATHNAME_HEADER = "x-pathname";
