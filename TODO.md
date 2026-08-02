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

- [ ] **Admin password is still the seed default.** The `damir` account
      (role `admin`) has the password from `db/seed.ts` (`123456`). Change it
      through the settings modal, or update the seed before anyone else runs
      `npm run db:seed` against a fresh database.
- [ ] **`APP_SECRET` in `.env` is a local dev placeholder.** Generate a real
      secret for any deployed environment. Never commit `.env`.
- [ ] **Kimi OAuth is unconfigured** (`VITE_KIMI_AUTH_URL`, `VITE_APP_ID`,
      `KIMI_AUTH_URL`, `KIMI_OPEN_URL`, `OWNER_UNION_ID` are all empty in
      `.env`). Local username and password auth works fine without it, so this
      only matters if Kimi login should be live too.
- [ ] **No git repository yet.** Nothing here is version controlled. Worth
      doing before more content changes stack up and become hard to review.

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
