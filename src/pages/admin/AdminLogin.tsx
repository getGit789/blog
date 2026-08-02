import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

/** Only same-site absolute paths are honoured, so `next` cannot bounce off-site. */
function safeNext(raw: string | null): string {
  if (!raw) return "/admin";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/admin";
  return raw;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const utils = trpc.useUtils();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const next = safeNext(searchParams.get("next"));

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (user) => {
      // Seed the cache before navigating: AdminLayout reads auth.me on the very
      // next render, and an unresolved refetch there would bounce straight back
      // to this page.
      utils.auth.me.setData(undefined, user);
      navigate(next, { replace: true });
    },
    onError: (err) => setError(err.message),
  });

  // Already signed in: skip the form rather than showing it behind a session.
  if (!isLoading && isAuthenticated) return <Navigate to={next} replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) return;
    loginMutation.mutate({ username: username.trim(), password });
  };

  const t = {
    rs: {
      title: "Prijava administratora",
      username: "Korisničko ime",
      password: "Lozinka",
      submit: "Prijavi se",
      submitting: "Prijavljujem...",
    },
    en: {
      title: "Admin Login",
      username: "Username",
      password: "Password",
      submit: "Log In",
      submitting: "Logging in...",
    },
  }[language];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "1px solid var(--border-light)",
    padding: "10px 12px",
    fontSize: "12px",
    color: "var(--text-charcoal)",
    fontFamily: "'Space Mono', monospace",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "var(--text-grey)",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-warm-white)" }}
    >
      <div
        className="w-full max-w-sm mx-4"
        style={{ border: "1px solid var(--border-light)", padding: "32px" }}
      >
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--text-charcoal)",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          {t.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={labelStyle}>{t.username}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          {error && <p style={{ fontSize: "11px", color: "#E74C3C" }}>{error}</p>}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "12px",
              fontFamily: "'Space Mono', monospace",
              color: "var(--bg-warm-white)",
              background: "var(--text-charcoal)",
              border: "none",
              cursor: loginMutation.isPending ? "wait" : "pointer",
              opacity: loginMutation.isPending ? 0.7 : 1,
              letterSpacing: "0.05em",
            }}
          >
            {loginMutation.isPending ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
