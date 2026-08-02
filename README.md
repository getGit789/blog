# Personal Blog Fullstack Template

A fullstack bilingual (Srpski / English) personal blog and portfolio named **NEURAL ATELIER**. Three column editorial layout (sidebar / posts feed / right rail), light and dark themes, Kimi OAuth plus local username and password auth, and an admin only authoring flow.

## Features

- Three column editorial layout: profile sidebar, post feed, CV rail
- Bilingual content (rs / en) for every post, bio paragraph and CV entry, with a language toggle in the header
- Light and dark theme toggle that writes CSS variables to `document.documentElement`
- Generated post covers: posts without an uploaded image draw a seeded SVG diagram themed to their collection
- Admin only post authoring (`/admin/new-post`) with image upload to `public/images/`
- Public guestbook (`/guestbook`) writing to the `contacts` table
- Editable profile bio, CV entries and avatar through the settings modal (admin only)
- Dual auth: Kimi OAuth and local username and password. The first local user is auto promoted to admin
- Animated three.js shader backdrop behind the profile column, fading out over its bottom quarter

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v3 + shadcn/ui
- tRPC 11 + Hono + Drizzle ORM + SQLite (`@libsql/client`, no DB server needed)
- Kimi OAuth 2.0 **and** local username and password authentication (both enabled)
- React Router v7
- three.js for the ambient hero shader

## Quick Start

1. Clone or extract this template
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in `APP_SECRET`. Kimi OAuth credentials are optional for local dev, username and password auth works without them
4. Run database migrations: `npx drizzle-kit push`
5. Seed starter content (posts, profile bio, CV entries): `npm run db:seed`
6. Run the dev server: `npm run dev`
7. Build for production: `npm run build`

### Upgrading a database seeded before the Serbian rename

The locale used to be `zh`. Two scripts move an existing database across, both safe to re-run:

```bash
npm run db:rename-rs   # renames the zh* columns to rs*
npm run db:backfill    # applies the bilingual, dash free content in db/content.ts
```

`db:backfill` finishes with a verification pass and fails loudly if any text field still contains a dash.

## Language

Two locales, `rs` (Serbian, Latin script) and `en`. The site always boots in English. The header toggle switches between them and the choice persists in `localStorage` under `blog-language`, so only a visitor's own choice overrides the English default. Every bilingual row (`posts`, `profileBio`, `cvEntries`) needs both `rs*` and `en*` fields populated.

## House style: no dashes

Post copy, bios and CV entries deliberately contain no em dashes, en dashes or hyphens. Clauses are joined with commas or split into separate sentences, compounds are written open (`full stack`, `self hosted`, `ecommerce`), and year ranges read `2022 to 2024` rather than `2022 - 2024`. Keep new content to the same rule; `npm run db:backfill` will flag violations in seeded content.

## Configuration

This template does not use `src/config.ts`. All user visible content is driven by the database and loaded through tRPC. A few static UI strings live inline in components, edit them there:

- **`src/App.tsx`** header wordmark, `LOG IN`, language and theme toggles, loading label
- **`src/components/LeftColumn.tsx`** profile column (bio paragraphs render from `profileBio`)
- **`src/components/MiddleColumn.tsx`** post feed (renders from `posts`)
- **`src/components/RightColumn.tsx`** CV rail (renders from `cvEntries`, category labels are mapped for display)
- **`src/components/PostDetail.tsx`** post detail page layout
- **`src/components/PostCover.tsx`** generated cover art
- **`src/components/ContactModal.tsx`** contact form (writes to `contacts`)
- **`src/components/SettingsModal.tsx`** admin settings modal (editable profile and avatar)
- **`src/pages/Guestbook.tsx`** guestbook page
- **`src/pages/NewPost.tsx`** admin only post editor
- **`src/pages/Login.tsx`** sign in UI (Kimi and local)
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
- Both auth flows stay live at the same time (`api/kimi/` and `api/local-auth-router.ts`), and the first local user is auto admin
- Content edits go through the admin UI (`SettingsModal`, `NewPost`) or `db/content.ts`
- The shader backdrop tracks its container with a `ResizeObserver`. Sizing it only on mount left it cut off partway down the column once the bio and CV loaded in
