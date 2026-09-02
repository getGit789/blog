// New cover art, keyed on enTitle like contracts/slugs.ts. The image paths
// live in DB rows, but this working copy has no production database
// credentials, so the overrides win at read time instead. db/content.ts
// carries the same paths for the next successful sync.
// ponytail: delete this map once sync-content --apply runs against production.
type Cover = { image?: string; detailImage?: string };

const COVER_BY_TITLE: Record<string, Cover> = {
  "Self Hosted Lab v2": { image: "/images/covers/self-hosted-lab-v3.webp" },
  "Building SudoWear": { image: "/images/covers/sudowear-v3.webp" },
  "Five Years in Support": { image: "/images/covers/five-years-support-v2.webp" },
  "Poker and the Mental Game": {
    image: "/images/covers/poker-mental-game-v3.webp",
    detailImage: "/images/covers/damir-poker-trophy.webp",
  },
};

type PostLike = { enTitle: string; image: string; detailImage: string | null };

export const coverImage = (p: PostLike): string => COVER_BY_TITLE[p.enTitle]?.image ?? p.image;

export const coverDetailImage = (p: PostLike): string =>
  COVER_BY_TITLE[p.enTitle]?.detailImage ?? p.detailImage ?? coverImage(p);
