import "dotenv/config";
import { getDb } from "../api/queries/connection";
import { posts, profileBio, cvEntries, siteSettings } from "./schema";
import { upsertAdminUser } from "../api/queries/local-users";
import { seedPosts, seedCv, BIO_EN, BIO_RS } from "./content";

/**
 * This file is the single source of truth for the admin account. Nothing else
 * creates local users: there is no registration endpoint, and the API layer
 * only ever reads or updates the row seeded here.
 */
const ADMIN_USERNAME = "damir";
const ADMIN_NAME = "Damir Kranjčević";

/** The placeholder that shipped in git history; refused outright in production. */
const KNOWN_WEAK_PASSWORD = "123456";

function adminPassword(): string {
  const password = process.env.SEED_ADMIN_PASSWORD ?? "";
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && (!password || password === KNOWN_WEAK_PASSWORD)) {
    throw new Error(
      "SEED_ADMIN_PASSWORD must be set to a real password before seeding a " +
        "production database. Refusing to seed with an empty or default value.",
    );
  }

  if (!password) {
    console.warn(
      `  ! SEED_ADMIN_PASSWORD is unset, falling back to "${KNOWN_WEAK_PASSWORD}" for local dev.\n` +
        "    Set it in .env before deploying anywhere reachable.",
    );
    return KNOWN_WEAK_PASSWORD;
  }
  return password;
}

async function seed() {
  console.log("Seeding database...");

  // 1. Seed admin user. Upserted by username so re-running the seed resets the
  //    password to whatever the environment says rather than failing or
  //    inserting a duplicate.
  const { created } = await upsertAdminUser({
    username: ADMIN_USERNAME,
    password: adminPassword(),
    name: ADMIN_NAME,
  });
  console.log(
    created
      ? `  Created admin user (${ADMIN_USERNAME}), password from SEED_ADMIN_PASSWORD`
      : `  Admin user (${ADMIN_USERNAME}) already existed, password reset from SEED_ADMIN_PASSWORD`,
  );

  // 2. Seed blog posts
  const existingPosts = await getDb().select().from(posts);
  if (existingPosts.length === 0) {
    for (const post of seedPosts) {
      await getDb().insert(posts).values(post);
    }
    console.log(`  Seeded ${seedPosts.length} blog posts`);
  } else {
    console.log(`  ${existingPosts.length} blog posts already exist`);
  }

  // 3. Seed profile bio
  const existingBio = await getDb().select().from(profileBio);
  if (existingBio.length === 0) {
    await getDb().insert(profileBio).values({
      id: 1,
      rsText: BIO_RS,
      enText: BIO_EN,
      email: "contact@damirkranjcevic.com",
      instagram: "https://www.instagram.com/damir.kranjcevic/",
    });
    console.log("  Seeded profile bio");
  } else {
    console.log("  Profile bio already exists");
  }

  // 4. Seed CV entries
  const existingCv = await getDb().select().from(cvEntries);
  if (existingCv.length === 0) {
    for (const entry of seedCv) {
      await getDb().insert(cvEntries).values(entry);
    }
    console.log(`  Seeded ${seedCv.length} CV entries`);
  } else {
    console.log(`  ${existingCv.length} CV entries already exist`);
  }

  // 5. Seed site settings
  const existingSettings = await getDb().select().from(siteSettings);
  if (existingSettings.length === 0) {
    await getDb().insert(siteSettings).values({
      id: 1,
      avatarImage: "/images/covers/profile.jpeg",
    });
    console.log("  Seeded site settings");
  } else {
    console.log("  Site settings already exist");
  }

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
