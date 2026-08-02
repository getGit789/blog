import "dotenv/config";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/**
 * This app runs in two runtimes: the local/production Node server (started
 * below) and Cloudflare Pages Functions (adapted via hono/cloudflare-pages in
 * functions/[[path]].ts). `UPLOADS`/`ASSETS` only exist on Cloudflare;
 * `incoming`/`outgoing` only exist on Node. Routes below branch on whichever
 * bindings are actually present rather than assuming one runtime.
 */
type R2Bucket = {
  put: (
    key: string,
    value: ArrayBuffer,
    opts?: { httpMetadata?: { contentType?: string } },
  ) => Promise<unknown>;
  get: (
    key: string,
  ) => Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string } } | null>;
};
type Bindings = Partial<HttpBindings> & {
  UPLOADS?: R2Bucket;
  ASSETS?: { fetch: (input: Request) => Promise<Response> };
};

const app = new Hono<{ Bindings: Bindings }>();

// Cloudflare bindings (APP_SECRET, DATABASE_URL, ...) only exist on this
// per-request env object, not at module load time, so api/lib/env.ts can't
// read them directly. Mirroring the string-valued ones onto process.env here,
// first thing on every request, is what lets env.ts's lazy proxy see them.
// Only strings are copied so this is a no-op for Node's HttpBindings
// (incoming/outgoing are objects) and for Cloudflare's own object bindings
// (UPLOADS, ASSETS).
app.use("*", async (c, next) => {
  for (const [key, value] of Object.entries(c.env ?? {})) {
    if (typeof value === "string") process.env[key] = value;
  }
  await next();
});

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// ── File Upload ───────────────────────────────────────────────
// Cloudflare (env.UPLOADS bound) stores to R2; local/Node dev writes to disk.

app.post("/api/upload", async (c) => {
  try {
    const body = await c.req.parseBody({ all: false });
    const file = body.file as File | undefined;

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate: only images
    if (!file.type.startsWith("image/")) {
      return c.json({ error: "Only image files are allowed" }, 400);
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const filename = `${timestamp}-${random}.${ext}`;

    const bucket = c.env?.UPLOADS;
    if (bucket) {
      await bucket.put(filename, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type },
      });
    } else {
      const uploadDir = env.isProduction
        ? join(process.cwd(), "dist", "public", "uploads")
        : join(process.cwd(), "public", "uploads");

      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
    }

    return c.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("[upload] error:", err);
    return c.json({ error: "Upload failed" }, 500);
  }
});

// Only reached on Cloudflare: local dev serves public/uploads as static files,
// and files uploaded to R2 after a deploy never exist in the static build
// output, so they need a dynamic route.
app.get("/uploads/:filename", async (c) => {
  const bucket = c.env?.UPLOADS;
  if (!bucket) return c.notFound();

  const object = await bucket.get(c.req.param("filename"));
  if (!object) return c.notFound();

  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
});

// ── tRPC ──────────────────────────────────────────────────────

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;
