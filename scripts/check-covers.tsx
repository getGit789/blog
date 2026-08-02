// Dev check: renders every cover motif and asserts the geometry stays inside
// the viewBox with no NaN coordinates. Run with: npx tsx scripts/check-covers.tsx
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PostCover from "../src/components/PostCover";

const cases = [
  { seed: 1, collection: "Projects" },
  { seed: 2, collection: "Projekti" },
  { seed: 3, collection: "Indie Dev" },
  { seed: 4, collection: "Notes" },
  { seed: 5, collection: "Tooling" },
  { seed: 6, collection: "Beleške" },
  { seed: 7, collection: "Unknown Collection" },
];

let failures = 0;
for (const c of cases) {
  const html = renderToStaticMarkup(
    React.createElement(PostCover, { seed: c.seed, collection: c.collection, label: "01", title: "t" }),
  );
  const nums = [...html.matchAll(/(?:x|y|x1|y1|x2|y2|cx|cy|r|width|height)="(-?[\d.]+)"/g)].map((m) => Number(m[1]));
  const bad = nums.filter((n) => !Number.isFinite(n));
  const shapeCount = (html.match(/<(rect|line|path|circle)/g) ?? []).length;
  const wayOut = nums.filter((n) => n < -400 || n > 2400);
  const ok = bad.length === 0 && shapeCount > 8 && wayOut.length === 0 && !html.includes("NaN");
  if (!ok) failures++;
  console.log(
    `${ok ? "ok  " : "FAIL"} seed=${c.seed} ${c.collection.padEnd(20)} shapes=${String(shapeCount).padStart(3)} nan=${bad.length} outOfRange=${wayOut.length} bytes=${html.length}`,
  );
}
console.log(failures === 0 ? "\nALL COVERS OK" : `\n${failures} COVER(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
