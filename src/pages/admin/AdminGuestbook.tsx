import { trpc } from "@/providers/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

const copy = {
  rs: {
    heading: "PORUKE IZ KNJIGE GOSTIJU",
    empty: "Još nema poruka.",
    loading: "UČITAVAM...",
    anon: "Anonimno",
    del: "OBRIŠI",
    confirmDelete: "Obrisati ovu poruku?",
  },
  en: {
    heading: "GUESTBOOK MESSAGES",
    empty: "No messages yet.",
    loading: "LOADING...",
    anon: "Anonymous",
    del: "DELETE",
    confirmDelete: "Delete this message?",
  },
};

/** Moderation for the public guestbook. The public page itself is read-only. */
export default function AdminGuestbook() {
  const { language } = useLanguage();
  const t = copy[language];
  const utils = trpc.useUtils();

  const { data: messages, isLoading } = trpc.contact.list.useQuery();
  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => utils.contact.list.invalidate(),
  });

  return (
    <div className="mx-auto" style={{ maxWidth: "720px", padding: "40px 24px 80px" }}>
      <h1 className="mono-label" style={{ color: "var(--text-grey)", marginBottom: "24px" }}>
        {t.heading}
      </h1>

      {isLoading ? (
        <p style={{ fontSize: "12px", color: "var(--text-grey)", fontFamily: "'Space Mono', monospace" }}>
          {t.loading}
        </p>
      ) : !messages || messages.length === 0 ? (
        <p style={{ fontSize: "13px", color: "var(--text-grey)" }}>{t.empty}</p>
      ) : (
        <div style={{ borderTop: "1px solid var(--border-light)" }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ borderBottom: "1px solid var(--border-light)", padding: "16px 0" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "6px" }}>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: "12px", color: "var(--text-charcoal)" }}>
                    {msg.name || t.anon}
                  </span>
                  <span className="mono-meta" style={{ color: "var(--text-grey)" }}>
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleDateString(language === "rs" ? "sr-RS" : "en-US")
                      : ""}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (confirm(t.confirmDelete)) deleteMutation.mutate({ id: msg.id });
                  }}
                  style={{
                    fontSize: "10px",
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: "0.05em",
                    color: "#E74C3C",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {t.del}
                </button>
              </div>
              <p style={{ fontSize: "13px", lineHeight: 1.8, color: "var(--text-charcoal)", whiteSpace: "pre-wrap" }}>
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
