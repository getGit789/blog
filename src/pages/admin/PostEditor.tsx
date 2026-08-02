import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import ImageUpload from "@/components/ImageUpload";

type Form = {
  year: string;
  image: string;
  detailImage: string;
  rsTitle: string;
  rsSubtitle: string;
  rsCollection: string;
  rsContent: string;
  rsDetailContent: string;
  enTitle: string;
  enSubtitle: string;
  enCollection: string;
  enContent: string;
  enDetailContent: string;
};

const EMPTY: Form = {
  year: String(new Date().getFullYear()),
  image: "",
  detailImage: "",
  rsTitle: "", rsSubtitle: "", rsCollection: "", rsContent: "", rsDetailContent: "",
  enTitle: "", enSubtitle: "", enCollection: "", enContent: "", enDetailContent: "",
};

const copy = {
  rs: {
    newTitle: "Novi tekst", editTitle: "Izmeni tekst",
    publish: "Objavi", save: "Sačuvaj", saving: "Čuvam...", publishing: "Objavljujem...",
    cancel: "Otkaži", loading: "UČITAVAM...", notFound: "Tekst ne postoji",
    required: "Naslov na engleskom je obavezan",
    srHeading: "SRPSKI", enHeading: "ENGLESKI",
    mirrorNote: "Ostavi prazno da se preuzme engleska verzija.",
    year: "Godina", title: "Naslov", subtitle: "Podnaslov", collection: "Kolekcija",
    summary: "Sažetak (u listi)", detail: "Tekst članka",
  },
  en: {
    newTitle: "New Post", editTitle: "Edit Post",
    publish: "Publish", save: "Save", saving: "Saving...", publishing: "Publishing...",
    cancel: "Cancel", loading: "LOADING...", notFound: "Post not found",
    required: "English title is required",
    srHeading: "SERBIAN", enHeading: "ENGLISH",
    mirrorNote: "Leave blank to reuse the English version.",
    year: "Year", title: "Title", subtitle: "Subtitle", collection: "Collection",
    summary: "Summary (feed)", detail: "Article body",
  },
};

/**
 * The single post editor, used for both `/admin/new-post` and `/admin/edit/:id`.
 *
 * Both languages are editable here on purpose. An earlier version only exposed
 * the English fields and mirrored them into the Serbian columns on save, which
 * silently destroyed the Serbian copy of any post that already had a real
 * translation. Mirroring now only happens for fields left blank.
 */
export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const t = copy[language];

  const isEdit = id !== undefined;
  const postId = Number(id);

  const { data: post, isLoading } = trpc.blog.byId.useQuery(
    { id: postId },
    { enabled: isEdit && Number.isFinite(postId) },
  );

  if (isEdit && isLoading) {
    return (
      <div className="mx-auto" style={{ maxWidth: "720px", padding: "40px 24px" }}>
        <p style={{ fontSize: "12px", color: "var(--text-grey)", fontFamily: "'Space Mono', monospace" }}>
          {t.loading}
        </p>
      </div>
    );
  }

  if (isEdit && !post) {
    return (
      <div className="mx-auto" style={{ maxWidth: "720px", padding: "40px 24px" }}>
        <p style={{ fontSize: "13px", color: "var(--text-grey)" }}>{t.notFound}</p>
      </div>
    );
  }

  // Mounted only once the post is in hand, so the form can seed its state
  // directly from it. The key remounts the form if the route switches to a
  // different post without unmounting this component.
  return (
    <EditorForm
      key={isEdit ? postId : "new"}
      postId={isEdit ? postId : null}
      initial={
        post
          ? {
              year: post.year,
              image: post.image ?? "",
              detailImage: post.detailImage ?? "",
              rsTitle: post.rsTitle, rsSubtitle: post.rsSubtitle, rsCollection: post.rsCollection,
              rsContent: post.rsContent, rsDetailContent: post.rsDetailContent,
              enTitle: post.enTitle, enSubtitle: post.enSubtitle, enCollection: post.enCollection,
              enContent: post.enContent, enDetailContent: post.enDetailContent,
            }
          : EMPTY
      }
    />
  );
}

