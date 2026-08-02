import { handle } from "hono/cloudflare-pages";
import app from "../api/boot";

/**
 * Catch-all Pages Function. Cloudflare only invokes this for requests that
 * don't match a static file in the build output, so real assets (JS bundles,
 * favicon, etc.) are served directly and never reach here. /api/* and
 * /uploads/* are handled by routes already registered on `app`; everything
 * else is a client-side route from the SPA router, so it falls back to
 * index.html.
 */
app.get("*", async (c) => {
  // ASSETS is always bound on Cloudflare, the only runtime this route runs in.
  const assets = c.env.ASSETS!;
  const first = await assets.fetch(c.req.raw);
  if (first.status !== 404) return first;
  return assets.fetch(new Request(new URL("/index.html", c.req.url), c.req.raw));
});

export const onRequest = handle(app);
