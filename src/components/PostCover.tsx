import { useMemo } from "react";

/**
 * Generated post covers.
 *
 * The template shipped with unrelated stock photography (gallery statues, a
 * rock on a table) which said nothing about a Linux and DevOps blog. Rather
 * than swap one set of stock images for another, each post draws its own
 * cover: a seeded plotter style diagram in the site palette, so the feed reads
 * as one designed system and every post is still visually distinct.
 *
 * Everything is drawn with CSS variables, so covers follow the light and dark
 * themes for free, and an SVG costs a few hundred bytes instead of 300 KB.
 */

// ── Seeded randomness ────────────────────────────────────────────
// Same post always draws the same cover, across reloads and machines.

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Motifs ───────────────────────────────────────────────────────
// One per collection, so the archive stays legible at a glance.

const W = 1200;
const H = 750;

type Rand = () => number;

/** Projects: topographic contours. Terrain being surveyed and built on. */
function contours(rand: Rand): string[] {
  const paths: string[] = [];
  const cx = W * (0.55 + rand() * 0.2);
  const cy = H * (0.45 + rand() * 0.2);
  const rings = 13;
  for (let i = 0; i < rings; i++) {
    const rx = 60 + i * (46 + rand() * 14);
    const ry = rx * (0.52 + rand() * 0.12);
    const points: string[] = [];
    const steps = 84;
    for (let s = 0; s <= steps; s++) {
      const a = (s / steps) * Math.PI * 2;
      const wobble = 1 + Math.sin(a * (3 + (i % 3)) + i) * (0.05 + rand() * 0.02);
      const x = cx + Math.cos(a) * rx * wobble;
      const y = cy + Math.sin(a) * ry * wobble;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    paths.push(`M${points.join("L")}Z`);
  }
  return paths;
}

/** Tooling: a stack of terminal windows seen edge on. */
function terminals(rand: Rand): Array<{ x: number; y: number; w: number; h: number; rows: number[] }> {
  const out = [];
  const count = 3;
  for (let i = 0; i < count; i++) {
    const w = 380 + rand() * 220;
    const h = 200 + rand() * 90;
    const x = 120 + i * 130 + rand() * 40;
    const y = 110 + i * 120 + rand() * 30;
    const rows = Array.from({ length: 5 }, () => 0.25 + rand() * 0.65);
    out.push({ x, y, w, h, rows });
  }
  return out;
}

/** Notes: ruled paper with one passage marked. */
function ruled(rand: Rand): Array<{ y: number; w: number; marked: boolean }> {
  const lines = [];
  const count = 18;
  const markStart = 4 + Math.floor(rand() * 8);
  for (let i = 0; i < count; i++) {
    lines.push({
      y: 90 + i * 36,
      w: (0.42 + rand() * 0.5) * (W - 240),
      marked: i >= markStart && i < markStart + 3,
    });
  }
  return lines;
}

/** Indie Dev: nested boxes. Shipping something inside something else. */
function boxes(rand: Rand): Array<{ x: number; y: number; w: number; h: number }> {
  const out = [];
  let x = 130;
  let y = 90;
  let w = W - 300;
  let h = H - 200;
  const count = 7;
  for (let i = 0; i < count; i++) {
    out.push({ x, y, w, h });
    const inset = 26 + rand() * 22;
    x += inset;
    y += inset * 0.72;
    w -= inset * 2;
    h -= inset * 1.44;
    if (w < 60 || h < 40) break;
  }
  return out;
}

type MotifKey = "contours" | "terminals" | "ruled" | "boxes";

// Collection names exist in both languages, so both map to the same motif.
const MOTIF_BY_COLLECTION: Record<string, MotifKey> = {
  projects: "contours",
  projekti: "contours",
  tooling: "terminals",
  alati: "terminals",
  notes: "ruled",
  beleške: "ruled",
  "indie dev": "boxes",
  "indi razvoj": "boxes",
};

function pickMotif(collection: string, rand: Rand): MotifKey {
  const key = MOTIF_BY_COLLECTION[collection.trim().toLowerCase()];
  if (key) return key;
  const all: MotifKey[] = ["contours", "terminals", "ruled", "boxes"];
  return all[Math.floor(rand() * all.length)];
}

// ── Component ────────────────────────────────────────────────────

interface PostCoverProps {
  /** Stable identity for the seed. Same id always yields the same cover. */
  seed: string | number;
  collection: string;
  /** Small mono slug drawn into the corner, e.g. a year or an index. */
  label?: string;
  title?: string;
  className?: string;
}

export default function PostCover({ seed, collection, label, title, className }: PostCoverProps) {
  const art = useMemo(() => {
    const rand = mulberry32(hashString(`${seed}:${collection}`));
    const motif = pickMotif(collection, rand);

    // Hairline grid behind every motif: the shared thread across covers.
    const gridStep = 26 + Math.floor(rand() * 14);
    const gridLines: number[] = [];
    for (let x = gridStep; x < W; x += gridStep) gridLines.push(x);

    // One accent bar, positioned per post.
    const accent = {
      x: 60 + rand() * (W - 400),
      y: H - 96,
      w: 120 + rand() * 220,
    };

    switch (motif) {
      case "contours":
        return { motif, gridLines, accent, contourPaths: contours(rand) } as const;
      case "terminals":
        return { motif, gridLines, accent, windows: terminals(rand) } as const;
      case "ruled":
        return { motif, gridLines, accent, lines: ruled(rand) } as const;
      case "boxes":
        return { motif, gridLines, accent, rects: boxes(rand) } as const;
    }
  }, [seed, collection]);

  const ink = "var(--text-charcoal)";
  const teal = "var(--accent-teal)";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label={title ? `Cover art for ${title}` : "Post cover art"}
      style={{ display: "block", width: "100%", height: "100%" }}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width={W} height={H} fill="var(--bg-warm-white)" />

      {/* Shared hairline grid */}
      <g stroke={ink} strokeWidth={1} opacity={0.07}>
        {art.gridLines.map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={H} />
        ))}
      </g>

      {art.motif === "contours" && (
        <g fill="none" stroke={ink} strokeWidth={1.4} opacity={0.42}>
          {art.contourPaths.map((d, i) => (
            <path key={i} d={d} opacity={1 - i * 0.045} />
          ))}
        </g>
      )}

      {art.motif === "terminals" &&
        art.windows.map((win, i) => (
          <g key={i} opacity={0.5 + i * 0.16}>
            <rect
              x={win.x}
              y={win.y}
              width={win.w}
              height={win.h}
              fill="var(--bg-warm-white)"
              stroke={ink}
              strokeWidth={1.6}
            />
            <line
              x1={win.x}
              y1={win.y + 30}
              x2={win.x + win.w}
              y2={win.y + 30}
              stroke={ink}
              strokeWidth={1.6}
            />
            <circle cx={win.x + 17} cy={win.y + 15} r={4.5} fill={ink} opacity={0.55} />
            {win.rows.map((len, r) => (
              <rect
                key={r}
                x={win.x + 22}
                y={win.y + 56 + r * 26}
                width={(win.w - 44) * len}
                height={7}
                fill={r === 1 ? teal : ink}
                opacity={r === 1 ? 0.85 : 0.28}
              />
            ))}
          </g>
        ))}

      {art.motif === "ruled" && (
        <g>
          {art.lines.map((line, i) => (
            <rect
              key={i}
              x={120}
              y={line.y}
              width={line.w}
              height={line.marked ? 9 : 6}
              fill={line.marked ? teal : ink}
              opacity={line.marked ? 0.8 : 0.22}
            />
          ))}
          <line x1={96} y1={70} x2={96} y2={H - 120} stroke={ink} strokeWidth={1.6} opacity={0.45} />
        </g>
      )}

      {art.motif === "boxes" && (
        <g fill="none" stroke={ink} strokeWidth={1.6}>
          {art.rects.map((r, i) => (
            <rect
              key={i}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              opacity={0.16 + i * 0.1}
              stroke={i === art.rects.length - 1 ? teal : ink}
            />
          ))}
        </g>
      )}

      {/* Accent bar and corner label: constant across every cover */}
      <rect x={art.accent.x} y={art.accent.y} width={art.accent.w} height={10} fill={teal} opacity={0.9} />

      {label && (
        <text
          x={W - 56}
          y={H - 52}
          textAnchor="end"
          fill={ink}
          opacity={0.55}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "30px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </text>
      )}
    </svg>
  );
}
