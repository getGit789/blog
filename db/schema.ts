import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  unionId: text("unionId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  avatar: text("avatar"),
  role: text("role", { enum: ["user", "admin"] })
    .default("user")
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
  lastSignInAt: integer("lastSignInAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Local Users (username/password auth) ──────────────────────

export const localUsers = sqliteTable("localUsers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  name: text("name"),
  role: text("role", { enum: ["user", "admin"] })
    .default("user")
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = typeof localUsers.$inferInsert;

// ── Blog Posts ────────────────────────────────────────────────

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  year: text("year").notNull(),
  image: text("image").notNull(),
  sortOrder: integer("sortOrder").default(0),
  rsTitle: text("rsTitle").notNull(),
  rsSubtitle: text("rsSubtitle").notNull(),
  rsCollection: text("rsCollection").notNull(),
  rsContent: text("rsContent").notNull(),
  rsDetailContent: text("rsDetailContent").notNull(),
  enTitle: text("enTitle").notNull(),
  enSubtitle: text("enSubtitle").notNull(),
  enCollection: text("enCollection").notNull(),
  enContent: text("enContent").notNull(),
  enDetailContent: text("enDetailContent").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

// ── Contact Messages (guestbook) ──────────────────────────────

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  message: text("message").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// ── Profile Bio (editable, single row) ────────────────────────

export const profileBio = sqliteTable("profileBio", {
  id: integer("id").default(1).primaryKey(),
  rsText: text("rsText").notNull(),
  enText: text("enText").notNull(),
  email: text("email"),
  instagram: text("instagram"),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export type ProfileBio = typeof profileBio.$inferSelect;
export type InsertProfileBio = typeof profileBio.$inferInsert;

// ── CV Entries (editable) ─────────────────────────────────────

export const cvEntries = sqliteTable("cvEntries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
  rsTitle: text("rsTitle").notNull(),
  rsSubtitle: text("rsSubtitle"),
  enTitle: text("enTitle").notNull(),
  enSubtitle: text("enSubtitle"),
  year: text("year").notNull(),
  sortOrder: integer("sortOrder").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export type CvEntry = typeof cvEntries.$inferSelect;
export type InsertCvEntry = typeof cvEntries.$inferInsert;

// ── Site Settings (avatar, etc.) ──────────────────────────────

export const siteSettings = sqliteTable("siteSettings", {
  id: integer("id").default(1).primaryKey(),
  avatarImage: text("avatarImage").default("/images/portrait.jpg"),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;
