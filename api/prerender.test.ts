import { describe, it, expect } from "vitest";
import { matchRoute, prerender } from "./prerender";
import type { Post } from "@db/schema";

const SHELL = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Damir Kranjčević / Tech Blog</title>
    <meta name="description" content="old description" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://damirkranjcevic.com/blog" />
    <script type="module" crossorigin src="/assets/index-abc.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

const post = (id: number, over: Partial<Post> = {}): Post =>
  ({
    id,
    year: "2026",
    image: `/images/covers/p${id}.jpg`,
    detailImage: null,
    sortOrder: id,
    rsTitle: "RS", rsSubtitle: "RS", rsCollection: "RS", rsContent: "RS", rsDetailContent: "RS",
    enTitle: `Post ${id}`,
    enSubtitle: `Subtitle ${id}`,
    enCollection: "Projects",
    enContent: `Teaser ${id}`,
    enDetailContent: `Body ${id} first.\n\nBody ${id} second.`,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    ...over,
  }) as Post;

const POSTS = [post(1), post(2), post(3)];
const ORIGIN = "https://blog.damirkranjcevic.com";

const render = (path: string, posts = POSTS) => {
  const route = matchRoute(path);
  return route ? prerender(SHELL, route, ORIGIN, posts) : null;
};

describe("matchRoute", () => {
  it("matches the three public routes and nothing else", () => {
    expect(matchRoute("/")).toEqual({ kind: "home" });
    expect(matchRoute("/guestbook")).toEqual({ kind: "guestbook" });
    expect(matchRoute("/post/12")).toEqual({ kind: "post", ref: "12" });
    expect(matchRoute("/post/proxmox-home-lab-self-hosting")).toEqual({
      kind: "post",
      ref: "proxmox-home-lab-self-hosting",
    });
    expect(matchRoute("/admin")).toBeNull();
    expect(matchRoute("/admin/settings")).toBeNull();
    expect(matchRoute("/nope")).toBeNull();
  });
});

describe("prerender", () => {
  it("gives each route its own title, canonical and description", () => {
    const home = render("/")!;
    const one = render("/post/1")!;

    expect(home).toContain(`<link rel="canonical" href="${ORIGIN}/" />`);
    expect(one).toContain(`<link rel="canonical" href="${ORIGIN}/post/1" />`);
    expect(one).toContain("<title>Post 1 — Damir Kranjčević / @root</title>");
    expect(one).toContain('content="Subtitle 1"');
    // The stale tags from the shell are gone, not merely appended to.
    expect(one).not.toContain("old description");
    expect(one).not.toContain("damirkranjcevic.com/blog");
    expect(one.match(/<title>/g)).toHaveLength(1);
    expect(one.match(/property="og:url"/g)).toHaveLength(1);
  });

  it("ships an h1, body text and social tags on a post", () => {
    const one = render("/post/1")!;
    expect(one).toContain("<h1>Post 1</h1>");
    expect(one).toContain("<p>Body 1 first.</p>");
    expect(one).toContain("<p>Body 1 second.</p>");
    expect(one).toContain('<meta property="og:type" content="article" />');
    expect(one).toContain('name="twitter:card" content="summary_large_image"');
    // og:image must be absolute for a card to render.
    expect(one).toContain(`content="${ORIGIN}/images/covers/p1.jpg"`);
  });

  it("links home to every post, so no post is an orphan", () => {
    const home = render("/")!;
    for (const p of POSTS) expect(home).toContain(`href="/post/${p.id}"`);
    expect(home).toContain('href="/guestbook"');
  });

  it("gives a post outgoing links to home and its siblings", () => {
    const one = render("/post/1")!;
    expect(one).toContain('href="/"');
    expect(one).toContain('href="/post/2"');
    expect(one).toContain('href="/post/3"');
    expect(one).not.toContain('href="/post/1"'); // no self link
  });

  it("returns null for a post that does not exist", () => {
    expect(render("/post/999")).toBeNull();
    expect(render("/post/no-such-slug")).toBeNull();
  });

  it("serves a mapped post by slug and by legacy id, canonical on the slug", () => {
    const mapped = [post(1, { enTitle: "Self Hosted Lab v2" }), post(2)];
    const canonical = `<link rel="canonical" href="${ORIGIN}/post/proxmox-home-lab-self-hosting" />`;

    const bySlug = render("/post/proxmox-home-lab-self-hosting", mapped)!;
    expect(bySlug).toContain("<h1>Self Hosted Lab v2</h1>");
    expect(bySlug).toContain(canonical);
    // A mapped title also gets its hand-written search snippet, not the subtitle.
    expect(bySlug).toContain('content="Rebuilding my home lab on Proxmox');

    // The old numeric URL still renders (the edge 301s it in production) and
    // never advertises itself: canonical and links point at the slug.
    const byId = render("/post/1", mapped)!;
    expect(byId).toContain(canonical);

    const home = render("/", mapped)!;
    expect(home).toContain('href="/post/proxmox-home-lab-self-hosting"');
    expect(home).not.toContain('href="/post/1"');
  });

  it("noindexes only the guestbook", () => {
    expect(render("/guestbook")!).toContain('<meta name="robots" content="noindex, follow" />');
    expect(render("/")!).not.toContain('name="robots"');
    expect(render("/post/1")!).not.toContain('name="robots"');
  });

  it("ships BlogPosting structured data on a post but not on home", () => {
    const one = render("/post/1")!;
    const ld = /<script type="application\/ld\+json">(.*?)<\/script>/.exec(one);
    expect(ld).not.toBeNull();
    const data = JSON.parse(ld![1]);
    expect(data["@type"]).toBe("BlogPosting");
    expect(data.headline).toBe("Post 1");
    expect(data.author.name).toBe("Damir Kranjčević");
    expect(data.datePublished).toBe(new Date(0).toISOString());
    expect(data.image).toBe(`${ORIGIN}/images/covers/p1.jpg`);
    expect(data.mainEntityOfPage).toBe(`${ORIGIN}/post/1`);

    expect(render("/")!).not.toContain("ld+json");
  });

  it("escapes html and does not expand $ patterns from post text", () => {
    const nasty = post(1, {
      enTitle: "Cost: $5 & <script>",
      enDetailContent: "Paid $& then $1 and $`.",
    });
    const out = render("/post/1", [nasty])!;
    expect(out).toContain("Cost: $5 &amp; &lt;script&gt;");
    // "$&" survives verbatim (escaped), proving no regex expansion happened.
    expect(out).toContain("<p>Paid $&amp; then $1 and $`.</p>");
    expect(out).not.toContain("<script>Cost");
  });

  it("leaves the app bundle and the root div intact", () => {
    const home = render("/")!;
    expect(home).toContain('src="/assets/index-abc.js"');
    expect(home).toContain('<div id="root">');
    expect(home).toContain("</body>");
  });
});
