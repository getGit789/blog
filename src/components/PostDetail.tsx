import { useParams, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLanguage } from "../contexts/LanguageContext";
import type { BlogPost } from "../../contracts/blog";
import PostCover from "./PostCover";
import CoverImage from "./CoverImage";
import { hasRealImage } from "@/lib/covers";

interface PostDetailProps {
  posts: BlogPost[];
}

/**
 * Public article view. Read-only by design: editing moved to /admin/edit/:id so
 * that no admin control renders on a public route, logged in or not.
 */
export default function PostDetail({ posts }: PostDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const post = posts.find((p) => p.id === Number(id));

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [id]);

  const backText = language === "rs" ? "Nazad na po\u010detnu" : "Back to home";
  const notFoundText = language === "rs" ? "Tekst ne postoji" : "Article not found";
  const closeText = language === "rs" ? "Zatvori" : "Close";
  const backAllText = language === "rs" ? "Nazad na sve tekstove" : "Back to all articles";

  if (!post) {
    return (
      <div className="flex items-center justify-center" style={{ height: "100vh", backgroundColor: "var(--bg-warm-white)" }}>
        <div className="text-center">
          <p style={{ fontSize: "14px", color: "var(--text-grey)" }}>{notFoundText}</p>
          <button onClick={() => navigate("/")} style={{ marginTop: "16px", fontSize: "12px", color: "var(--text-charcoal)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            {backText}
          </button>
        </div>
      </div>
    );
  }

  const content = post[language];
  const paragraphs = content.detailContent.split("\n\n");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-warm-white)" }}>
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6" style={{ height: "40px", zIndex: 50, backgroundColor: "var(--bg-warm-white)", borderBottom: "1px solid var(--border-light)" }}>
        <button onClick={() => navigate("/")} style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-charcoal)", background: "none", border: "none", cursor: "pointer" }}>
          DAMIR KRANJČEVIĆ / @ROOT
        </button>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} style={{ fontSize: "12px", fontFamily: "'Space Mono', monospace", color: "var(--text-charcoal)", background: "none", border: "none", cursor: "pointer" }}>
            {closeText}
          </button>
        </div>
      </header>

      <div ref={contentRef} className="mx-auto" style={{ maxWidth: "720px", padding: "96px 24px 96px" }}>
        <div
          className="overflow-hidden"
          style={{ border: "1px solid var(--border-light)", marginBottom: "48px", aspectRatio: "16 / 10" }}
        >
          {hasRealImage(post.detailImage) ? (
            <CoverImage src={post.detailImage} alt={content.title} eager />
          ) : (
            <PostCover seed={post.id} collection={content.collection} title={content.title} label={post.year} />
          )}
        </div>

        <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
          <span className="mono-label" style={{ color: "var(--accent-teal)" }}>{content.collection}</span>
          <span className="mono-label" style={{ color: "var(--border-light)" }}>/</span>
          <span className="mono-label" style={{ color: "var(--text-grey)" }}>{post.year}</span>
        </div>

        <h1 className="headline" style={{ color: "var(--text-charcoal)", marginBottom: "12px" }}>
          {content.title}
        </h1>
        <p className="prose-lead" style={{ color: "var(--text-grey)", marginBottom: "40px", maxWidth: "56ch" }}>
          {content.subtitle}
        </p>

        <div style={{ borderTop: "1px solid var(--border-light)", marginBottom: "40px" }} />

        <div>
          {paragraphs.map((para, idx) => (
            <p
              key={idx}
              className="prose-serif"
              style={{ color: "var(--text-charcoal)", whiteSpace: "pre-line" }}
            >
              {para}
            </p>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--border-light)", marginTop: "64px", paddingTop: "28px" }}>
          <button onClick={() => navigate("/")} style={{ fontSize: "12px", color: "var(--text-charcoal)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            {backAllText}
          </button>
        </div>
      </div>
    </div>
  );
}
