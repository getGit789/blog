import type { Post } from "@db/schema";
import { postPath, findPostByRef } from "../contracts/slugs";

/**
 * The site is a client-rendered SPA, so every URL used to return the same empty
 * shell: one shared <title>, no <h1>, no text and no links. A crawler that does
 * not run JavaScript therefore saw nine identical, wordless, link-less pages.
 *
 * This module fills that shell in at the edge, so each route ships real HTML.
 * The markup is the same content React draws a moment later — createRoot()
 * clears #root on mount, so a visitor only sees it while the bundle boots.
 */

const SITE = "Damir Kranjčević / @root";
const HOME_TITLE = "Damir Kranjčević / Tech Blog";
const HOME_DESC =
  "Notes on Linux, self hosting, DevOps, and building software solo, by Damir Kranjčević (@root), full stack engineer and founder of Beekio LLC.";
const GUESTBOOK_DESC =
  "Leave a note. The guestbook on Damir Kranjčević's tech blog, for anyone passing through.";
const HANDLE = "@damirroot";
const FALLBACK_IMAGE = "/images/covers/beekio.jpg";

export type Route =
  | { kind: "home" }
  | { kind: "guestbook" }
  | { kind: "post"; ref: string };

/**
 * Cheap path test, kept separate from prerender() so a request for /admin or an
 * unknown URL never pays for the database round trip that posts require.
 * A post ref is a slug or a legacy numeric id; findPostByRef resolves it.
 */
export function matchRoute(pathname: string): Route | null {
  if (pathname === "/" || pathname === "") return { kind: "home" };
  if (pathname === "/guestbook" || pathname === "/guestbook/") return { kind: "guestbook" };
  const post = /^\/post\/([\w-]+)\/?$/.exec(pathname);
  if (post) return { kind: "post", ref: post[1] };
  return null;
}

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Trim to a length search engines will actually show, on a word boundary. */
function clamp(s: string, max = 155) {
  const flat = s.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (space > 40 ? cut.slice(0, space) : cut).replace(/[,;:.\s]+$/, "") + "…";
}

const paras = (text: string) =>
  text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p)}</p>`)
    .join("");

const postItem = (p: Post) =>
  `<li><a href="${postPath(p)}">${esc(p.enTitle)}</a> — ${esc(clamp(p.enSubtitle, 120))}</li>`;

type Page = {
  title: string;
  description: string;
  path: string;
  image: string;
  type: "website" | "article";
  body: string;
};

function build(route: Route, posts: Post[]): Page | null {
  if (route.kind === "home") {
    return {
      title: HOME_TITLE,
      description: HOME_DESC,
      path: "/",
      image: posts[0]?.image || FALLBACK_IMAGE,
      type: "website",
      body:
        `<h1>${esc(HOME_TITLE)}</h1><p>${esc(HOME_DESC)}</p>` +
        `<h2>Articles</h2>` +
        posts
          .map(
            (p) =>
              `<article><h3><a href="${postPath(p)}">${esc(p.enTitle)}</a></h3>` +
              `<p>${esc(p.enCollection)} / ${esc(p.year)}</p>` +
              `<p>${esc(p.enSubtitle)}</p><p>${esc(clamp(p.enContent, 400))}</p></article>`,
          )
          .join("") +
        `<p><a href="/guestbook">Guestbook</a></p>`,
    };
  }

  if (route.kind === "guestbook") {
    return {
      title: `Guestbook — ${SITE}`,
      description: GUESTBOOK_DESC,
      path: "/guestbook",
      image: posts[0]?.image || FALLBACK_IMAGE,
      type: "website",
      body:
        `<p><a href="/">${esc(SITE)}</a></p>` +
        `<h1>Guestbook</h1><p>${esc(GUESTBOOK_DESC)}</p>` +
        `<h2>Articles</h2><ul>${posts.map(postItem).join("")}</ul>`,
    };
  }

  const post = findPostByRef(posts, route.ref);
  if (!post) return null;
  const others = posts.filter((p) => p.id !== post.id);

  return {
    title: `${post.enTitle} — ${SITE}`,
    description: clamp(post.enSubtitle || post.enContent),
    path: postPath(post),
    image: post.detailImage || post.image,
    type: "article",
    body:
      `<p><a href="/">${esc(SITE)}</a></p>` +
      `<p>${esc(post.enCollection)} / ${esc(post.year)}</p>` +
      `<h1>${esc(post.enTitle)}</h1><p>${esc(post.enSubtitle)}</p>` +
      paras(post.enDetailContent) +
      `<h2>More articles</h2><ul>${others.map(postItem).join("")}</ul>` +
      `<p><a href="/">Back to all articles</a></p>`,
  };
}

// Self contained: the site stylesheet has not applied yet at this point, so the
// pre-rendered markup carries the little styling it needs to be readable.
const STYLE =
  `<style>#root>.pre{max-width:720px;margin:0 auto;padding:48px 24px;` +
  `font-family:'IBM Plex Serif',Georgia,serif;line-height:1.7;color:#1a1a1a}` +
  `#root>.pre h1{font-size:2rem;line-height:1.25;margin:0 0 12px}` +
  `#root>.pre h2{font-size:1.15rem;margin:36px 0 10px}` +
  `#root>.pre h3{font-size:1.05rem;margin:24px 0 6px}` +
  `#root>.pre p{margin:0 0 16px}#root>.pre a{color:inherit}` +
  `#root>.pre ul{padding-left:20px}#root>.pre li{margin:0 0 8px}</style>`;

/**
 * Returns the shell with head tags and body content filled in, or null when the
 * route has no content to render (an unknown post id), so the caller can serve
 * the untouched shell and let the SPA show its own not-found page.
 */
export function prerender(
  shell: string,
  route: Route,
  origin: string,
  posts: Post[],
): string | null {
  const page = build(route, posts);
  if (!page) return null;

  const url = origin + page.path;
  const image = origin + page.image;
  const head = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${page.type}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:site_name" content="${esc(SITE)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="${HANDLE}" />`,
    `<meta name="twitter:creator" content="${HANDLE}" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  ].join("\n    ");

  // Function replacers throughout: post text may contain "$&" or "$1", which a
  // string replacement would expand.
  return shell
    .replace(/<title>[\s\S]*?<\/title>\s*/, "")
    .replace(/<meta\s+name="description"[^>]*>\s*/, "")
    .replace(/<meta\s+property="og:[^>]*>\s*/g, "")
    .replace("</head>", () => `${head}\n  </head>`)
    .replace(
      /<div id="root"><\/div>/,
      () => `<div id="root">${STYLE}<div class="pre">${page.body}</div></div>`,
    );
}
