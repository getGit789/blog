import { handle } from "hono/cloudflare-pages";
import app from "../api/boot";
import { matchRoute, prerender } from "../api/prerender";
import { postPath, findPostByRef } from "../contracts/slugs";
import { findAllPosts } from "../api/queries/posts";

/**
 * Catch-all Pages Function. Cloudflare only invokes this for requests that
 * don't match a static file in the build output, so real assets (JS bundles,
 * favicon, etc.) are served directly and never reach here. /api/* and
 * /uploads/* are handled by routes already registered on `app`; everything
 * else is a client-side route from the SPA router.
 *
 * A known page route is answered from index.html with that page's own title,
 * meta tags and content filled in (see api/prerender.ts). That is decided from
 * the path alone, never from whether ASSETS happens to 404, because the local
 * dev runtime and production disagree on that.
 */
app.get("*", async (c) => {
  // ASSETS is always bound on Cloudflare, the only runtime this route runs in.
  const assets = c.env.ASSETS!;
  const url = new URL(c.req.url);
  // "/" and not "/index.html": the asset server 308-redirects the explicit
  // filename to "/", so asking for it by name returns a redirect, not the page.
  const shell = () =>
    assets.fetch(new Request(new URL("/", c.req.url), c.req.raw));

  const route = matchRoute(url.pathname);
  if (!route) {
    const hit = await assets.fetch(c.req.raw);
    return hit.status === 404 ? shell() : hit;
  }

  const shellRes = await shell();
  // A database blip must never take the site down: on any failure the plain
  // shell still goes out and the SPA renders exactly as it did before.
  try {
    const posts = await findAllPosts();
    // A legacy /post/<id> URL (or a trailing-slash variant) is permanently
    // redirected to the post's canonical slug URL, so old links and search
    // results carry over instead of splitting into duplicate pages.
    if (route.kind === "post") {
      const post = findPostByRef(posts, route.ref);
      if (post && url.pathname !== postPath(post)) {
        return c.redirect(postPath(post) + url.search, 301);
      }
    }
    const html = prerender(await shellRes.clone().text(), route, url.origin, posts);
    if (!html) return shellRes;
    const headers = new Headers(shellRes.headers);
    headers.delete("content-length");
    headers.delete("etag"); // describes the unmodified shell, not this body
    return new Response(html, { status: 200, headers });
  } catch (err) {
    console.error("[prerender] falling back to shell:", err);
    return shellRes;
  }
});

export const onRequest = handle(app);
