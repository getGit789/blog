import "dotenv/config";
import { createClient } from "@libsql/client";

// Renames the legacy zh* columns to rs* (Serbian). Safe to re-run: each rename
// is skipped when the target column already exists.
const url = process.env.DATABASE_URL?.startsWith("file:")
  ? process.env.DATABASE_URL
  : `file:${process.env.DATABASE_URL ?? "./local.db"}`;

const client = createClient({ url });

const renames: Array<[string, string, string]> = [
  ["posts", "zhTitle", "rsTitle"],
  ["posts", "zhSubtitle", "rsSubtitle"],
  ["posts", "zhCollection", "rsCollection"],
  ["posts", "zhContent", "rsContent"],
  ["posts", "zhDetailContent", "rsDetailContent"],
  ["cvEntries", "zhTitle", "rsTitle"],
  ["cvEntries", "zhSubtitle", "rsSubtitle"],
  ["profileBio", "zhText", "rsText"],
];

async function columns(table: string): Promise<string[]> {
  const res = await client.execute(`PRAGMA table_info(${table})`);
  return res.rows.map((r) => String(r.name));
}

(async () => {
  for (const [table, from, to] of renames) {
    const cols = await columns(table);
    if (cols.includes(to)) {
      console.log(`skip ${table}.${from} (${to} already present)`);
      continue;
    }
    if (!cols.includes(from)) {
      console.log(`skip ${table}.${from} (column missing)`);
      continue;
    }
    await client.execute(`ALTER TABLE ${table} RENAME COLUMN "${from}" TO "${to}"`);
    console.log(`renamed ${table}.${from} -> ${to}`);
  }
  console.log("done");
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
