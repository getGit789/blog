// Stock files that shipped with the original template. Treated as "no image" so
// any post still pointing at one falls through to a generated cover.
const STOCK_IMAGES = new Set([
  "/images/hero-art.jpg",
  "/images/blog-1.jpg",
  "/images/blog-2.jpg",
  "/images/blog-3.jpg",
  "/images/blog-4.jpg",
  "/images/blog-5.jpg",
  "/images/blog-6.jpg",
]);

/** True when a post has its own cover photo rather than template stock. */
export function hasRealImage(image: string | null | undefined): boolean {
  return !!image && !STOCK_IMAGES.has(image);
}

/**
 * The WebP sibling of a cover JPEG, or null when there isn't one.
 *
 * Only the pre-built covers under /images/covers/ are shipped in both formats.
 * Admin uploads land in /uploads/ as a single file, so they get no source and
 * the plain <img> is used.
 */
export function webpFor(src: string): string | null {
  if (!src.startsWith("/images/covers/")) return null;
  return src.replace(/\.jpe?g$/i, ".webp");
}
