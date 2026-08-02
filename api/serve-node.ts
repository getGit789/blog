/**
 * Node production entrypoint. Kept separate from api/boot.ts so that file
 * stays a pure, side-effect-free Hono app that's safe to import from the
 * Cloudflare Pages Functions bundle (functions/[[path]].ts) too: that bundle
 * runs in a Workers isolate, which has no @hono/node-server and would crash
 * on boot if this file's serve() call lived in boot.ts instead.
 */
import { serve } from "@hono/node-server";
import app from "./boot";
import { serveStaticFiles } from "./lib/vite";

serveStaticFiles(app);

const port = parseInt(process.env.PORT || "3000");
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
