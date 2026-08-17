/**
 * Encodes source cover art into the two files the site actually serves.
 *
 * Sources are full-resolution renders kept outside the repo. For each one we
 * emit a WebP (what almost every browser gets) and a JPEG of the same frame
 * (the fallback <img> in CoverImage). Both are pre-cropped to the 16:10 box the
 * feed and the article header render into, so the browser never downloads
 * pixels that get cropped away at paint time.
 *
 * Usage: tsx scripts/encode-covers.ts <source-dir> [--contain <hex>]
 * Every .png in the source dir becomes <name>.webp + <name>.jpg in public/images/covers/.
 *
 * The default centre-crops, which is right for photography: a still life has
 * slack at the edges and loses nothing worth keeping. It is wrong for artwork
 * that was composed to its own frame. A 1200x630 brand image cropped to 16:10
 * loses 8% off each side, which is enough to clip a logo or the first letter
 * of a headline. Pass --contain with the artwork's own background colour to
 * letterbox instead, so the whole frame survives.
 */
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * The article header is the widest place a cover is ever painted: 720px of
 * layout, so 1440 is exactly 2x for a retina screen. Anything larger is bytes
 * the browser downloads and then throws away when it scales the image down.
 */
const WIDTH = 1440;
const HEIGHT = 900;

/**
 * Encoding starts at BASE_QUALITY and steps down until the frame fits BUDGET.
 * A flat quality does not work across this set: the still lifes land around
 * 30KB, while the two dense flat-lays (linen weave, graph paper) hold so much
 * high-frequency detail that the same setting costs three times as much. At
 * the size these are painted, stepping those two down is invisible, so the
 * budget buys real bandwidth for no perceptible loss.
 */
const BASE_QUALITY = 76;
const MIN_QUALITY = 58;
const QUALITY_STEP = 6;
const BUDGET = 80 * 1024;

/**
 * WebP normally beats JPEG by a wide margin here, but on the densest frames
 * (fine linen weave, graph paper) it loses outright. Since CoverImage offers
 * the WebP first, that would ship the *larger* file to almost every visitor,
 * so those frames get pushed below the JPEG even if it means extra quality
 * loss in a format nobody would otherwise have been served.
 */
const FLOOR_QUALITY = 30;

const OUT_DIR = path.join(process.cwd(), "public/images/covers");

/** Encodes to WebP, easing quality down until the result fits the budget. */
async function encodeWebp(frame: sharp.Sharp) {
  let quality = BASE_QUALITY;
  let buffer = await frame.clone().webp({ quality, effort: 6 }).toBuffer();

  while (buffer.length > BUDGET && quality > MIN_QUALITY) {
    quality -= QUALITY_STEP;
    buffer = await frame.clone().webp({ quality, effort: 6 }).toBuffer();
  }
  return { buffer, quality };
}

/** Keeps reducing the WebP until it is genuinely smaller than the JPEG. */
async function undercut(frame: sharp.Sharp, webp: Buffer, quality: number, target: number) {
  while (webp.length >= target && quality > FLOOR_QUALITY) {
    quality -= QUALITY_STEP;
    webp = await frame.clone().webp({ quality, effort: 6 }).toBuffer();
  }
  return { buffer: webp, quality };
}

/** Reads `--contain <hex>`, the opt-in to letterbox rather than crop. */
function containColour(argv: string[]): string | null {
  const at = argv.indexOf("--contain");
  if (at === -1) return null;

  const colour = argv[at + 1];
  if (!colour || !/^#[0-9a-f]{6}$/i.test(colour)) {
    console.error("--contain needs a six digit hex colour, e.g. --contain '#0B0A08'");
    process.exit(1);
  }
  return colour;
}

async function main() {
  const sourceDir = process.argv[2];
  if (!sourceDir || sourceDir.startsWith("--")) {
    console.error("usage: tsx scripts/encode-covers.ts <source-dir> [--contain <hex>]");
    process.exit(1);
  }
  const contain = containColour(process.argv);

  await mkdir(OUT_DIR, { recursive: true });
  const sources = (await readdir(sourceDir)).filter((f) => f.endsWith(".png")).sort();

  let webpTotal = 0;

  for (const file of sources) {
    const name = path.basename(file, ".png");
    // Framed once, then encoded twice, so both formats frame identically.
    const frame = sharp(path.join(sourceDir, file)).resize(WIDTH, HEIGHT, {
      fit: contain ? "contain" : "cover",
      position: "centre",
      ...(contain ? { background: contain } : {}),
    });

    const first = await encodeWebp(frame);
    const jpeg = await frame
      .clone()
      .jpeg({ quality: first.quality, mozjpeg: true, progressive: true })
      .toBuffer();
    const { buffer: webp, quality } = await undercut(
      frame,
      first.buffer,
      first.quality,
      jpeg.length,
    );

    // Written verbatim: handing these buffers back to sharp would decode and
    // re-encode them at its default quality, discarding the budget above.
    await writeFile(path.join(OUT_DIR, `${name}.webp`), webp);
    await writeFile(path.join(OUT_DIR, `${name}.jpg`), jpeg);

    webpTotal += webp.length;
    console.log(
      `${name.padEnd(30)} q${quality}  webp ${String(Math.round(webp.length / 1024)).padStart(3)}KB   ` +
        `jpg ${String(Math.round(jpeg.length / 1024)).padStart(3)}KB`,
    );
  }

  console.log(`\n${sources.length} covers — ${Math.round(webpTotal / 1024)}KB of WebP total`);
}

main();
