# What is left on this blog

Snapshot as of 2026-08-02. Ordered by what blocks a real launch first.

## Content

- [ ] **Five posts are still one line drafts.** Only *Self Hosted Lab v2* has a
      full article, everything else has a summary and a placeholder body
      ("Draft in progress"):
      - WPAS AI Assistant
      - Building SudoWear
      - Five Years in Support
      - Running Linux on Everything
      - Poker and the Mental Game

      Send notes per post (what actually happened, what broke, specifics) and
      they can be written in both languages to match the tone of the finished
      post. See `db/content.ts` for where the text lives.

## Before this goes on the public internet

- [ ] **Set `SEED_ADMIN_PASSWORD` in `.env`.** The admin password now comes
      from that variable rather than being hardcoded. With it unset the seed
      falls back to `123456` and prints a warning; with `NODE_ENV=production`
      it refuses to seed at all if the value is empty or still `123456`. Set a
      real one and re-run `npm run db:seed` (the seed upserts, so this is also
      the password reset path). Changing it afterwards is done at
      `/admin/settings`, which requires the current password and forces a
      re-login.
- [ ] **`APP_SECRET` in `.env` is a local dev placeholder.** Generate a real
      secret for any deployed environment (`openssl rand -hex 32`). Never
      commit `.env`. The server already refuses to boot in production without
      it.
- [ ] **Kimi OAuth is unconfigured and unmounted** (`VITE_KIMI_AUTH_URL`,
      `VITE_APP_ID`, `KIMI_AUTH_URL`, `KIMI_OPEN_URL`, `OWNER_UNION_ID` are
      all empty in `.env`). Nothing imports `api/kimi/*`, so this only matters
      if Kimi login should ever be live.
- [ ] **No git repository yet.** Nothing here is version controlled. Worth
      doing before more content changes stack up and become hard to review.

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

- [ ] **Production JS bundle is large:** `dist/boot.js` is about 1.3 MB and
      Vite warns the client bundle is over 500 KB after minification. Not
      broken, but worth revisiting with route level code splitting
      (`build.rollupOptions.output.manualChunks` or dynamic `import()`) if
      load time on a slow connection matters.
- [ ] **Five of the six generated post covers lean dark and moody**; only the
      SudoWear packing table cover is bright. Coherent as a set, but flag it
      if the feed should read lighter overall. Regenerating any of them is a
      small, cheap job (Higgsfield `soul_location`, about 0.12 credits each).
- [ ] **`local.db.bak`** sits at the project root from before the `zh` to `rs`
      column rename. Safe to delete once you've confirmed the live `local.db`
      looks right; it is only a safety net.

## Not broken, just worth knowing

- The avatar (`/uploads/1785669300605-gbp09q.jpeg`) and the static fallback
  (`public/images/portrait.jpg`, still a stock photo of a woman) are two
  different things. The live site uses the uploaded photo; the static file is
  only shown if `siteSettings.avatarImage` is ever cleared. No action needed
  unless that fallback should also be swapped for a real photo.
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
