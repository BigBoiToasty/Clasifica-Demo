import { useState } from "react";
import {
  MAX_EVIDENCE_IMAGES,
  categories,
  copy,
  defaultSettings,
  organizations,
  users,
  type CategoryId,
  type Classification,
  type Evidence,
  type Language,
  type Screen,
  type Settings,
  type User,
} from "./data";
import { formatDateTime, uruguayNow } from "./time";
import { BackIcon, HomeIcon, SettingsIcon } from "./icons";
import SignIn from "./screens/SignIn";
import Users from "./screens/Users";
import Dashboard, { type LastEntry } from "./screens/Dashboard";
import ClassifySetup from "./screens/ClassifySetup";
import ClassifyReview from "./screens/ClassifyReview";
import ClassifyCategories from "./screens/ClassifyCategories";
import ClassifyMaterial from "./screens/ClassifyMaterial";
import HistoryScreen, { SAMPLE_ENTRIES, type HistoryEntry } from "./screens/History";
import SettingsScreen from "./screens/Settings";
import EvidenceSetup from "./screens/EvidenceSetup";
import EvidenceEntry from "./screens/EvidenceEntry";
import WeightSheet from "./components/WeightSheet";
import HelpSheet from "./components/HelpSheet";

const newClassification = (): Classification => ({
  organization: "",
  location: "",
  date: uruguayNow(),
  weights: {},
});

const newEvidence = (): Evidence => ({
  organization: "",
  location: "",
  date: uruguayNow(),
  images: [],
  notes: "",
});

const SETTINGS_KEY = "clasifica-settings";

// Settings are a per-device preference, so they're remembered in this browser.
function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

// Where the top-left "Go back" button leads from each screen.
const backTo: Partial<Record<Screen, Screen>> = {
  users: "sign-in",
  dashboard: "users",
  "classify-setup": "dashboard",
  review: "classify-setup",
  "classify-categories": "review",
  material: "classify-categories",
  history: "dashboard",
  "evidence-setup": "dashboard",
  "evidence-entry": "evidence-setup",
};

