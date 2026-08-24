import { lazy, Suspense } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { trpc } from "@/providers/trpc";

// three.js is ~700 kB and only draws the decorative backdrop, so it loads
// after first paint instead of blocking it.
const ShaderCanvas = lazy(() => import("./ShaderCanvas"));

interface LeftColumnProps {
  onContactClick: () => void;
}

const fallbackText = {
  rs: "Zovem se Damir. Full stack sam inženjer i vodim Beekio LLC. Softver pravim sam, s kraja na kraj, od baze do deploya. Pre toga sam držao sisteme u životu u Mozzartbetu, a pre toga odgovarao na tikete u AT&T u Brnu. Sad mi vreme ode na klijente, na moje proizvode i na home lab koji nikad nije skroz gotov. Ovde zapisujem sve to: šta pravim, šta se raspalo i šta sam iz toga naučio.",
  en: "I'm Damir Kranjčević, a full stack engineer and founder of Beekio LLC, building and running software end to end as a one man operation. Before going independent I kept systems alive as a System Administrator at Mozzartbet and an IT Support Engineer at AT&T Brno. These days I split my time between client work, my own products, and a home lab that's never quite finished. This blog is where I write all of it down: what I'm building, what broke, and what I learned.",
};

const copy = {
  rs: { profile: "PROFIL (KONTAKT)", contact: "KONTAKT", whoami: "root@damir:~$ whoami", tags: "Linux · Self Hosted · DevOps" },
  en: { profile: "PROFILE (CONTACT)", contact: "CONTACT", whoami: "root@damir:~$ whoami", tags: "Linux · Self Hosted · DevOps" },
};

// Bio, email and Instagram are edited at /admin/settings. This column only reads.

export default function LeftColumn({ onContactClick }: LeftColumnProps) {
  const { language } = useLanguage();
  const t = copy[language];
  const isMobile = useIsMobile();

  const { data: bio } = trpc.profile.get.useQuery();

  const profileText = {
    rs: bio?.rsText || fallbackText.rs,
    en: bio?.enText || fallbackText.en,
  };
  const email = bio?.email || "contact@damirkranjcevic.com";
  const instagram = bio?.instagram || "https://www.instagram.com/damir.kranjcevic/";

  return (
    <aside
      className={isMobile ? "flex flex-col" : "sticky top-0 h-screen flex flex-col"}
      style={{
        width: isMobile ? "100%" : "21%",
        minWidth: isMobile ? "0" : "240px",
        minHeight: isMobile ? "55vh" : undefined,
        borderRight: isMobile ? "none" : "1px solid var(--border-light)",
        position: "relative",
      }}
    >
      <Suspense fallback={null}>
        <ShaderCanvas />
      </Suspense>

      <div
        className="relative z-10 flex flex-col h-full p-6"
        style={{ mixBlendMode: "difference" }}
      >
        <div className="mb-8">
          <h2
            className="mono-label"
            style={{ color: "#FFFFFF", marginBottom: "16px" }}
          >
            {t.profile}
          </h2>

          <div className="space-y-1">
            <a
              href={`mailto:${email}`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "#FFFFFF",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                display: "block",
                lineHeight: 1.8,
              }}
            >
              {email}
            </a>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "#FFFFFF",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                display: "block",
                lineHeight: 1.8,
              }}
            >
              Instagram
            </a>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.62)",
                lineHeight: 1.9,
              }}
            >
              {t.whoami}
            </p>
            <p
              className="mono-label"
              style={{ color: "#FFFFFF", lineHeight: 1.9 }}
            >
              {t.tags}
            </p>
          </div>
          <p
            className="prose-lead"
            style={{
              color: "#FFFFFF",
              maxWidth: isMobile ? "100%" : "34ch",
            }}
          >
            {profileText[language]}
          </p>
        </div>

        <div className="mt-auto" style={{ flexShrink: 0, paddingBottom: "24px" }}>
          <button
            onClick={onContactClick}
            className="mono-label"
            style={{
              color: "#FFFFFF",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.opacity = "0.6";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.opacity = "1";
            }}
          >
            {t.contact}
          </button>
        </div>
      </div>
    </aside>
  );
}
