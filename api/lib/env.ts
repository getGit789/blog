// On Node, process.env is populated once at boot (by the shell or dotenv) and
// never changes, so reading it eagerly would be fine. On Cloudflare Pages,
// bindings only exist inside the per-request handler, not at Worker cold
// start when this module's top level runs — a plain `const env = {...}`
// computed here would permanently capture empty values. The middleware at
// the top of api/boot.ts copies each request's string bindings onto
// process.env before any route handler runs, so this Proxy re-reads
// process.env on every property access instead of caching it once.

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

type Env = {
  appId: string;
  appSecret: string;
  isProduction: boolean;
  databaseUrl: string;
  databaseAuthToken: string;
  kimiAuthUrl: string;
  kimiOpenUrl: string;
  ownerUnionId: string;
};

function computeEnv(): Env {
  return {
    appId: required("APP_ID"),
    appSecret: required("APP_SECRET"),
    isProduction: process.env.NODE_ENV === "production",
    databaseUrl: process.env.DATABASE_URL ?? "./local.db",
    // Only needed against a remote libsql:// URL (Turso). Local dev's file: URL
    // ignores it.
    databaseAuthToken: process.env.DATABASE_AUTH_TOKEN ?? "",
    // Kimi OAuth is an optional second sign-in path and is not currently mounted:
    // the router serves local-auth-router, and nothing imports api/kimi/*. Marking
    // these required blocked production boot for a feature that never runs. The
    // Kimi module validates them itself if it is ever wired up.
    kimiAuthUrl: process.env.KIMI_AUTH_URL ?? "",
    kimiOpenUrl: process.env.KIMI_OPEN_URL ?? "",
    ownerUnionId: process.env.OWNER_UNION_ID ?? "",
  };
}

export const env: Env = new Proxy({} as Env, {
  get(_target, prop: keyof Env) {
    return computeEnv()[prop];
  },
});
