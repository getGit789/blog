import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { trpc } from "@/providers/trpc";

interface CVItem {
  category: string;
  title: string;
  subtitle?: string;
  year: string;
}

const fallbackCvData: Record<string, CVItem[]> = {
  rs: [
    { category: "Experience", title: "Beekio LLC", subtitle: "Osnivač i full stack inženjer", year: "2026 do danas" },
    { category: "Experience", title: "Mozzartbet", subtitle: "Sistem administrator", year: "2022 do 2024" },
    { category: "Experience", title: "AT&T Brno", subtitle: "Inženjer IT podrške", year: "2020 do 2022" },
    { category: "Current Focus", title: "Beekio", subtitle: "AI konsultant za pčelare, pred lansiranje", year: "2026" },
    { category: "Current Focus", title: "WPAS AI asistent", subtitle: "Multi agent LLM pipeline u produkciji", year: "2026" },
    { category: "Current Focus", title: "Home lab v2", subtitle: "Home lab na Proxmox i Docker", year: "2026" },
    { category: "Stack", title: "Jezici", subtitle: "TypeScript / Python / Rust", year: "" },
    { category: "Stack", title: "Infrastruktura", subtitle: "Docker / Proxmox / Linux", year: "" },
    { category: "Projects", title: "Beekio", subtitle: "AI SaaS za pčelare, lista čekanja otvorena", year: "2026" },
    { category: "Projects", title: "WPAS AI asistent", subtitle: "AI asistent, sam od početka do kraja", year: "2026" },
    { category: "Projects", title: "SudoWear", subtitle: "Shop koji sam sam napravio i vodim", year: "Uživo od 2025" },
    { category: "Projects", title: "Ovaj blog", subtitle: "Full stack / React + tRPC + Drizzle", year: "2026" },
  ],
  en: [
    { category: "Experience", title: "Beekio LLC", subtitle: "Founder / Full Stack Engineer", year: "2026 to Present" },
    { category: "Experience", title: "Mozzartbet", subtitle: "System Administrator", year: "2022 to 2024" },
    { category: "Experience", title: "AT&T Brno", subtitle: "IT Support Engineer", year: "2020 to 2022" },
    { category: "Current Focus", title: "Beekio", subtitle: "AI beekeeping consultant, pre launch", year: "2026" },
    { category: "Current Focus", title: "WPAS AI Assistant", subtitle: "Multi agent LLM pipelines in production", year: "2026" },
    { category: "Current Focus", title: "Self Hosted Lab v2", subtitle: "Proxmox and Docker home infrastructure", year: "2026" },
    { category: "Stack", title: "Languages", subtitle: "TypeScript / Python / Rust", year: "" },
    { category: "Stack", title: "Infrastructure", subtitle: "Docker / Proxmox / Linux", year: "" },
    { category: "Projects", title: "Beekio", subtitle: "AI beekeeping SaaS, waitlist open", year: "2026" },
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
  rs: { heading: "CV (ARHIVA)", updated: "Poslednja izmena 2026.08" },
  en: { heading: "CV (ARCHIVE)", updated: "Last Updated 2026.08" },
};

// CV entries and the avatar are edited at /admin/settings. This column only reads.

export default function RightColumn() {
  const { language } = useLanguage();
  const t = copy[language];
  const isMobile = useIsMobile();

  const { data: cvDataDb } = trpc.cv.list.useQuery();

  // Falls back to the hardcoded CV until the database has entries, so a fresh
  // unseeded install still renders a complete page.
  const dbItems = cvDataDb ?? [];
  const items = dbItems.length > 0
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
        <h2 className="mono-label" style={{ color: "var(--text-grey)", marginBottom: "48px" }}>
          {t.heading}
        </h2>

        <AvatarSection />

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
  const { data: settings } = trpc.settings.get.useQuery();
  const avatarUrl = settings?.avatarImage || "/images/covers/profile.jpeg";

  return (
    <div className="mb-10">
      <div style={{ border: "1px solid var(--border-light)", boxShadow: "0px 4px 15px rgba(0,0,0,0.08)", overflow: "hidden", aspectRatio: "1 / 1", width: "100%" }}>
        {/* Fills the square frame exactly: object-fit handles the crop, so there is
            nothing to shift and no background can show through. */}
        <img
          src={avatarUrl}
          alt="Portrait"
          className="block"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </div>
    </div>
  );
}
