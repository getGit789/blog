import type { Post } from "@db/schema";
import { postSlug } from "./slugs";

// Frontend-facing BlogPost shape — compatible with existing UI components
export interface PostContent {
  title: string;
  subtitle: string;
  collection: string;
  content: string;
  detailContent: string;
}

export interface BlogPost {
  id: number;
  /** URL segment for /post/<slug>; falls back to the numeric id. */
  slug: string;
  year: string;
  image: string;
  /** Article header photo. Falls back to `image` when a post has only one. */
  detailImage: string;
  rs: PostContent;
  en: PostContent;
}

/**
 * Transform a database Post row into the BlogPost shape the UI expects.
 */
export function toBlogPost(post: Post): BlogPost {
  return {
    id: post.id,
    slug: postSlug(post),
    year: post.year,
    image: post.image,
    detailImage: post.detailImage || post.image,
    rs: {
      title: post.rsTitle,
      subtitle: post.rsSubtitle,
      collection: post.rsCollection,
      content: post.rsContent,
      detailContent: post.rsDetailContent,
    },
    en: {
      title: post.enTitle,
      subtitle: post.enSubtitle,
      collection: post.enCollection,
      content: post.enContent,
      detailContent: post.enDetailContent,
    },
  };
}
