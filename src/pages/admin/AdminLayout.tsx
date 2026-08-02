import { Navigate, NavLink, Outlet, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Guards every route under /admin except the login page.
 *
 * The redirect carries the path the visitor actually asked for in `next`, so a
 * deep link into the editor survives the trip through the login form. This is
 * UI convenience only: every admin mutation is independently role-checked by
 * `adminQuery` on the server, so bypassing this component gains nothing.
 */
export default function AdminLayout() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <AdminSpinner />;

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin/login?next=${next}`} replace />;
  }

  // Authenticated but not an admin. There is only one account today, so this is
  // a guard against a future non-admin role rather than a reachable state.
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-warm-white)" }}>
      <AdminNav />
      <div style={{ paddingTop: "40px" }}>
        <Outlet />
      </div>
    </div>
  );
}

function AdminSpinner() {
  const { language } = useLanguage();
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-warm-white)" }}
    >
      <p
        style={{
          fontSize: "12px",
          color: "var(--text-grey)",
          fontFamily: "'Space Mono', monospace",
          letterSpacing: "0.05em",
        }}
      >
        {language === "rs" ? "UČITAVAM..." : "LOADING..."}
      </p>
    </div>
  );
}

const navCopy = {
  rs: { dashboard: "TEKSTOVI", newPost: "NOVI TEKST", guestbook: "PORUKE", settings: "PODEŠAVANJA", site: "VIDI SAJT", logout: "ODJAVA" },
  en: { dashboard: "POSTS", newPost: "NEW POST", guestbook: "MESSAGES", settings: "SETTINGS", site: "VIEW SITE", logout: "LOG OUT" },
};

function AdminNav() {
  const { language } = useLanguage();
  const { logout } = useAuth();
  const t = navCopy[language];

  const items = [
    { to: "/admin", label: t.dashboard, end: true },
    { to: "/admin/new-post", label: t.newPost, end: false },
    { to: "/admin/guestbook", label: t.guestbook, end: false },
    { to: "/admin/settings", label: t.settings, end: false },
  ];

  const linkStyle = (isActive: boolean) => ({
    fontSize: "11px",
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.05em",
    color: isActive ? "var(--accent-teal)" : "var(--text-grey)",
    textDecoration: "none",
  });

  return (
    <header
      className="fixed top-0 left-0 right-0 flex items-center justify-between px-6"
      style={{
        height: "40px",
        zIndex: 50,
        backgroundColor: "var(--bg-warm-white)",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      <div className="flex items-center gap-5">
        <span
          style={{
            fontSize: "12px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--text-charcoal)",
            whiteSpace: "nowrap",
          }}
        >
          @ROOT / ADMIN
        </span>
        <nav className="flex items-center gap-4">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} style={({ isActive }) => linkStyle(isActive)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <a href="/" style={linkStyle(false)}>
          {t.site}
        </a>
        <button
          onClick={logout}
          style={{
            ...linkStyle(false),
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {t.logout}
        </button>
      </div>
    </header>
  );
}
