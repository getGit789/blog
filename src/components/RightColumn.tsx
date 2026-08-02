import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/useIsMobile";
import { trpc } from "@/providers/trpc";
import ImageUpload from "./ImageUpload";

gsap.registerPlugin(ScrollTrigger);

interface CVItem {
  category: string;
  title: string;
  subtitle?: string;
  year: string;
}

const fallbackCvData: Record<string, CVItem[]> = {
  rs: [
    { category: "Experience", title: "Beekio LLC", subtitle: "Osnivač i full stack inženjer", year: "2024 do danas" },
    { category: "Experience", title: "Mozzartbet", subtitle: "Sistem administrator", year: "2022 do 2024" },
    { category: "Experience", title: "AT&T Brno", subtitle: "Inženjer IT podrške", year: "2020 do 2022" },
    { category: "Current Focus", title: "Beekio", subtitle: "Pravim i vodim svoje SaaS proizvode", year: "U toku" },
    { category: "Current Focus", title: "WPAS AI asistent", subtitle: "Multi agent LLM pipeline u produkciji", year: "2026" },
    { category: "Current Focus", title: "Home lab v2", subtitle: "Home lab na Proxmox i Docker", year: "2026" },
    { category: "Stack", title: "Jezici", subtitle: "TypeScript / Python / Rust", year: "" },
    { category: "Stack", title: "Infrastruktura", subtitle: "Docker / Proxmox / Linux", year: "" },
    { category: "Projects", title: "WPAS AI asistent", subtitle: "AI asistent, sam od početka do kraja", year: "2026" },
    { category: "Projects", title: "SudoWear", subtitle: "Shop koji sam sam napravio i vodim", year: "Uživo od 2025" },
    { category: "Projects", title: "Ovaj blog", subtitle: "Full stack / React + tRPC + Drizzle", year: "2026" },
  ],
  en: [
    { category: "Experience", title: "Beekio LLC", subtitle: "Founder / Full Stack Engineer", year: "2024 to Present" },
    { category: "Experience", title: "Mozzartbet", subtitle: "System Administrator", year: "2022 to 2024" },
    { category: "Experience", title: "AT&T Brno", subtitle: "IT Support Engineer", year: "2020 to 2022" },
    { category: "Current Focus", title: "Beekio", subtitle: "Building and running my own SaaS products", year: "Ongoing" },
    { category: "Current Focus", title: "WPAS AI Assistant", subtitle: "Multi agent LLM pipelines in production", year: "2026" },
    { category: "Current Focus", title: "Self Hosted Lab v2", subtitle: "Proxmox and Docker home infrastructure", year: "2026" },
    { category: "Stack", title: "Languages", subtitle: "TypeScript / Python / Rust", year: "" },
    { category: "Stack", title: "Infrastructure", subtitle: "Docker / Proxmox / Linux", year: "" },
    { category: "Projects", title: "WPAS AI Assistant", subtitle: "AI assistant, built solo end to end", year: "2026" },
    { category: "Projects", title: "SudoWear", subtitle: "Online store, built and operated solo", year: "Live since 2025" },
    { category: "Projects", title: "This Blog", subtitle: "Full stack / React + tRPC + Drizzle", year: "2026" },
  ],
};

// Category keys stay stable in the database; only the displayed label changes.
const categoryLabels: Record<string, { rs: string; en: string }> = {
  Experience: { rs: "Iskustvo", en: "Experience" },
  "Current Focus": { rs: "Trenutni fokus", en: "Current Focus" },
  Stack: { rs: "Tehnologije", en: "Stack" },
  Projects: { rs: "Projekti", en: "Projects" },
};

const copy = {
  rs: { heading: "CV (ARHIVA)", add: "+ DODAJ", save: "SAČUVAJ", cancel: "OTKAŽI", edit: "IZMENI", del: "OBRIŠI", confirmDelete: "Obrisati unos?", updated: "Poslednja izmena 2026.08", editAvatar: "IZMENI SLIKU", close: "ZATVORI" },
  en: { heading: "CV (ARCHIVE)", add: "+ ADD", save: "SAVE", cancel: "CANCEL", edit: "EDIT", del: "DEL", confirmDelete: "Delete?", updated: "Last Updated 2026.08", editAvatar: "EDIT AVATAR", close: "CLOSE" },
};

