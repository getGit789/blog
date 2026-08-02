import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { BlogPost } from "../../contracts/blog";
import PostCover from "./PostCover";
import CoverImage from "./CoverImage";
import { hasRealImage } from "@/lib/covers";

gsap.registerPlugin(ScrollTrigger);

interface MiddleColumnProps {
  posts: BlogPost[];
}

export default function MiddleColumn({ posts }: MiddleColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!columnRef.current) return;
    const column = columnRef.current;
    // On desktop the feed scrolls inside this column, not the window. ScrollTrigger
    // watches the window by default, which never scrolls here, so covers below the
    // first screen would stay at the opacity 0 they are set to and never reveal.
    // On mobile the column is not a scroll container and the page scrolls normally.
    const scroller = isMobile ? undefined : column;
    const images = column.querySelectorAll(".blog-image");
    const triggers: ScrollTrigger[] = [];
    images.forEach((img) => {
      gsap.set(img, { opacity: 0, scale: 1.03 });
      const tween = gsap.to(img, {
        opacity: 1, scale: 1, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: img, scroller, start: "top 90%", toggleActions: "play none none none" },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });
    // Covers reserve their box via aspect-ratio, but fonts and the CV column can
    // still shift things after mount; recompute once the layout settles.
    ScrollTrigger.refresh();
    return () => { triggers.forEach((t) => t.kill()); };
  }, [posts, isMobile]);

  const t = {
    rs: { heading: "TEKSTOVI (ARHIVA)" },
    en: { heading: "POSTS (ARCHIVE)" },
  }[language];

  return (
    <main
      ref={columnRef}
      className={isMobile ? "" : "flex-1 overflow-y-auto"}
      style={{
        borderRight: isMobile ? "none" : "1px solid var(--border-light)",
        borderTop: isMobile ? "1px solid var(--border-light)" : "none",
        height: isMobile ? "auto" : "100vh",
        scrollBehavior: "smooth",
      }}
    >
      <div className="p-6 pb-24">
        <h2 className="mono-label" style={{ color: "var(--text-grey)", marginBottom: "40px" }}>
          {t.heading}
        </h2>

        {posts.map((post, index) => {
          const content = post[language];
          const isHovered = hoveredImage === post.id;
          return (
            <article
              key={post.id}
              style={{
                cursor: "pointer",
                marginBottom: "40px",
                borderBottom: "1px solid var(--border-light)",
                paddingBottom: "40px",
              }}
            >
              <div
                onClick={() => navigate(`/post/${post.id}`)}
                onMouseEnter={() => setHoveredImage(post.id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <div
                  className="blog-image overflow-hidden"
                  style={{
                    border: "1px solid var(--border-light)",
                    marginBottom: "18px",
                    aspectRatio: "16 / 10",
                  }}
                >
                  <div
                    className="transition-transform duration-500 ease-out"
                    style={{
                      height: "100%",
                      transform: isHovered ? "scale(1.025)" : "scale(1)",
                    }}
                  >
                    {hasRealImage(post.image) ? (
                      <CoverImage
                        src={post.image}
                        alt={content.title}
                        eager={index === 0}
                        grayscale={isHovered}
                      />
                    ) : (
                      <PostCover
                        seed={post.id}
                        collection={content.collection}
                        title={content.title}
                        label={String(index + 1).padStart(2, "0")}
                        className="block"
                      />
                    )}
                  </div>
                </div>

                {/* Meta row above the title: collection first, then year. */}
                <div className="flex items-center gap-2" style={{ marginBottom: "10px" }}>
                  <span className="mono-label" style={{ color: "var(--accent-teal)" }}>
                    {content.collection}
                  </span>
                  <span className="mono-label" style={{ color: "var(--border-light)" }}>/</span>
                  <span className="mono-label" style={{ color: "var(--text-grey)" }}>
                    {post.year}
                  </span>
                </div>

                <h3
                  className="mono-title"
                  style={{
                    fontSize: "var(--step-title)",
                    lineHeight: 1.35,
                    color: "var(--text-charcoal)",
                    marginBottom: "8px",
                    textDecoration: isHovered ? "underline" : "none",
                    textUnderlineOffset: "4px",
                    textDecorationThickness: "1px",
                  }}
                >
                  {content.title}
                </h3>

                <p
                  className="prose-lead"
                  style={{ color: "var(--text-grey)", marginBottom: "12px", maxWidth: "58ch" }}
                >
                  {content.subtitle}
                </p>

                <p
                  className="prose-lead"
                  style={{ color: "var(--text-charcoal)", opacity: 0.82, maxWidth: "62ch" }}
                >
                  {content.content}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
