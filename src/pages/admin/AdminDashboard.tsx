import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

const copy = {
  rs: {
    heading: "SVI TEKSTOVI",
    newPost: "+ NOVI TEKST",
    empty: "Još nema tekstova.",
    loading: "UČITAVAM...",
    edit: "IZMENI",
    del: "OBRIŠI",
    view: "VIDI",
    confirmDelete: (title: string) => `Obrisati "${title}"? Ovo se ne može poništiti.`,
    count: (n: number) => `${n} ${n === 1 ? "tekst" : "tekstova"}`,
  },
  en: {
    heading: "ALL POSTS",
    newPost: "+ NEW POST",
    empty: "No posts yet.",
    loading: "LOADING...",
    edit: "EDIT",
    del: "DELETE",
    view: "VIEW",
    confirmDelete: (title: string) => `Delete "${title}"? This cannot be undone.`,
    count: (n: number) => `${n} ${n === 1 ? "post" : "posts"}`,
  },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = copy[language];
  const utils = trpc.useUtils();

  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  const deletePost = trpc.blog.delete.useMutation({
    onSuccess: () => utils.blog.list.invalidate(),
  });

  const actionStyle: React.CSSProperties = {
    fontSize: "10px",
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.05em",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  };

  return (
    <div className="mx-auto" style={{ maxWidth: "860px", padding: "40px 24px 80px" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
        <h1 className="mono-label" style={{ color: "var(--text-grey)" }}>
          {t.heading}
        </h1>
        <button
          onClick={() => navigate("/admin/new-post")}
          style={{ ...actionStyle, fontSize: "11px", color: "var(--text-charcoal)" }}
        >
          {t.newPost}
        </button>
      </div>

      {isLoading ? (
        <p style={{ fontSize: "12px", color: "var(--text-grey)", fontFamily: "'Space Mono', monospace" }}>
          {t.loading}
        </p>
      ) : !posts || posts.length === 0 ? (
        <p style={{ fontSize: "13px", color: "var(--text-grey)" }}>{t.empty}</p>
      ) : (
        <>
          <p className="mono-meta" style={{ color: "var(--text-grey)", marginBottom: "24px" }}>
            {t.count(posts.length)}
          </p>

          <div style={{ borderTop: "1px solid var(--border-light)" }}>
            {posts.map((post) => {
              const title = language === "rs" ? post.rsTitle : post.enTitle;
              const collection = language === "rs" ? post.rsCollection : post.enCollection;
              // Serbian columns mirror English until a translation is entered,
              // so identical titles mean this post is still English-only.
              const translated = post.rsTitle !== post.enTitle;

              return (
                <div
                  key={post.id}
                  className="flex items-start justify-between gap-6"
                  style={{
                    borderBottom: "1px solid var(--border-light)",
                    padding: "16px 0",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: "4px" }}>
                      <span className="mono-label" style={{ color: "var(--accent-teal)" }}>
                        {collection}
                      </span>
                      <span className="mono-label" style={{ color: "var(--border-light)" }}>/</span>
                      <span className="mono-label" style={{ color: "var(--text-grey)" }}>
                        {post.year}
                      </span>
                      <span className="mono-label" style={{ color: "var(--border-light)" }}>/</span>
                      <span className="mono-label" style={{ color: "var(--text-grey)" }}>
                        {translated ? "SR + EN" : "EN"}
                      </span>
                    </div>
                    <p
                      className="mono-title"
                      style={{ fontSize: "14px", color: "var(--text-charcoal)", lineHeight: 1.4 }}
                    >
                      {title}
                    </p>
                  </div>

                  <div className="flex items-center gap-3" style={{ flexShrink: 0, paddingTop: "4px" }}>
                    <button
                      onClick={() => navigate(`/post/${post.id}`)}
                      style={{ ...actionStyle, color: "var(--text-grey)" }}
                    >
                      {t.view}
                    </button>
                    <button
                      onClick={() => navigate(`/admin/edit/${post.id}`)}
                      style={{ ...actionStyle, color: "var(--text-charcoal)" }}
                    >
                      {t.edit}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(t.confirmDelete(title))) {
                          deletePost.mutate({ id: post.id });
                        }
                      }}
                      disabled={deletePost.isPending}
                      style={{ ...actionStyle, color: "#E74C3C" }}
                    >
                      {t.del}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