// ponytail: manual entry + single-page setup only. Voice mode and the "pages" layout
// come with the Settings screen, which is what switches them on.
export default function App() {
  const [screen, setScreen] = useState<Screen>("sign-in");
  const [language, setLanguage] = useState<Language>("EN");
  const [user, setUser] = useState<User>(users[0]);
  const [notice, setNotice] = useState("");

  const [draft, setDraft] = useState<Classification>(newClassification);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("paper");
  const [weightMaterial, setWeightMaterial] = useState("");
  const [help, setHelp] = useState<{ category: CategoryId; material?: string } | null>(null);
  // Which entry was sent last; drives the temporary "Edit last …" button on the dashboard.
  // Cleared when a new entry is started or the user changes.
  const [lastSent, setLastSent] = useState<LastEntry["kind"] | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(SAMPLE_ENTRIES);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  // Settings opens from any screen; "Go back" returns there.
  const [settingsReturn, setSettingsReturn] = useState<Screen>("dashboard");

  function updateSettings(patch: Partial<Settings>) {
    setSettings((s) => {
      const next = { ...s, ...patch };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable (private mode); settings still apply for this session.
      }
      return next;
    });
  }

  function openSettings() {
    setSettingsReturn(screen);
    navigate("settings");
  }

  const text = copy[language];
  const en = language === "EN";

  function navigate(next: Screen) {
    setNotice("");
    setScreen(next);
  }

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1900);
  }

  // Spoken feedback; switched on/off in Settings.
  function speak(message: string) {
    if (!settings.spokenFeedback || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = en ? "en-US" : "es-UY";
    window.speechSynthesis.speak(utterance);
  }

  function confirmChoice(message: string) {
    flash(message);
    speak(message);
  }

  const updateDraft = (patch: Partial<Classification>) => setDraft((d) => ({ ...d, ...patch }));

  function startClassification() {
    setLastSent(null);
    setDraft(newClassification());
    navigate("classify-setup");
  }

  function openCategory(category: CategoryId) {
    const cat = categories.find((c) => c.id === category)!;
    setActiveCategory(category);
    navigate("material");
    confirmChoice(en ? `${cat.en} selected` : `${cat.es} seleccionado`);
  }

  function openWeight(material: string) {
    setWeightMaterial(material);
    speak(material);
  }

  function saveWeight(weight: number) {
    setDraft((d) => ({ ...d, weights: { ...d.weights, [weightMaterial]: weight } }));
    confirmChoice(
      en ? `${weightMaterial}: ${weight} kg added` : `${weightMaterial}: ${weight} kg agregado`,
    );
    setWeightMaterial("");
  }

  function removeMaterial(material: string) {
    setDraft((d) => {
      const weights = { ...d.weights };
      delete weights[material];
      return { ...d, weights };
    });
    confirmChoice(en ? "Material removed" : "Material eliminado");
  }

  function speakSummary() {
    const org = organizations.find((o) => o.id === draft.organization)?.name;
    const materials = Object.keys(draft.weights);
    const total = Object.values(draft.weights).reduce((sum, w) => sum + w, 0);
    const list = materials.map((m) => `${m}, ${draft.weights[m]} kilograms`).join(". ");
    const when = formatDateTime(draft.date, language);
    speak(
      en
        ? `Classification summary. ${org}, ${draft.location}. ${when}. ${materials.length} materials, ${total.toFixed(1)} kilograms total. ${list}`
        : `Resumen de clasificación. ${org}, ${draft.location}. ${when}. ${materials.length} materiales, ${total.toFixed(1)} kilos en total. ${list}`,
    );
  }

  function submitClassification() {
    const edited = lastSent === "classification";
    setLastSent("classification");
    navigate("dashboard");
    flash(
      edited
        ? en ? "Classification updated" : "Clasificación actualizada"
        : en ? "Classification saved" : "Clasificación guardada",
    );
  }

  // ---- Evidences ----
  const [evidence, setEvidence] = useState<Evidence>(newEvidence);
  const updateEvidence = (patch: Partial<Evidence>) => setEvidence((e) => ({ ...e, ...patch }));

  /** Starts a fresh evidence, freeing the previews of the previous one. */
  function startEvidence() {
    setLastSent(null);
    evidence.images.forEach((image) => URL.revokeObjectURL(image.url));
    setEvidence(newEvidence());
    navigate("evidence-setup");
  }

  function addEvidenceImages(files: File[]) {
    const room = MAX_EVIDENCE_IMAGES - evidence.images.length;
    const added = files
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, room)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    if (added.length === 0) return;
    updateEvidence({ images: [...evidence.images, ...added] });
    if (files.length > room) flash(en ? "Up to 4 photos" : "Hasta 4 fotos");
    else confirmChoice(en ? "Photo added" : "Foto agregada");
  }

  function removeEvidenceImage(index: number) {
    URL.revokeObjectURL(evidence.images[index].url);
    updateEvidence({ images: evidence.images.filter((_, i) => i !== index) });
    confirmChoice(en ? "Photo removed" : "Foto eliminada");
  }

  function speakEvidenceSummary() {
    const org = organizations.find((o) => o.id === evidence.organization)?.name;
    const when = formatDateTime(evidence.date, language);
    const count = evidence.images.length;
    const notes = evidence.notes.trim();
    speak(
      en
        ? `Evidence summary. ${org}, ${evidence.location}. ${when}. ${count} ${count === 1 ? "photo" : "photos"}.${notes ? ` Notes: ${notes}` : ""}`
        : `Resumen de evidencia. ${org}, ${evidence.location}. ${when}. ${count} ${count === 1 ? "foto" : "fotos"}.${notes ? ` Notas: ${notes}` : ""}`,
    );
  }

  // ponytail: no backend yet, so "sending" just confirms. Upload `evidence.images[].file`
  // + the other fields here once there's an API. The draft is kept (not reset) so the
  // dashboard's "Edit last evidence" can reopen it; startEvidence() clears it.
  function sendEvidence() {
    const edited = lastSent === "evidence";
    setLastSent("evidence");
    navigate("dashboard");
    confirmChoice(
      edited
        ? en ? "Evidence updated" : "Evidencia actualizada"
        : en ? "Evidence sent" : "Evidencia enviada",
    );
  }

  /** Details for the dashboard's "Edit last …" button. */
  const lastSentEntry = lastSent && (lastSent === "classification" ? draft : evidence);
  const lastEntry: LastEntry | null = lastSentEntry
    ? {
        kind: lastSent!,
        client: organizations.find((o) => o.id === lastSentEntry.organization)?.name ?? "",
        location: lastSentEntry.location,
        date: lastSentEntry.date,
      }
    : null;

  function goHome() {
    setWeightMaterial("");
    setHelp(null);
    navigate("dashboard");
  }

  const toggleLanguage = () => setLanguage(en ? "ES" : "EN");

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section
        className="app-frame"
        aria-label="Obra Padre Cacho app"
        data-ui-size={settings.uiSize}
        data-custom-color={settings.fontColor !== null}
        style={
          {
            "--font-adjust": `${settings.fontAdjust}px`,
            "--app-brightness": `${settings.brightness}%`,
            ...(settings.fontColor && { "--font-color": settings.fontColor }),
          } as React.CSSProperties
        }
      >
        {screen !== "sign-in" && (
          <header className="topbar">
            <div className="topbar-actions">
              <button
                type="button"
                className="back-button"
                onClick={() =>
                  navigate(screen === "settings" ? settingsReturn : (backTo[screen] ?? "sign-in"))
                }
              >
                <BackIcon />
                {text.back}
              </button>
              {screen !== "users" && screen !== "dashboard" && (
                <button
                  type="button"
                  className="home-button"
                  onClick={goHome}
                  aria-label={en ? "Go to dashboard" : "Ir al inicio"}
                >
                  <HomeIcon />
                </button>
              )}
            </div>
            <div className="topbar-actions">
              {screen !== "settings" && (
                <button
                  type="button"
                  className="settings-button"
                  onClick={openSettings}
                  aria-label={en ? "Open settings" : "Abrir ajustes"}
                >
                  <SettingsIcon />
                </button>
              )}
              <button
                type="button"
                className="language-button"
                onClick={toggleLanguage}
                aria-label="Change language"
              >
                {language}
              </button>
            </div>
          </header>
        )}

        {screen === "sign-in" && (
          <SignIn
            language={language}
            onToggleLanguage={toggleLanguage}
            onSignIn={() => navigate("users")}
          />
        )}
        {screen === "users" && (
          <Users
            language={language}
            onSelect={(selected) => {
              setUser(selected);
              setLastSent(null);
              navigate("dashboard");
            }}
          />
        )}
        {screen === "dashboard" && (
          <Dashboard
            key={user.name}
            language={language}
            user={user}
            lastEntry={lastEntry}
            onEditLastEntry={() => navigate(lastSent === "evidence" ? "evidence-entry" : "review")}
            onOption={(option, index) =>
              index === 1 ? startClassification() 
              : index === 2 ? navigate("history")
              : index === 3 ? startEvidence()
              : flash(`${option} ${text.comingSoon}`)
            }
          />
        )}

        {screen === "classify-setup" && (
          <ClassifySetup
            language={language}
            draft={draft}
            onSelectOrganization={(id, name) => {
              updateDraft({ organization: id, location: "" });
              confirmChoice(`${name} ${en ? "selected" : "seleccionado"}`);
            }}
            onSelectLocation={(location) => {
              updateDraft({ location });
              confirmChoice(`${location} ${en ? "selected" : "seleccionada"}`);
            }}
            onDateChange={(date) => updateDraft({ date })}
            onContinue={() => navigate("review")}
          />
        )}
        {screen === "review" && (
          <ClassifyReview
            language={language}
            draft={draft}
            onDateChange={(date) => updateDraft({ date })}
            onEditMaterial={openWeight}
            onRemoveMaterial={removeMaterial}
            onHearSummary={speakSummary}
            onAddBag={() => navigate("classify-categories")}
            onSend={submitClassification}
          />
        )}
        {screen === "classify-categories" && (
          <ClassifyCategories
            language={language}
            draft={draft}
            onOpenCategory={openCategory}
            onHelp={(category) => setHelp({ category })}
            onSummary={() => navigate("review")}
          />
        )}
        {screen === "material" && (
          <ClassifyMaterial
            key={activeCategory}
            language={language}
            category={activeCategory}
            weights={draft.weights}
            onPickMaterial={openWeight}
            onHelp={(material) => setHelp({ category: activeCategory, material })}
            onDone={() => navigate("classify-categories")}
          />
        )}
        {screen === "history" && (
          <HistoryScreen
            language={language}
            entries={history}
            onUpdateEntry={(id, edit) => {
              setHistory((prev) => prev.map((e) => (e.id === id ? { ...e, ...edit } : e)));
              confirmChoice(en ? "Entry updated" : "Registro actualizado");
            }}
            onHearSummary={speak}
          />
        )}
        {screen === "settings" && (
          <SettingsScreen
            language={language}
            settings={settings}
            onChange={updateSettings}
            onLanguageChange={setLanguage}
          />
        )}
        {screen === "evidence-setup" && (
          <EvidenceSetup
            language={language}
            draft={evidence}
            onSelectOrganization={(id, name) => {
              updateEvidence({ organization: id, location: "" });
              confirmChoice(`${name} ${en ? "selected" : "seleccionado"}`);
            }}
            onSelectLocation={(location) => {
              updateEvidence({ location });
              confirmChoice(`${location} ${en ? "selected" : "seleccionada"}`);
            }}
            onContinue={() => navigate("evidence-entry")}
          />
        )}
        {screen === "evidence-entry" && (
          <EvidenceEntry
            language={language}
            draft={evidence}
            onDateChange={(date) => updateEvidence({ date })}
            onAddImages={addEvidenceImages}
            onRemoveImage={removeEvidenceImage}
            onNotesChange={(notes) => updateEvidence({ notes })}
            onHearSummary={speakEvidenceSummary}
            onSend={sendEvidence}
          />
        )}


        {weightMaterial && (
          <WeightSheet
            key={weightMaterial}
            language={language}
            material={weightMaterial}
            initialWeight={draft.weights[weightMaterial] ?? 1}
            onCancel={() => setWeightMaterial("")}
            onSave={saveWeight}
          />
        )}
        {help && (
          <HelpSheet
            language={language}
            category={help.category}
            material={help.material}
            onClose={() => setHelp(null)}
          />
        )}

        <div className={`notice ${notice ? "is-visible" : ""}`} role="status">
          <span aria-hidden="true">✓</span>
          {notice}
        </div>
      </section>

      <a
        className="photo-credit"
        href="https://unsplash.com/@haiiku"
        target="_blank"
        rel="noreferrer"
      >
        Photo by Sebastián Velásquez
      </a>
    </main>
  );
}
