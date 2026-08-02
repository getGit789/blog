import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import ImageUpload from "@/components/ImageUpload";

const copy = {
  rs: {
    account: "NALOG", profile: "PROFIL", avatar: "SLIKA PROFILA", cv: "CV",
    currentUser: "Trenutni korisnik",
    currentPassword: "Trenutna lozinka",
    newUsername: "Novo korisničko ime (opciono)",
    newPassword: "Nova lozinka (opciono)",
    confirmPassword: "Potvrdi novu lozinku",
    save: "Sačuvaj", saving: "Čuvam...", cancel: "Otkaži", add: "+ DODAJ",
    edit: "IZMENI", del: "OBRIŠI", confirmDelete: "Obrisati unos?",
    needCurrent: "Unesi trenutnu lozinku",
    mismatch: "Nove lozinke se ne poklapaju",
    tooShort: "Lozinka mora imati bar 6 znakova",
    changedPassword: "Lozinka je promenjena. Prijavi se ponovo.",
    changedUsername: "Korisničko ime je ažurirano.",
    bioRs: "Biografija (srpski)", bioEn: "Biografija (engleski)",
    email: "Email", instagram: "Instagram URL",
    profileSaved: "Profil sačuvan.",
    avatarNote: "Zamena slike odmah menja sajt.",
  },
  en: {
    account: "ACCOUNT", profile: "PROFILE", avatar: "AVATAR", cv: "CV",
    currentUser: "Current user",
    currentPassword: "Current password",
    newUsername: "New username (optional)",
    newPassword: "New password (optional)",
    confirmPassword: "Confirm new password",
    save: "Save", saving: "Saving...", cancel: "Cancel", add: "+ ADD",
    edit: "EDIT", del: "DELETE", confirmDelete: "Delete this entry?",
    needCurrent: "Current password is required",
    mismatch: "New passwords do not match",
    tooShort: "Password must be at least 6 characters",
    changedPassword: "Password changed. Please log in again.",
    changedUsername: "Username updated.",
    bioRs: "Bio (Serbian)", bioEn: "Bio (English)",
    email: "Email", instagram: "Instagram URL",
    profileSaved: "Profile saved.",
    avatarNote: "Replacing the image updates the site immediately.",
  },
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

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  fontSize: "12px",
  fontFamily: "'Space Mono', monospace",
  color: "var(--bg-warm-white)",
  background: "var(--text-charcoal)",
  border: "none",
  cursor: "pointer",
  letterSpacing: "0.05em",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ borderTop: "1px solid var(--border-light)", paddingTop: "24px", marginTop: "32px" }}>
      <h2 className="mono-label" style={{ color: "var(--text-grey)", marginBottom: "16px" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * The admin zone's only settings surface. Everything that used to be edited
 * inline on the public blog (bio, avatar, CV) lives here now, so the public
 * routes render no admin controls at all.
 */
export default function AdminSettings() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="mx-auto" style={{ maxWidth: "720px", padding: "40px 24px 80px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: 400, color: "var(--text-charcoal)" }}>
        {language === "rs" ? "Podešavanja" : "Settings"}
      </h1>

      <Section title={t.account}>
        <AccountForm />
      </Section>

      <Section title={t.profile}>
        <ProfileForm />
      </Section>

      <Section title={t.avatar}>
        <AvatarForm />
      </Section>

      <Section title={t.cv}>
        <CvEditor />
      </Section>
    </div>
  );
}

function AccountForm() {
  const { language } = useLanguage();
  const t = copy[language];
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateMutation = trpc.auth.updateCredentials.useMutation({
    onSuccess: (result) => {
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      if (result.sessionEnded) {
        // The server already expired the cookie. A full reload clears every
        // cached query along with it and drops us back at the login form.
        setSuccess(t.changedPassword);
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 1200);
        return;
      }

      setSuccess(t.changedUsername);
      setNewUsername("");
      utils.auth.me.invalidate();
    },
    onError: (err) => {
      setSuccess("");
      setError(err.message);
    },
  });

  const handleSubmit = () => {
    setError("");
    setSuccess("");

    if (!currentPassword) return setError(t.needCurrent);
    if (newPassword && newPassword !== confirmPassword) return setError(t.mismatch);
    if (newPassword && newPassword.length < 6) return setError(t.tooShort);

    updateMutation.mutate({
      currentPassword,
      newUsername: newUsername || undefined,
      newPassword: newPassword || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label style={labelStyle}>{t.currentUser}</label>
        <div style={{ ...inputStyle, color: "var(--text-grey)" }}>{user?.username}</div>
      </div>

      <div>
        <label style={labelStyle}>{t.currentPassword} *</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>{t.newUsername}</label>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder={user?.username}
          autoComplete="username"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>{t.newPassword}</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>{t.confirmPassword}</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          style={inputStyle}
        />
      </div>

      {error && <p style={{ fontSize: "11px", color: "#E74C3C" }}>{error}</p>}
      {success && <p style={{ fontSize: "11px", color: "#2ECC71" }}>{success}</p>}

      <button onClick={handleSubmit} disabled={updateMutation.isPending} style={buttonStyle}>
        {updateMutation.isPending ? t.saving : t.save}
      </button>
    </div>
  );
}

type ProfileValues = { rsText: string; enText: string; email: string; instagram: string };

function ProfileForm() {
  const { language } = useLanguage();
  const t = copy[language];
  const { data: bio, isLoading } = trpc.profile.get.useQuery();

  if (isLoading) {
    return (
      <p style={{ fontSize: "12px", color: "var(--text-grey)", fontFamily: "'Space Mono', monospace" }}>
        {t.saving}
      </p>
    );
  }

  // Remounted when the bio arrives so the fields seed from it directly rather
  // than being pushed in by an effect after the first render.
  return (
    <ProfileFields
      key={bio ? "loaded" : "empty"}
      initial={{
        rsText: bio?.rsText ?? "",
        enText: bio?.enText ?? "",
        email: bio?.email ?? "",
        instagram: bio?.instagram ?? "",
      }}
    />
  );
}

function ProfileFields({ initial }: { initial: ProfileValues }) {
  const { language } = useLanguage();
  const t = copy[language];
  const utils = trpc.useUtils();

  const [form, setForm] = useState<ProfileValues>(initial);
  const [saved, setSaved] = useState(false);

  const updateBio = trpc.profile.update.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <label style={labelStyle}>{t.email}</label>
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>{t.instagram}</label>
        <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>{t.bioRs}</label>
        <textarea value={form.rsText} onChange={(e) => setForm({ ...form, rsText: e.target.value })} rows={7} style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      <div>
        <label style={labelStyle}>{t.bioEn}</label>
        <textarea value={form.enText} onChange={(e) => setForm({ ...form, enText: e.target.value })} rows={7} style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      {saved && <p style={{ fontSize: "11px", color: "#2ECC71" }}>{t.profileSaved}</p>}

      <button onClick={() => updateBio.mutate(form)} disabled={updateBio.isPending} style={buttonStyle}>
        {updateBio.isPending ? t.saving : t.save}
      </button>
    </div>
  );
}

function AvatarForm() {
  const { language } = useLanguage();
  const t = copy[language];
  const utils = trpc.useUtils();

  const { data: settings } = trpc.settings.get.useQuery();
  const updateSettings = trpc.settings.update.useMutation({
    onSuccess: () => utils.settings.get.invalidate(),
  });

  const avatarUrl = settings?.avatarImage || "/images/covers/profile.jpeg";

  return (
    <div>
      <p className="mono-meta" style={{ color: "var(--text-grey)", marginBottom: "12px" }}>
        {t.avatarNote}
      </p>
      <div style={{ maxWidth: "240px" }}>
        <ImageUpload
          value={avatarUrl}
          onChange={(url) => updateSettings.mutate({ avatarImage: url })}
          label="Avatar"
          variant="dark"
        />
      </div>
    </div>
  );
}

const EMPTY_CV = { category: "Experience", rsTitle: "", rsSubtitle: "", enTitle: "", enSubtitle: "", year: "" };

function CvEditor() {
  const { language } = useLanguage();
  const t = copy[language];
  const utils = trpc.useUtils();

  const { data: entries } = trpc.cv.list.useQuery();
  const invalidate = () => utils.cv.list.invalidate();

  const createCv = trpc.cv.create.useMutation({ onSuccess: invalidate });
  const updateCv = trpc.cv.update.useMutation({ onSuccess: invalidate });
  const deleteCv = trpc.cv.delete.useMutation({ onSuccess: invalidate });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_CV);

  const items = entries ?? [];

  const startAdd = () => {
    setForm(EMPTY_CV);
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (entry: (typeof items)[number]) => {
    setForm({
      category: entry.category,
      rsTitle: entry.rsTitle,
      rsSubtitle: entry.rsSubtitle ?? "",
      enTitle: entry.enTitle,
      enSubtitle: entry.enSubtitle ?? "",
      year: entry.year,
    });
    setEditingId(entry.id);
    setIsAdding(false);
  };

  const close = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const save = () => {
    if (isAdding) {
      createCv.mutate({ ...form, sortOrder: items.length + 1 });
    } else if (editingId !== null) {
      updateCv.mutate({ id: editingId, ...form });
    }
    close();
  };

  const fields: { key: keyof typeof EMPTY_CV; label: string }[] = [
    { key: "category", label: "Category (Experience / Current Focus / Stack / Projects)" },
    { key: "enTitle", label: "EN Title" },
    { key: "enSubtitle", label: "EN Subtitle" },
    { key: "rsTitle", label: "SR Title" },
    { key: "rsSubtitle", label: "SR Subtitle" },
    { key: "year", label: "Year" },
  ];

  const smallButton: React.CSSProperties = {
    fontSize: "10px",
    fontFamily: "'Space Mono', monospace",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    letterSpacing: "0.05em",
  };

  return (
    <div>
      <div className="flex justify-end" style={{ marginBottom: "12px" }}>
        <button onClick={startAdd} style={{ ...smallButton, fontSize: "11px", color: "var(--text-charcoal)" }}>
          {t.add}
        </button>
      </div>

      {(isAdding || editingId !== null) && (
        <div className="space-y-3" style={{ border: "1px solid var(--border-light)", padding: "16px", marginBottom: "20px" }}>
          {fields.map((f) => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                style={inputStyle}
              />
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={save} style={{ ...buttonStyle, padding: "8px 16px" }}>{t.save}</button>
            <button
              onClick={close}
              style={{ ...buttonStyle, padding: "8px 16px", background: "none", color: "var(--text-charcoal)", border: "1px solid var(--border-light)" }}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      <div style={{ borderTop: "1px solid var(--border-light)" }}>
        {items.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start justify-between gap-4"
            style={{ borderBottom: "1px solid var(--border-light)", padding: "12px 0" }}
          >
            <div style={{ minWidth: 0 }}>
              <span className="mono-label" style={{ color: "var(--accent-teal)" }}>{entry.category}</span>
              <p className="mono-title" style={{ fontSize: "13px", color: "var(--text-charcoal)", marginTop: "2px" }}>
                {language === "rs" ? entry.rsTitle : entry.enTitle}
              </p>
              <p className="mono-meta" style={{ color: "var(--text-grey)" }}>
                {(language === "rs" ? entry.rsSubtitle : entry.enSubtitle) || ""} {entry.year}
              </p>
            </div>
            <div className="flex gap-3" style={{ flexShrink: 0 }}>
              <button onClick={() => startEdit(entry)} style={{ ...smallButton, color: "var(--text-charcoal)" }}>
                {t.edit}
              </button>
              <button
                onClick={() => { if (confirm(t.confirmDelete)) deleteCv.mutate({ id: entry.id }); }}
                style={{ ...smallButton, color: "#E74C3C" }}
              >
                {t.del}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
