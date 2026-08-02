import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/providers/trpc";

/** Public, read-only. Moderation lives at /admin/guestbook. */
export default function Guestbook() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { data: messages, isLoading } = trpc.contact.list.useQuery();

  const t = {
    rs: {
      title: "Knjiga gostiju",
      back: "Nazad na početnu",
      empty: "Još nema poruka",
      loading: "Učitavam...",
      anon: "Anonimno",
    },
    en: {
      title: "Guestbook",
      back: "Back to home",
      empty: "No messages yet",
      loading: "Loading...",
      anon: "Anonymous",
    },
  };
  const s = t[language];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-warm-white)" }}
    >
      {/* Top Bar */}
      <header
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-6"
        style={{
          height: "40px",
          zIndex: 50,
          backgroundColor: "var(--bg-warm-white)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            fontSize: "12px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--text-charcoal)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          DAMIR KRANJČEVIĆ / @ROOT
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            fontSize: "12px",
            fontFamily: "'Space Mono', monospace",
            color: "var(--text-charcoal)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {s.back}
        </button>
      </header>

      {/* Content */}
      <div className="mx-auto" style={{ maxWidth: "680px", padding: "80px 24px 80px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 400,
            color: "var(--text-charcoal)",
            marginBottom: "32px",
          }}
        >
          {s.title}
        </h1>

        {isLoading ? (
          <p style={{ fontSize: "12px", color: "var(--text-grey)" }}>{s.loading}</p>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  borderBottom: "1px solid var(--border-light)",
                  paddingBottom: "16px",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "var(--text-charcoal)",
                    }}
                  >
                    {msg.name || s.anon}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-grey)" }}>
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleDateString(
                          language === "rs" ? "sr-RS" : "en-US",
                        )
                      : ""}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.8,
                    color: "var(--text-charcoal)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "12px", color: "var(--text-grey)" }}>{s.empty}</p>
        )}
      </div>
    </div>
  );
}
