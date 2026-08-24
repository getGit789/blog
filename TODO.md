# What is left on this blog

Snapshot as of 2026-08-24 (verified against the live site and the production database). Ordered by what blocks a real launch first.

## Content

- [x] **All seven posts are written**, both languages, full articles. Verified
      2026-08-24 against `blog.damirkranjcevic.com/api/trpc/blog.list`: seven
      rows, every `enDetailContent` and `rsDetailContent` between 1.6k and 3.8k
      characters, none containing the draft placeholder.
- [ ] **`DRAFT_EN` / `DRAFT_RS` in `db/content.ts` are now unused.** Leftovers
      from when five posts were stubs. Delete them, or keep them as the
      placeholder for the next post that starts as a stub.

## Before this goes on the public internet

- [ ] **Kimi OAuth is unconfigured and unmounted** (`VITE_KIMI_AUTH_URL`,
      `VITE_APP_ID`, `KIMI_AUTH_URL`, `KIMI_OPEN_URL`, `OWNER_UNION_ID` are
      all empty in `.env`). Nothing imports `api/kimi/*`, so this only matters
      if Kimi login should ever be live.

## Deployment (Cloudflare Pages)

Live at `https://blog.damirkranjcevic.com`, deployed from the `blog` Cloudflare
Pages project connected to this repo's `main` branch — every push rebuilds and
redeploys automatically.

- **Database**: Turso (hosted libSQL), same `drizzle-orm/libsql` driver as
  local dev, just pointed at a `libsql://`/`https://` URL instead of a file.
  `DATABASE_URL` and `DATABASE_AUTH_TOKEN` are set as Pages environment
  variables, not in this repo's `.env`.
- **File uploads**: Cloudflare R2 (`blog-uploads` bucket, bound as `UPLOADS`).
  `api/boot.ts`'s upload route branches on whether `c.env.UPLOADS` exists —
  R2 on Cloudflare, local disk in Node dev.
- **Entry point**: `functions/[[path]].ts` adapts the same Hono app
  (`api/boot.ts`) via `hono/cloudflare-pages`, with an SPA fallback to
  `index.html` for client-side routes. The Node HTTP server (`npm start`) is
  a separate entry, `api/serve-node.ts`, so none of its `@hono/node-server`
  code ships in the Cloudflare bundle.
- **Env vars only exist per-request on Cloudflare** (Workers bindings, not a
  boot-time `process.env`), so `api/lib/env.ts` is a Proxy that re-reads
  `process.env` on every access, and middleware at the top of `api/boot.ts`
  copies each request's string bindings onto `process.env` before anything
  else runs. Don't change `env` back to a plain object without re-checking
  this — it silently breaks DB access on Cloudflare only, not in local dev.
- **`nodejs_compat`** compatibility flag is required (set on the Pages
  project) for `bcryptjs`/`fs`/etc. to resolve inside the Workers bundle.
- Seeding is a one-time manual step against the Turso database
  (`DATABASE_URL`/`DATABASE_AUTH_TOKEN`/`SEED_ADMIN_PASSWORD` as env vars,
  then `npm run db:seed`), never part of the build — the build command is
  `npm run build:pages` (frontend only), which does not touch the database.

## Known auth debt

- [ ] **A password change does not kill other live sessions.** Sessions are
      stateless JWTs signed with `APP_SECRET`, so an already-issued token stays
      valid until it expires (currently one year) even after the password
      changes. Changing the password does expire the cookie on the session that
      made the change, which is the realistic case for a single-admin blog. The
      real fixes, in increasing order of work: shorten `Session.maxAgeMs` in
      `contracts/constants.ts`; or add a `tokenVersion` column to `localUsers`,
      put it in the JWT claim, bump it on every credential change, and reject
      tokens whose version is stale in `api/context.ts`. Not implemented on
      purpose.
- [ ] **Login rate limiting is per process and in memory.** `api/lib/rate-limit.ts`
      allows five attempts per fifteen minutes per client address, which is
      enough for one SQLite-backed node. It resets on restart and is not shared,
      so running more than one instance behind a load balancer would multiply
      the effective limit by the instance count. Move the counter to the
      database or a shared store if this is ever scaled out. The client address
      comes from `x-forwarded-for`, so put a proxy you trust in front of it or
      the header can be spoofed.

## Known rough edges

- [ ] **Production JS bundle is large:** `dist/serve-node.js` (the Node
      server bundle, only used by `npm start`, not the Cloudflare deploy) is
      about 1.3 MB, and Vite warns the client bundle is over 500 KB after
      minification. Not
      broken, but worth revisiting with route level code splitting
      (`build.rollupOptions.output.manualChunks` or dynamic `import()`) if
      load time on a slow connection matters.
- [ ] **Most post covers lean dark and moody**; only the SudoWear packing
      table cover is bright. Coherent as a set, but flag it if the feed should
      read lighter overall. Seven covers now, each a JPEG plus a WebP, Beekio
      included. Regenerating any of them is a small, cheap job (Higgsfield
      `soul_location`, about 0.12 credits each).
- [ ] **`local.db.bak`** sits at the project root from before the `zh` to `rs`
      column rename. Safe to delete once you've confirmed the live `local.db`
      looks right; it is only a safety net.

## Not broken, just worth knowing

- The stock `public/images/portrait.jpg` fallback is gone, and nothing in
  `src/` references it any more. `public/images/profile.jpeg` is the real
  photo now.
- The English fallback text hardcoded in `LeftColumn.tsx` and
  `RightColumn.tsx` (shown only if the database bio or CV table is ever
  empty) is a safety net, not what's rendering today. No need to touch it
  unless the tone should change there too.

## Already done, for reference

- `zh` (Chinese) locale fully renamed to `rs` (Serbian), including the
  database columns, with a real rewritten bio, CV and post summaries in a
  looser, spoken register.
- Every dash in seeded content replaced with commas or periods.
- Six generated photographic covers replacing the original stock images,
  served as WebP with a JPEG fallback.
- Typography split into a mono system for chrome/labels and a serif system
  for reading, with a capped measure and no justified text.
- Hero shader backdrop no longer cuts off mid page (was sized once on mount,
  now tracks its container), and fades out smoothly starting at 3/4 height
  instead of ending on a hard edge.
- Site now always boots in English; the SR/EN toggle persists a visitor's own
  choice.
- Contact email and Instagram URL corrected everywhere they're referenced.
- Avatar parallax fixed: the image is now sized larger than its frame so the
  scroll linked motion never uncovers the page background at the bottom edge.
