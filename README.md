# Personal Blog Fullstack Template

A fullstack bilingual (Srpski / English) personal blog and portfolio named **NEURAL ATELIER**. Three column editorial layout (sidebar / posts feed / right rail), light and dark themes, and a private admin zone at `/admin` for authoring. The public blog shows no sign that a login exists.

## Features

- Three column editorial layout: profile sidebar, post feed, CV rail
- Bilingual content (rs / en) for every post, bio paragraph and CV entry, with a language toggle in the header
- Light and dark theme toggle that writes CSS variables to `document.documentElement`
- Generated post covers: posts without an uploaded image draw a seeded SVG diagram themed to their collection
- Private admin zone at `/admin`: post dashboard, editor, guestbook moderation and settings, all behind a session guard
- Post authoring and editing (`/admin/new-post`, `/admin/edit/:id`) with image upload to `public/images/`
- Public guestbook (`/guestbook`) writing to the `contacts` table
- Profile bio, CV entries and avatar edited at `/admin/settings`
- Single local admin account, created by the seed. No registration endpoint and no login UI on the public blog
- Animated three.js shader backdrop behind the profile column, fading out over its bottom quarter

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v3 + shadcn/ui
- tRPC 11 + Hono + Drizzle ORM + SQLite (`@libsql/client`, no DB server needed)
- Local username and password authentication (JWT session cookie). Kimi OAuth code ships but is not mounted
- React Router v7
- three.js for the ambient hero shader

## Quick Start

1. Clone or extract this template
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`, then fill in `APP_SECRET` and `SEED_ADMIN_PASSWORD`. Kimi OAuth credentials are unused
4. Run database migrations: `npx drizzle-kit push`
5. Seed starter content and the admin account: `npm run db:seed`. Safe to re-run; it upserts the admin and resets the password to `SEED_ADMIN_PASSWORD`
6. Run the dev server: `npm run dev`
7. Build for production: `npm run build`

### Upgrading a database seeded before the Serbian rename

The locale used to be `zh`. Two scripts move an existing database across, both safe to re-run:

```bash
npm run db:rename-rs   # renames the zh* columns to rs*
npm run db:backfill    # applies the bilingual, dash free content in db/content.ts
```

`db:backfill` finishes with a verification pass and fails loudly if any text field still contains a dash.

## Deployment

Live at `https://blog.damirkranjcevic.com`, served from a Cloudflare Pages project (`blog`) connected to this repo's `main` branch: every push rebuilds and redeploys automatically, no separate CI config needed.

Cloudflare Pages Functions run on Workers, which have no persistent filesystem, so the deployed app differs from local dev in two places:

