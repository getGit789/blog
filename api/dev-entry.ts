// Vite's dev server (@hono/vite-dev-server) entry. Loads .env before
// anything else runs, then hands off to the real app. This indirection keeps
// api/boot.ts itself free of a dotenv import: boot.ts is also bundled
// directly into the Cloudflare Pages Functions build, where dotenv's
// internal (unprefixed) fs/path/os/crypto requires fail to resolve.
import "dotenv/config";

export { default } from "./boot";
