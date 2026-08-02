import { useState } from "react";
import ShaderCanvas from "./ShaderCanvas";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/useIsMobile";
import { trpc } from "@/providers/trpc";

interface LeftColumnProps {
  onContactClick: () => void;
}

const fallbackText = {
  rs: "Zovem se Damir. Full stack sam inženjer i vodim Beekio LLC. Softver pravim sam, s kraja na kraj, od baze do deploya. Pre toga sam držao sisteme u životu u Mozzartbetu, a pre toga odgovarao na tikete u AT&T u Brnu. Sad mi vreme ode na klijente, na moje proizvode i na home lab koji nikad nije skroz gotov. Ovde zapisujem sve to: šta pravim, šta se raspalo i šta sam iz toga naučio.",
  en: "I'm Damir Kranjčević, a full stack engineer and founder of Beekio LLC, building and running software end to end as a one man operation. Before going independent I kept systems alive as a System Administrator at Mozzartbet and an IT Support Engineer at AT&T Brno. These days I split my time between client work, my own products, and a home lab that's never quite finished. This blog is where I write all of it down: what I'm building, what broke, and what I learned.",
};

const copy = {
  rs: { profile: "PROFIL (KONTAKT)", edit: "IZMENI", save: "SAČUVAJ", cancel: "OTKAŽI", contact: "KONTAKT", whoami: "root@damir:~$ whoami", tags: "Linux · Self Hosted · DevOps" },
  en: { profile: "PROFILE (CONTACT)", edit: "EDIT", save: "SAVE", cancel: "CANCEL", contact: "CONTACT", whoami: "root@damir:~$ whoami", tags: "Linux · Self Hosted · DevOps" },
};

export default function LeftColumn({ onContactClick }: LeftColumnProps) {
  const { language } = useLanguage();
  const t = copy[language];
  const { isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const utils = trpc.useUtils();

  const { data: bio } = trpc.profile.get.useQuery();
  const updateBio = trpc.profile.update.useMutation({
    onSuccess: () => utils.profile.get.invalidate(),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editRs, setEditRs] = useState("");
  const [editEn, setEditEn] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editInstagram, setEditInstagram] = useState("");

  const profileText = {
    rs: bio?.rsText || fallbackText.rs,
    en: bio?.enText || fallbackText.en,
  };
  const email = bio?.email || "contact@damirkranjcevic.com";
  const instagram = bio?.instagram || "https://www.instagram.com/damir.kranjcevic/";

  const startEdit = () => {
    setEditRs(profileText.rs);
    setEditEn(profileText.en);
    setEditEmail(email);
    setEditInstagram(instagram);
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateBio.mutate({ rsText: editRs, enText: editEn, email: editEmail, instagram: editInstagram });
    setIsEditing(false);
  };

  const inputStyle = {
    width: "100%",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "6px 8px",
    fontSize: "11px",
    color: "#FFFFFF",
    outline: "none" as const,
    resize: "vertical" as const,
    fontFamily: "'Space Mono', monospace",
  };

  const labelStyle = {
    fontSize: "10px",
    color: "rgba(255,255,255,0.6)",
    display: "block" as const,
    marginBottom: "4px",
  };

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
      <ShaderCanvas />

      <div
        className="relative z-10 flex flex-col h-full p-6"
        style={{ mixBlendMode: "difference" }}
      >
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2
              className="mono-label"
              style={{ color: "#FFFFFF", marginBottom: "16px" }}
            >
              {t.profile}
            </h2>
            {isAdmin && !isEditing && (
              <button
                onClick={startEdit}
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.6)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Space Mono', monospace",
                  marginBottom: "16px",
                }}
              >
                {t.edit}
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <div>
                <label style={labelStyle}>EMAIL</label>
                <input
                  type="text"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>
              <div>
                <label style={labelStyle}>INSTAGRAM URL</label>
                <input
                  type="text"
                  value={editInstagram}
                  onChange={(e) => setEditInstagram(e.target.value)}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>
            </div>
          ) : (
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
          )}
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label style={labelStyle}>SR</label>
                <textarea
                  value={editRs}
                  onChange={(e) => setEditRs(e.target.value)}
                  rows={8}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>EN</label>
                <textarea
                  value={editEn}
                  onChange={(e) => setEditEn(e.target.value)}
                  rows={8}
                  style={inputStyle}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  style={{
                    fontSize: "10px",
                    color: "#1A1A1A",
                    background: "#FFFFFF",
                    border: "none",
                    padding: "4px 12px",
                    cursor: "pointer",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {t.save}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    fontSize: "10px",
                    color: "#FFFFFF",
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    padding: "4px 12px",
                    cursor: "pointer",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
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