function EditorForm({ postId, initial }: { postId: number | null; initial: Form }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = copy[language];
  const utils = trpc.useUtils();

  const isEdit = postId !== null;
  const [form, setForm] = useState<Form>(initial);
  const [error, setError] = useState("");

  const onDone = () => {
    utils.blog.list.invalidate();
    if (postId !== null) utils.blog.byId.invalidate({ id: postId });
    navigate("/admin");
  };

  const createPost = trpc.blog.create.useMutation({
    onSuccess: onDone,
    onError: (err) => setError(err.message),
  });
  const updatePost = trpc.blog.update.useMutation({
    onSuccess: onDone,
    onError: (err) => setError(err.message),
  });

  const pending = createPost.isPending || updatePost.isPending;

  const handleSubmit = () => {
    setError("");
    if (!form.enTitle.trim()) {
      setError(t.required);
      return;
    }

    // Serbian columns are NOT NULL. Anything left blank falls back to the
    // English text so a post can go out before it is translated.
    const payload = {
      ...form,
      rsTitle: form.rsTitle.trim() || form.enTitle,
      rsSubtitle: form.rsSubtitle.trim() || form.enSubtitle,
      rsCollection: form.rsCollection.trim() || form.enCollection,
      rsContent: form.rsContent.trim() || form.enContent,
      rsDetailContent: form.rsDetailContent.trim() || form.enDetailContent,
    };

    if (postId !== null) {
      updatePost.mutate({ id: postId, ...payload });
    } else {
      createPost.mutate({ ...payload, sortOrder: 0 });
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    fontSize: "12px",
    padding: "8px 10px",
    border: "1px solid var(--border-light)",
    outline: "none",
    color: "var(--text-charcoal)",
    fontFamily: "'Space Mono', monospace",
    background: "transparent",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "var(--text-grey)",
    display: "block",
    marginBottom: "4px",
  };

  const set = (key: keyof Form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="mx-auto" style={{ maxWidth: "720px", padding: "40px 24px 80px" }}>
      <h1
        style={{
          fontSize: "20px",
          fontWeight: 400,
          color: "var(--text-charcoal)",
          marginBottom: "32px",
        }}
      >
        {isEdit ? t.editTitle : t.newTitle}
      </h1>

      <div className="space-y-5">
        <div>
          <label style={labelStyle}>{t.year}</label>
          <input value={form.year} onChange={(e) => set("year")(e.target.value)} style={inputStyle} />
        </div>

        <ImageUpload
          value={form.image}
          onChange={set("image")}
          label="Cover image (feed)"
          variant="dark"
        />

        <ImageUpload
          value={form.detailImage}
          onChange={set("detailImage")}
          label="Article image (inside the post)"
          variant="dark"
        />

        <section style={{ borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
          <h2 className="mono-label" style={{ color: "var(--text-grey)", marginBottom: "12px" }}>
            {t.enHeading}
          </h2>
          <div className="space-y-3">
            <div>
              <label style={labelStyle}>{t.title} *</label>
              <input value={form.enTitle} onChange={(e) => set("enTitle")(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.subtitle}</label>
              <input value={form.enSubtitle} onChange={(e) => set("enSubtitle")(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.collection}</label>
              <input value={form.enCollection} onChange={(e) => set("enCollection")(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.summary}</label>
              <textarea value={form.enContent} onChange={(e) => set("enContent")(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div>
              <label style={labelStyle}>{t.detail}</label>
              <textarea value={form.enDetailContent} onChange={(e) => set("enDetailContent")(e.target.value)} rows={10} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>
        </section>

        <section style={{ borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
          <h2 className="mono-label" style={{ color: "var(--text-grey)", marginBottom: "4px" }}>
            {t.srHeading}
          </h2>
          <p className="mono-meta" style={{ color: "var(--text-grey)", marginBottom: "12px" }}>
            {t.mirrorNote}
          </p>
          <div className="space-y-3">
            <div>
              <label style={labelStyle}>{t.title}</label>
              <input value={form.rsTitle} onChange={(e) => set("rsTitle")(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.subtitle}</label>
              <input value={form.rsSubtitle} onChange={(e) => set("rsSubtitle")(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.collection}</label>
              <input value={form.rsCollection} onChange={(e) => set("rsCollection")(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.summary}</label>
              <textarea value={form.rsContent} onChange={(e) => set("rsContent")(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div>
              <label style={labelStyle}>{t.detail}</label>
              <textarea value={form.rsDetailContent} onChange={(e) => set("rsDetailContent")(e.target.value)} rows={10} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>
        </section>

        {error && <p style={{ fontSize: "11px", color: "#E74C3C" }}>{error}</p>}

        <div className="flex gap-3" style={{ borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
          <button
            onClick={handleSubmit}
            disabled={pending}
            style={{
              flex: 1, padding: "12px", fontSize: "12px", fontFamily: "'Space Mono', monospace",
              color: "var(--bg-warm-white)", background: "var(--text-charcoal)", border: "none",
              cursor: pending ? "wait" : "pointer", opacity: pending ? 0.7 : 1, letterSpacing: "0.05em",
            }}
          >
            {pending ? (isEdit ? t.saving : t.publishing) : isEdit ? t.save : t.publish}
          </button>
          <button
            onClick={() => navigate("/admin")}
            style={{
              flex: 1, padding: "12px", fontSize: "12px", fontFamily: "'Space Mono', monospace",
              color: "var(--text-charcoal)", background: "none",
              border: "1px solid var(--border-light)", cursor: "pointer", letterSpacing: "0.05em",
            }}
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
