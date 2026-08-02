/**
 * Fixed-window rate limiter held in process memory.
 *
 * This is a single-process SQLite app with one admin account, so an in-memory
 * counter is the whole requirement: there is no second instance to share state
 * with. It resets on restart, which is acceptable for slowing down password
 * guessing but would not be if this ever runs behind more than one node.
 * See TODO.md if that changes.
 */
type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Drops expired windows so a long-running process does not grow unbounded. */
function sweep(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the window resets. Only meaningful when blocked. */
  retryAfterSeconds: number;
};

export function hitRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  if (windows.size > 512) sweep(now);

  const existing = windows.get(key);
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Clears a key's window, so a successful login does not count against the next one. */
export function resetRateLimit(key: string) {
  windows.delete(key);
}

/**
 * Best-effort client address. Behind a proxy the socket address is the proxy's,
 * so the forwarded headers are preferred; both are spoofable by a client that
 * talks to the origin directly, which is why this only gates login attempts and
 * is not used for anything authorization depends on.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") || "unknown";
}
