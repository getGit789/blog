import { drizzle } from "drizzle-orm/libsql";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

// Only bare local paths need file: prepended; anything already carrying one
// of libsql's own supported schemes (a remote Turso URL, notably) must pass
// through untouched.
const LIBSQL_SCHEMES = /^(file|libsql|https|http|wss|ws):/;

function toFileUrl(pathOrUrl: string): string {
  if (LIBSQL_SCHEMES.test(pathOrUrl)) {
    return pathOrUrl;
  }
  return `file:${pathOrUrl}`;
}

export function getDb() {
  if (!instance) {
    instance = drizzle({
      connection: {
        url: toFileUrl(env.databaseUrl),
        authToken: env.databaseAuthToken || undefined,
      },
      schema: fullSchema,
    });
  }
  return instance;
}
