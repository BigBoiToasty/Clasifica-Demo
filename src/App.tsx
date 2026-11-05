import { useState } from "react";
import {
  categories,
  copy,
  organizations,
  users,
  type CategoryId,
  type Classification,
  type Language,
  type Screen,
  type User,
} from "./data";
import { formatDateTime, uruguayNow } from "./time";
import { BackIcon, HomeIcon, SettingsIcon } from "./icons";
import SignIn from "./screens/SignIn";
import Users from "./screens/Users";
import Dashboard from "./screens/Dashboard";
import ClassifySetup from "./screens/ClassifySetup";
import ClassifyReview from "./screens/ClassifyReview";
import ClassifyCategories from "./screens/ClassifyCategories";
import ClassifyMaterial from "./screens/ClassifyMaterial";
import WeightSheet from "./components/WeightSheet";
import HelpSheet from "./components/HelpSheet";

const newClassification = (): Classification => ({
  organization: "",
  location: "",
  date: uruguayNow(),
  weights: {},
});

// Where the top-left "Go back" button leads from each screen.
const backTo: Partial<Record<Screen, Screen>> = {
  users: "sign-in",
  dashboard: "users",
  "classify-setup": "dashboard",
  review: "classify-setup",
  "classify-categories": "review",
  material: "classify-categories",
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
  const [savedClassification, setSavedClassification] = useState(false);

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

  // Spoken feedback (on by default in the original; the toggle lives in Settings).
  function speak(message: string) {
    if (!("speechSynthesis" in window)) return;
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
    setSavedClassification(false);
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
    setSavedClassification(true);
    navigate("dashboard");
    flash(en ? "Classification saved" : "Clasificación guardada");
  }

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

      <section className="app-frame" aria-label="Obra Padre Cacho app">
        {screen !== "sign-in" && (
          <header className="topbar">
            <div className="topbar-actions">
              <button
                type="button"
                className="back-button"
                onClick={() => navigate(backTo[screen] ?? "sign-in")}
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
              {/* ponytail: not wired up yet; gets an onClick when the Settings screen is ported */}
              <button type="button" className="settings-button" aria-label="Open settings">
                <SettingsIcon />
              </button>
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
              navigate("dashboard");
            }}
          />
        )}
        {screen === "dashboard" && (
          <Dashboard
            key={user.name}
            language={language}
            user={user}
            lastClassificationDate={savedClassification ? draft.date : undefined}
            onEditLastClassification={() => navigate("review")}
            onOption={(option, index) =>
              index === 1 ? startClassification() : flash(`${option} ${text.comingSoon}`)
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
