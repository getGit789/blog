import "dotenv/config";
import { getDb } from "../api/queries/connection";
import { posts, profileBio, cvEntries, localUsers, siteSettings } from "./schema";
import { seedPosts, seedCv, BIO_EN, BIO_RS } from "./content";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // 1. Seed admin user
  const existingUsers = await getDb().select().from(localUsers);
  if (existingUsers.length === 0) {
    const passwordHash = await bcrypt.hash("123456", 12);
    await getDb().insert(localUsers).values({
      username: "damir",
      passwordHash,
      name: "Damir Kranjčević",
      role: "admin",
    });
    console.log("  Created admin user (damir / 123456)");
  } else {
    console.log("  Admin user already exists");
  }

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
      avatarImage: "/images/portrait.jpg",
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
