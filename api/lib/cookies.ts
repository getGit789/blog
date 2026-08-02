import type { CookieOptions } from "hono/utils/cookie";

function isLocalhost(headers: Headers): boolean {
  const host = headers.get("host") || "";
  return host.startsWith("localhost:") || host.startsWith("127.0.0.1:");
}

/**
 * The session cookie is always SameSite=Lax.
 *
 * The frontend and the API are served from the same origin (Vite proxies
 * /api/* to the Hono app in dev, and boot.ts serves dist/public in prod), so
 * Lax is enough for the cookie to ride along on every same-site request while
 * still blocking it on cross-site POSTs. SameSite=None would only be needed
 * for a frontend on a different site, and it removes that CSRF protection.
 */
export function getSessionCookieOptions(headers: Headers): CookieOptions {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    secure: !isLocalhost(headers),
  };
}
