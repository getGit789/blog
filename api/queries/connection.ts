import { drizzle } from "drizzle-orm/libsql";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

function toFileUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("file:") || pathOrUrl.startsWith("libsql:")) {
    return pathOrUrl;
  }
  return `file:${pathOrUrl}`;
}

export function getDb() {
  if (!instance) {
    instance = drizzle(toFileUrl(env.databaseUrl), { schema: fullSchema });
  }
  return instance;
}
