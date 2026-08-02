import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDb } from "./connection";
import { localUsers } from "@db/schema";
import type { LocalUser } from "@db/schema";

export async function findLocalUserByUsername(
  username: string,
): Promise<LocalUser | undefined> {
  const rows = await getDb()
    .select()
    .from(localUsers)
    .where(eq(localUsers.username, username))
    .limit(1);
  return rows.at(0);
}

export async function findLocalUserById(
  id: number,
): Promise<LocalUser | undefined> {
  const rows = await getDb()
    .select()
    .from(localUsers)
    .where(eq(localUsers.id, id))
    .limit(1);
  return rows.at(0);
}

/**
 * Creates the admin account, or resets the existing one's password in place.
 *
 * This is the only way a local user is ever created: there is no registration
 * endpoint and only the owner has an account. Keying on the username makes
 * `npm run db:seed` safe to re-run against a database that already has the
 * admin row, which is the normal case after the first seed.
 */
export async function upsertAdminUser(data: {
  username: string;
  password: string;
  name: string;
}): Promise<{ user: LocalUser; created: boolean }> {
  const passwordHash = await bcrypt.hash(data.password, 12);
  const existing = await findLocalUserByUsername(data.username);

  if (existing) {
    await getDb()
      .update(localUsers)
      .set({ passwordHash, name: data.name, role: "admin" })
      .where(eq(localUsers.id, existing.id));
    const user = await findLocalUserById(existing.id);
    if (!user) throw new Error("Admin user vanished during upsert");
    return { user, created: false };
  }

  const result = await getDb()
    .insert(localUsers)
    .values({
      username: data.username,
      passwordHash,
      name: data.name,
      role: "admin",
    })
    .returning({ id: localUsers.id });
  const id = result[0]?.id;
  if (!id) throw new Error("Failed to create admin user");
  const user = await findLocalUserById(id);
  if (!user) throw new Error("Failed to fetch created admin user");
  return { user, created: true };
}

export async function verifyLocalPassword(
  user: LocalUser,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export async function updateLocalUser(
  id: number,
  data: {
    username?: string;
    password?: string;
    name?: string;
  },
): Promise<LocalUser> {
  const updateData: Partial<typeof localUsers.$inferInsert> = {};
  if (data.username !== undefined) updateData.username = data.username;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.password !== undefined) {
    updateData.passwordHash = await bcrypt.hash(data.password, 12);
  }

  await getDb()
    .update(localUsers)
    .set(updateData)
    .where(eq(localUsers.id, id));

  const user = await findLocalUserById(id);
  if (!user) throw new Error("User not found after update");
  return user;
}