- **Database**: [Turso](https://turso.tech) (hosted libSQL) instead of a local file. Same `drizzle-orm/libsql` driver either way; `DATABASE_URL`/`DATABASE_AUTH_TOKEN` are set as Pages environment variables rather than in `.env`.
- **Uploads**: a Cloudflare R2 bucket (`blog-uploads`, bound as `UPLOADS`) instead of `public/uploads/`. `api/boot.ts`'s upload route branches on whether the R2 binding is present.

`functions/[[path]].ts` adapts the shared Hono app (`api/boot.ts`) for Pages Functions via `hono/cloudflare-pages`. The Node HTTP server used by `npm start` lives in the separate `api/serve-node.ts` entry, so none of its Node-only code is bundled into the Cloudflare deploy. See `TODO.md`'s Deployment section for the rest of the wiring (env var handling, `nodejs_compat`, seeding).

## Language

Two locales, `rs` (Serbian, Latin script) and `en`. The site always boots in English. The header toggle switches between them and the choice persists in `localStorage` under `blog-language`, so only a visitor's own choice overrides the English default. Every bilingual row (`posts`, `profileBio`, `cvEntries`) needs both `rs*` and `en*` fields populated.

## House style: no dashes

Post copy, bios and CV entries deliberately contain no em dashes, en dashes or hyphens. Clauses are joined with commas or split into separate sentences, compounds are written open (`full stack`, `self hosted`, `ecommerce`), and year ranges read `2022 to 2024` rather than `2022 - 2024`. Keep new content to the same rule; `npm run db:backfill` will flag violations in seeded content.

## Configuration

This template does not use `src/config.ts`. All user visible content is driven by the database and loaded through tRPC. A few static UI strings live inline in components, edit them there:

- **`src/App.tsx`** header wordmark, language and theme toggles, loading label, route table
- **`src/components/LeftColumn.tsx`** profile column (bio paragraphs render from `profileBio`)
- **`src/components/MiddleColumn.tsx`** post feed (renders from `posts`)
- **`src/components/RightColumn.tsx`** CV rail (renders from `cvEntries`, category labels are mapped for display)
- **`src/components/PostDetail.tsx`** post detail page layout
- **`src/components/PostCover.tsx`** generated cover art
- **`src/components/ContactModal.tsx`** contact form (writes to `contacts`)
- **`src/pages/Guestbook.tsx`** public guestbook page (read only)
- **`src/pages/admin/AdminLayout.tsx`** session guard and admin nav for everything under `/admin`
- **`src/pages/admin/AdminLogin.tsx`** admin sign in, no credential hints
- **`src/pages/admin/AdminDashboard.tsx`** post list with edit and delete
- **`src/pages/admin/PostEditor.tsx`** create and edit posts, both languages
- **`src/pages/admin/AdminSettings.tsx`** account, profile bio, avatar and CV editing
- **`src/pages/admin/AdminGuestbook.tsx`** guestbook moderation
- **`db/content.ts`** bilingual bootstrap content for posts, bio and CV entries

See `info.md` (outer folder) for layout character limits per field.

## Database Schema

Seven tables, defined in `db/schema.ts`:

- **`users`** Kimi OAuth managed (id, unionId, name, email, avatar, role)
- **`localUsers`** local username and password records (id, username, passwordHash, name, role)
- **`posts`** bilingual blog posts (id, year, image, sortOrder, rs\*/en\* title, subtitle, collection, content, detailContent)
- **`contacts`** guestbook and contact submissions (id, name, message, createdAt)
- **`profileBio`** single row profile bio (id=1, rsText, enText, email, instagram)
- **`cvEntries`** CV rows grouped by category (id, category, rs/en title, subtitle, year, sortOrder)
- **`siteSettings`** single row site settings (id=1, avatarImage)

## Images

Each post has a photographic cover under `public/images/covers/`, shipped as both WebP and JPEG and pre-cropped to the 16:10 frame the feed uses. `CoverImage` serves the WebP through a `<picture>` source and falls back to the JPEG. They run 18 to 40 KB as WebP; the template's original stock photos were around 300 KB each and showed marble statues and a rock on a table, which had nothing to do with the subject matter.

If a post has no cover, or still points at one of the deleted template stock paths, it falls back to a generated SVG cover from `src/components/PostCover.tsx`, themed by collection:

| Collection | Motif |
| --- | --- |
| Projects / Projekti | topographic contours |
| Tooling / Alati | stacked terminal windows |
| Notes / Beleške | ruled page with a marked passage |
| Indie Dev / Indi razvoj | nested boxes |

Generated covers are drawn with CSS variables so they follow the light and dark themes, and they are deterministic: the same post id always produces the same art. Run `npm run check:covers` to assert every motif renders valid geometry.

Uploading an image through the admin editor overrides both. Uploads land in `public/uploads/` as a single file and get no WebP sibling, which `webpFor` in `src/lib/covers.ts` handles by returning null.

The only other raster asset is `/images/portrait.jpg`, the profile avatar (square, 800x800 or larger recommended).

## Typography

Two families, with a clear division of labour:

- **Space Mono** carries the identity: header, labels, meta rows, section headings, post titles. Use the `.mono-label`, `.mono-meta`, `.mono-title` and `.headline` classes.
- **IBM Plex Serif** carries the reading: article body, post summaries, bio, CV subtitles. Use `.prose-serif` (article body, 17px / 1.75, measure capped at 68ch) and `.prose-lead` (summaries and bio).

Body copy is never justified. At these column widths justification opens rivers, so text is set ragged right with `text-wrap: pretty`. The type scale lives in `:root` in `src/index.css` as `--step-*` variables; change it there rather than in component inline styles.

## Design

- Three column layout: left profile (~21%), middle feed (flex), right CV rail (~25%)
- Fixed 40px top header, each column scrolls independently
- CSS variables drive the theme (`--bg-warm-white`, `--text-charcoal`, `--accent-teal`, `--border-light`, and the `--font-*` and `--step-*` type tokens)

## Notes

- Don't re-introduce hard coded post content into components. The DB is the source of truth
- Only local auth is live (`api/local-auth-router.ts`). `api/kimi/` is dormant and nothing imports it
- There is exactly one admin account and no way to create another through the API. `db/seed.ts` is the only thing that creates users
- Hiding admin UI is not security: every admin procedure is gated server side with `adminQuery`, which returns UNAUTHORIZED without a session and FORBIDDEN for a non-admin one
- Content edits go through the admin zone at `/admin` or `db/content.ts`
- The shader backdrop tracks its container with a `ResizeObserver`. Sizing it only on mount left it cut off partway down the column once the bio and CV loaded in
