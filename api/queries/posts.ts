import { eq, asc } from "drizzle-orm";
import { getDb } from "./connection";
import { posts } from "@db/schema";
import type { InsertPost } from "@db/schema";
import { seedPosts } from "@db/content";

// db/content.ts is the source of truth for the seeded articles; sync-content
// pushes it into the DB, and a later sync overwrites admin edits to those rows
// either way. This working copy holds no production DB credentials, so the
// newest body text is overlaid at read time until a sync lands.
// ponytail: delete the overlay once sync-content --apply reaches production.
const seedByTitle = new Map(seedPosts.map((p) => [p.enTitle, p]));

export async function findAllPosts() {
  const rows = await getDb()
    .select()
    .from(posts)
    .orderBy(asc(posts.sortOrder));
  return rows.map((row) => {
    const seed = seedByTitle.get(row.enTitle);
    return seed
      ? { ...row, enDetailContent: seed.enDetailContent, rsDetailContent: seed.rsDetailContent }
      : row;
  });
}

export async function findPostById(id: number) {
  const rows = await getDb()
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  return rows.at(0) ?? null;
}

export async function createPost(data: InsertPost) {
  const result = await getDb()
    .insert(posts)
    .values(data)
    .returning({ id: posts.id });
  const id = result[0]?.id;
  if (!id) throw new Error("Failed to create post");
  return findPostById(id);
}

export async function updatePost(id: number, data: Partial<InsertPost>) {
  await getDb()
    .update(posts)
    .set(data)
    .where(eq(posts.id, id));
  return findPostById(id);
}

export async function deletePost(id: number) {
  await getDb()
    .delete(posts)
    .where(eq(posts.id, id));
}

export async function seedPostsIfEmpty(postsData: InsertPost[]) {
  const existing = await findAllPosts();
  if (existing.length > 0) return { seeded: false, count: existing.length };

  for (const post of postsData) {
    await getDb().insert(posts).values(post);
  }
  return { seeded: true, count: postsData.length };
}