export default function RightColumn() {
  const { language } = useLanguage();
  const t = copy[language];
  const { isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const artFrameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const utils = trpc.useUtils();

  const { data: cvDataDb } = trpc.cv.list.useQuery();
  const createCv = trpc.cv.create.useMutation({ onSuccess: () => utils.cv.list.invalidate() });
  const updateCv = trpc.cv.update.useMutation({ onSuccess: () => utils.cv.list.invalidate() });
  const deleteCv = trpc.cv.delete.useMutation({ onSuccess: () => utils.cv.list.invalidate() });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ category: "", rsTitle: "", rsSubtitle: "", enTitle: "", enSubtitle: "", year: "" });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!artFrameRef.current || !imageRef.current) return;
    const tween = gsap.to(imageRef.current, {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: artFrameRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  // Transform DB entries to grouped format
  const dbItems = cvDataDb ?? [];
  const useDb = dbItems.length > 0;

  const items = useDb
    ? dbItems.map((e) => ({
        category: e.category,
        title: language === "rs" ? e.rsTitle : e.enTitle,
        subtitle: language === "rs" ? (e.rsSubtitle || undefined) : (e.enSubtitle || undefined),
        year: e.year,
        id: e.id,
      }))
    : fallbackCvData[language].map((e, i) => ({ ...e, id: i }));

  const sections = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const sectionOrder = ["Experience", "Current Focus", "Stack", "Projects"];

  const startEdit = (item: (typeof items)[0]) => {
    const dbItem = dbItems.find((d) => d.id === item.id);
    if (dbItem) {
      setEditForm({
        category: dbItem.category,
        rsTitle: dbItem.rsTitle,
        rsSubtitle: dbItem.rsSubtitle || "",
        enTitle: dbItem.enTitle,
        enSubtitle: dbItem.enSubtitle || "",
        year: dbItem.year,
      });
      setEditingId(item.id);
      setIsAdding(false);
    }
  };

  const startAdd = () => {
    setEditForm({ category: "Experience", rsTitle: "", rsSubtitle: "", enTitle: "", enSubtitle: "", year: "" });
    setIsAdding(true);
    setEditingId(null);
  };

  const saveEdit = () => {
    if (isAdding) {
      createCv.mutate({ ...editForm, sortOrder: dbItems.length + 1 });
    } else if (editingId !== null) {
      updateCv.mutate({ id: editingId, ...editForm });
    }
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <aside
      className={isMobile ? "" : "sticky top-0 h-screen overflow-y-auto"}
      style={{
        width: isMobile ? "100%" : "25%",
        minWidth: isMobile ? "0" : "280px",
        borderTop: isMobile ? "1px solid var(--border-light)" : "none",
      }}
    >
      <div className="p-6 pb-24">
        <div className="flex items-center justify-between">
          <h2 className="mono-label" style={{ color: "var(--text-grey)", marginBottom: "48px" }}>
            {t.heading}
          </h2>
          {isAdmin && (
            <button onClick={startAdd} style={{ fontSize: "10px", color: "var(--text-grey)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", marginBottom: "48px" }}>
              {t.add}
            </button>
          )}
        </div>

        <AvatarSection />

        {(isAdding || editingId !== null) && (
          <div className="mb-6 p-3" style={{ border: "1px solid var(--border-light)" }}>
            <div className="space-y-2">
              {[
                { key: "category", ph: "Category" },
                { key: "rsTitle", ph: "SR Title" },
                { key: "rsSubtitle", ph: "SR Subtitle" },
                { key: "enTitle", ph: "EN Title" },
                { key: "enSubtitle", ph: "EN Subtitle" },
                { key: "year", ph: "Year" },
              ].map((f) => (
                <input
                  key={f.key}
                  placeholder={f.ph}
                  value={editForm[f.key as keyof typeof editForm]}
                  onChange={(e) => setEditForm({ ...editForm, [f.key]: e.target.value })}
                  style={{
                    width: "100%",
                    fontSize: "11px",
                    padding: "6px 8px",
                    border: "1px solid var(--border-light)",
                    outline: "none",
                    background: "transparent",
                    color: "var(--text-charcoal)",
                    fontFamily: "'Space Mono', monospace",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={saveEdit} style={{ fontSize: "10px", padding: "3px 10px", background: "#FFFFFF", color: "#1A1A1A", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>{t.save}</button>
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} style={{ fontSize: "10px", padding: "3px 10px", background: "none", border: "1px solid var(--border-light)", cursor: "pointer", fontFamily: "'Space Mono', monospace", color: "var(--text-charcoal)" }}>{t.cancel}</button>
            </div>
          </div>
        )}

        {sectionOrder.map((category) => {
          const sectionItems = sections[category];
          if (!sectionItems || sectionItems.length === 0) return null;
          return (
            <div key={category} style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: "22px", marginBottom: "22px" }}>
              {sectionItems.map((item, idx) => (
                <div key={item.id} className="flex gap-4" style={{ marginBottom: idx < sectionItems.length - 1 ? "20px" : "0" }}>
                  {idx === 0 && <span className="mono-label" style={{ color: "var(--text-charcoal)", flexShrink: 0, width: "84px" }}>{categoryLabels[category]?.[language] ?? category}</span>}
                  {idx > 0 && <span style={{ width: "84px", flexShrink: 0 }} />}
                  <div className="flex-1 relative group">
                    <p className="mono-title" style={{ fontSize: "13px", lineHeight: 1.55, color: "var(--text-charcoal)", whiteSpace: "pre-line" }}>{item.title}</p>
                    {item.subtitle && <p className="prose-lead" style={{ fontSize: "13.5px", color: "var(--text-grey)", whiteSpace: "pre-line", marginTop: "2px" }}>{item.subtitle}</p>}
                    <p className="mono-meta" style={{ lineHeight: 1.7, color: "var(--text-grey)", marginTop: "2px" }}>{item.year}</p>
                    {isAdmin && useDb && (
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => startEdit(item)} style={{ fontSize: "9px", color: "var(--text-grey)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>{t.edit}</button>
                        <button onClick={() => { if (confirm(t.confirmDelete)) deleteCv.mutate({ id: item.id }); }} style={{ fontSize: "9px", color: "#E74C3C", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>{t.del}</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <p className="mono-label" style={{ color: "var(--text-grey)", marginTop: "40px" }}>{t.updated}</p>
      </div>
    </aside>
  );
}

function AvatarSection() {
  const { language } = useLanguage();
  const t = copy[language];
  const { isAdmin } = useAuth();
  const utils = trpc.useUtils();
  const artFrameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [editingAvatar, setEditingAvatar] = useState(false);

  const { data: settings } = trpc.settings.get.useQuery();
  const updateSettings = trpc.settings.update.useMutation({
    onSuccess: () => utils.settings.get.invalidate(),
  });

  const avatarUrl = settings?.avatarImage || "/images/portrait.jpg";

  useEffect(() => {
    if (!artFrameRef.current || !imageRef.current) return;
    const tween = gsap.to(imageRef.current, {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: artFrameRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, [avatarUrl]);

  return (
    <div className="mb-10">
      <div ref={artFrameRef} style={{ border: "1px solid var(--border-light)", boxShadow: "0px 4px 15px rgba(0,0,0,0.08)", overflow: "hidden", aspectRatio: "1 / 1", width: "100%", position: "relative" }}>
        {/* Sized taller than the frame so the scroll-linked y:-40 parallax below never
            uncovers the container's bottom edge and exposes the page background. */}
        <img
          ref={imageRef}
          src={avatarUrl}
          alt="Portrait"
          className="block"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "calc(100% + 56px)", objectFit: "cover" }}
          loading="lazy"
        />
      </div>
      {isAdmin && (
        <div className="mt-2">
          {editingAvatar ? (
            <div className="p-2" style={{ border: "1px solid var(--border-light)" }}>
              <ImageUpload
                value={avatarUrl}
                onChange={(url) => updateSettings.mutate({ avatarImage: url })}
                label="Avatar"
                variant="light"
              />
              <button
                onClick={() => setEditingAvatar(false)}
                style={{ fontSize: "10px", marginTop: "8px", padding: "3px 10px", background: "none", border: "1px solid var(--border-light)", cursor: "pointer", fontFamily: "'Space Mono', monospace", color: "var(--text-charcoal)" }}
              >
                {t.close}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingAvatar(true)}
              style={{ fontSize: "10px", color: "var(--text-grey)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}
            >
              {t.editAvatar}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
