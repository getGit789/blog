import { lazy, Suspense, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import LeftColumn from "./components/LeftColumn";
import MiddleColumn from "./components/MiddleColumn";
import RightColumn from "./components/RightColumn";
import PostDetail from "./components/PostDetail";
import ContactModal from "./components/ContactModal";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { trpc } from "@/providers/trpc";
import type { BlogPost } from "../contracts/blog";
import { toBlogPost } from "../contracts/blog";
import NotFound from "./pages/NotFound";
import Guestbook from "./pages/Guestbook";
import { useIsMobile } from "./hooks/useIsMobile";

// A visitor never loads the admin zone: it is one person's editor, so it is
// split out of the bundle every public page has to download.
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminGuestbook = lazy(() => import("./pages/admin/AdminGuestbook"));
const PostEditor = lazy(() => import("./pages/admin/PostEditor"));

/**
 * Public header controls. Language and theme only: the admin zone is reachable
 * by typing /admin and is never advertised here, so a visitor sees no sign that
 * the site has a login at all.
 */
function ToggleBar() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-4">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        title={language === "rs" ? "Switch to English" : "Prebaci na srpski"}
        style={{
          fontSize: "12px",
          fontFamily: "'Space Mono', monospace",
          color: "var(--text-charcoal)",
          background: "none",
          border: "none",
          cursor: "pointer",
          transition: "color 0.2s ease",
          letterSpacing: "0.05em",
        }}
        onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--accent-teal)"; }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--text-charcoal)"; }}
      >
        {language === "rs" ? "EN" : "SR"}
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          fontSize: "12px",
          fontFamily: "'Space Mono', monospace",
          color: "var(--text-charcoal)",
          background: "none",
          border: "none",
          cursor: "pointer",
          transition: "color 0.2s ease",
          letterSpacing: "0.05em",
        }}
        onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--accent-teal)"; }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--text-charcoal)"; }}
      >
        {theme === "light" ? "DARK" : "LIGHT"}
      </button>
    </div>
  );
}

function HomePage() {
  const { language } = useLanguage();
  const [showContact, setShowContact] = useState(false);
  const { data: dbPosts, isLoading } = trpc.blog.list.useQuery();
  const posts: BlogPost[] = dbPosts ? dbPosts.map(toBlogPost) : [];
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-warm-white)" }}>
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6" style={{ height: "40px", zIndex: 50, backgroundColor: "transparent" }}>
        <span style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-charcoal)", whiteSpace: "nowrap" }}>
          {isMobile ? "DAMIR KRANJČEVIĆ" : "DAMIR KRANJČEVIĆ / @ROOT"}
        </span>
        <ToggleBar />
      </header>

      <div
        className={isMobile ? "flex flex-col" : "flex"}
        style={isMobile ? { paddingTop: "40px" } : { paddingTop: "40px", height: "100vh" }}
      >
        <LeftColumn onContactClick={() => setShowContact(true)} />
        {isLoading ? (
          <main className="flex-1 flex items-center justify-center" style={{ borderRight: "1px solid var(--border-light)", minHeight: isMobile ? "40vh" : undefined }}>
            <p style={{ fontSize: "12px", color: "var(--text-grey)", fontFamily: "'Space Mono', monospace" }}>{language === "rs" ? "UČITAVAM..." : "LOADING..."}</p>
          </main>
        ) : (
          <MiddleColumn posts={posts} />
        )}
        <RightColumn />
      </div>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </div>
  );
}

function PostPage() {
  const { data: dbPosts } = trpc.blog.list.useQuery();
  const posts: BlogPost[] = dbPosts ? dbPosts.map(toBlogPost) : [];
  return <PostDetail posts={posts} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Suspense fallback={null}>
        <Routes>
          {/* Public blog. Nothing under here renders an auth control. */}
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/guestbook" element={<Guestbook />} />

          {/* Admin zone. Unguarded login, everything else behind AdminLayout. */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="new-post" element={<PostEditor />} />
            <Route path="edit/:id" element={<PostEditor />} />
            <Route path="guestbook" element={<AdminGuestbook />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* The old public login URL; kept only so stale links land somewhere sane. */}
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </LanguageProvider>
    </ThemeProvider>
  );
}
