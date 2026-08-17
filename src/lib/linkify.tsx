import type { ReactNode } from "react";

/**
 * Turns bare URLs and domains in post prose into real anchors.
 *
 * Article bodies are stored and rendered as plain text, so a mention like
 * beekio.com used to be unclickable and invisible to crawlers. Rather than
 * pull in a markdown renderer for one feature, the paragraph text is split on
 * anything that looks like a link and the matches are wrapped.
 *
 * The TLD list is deliberately short. Posts here are full of filenames that
 * look like domains (send_test_nurture.py, SignInPage.tsx, api/client.ts), and
 * a permissive pattern would linkify every one of them.
 */
const LINK_PATTERN =
  /\b(?:https?:\/\/)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:com|net|org|io|dev|shop)\b(?:\/[^\s)]*)?/gi;

const linkStyle = {
  color: "var(--accent-teal)",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
} as const;

/** Splits `text` into plain strings and anchor elements, in order. */
export function linkify(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const start = match.index ?? 0;
    if (start > cursor) nodes.push(text.slice(cursor, start));

    const raw = match[0];
    // Bare domains still need a scheme, otherwise the browser resolves them
    // against the current path and the link points back at this blog.
    const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

    nodes.push(
      <a key={start} href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {raw}
      </a>,
    );
    cursor = start + raw.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
