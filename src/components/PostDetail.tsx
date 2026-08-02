import { useParams, useNavigate, useSearchParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import type { BlogPost } from "../data/blogPosts";
import ImageUpload from "./ImageUpload";
import PostCover from "./PostCover";
import CoverImage from "./CoverImage";
import { hasRealImage } from "@/lib/covers";

interface PostDetailProps {
  posts: BlogPost[];
}

export default function PostDetail({ posts }: PostDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const utils = trpc.useUtils();

  const isEditMode = searchParams.get("mode") === "edit" && isAdmin;

  const post = posts.find((p) => p.id === Number(id));

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      utils.blog.list.invalidate();
      navigate(`/post/${id}`);
    },
  });

  const [editForm, setEditForm] = useState({
    year: "", image: "", rsTitle: "", rsSubtitle: "", rsCollection: "",
    rsContent: "", rsDetailContent: "", enTitle: "", enSubtitle: "",
    enCollection: "", enContent: "", enDetailContent: "",
  });

  useEffect(() => {
    if (post && isEditMode) {
      setEditForm({
        year: post.year, image: post.image, rsTitle: post.rs.title,
        rsSubtitle: post.rs.subtitle, rsCollection: post.rs.collection,
        rsContent: post.rs.content, rsDetailContent: post.rs.detailContent,
        enTitle: post.en.title, enSubtitle: post.en.subtitle,
        enCollection: post.en.collection, enContent: post.en.content,
        enDetailContent: post.en.detailContent,
      });
    }
  }, [post, isEditMode]);

  useEffect(() => {
    if (contentRef.current && !isEditMode) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [id, isEditMode]);

  const backText = language === "rs" ? "Nazad na početnu" : "Back to home";
  const notFoundText = language === "rs" ? "Tekst ne postoji" : "Article not found";
  const editThisText = language === "rs" ? "Izmeni ovaj tekst" : "Edit this post";
  const viewText = language === "rs" ? "Pogledaj tekst" : "View article";
  const closeText = language === "rs" ? "Zatvori" : "Close";
  const backAllText = language === "rs" ? "Nazad na sve tekstove" : "Back to all articles";

  const inputBase = {
    width: "100%",
    background: "#2A2A2A",
    border: "1px solid #444",
    borderRadius: "2px",
    padding: "10px 12px",
    fontSize: "13px",
    color: "#FFFFFF",
    fontFamily: "'Space Mono', monospace",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "11px",
    color: "rgba(255,255,255,0.6)",
    display: "block" as const,
    marginBottom: "6px",
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.05em",
  };

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

  // EDIT MODE
  if (isEditMode) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6" style={{ height: "40px", zIndex: 50, backgroundColor: "#1A1A1A", borderBottom: "1px solid #333" }}>
          <button onClick={() => navigate("/")} style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "0.05em", textTransform: "uppercase", color: "#FFFFFF", background: "none", border: "none", cursor: "pointer" }}>
            DAMIR KRANJČEVIĆ / @ROOT
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(`/post/${post.id}`)} style={{ fontSize: "11px", fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.6)", background: "none", border: "none", cursor: "pointer" }}>
              {viewText}
            </button>
            <button onClick={() => navigate("/")} style={{ fontSize: "11px", fontFamily: "'Space Mono', monospace", color: "#FFFFFF", background: "none", border: "none", cursor: "pointer" }}>
              {closeText}
            </button>
          </div>
        </header>

        <div className="mx-auto" style={{ maxWidth: "720px", padding: "80px 24px 80px" }}>
          <div className="flex items-center justify-between mb-8">
            <h1 style={{ fontSize: "16px", fontWeight: 400, color: "#FFFFFF", letterSpacing: "0.05em" }}>{editThisText}</h1>
          </div>

          <div className="space-y-5">
            <div>
              <label style={labelStyle}>Year</label>
              <input type="text" value={editForm.year} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} style={inputBase} />
            </div>

            <div>
              <ImageUpload
                value={editForm.image}
                onChange={(url) => setEditForm({ ...editForm, image: url })}
                label="Image"
              />
            </div>

            <div style={{ borderTop: "1px solid #333", paddingTop: "20px" }}>
              <h3 style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "16px", letterSpacing: "0.05em", fontFamily: "'Space Mono', monospace" }}>Content</h3>
              <div className="space-y-4">
                <div><label style={labelStyle}>Title</label><input type="text" value={editForm.enTitle} onChange={(e) => setEditForm({ ...editForm, enTitle: e.target.value })} style={inputBase} /></div>
                <div><label style={labelStyle}>Subtitle</label><input type="text" value={editForm.enSubtitle} onChange={(e) => setEditForm({ ...editForm, enSubtitle: e.target.value })} style={inputBase} /></div>
                <div><label style={labelStyle}>Collection</label><input type="text" value={editForm.enCollection} onChange={(e) => setEditForm({ ...editForm, enCollection: e.target.value })} style={inputBase} /></div>
                <div><label style={labelStyle}>Summary</label><textarea value={editForm.enContent} onChange={(e) => setEditForm({ ...editForm, enContent: e.target.value })} rows={3} style={{ ...inputBase, resize: "vertical" }} /></div>
                <div><label style={labelStyle}>Detail Content</label><textarea value={editForm.enDetailContent} onChange={(e) => setEditForm({ ...editForm, enDetailContent: e.target.value })} rows={8} style={{ ...inputBase, resize: "vertical" }} /></div>
              </div>
            </div>

            <div className="flex gap-3 pt-4" style={{ borderTop: "1px solid #333" }}>
              <button
                onClick={() => updatePost.mutate({
                  id: post.id,
                  ...editForm,
                  // Serbian columns are NOT NULL, so mirror English until a translation is entered.
                  rsTitle: editForm.enTitle,
                  rsSubtitle: editForm.enSubtitle,
                  rsCollection: editForm.enCollection,
                  rsContent: editForm.enContent,
                  rsDetailContent: editForm.enDetailContent,
                  sortOrder: post.id,
                })}
                disabled={updatePost.isPending}
                style={{ flex: 1, padding: "12px", fontSize: "12px", fontFamily: "'Space Mono', monospace", color: "#1A1A1A", background: "#FFFFFF", border: "none", borderRadius: "2px", cursor: updatePost.isPending ? "wait" : "pointer", opacity: updatePost.isPending ? 0.7 : 1, letterSpacing: "0.05em" }}
              >
                {updatePost.isPending ? (language === "rs" ? "ČUVAM..." : "Saving...") : (language === "rs" ? "SAČUVAJ" : "SAVE")}
              </button>
              <button
                onClick={() => navigate(`/post/${post.id}`)}
                style={{ flex: 1, padding: "12px", fontSize: "12px", fontFamily: "'Space Mono', monospace", color: "#FFFFFF", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "2px", cursor: "pointer", letterSpacing: "0.05em" }}
              >
                {language === "rs" ? "OTKAŽI" : "CANCEL"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW MODE
  const content = post[language];
  const paragraphs = content.detailContent.split("\n\n");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-warm-white)" }}>
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6" style={{ height: "40px", zIndex: 50, backgroundColor: "var(--bg-warm-white)", borderBottom: "1px solid var(--border-light)" }}>
        <button onClick={() => navigate("/")} style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-charcoal)", background: "none", border: "none", cursor: "pointer" }}>
          DAMIR KRANJČEVIĆ / @ROOT
        </button>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button onClick={() => navigate(`/post/${post.id}?mode=edit`)} style={{ fontSize: "11px", fontFamily: "'Space Mono', monospace", color: "var(--text-grey)", background: "none", border: "none", cursor: "pointer" }}>
              EDIT
            </button>
          )}
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
          {hasRealImage(post.image) ? (
            <CoverImage src={post.image} alt={content.title} eager />
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
