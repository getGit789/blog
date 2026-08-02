import "dotenv/config";
import { getDb } from "../api/queries/connection";
import { posts, profileBio, cvEntries } from "../db/schema";
import { seedPosts, seedCv, BIO_EN, BIO_RS } from "../db/content";
import { eq } from "drizzle-orm";

// Applies the bilingual, dash free content in db/content.ts to a database that
// was already seeded with the old English only rows. Matches posts by sortOrder
// and CV entries by sortOrder, so it is safe to re-run.

const DASH = /[‐-―−-]/;

(async () => {
  const db = getDb();

  // 1. Bio
  await db.update(profileBio).set({ rsText: BIO_RS, enText: BIO_EN }).where(eq(profileBio.id, 1));
  console.log("bio updated");

  // 2. Posts, matched on sortOrder
  const existingPosts = await db.select().from(posts);
  let postCount = 0;
  for (const seed of seedPosts) {
    const row = existingPosts.find((p) => p.sortOrder === seed.sortOrder);
    if (!row) {
      console.log(`  no post with sortOrder ${seed.sortOrder}, skipping`);
      continue;
    }
    await db
      .update(posts)
      .set({
        year: seed.year,
        image: seed.image,
        rsTitle: seed.rsTitle,
        rsSubtitle: seed.rsSubtitle,
        rsCollection: seed.rsCollection,
        rsContent: seed.rsContent,
        rsDetailContent: seed.rsDetailContent,
        enTitle: seed.enTitle,
        enSubtitle: seed.enSubtitle,
        enCollection: seed.enCollection,
        enContent: seed.enContent,
        enDetailContent: seed.enDetailContent,
      })
      .where(eq(posts.id, row.id));
    postCount++;
  }
  console.log(`posts updated: ${postCount}`);

  // 3. CV entries, matched on sortOrder
  const existingCv = await db.select().from(cvEntries);
  let cvCount = 0;
  for (const seed of seedCv) {
    const row = existingCv.find((c) => c.sortOrder === seed.sortOrder);
    if (!row) {
      console.log(`  no cv entry with sortOrder ${seed.sortOrder}, skipping`);
      continue;
    }
    await db
      .update(cvEntries)
      .set({
        category: seed.category,
        rsTitle: seed.rsTitle,
        rsSubtitle: seed.rsSubtitle,
        enTitle: seed.enTitle,
        enSubtitle: seed.enSubtitle,
        year: seed.year,
      })
      .where(eq(cvEntries.id, row.id));
    cvCount++;
  }
  console.log(`cv entries updated: ${cvCount}`);

  // 4. Verify no dashes survived anywhere
  let bad = 0;
  const check = (label: string, value: string | null) => {
    if (value && DASH.test(value)) {
      console.log(`  DASH in ${label}: ${value.slice(0, 100)}`);
      bad++;
    }
  };

  for (const r of await db.select().from(posts)) {
    for (const k of [
      "rsTitle", "rsSubtitle", "rsCollection", "rsContent", "rsDetailContent",
      "enTitle", "enSubtitle", "enCollection", "enContent", "enDetailContent", "year",
    ] as const) {
      check(`post ${r.id}.${k}`, r[k]);
    }
  }
  for (const r of await db.select().from(cvEntries)) {
    for (const k of ["rsTitle", "rsSubtitle", "enTitle", "enSubtitle", "year"] as const) {
      check(`cv ${r.id}.${k}`, r[k]);
    }
  }
  for (const r of await db.select().from(profileBio)) {
    check(`bio ${r.id}.rsText`, r.rsText);
    check(`bio ${r.id}.enText`, r.enText);
  }

  console.log(bad === 0 ? "VERIFY OK: no dashes in any text field" : `VERIFY FAILED: ${bad} fields still contain a dash`);
  process.exit(bad === 0 ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
