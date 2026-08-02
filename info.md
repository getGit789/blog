# Personal Blog Fullstack Template

> **⚠ FULLSTACK — READ FIRST:** You MUST use the `backend-building` skill to make this website fullstack. You need to consider the user's query's intent and change the data accordingly.

A fullstack bilingual (中文 / English) personal blog + portfolio named **NEURAL ATELIER**. Three-column editorial layout (sidebar / posts feed / right rail), light & dark themes, Kimi OAuth + local username/password auth, and an admin-only authoring flow.

**You MUST use the `webapp-building` skill with this template info, then use the `backend-building` skill with the `--template` flag, to finish the initialization and change the project adapted to the user's requirement. Then you must deploy the website.**

## Language
If the user has not specified a language of the website, then the language of the website (the content you insert into the template) must match the language of the user's query.
If the user has specified a language of the website, then the language of the website must match the user's requirement.

**Default language on first load:** this template is bilingual, but the site must boot in exactly one language. Pick the initial state based on the user's query language:
This site boots in English for every first time visitor, regardless of browser language. The `SR / EN` toggle in the header lets visitors switch to Serbian, and that choice is remembered in `localStorage` under `blog-language`. Implemented in `src/contexts/LanguageContext.tsx`.

## Content
The actual content of the website should match the user's query.

## Where The Editable Content Lives

The site is driven by the database, not a config file. All posts / profile / CV / contact content is loaded through tRPC and seeded via `db/seed.ts`. A few strings remain inline in components — edit them directly:

- **`src/App.tsx`** — `NEURAL ATELIER (BLOG)` header wordmark, `LOG IN / 登入`, `ADMIN`, `LOADING...`, theme toggle `DARK / LIGHT`, language toggle `中 / EN`
- **`src/components/LeftColumn.tsx`** — profile column: avatar render, bio paragraphs (rendered from DB `profileBio.rsText / enText`), contact CTA label, social links
- **`src/components/MiddleColumn.tsx`** — year grouping, post list rendering (rendered from DB `posts`)
- **`src/components/RightColumn.tsx`** — CV rail section headers, CV row rendering (rendered from DB `cvEntries`)
- **`src/components/PostDetail.tsx`** — back-to-feed label, post detail layout
- **`src/components/ContactModal.tsx`** — form labels / placeholders, submit label; writes to `contacts` via tRPC
- **`src/pages/admin/AdminSettings.tsx`** — admin settings page: account credentials, avatar upload, profile bio and CV editing
- **`src/pages/Guestbook.tsx`** — guestbook page title + intro; reads from `contacts` table
- **`src/pages/admin/PostEditor.tsx`** — admin-only post editor for create and edit; writes to `posts` via tRPC
- **`src/pages/admin/AdminLogin.tsx`** — sign-in UI; local username/password only, no credential hints
- **`db/seed.ts`** — bootstrap content (initial posts, profile bio, CV entries, default avatar). **Run this to populate the starter blog.**

## Layout Constraints

- **Header wordmark** (`NEURAL ATELIER (BLOG)`): max ~28 characters, rendered 12px uppercase tracked
- **Bilingual post title** (`posts.rsTitle` / `posts.enTitle`): max ~30 characters; longer titles wrap awkwardly in the middle column
- **Post subtitle** (`rsSubtitle` / `enSubtitle`): max ~60 characters; single line in the feed
- **Collection label** (`rsCollection` / `enCollection`): max ~12 characters; rendered as a small uppercase tag
- **Year badge** (`posts.year`): 4-character year string, used as section header and grouping key
- **CV entry title/subtitle**: max ~60 / ~80 characters; long rows cause the right rail to overflow
- **CV category** (`cvEntries.category`): short slug (e.g. `exhibitions`, `publications`, `awards`) — used to group rows
- **Profile bio** (`profileBio.rsText` / `enText`): 1–3 short paragraphs; the left column is narrow (~260px)
- **Guestbook message**: plain text, no markdown; 500-char soft limit reads best
- **Avatar image**: square, uploaded at `/admin/settings`; default is `/images/covers/profile.jpeg`

## Database Schema

The template uses 7 tables (see `db/schema.ts`):

- **`users`** — managed by Kimi OAuth (id, unionId, name, email, avatar, role)
- **`localUsers`** — username/password auth records (id, username, passwordHash, name, role)
- **`posts`** — bilingual blog posts (id, year, image, sortOrder, rs/en title, subtitle, collection, content, detailContent)
- **`contacts`** — guestbook / contact form submissions (id, name, message, createdAt)
- **`profileBio`** — single-row profile bio (id=1, rsText, enText, email, instagram)
- **`cvEntries`** — CV / résumé rows grouped by category (id, category, rs/en title, subtitle, year, sortOrder)
- **`siteSettings`** — single-row site settings (id=1, avatarImage)

## Required Images

Images are referenced by URL from the database. Two starter image paths live under `public/images/`:

- **`/images/portrait.jpg`** — default profile avatar (square, 800×800+ recommended)
- **`/images/hero-art.jpg`**, **`/images/blog-1.jpg`** … — post cover images; seeded by `db/seed.ts`

When generating new content, upload new cover images through the admin post editor at `/admin/new-post` (which calls `contracts/upload` via tRPC and writes to `public/images/`) rather than editing paths by hand.

## Auth

> **Stale below this line in places.** This file predates the Serbian locale
> rename and still describes the `zh` build. `README.md` is the current
> reference; the auth section here has been corrected because it changed most
> recently.

One auth flow is live:

- **Local username/password** (`api/local-auth-router.ts` + `api/local-auth-session.ts`) — sign in at `/admin/login`. There is exactly one account, created by `db/seed.ts` with its password from `SEED_ADMIN_PASSWORD`. No registration endpoint exists.
- **Kimi OAuth** (`api/auth-router.ts` + `api/kimi/`) — code is present but unmounted; nothing imports it.

The public blog renders no auth UI at all, logged in or not. Everything an admin can do lives under `/admin`, which is reachable by URL only. That is presentation: authorization is enforced server side by `adminQuery` on every admin procedure.

## Design Reference

- Three-column layout: left profile (~260px), middle post feed (~flexible), right CV rail (~260px)
- Fixed 40px top header; no scroll on the shell — each column scrolls independently
- Fonts: Inter body, Space Mono for small labels, a custom serif for headlines
- Light / dark theme toggle writes CSS variables (`--bg-warm-white`, `--text-charcoal`, `--accent-teal`, `--border-light` …) to `document.documentElement`
- Animated shader hero via `src/components/ShaderCanvas.tsx` (three.js ambient backdrop)

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v3 + shadcn/ui component kit
- tRPC 11 + Hono + Drizzle ORM + MySQL backend
- Local username/password authentication. Kimi OAuth ships but is not mounted
- React Router v7
- three.js for the ambient hero shader

## Important Notes

- **Fullstack**: `api/`, `db/`, `contracts/`, `Dockerfile`, `tsconfig.server.json`, `vitest.config.ts`, `drizzle.config.ts`, `.backend-features.json` and `.env.example` are all part of this template
- `.backend-features.json` declares `["auth", "db"]`; `backend-building --template` will pick this up
- `.env.example` documents every required environment variable — the app will not start without `DATABASE_URL` etc.
- Do not remove `api/kimi/`, `api/local-auth-router.ts`, or `api/local-auth-session.ts` — they handle the two auth flows
- Content changes go through the admin zone at `/admin` or through `db/seed.ts`. Do not hard-code post content back into components
- The frontend is bilingual — every `posts` / `profileBio` / `cvEntries` row has both `rs*` and `en*` fields; both must be populated at insert time
