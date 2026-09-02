// Descriptive URL slugs, keyed on enTitle — the same natural key
// scripts/sync-content.ts matches rows on, so no schema change is needed.
// A post created later through /admin keeps its numeric URL until a slug is
// added here. Old numeric URLs 301-redirect to these (see functions/[[path]].ts).
const SLUG_BY_TITLE: Record<string, string> = {
  "Self Hosted Lab v2": "proxmox-home-lab-self-hosting",
  "WPAS AI Assistant": "local-ai-support-assistant-architecture",
  "Building SudoWear": "running-online-store-solo",
  "Five Years in Support": "it-support-systems-engineering-lessons",
  "Running Linux on Everything": "fedora-43-thinkpad-t14-setup",
  "Poker and the Mental Game": "poker-lessons-engineering-decisions",
  "Beekio, One Person": "building-beekio-ai-beekeeping-assistant",
};

type PostRef = { id: number; enTitle: string };

export const postSlug = (p: PostRef): string => SLUG_BY_TITLE[p.enTitle] ?? String(p.id);

export const postPath = (p: PostRef): string => `/post/${postSlug(p)}`;

/** Resolve the <ref> in /post/<ref>: slug first, then legacy numeric id. */
export function findPostByRef<T extends PostRef>(posts: T[], ref: string): T | undefined {
  return (
    posts.find((p) => postSlug(p) === ref) ??
    (/^\d+$/.test(ref) ? posts.find((p) => p.id === Number(ref)) : undefined)
  );
}
