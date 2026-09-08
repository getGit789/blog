/** True when a post has its own cover photo rather than falling back to generated art. */
export function hasRealImage(image: string | null | undefined): boolean {
  return !!image;
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

/** The first "video: /path.mp4" block in a post body, or null. A post with a clip shows it in the feed instead of the cover. */
export function videoFor(detailContent: string): string | null {
  return /^video: (\S+)/m.exec(detailContent)?.[1] ?? null;
}
