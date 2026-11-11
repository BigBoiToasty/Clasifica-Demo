import { DEFAULT_FONT_COLOR, type Language, type Settings } from "../data";

type Props = {
  language: Language;
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onLanguageChange: (language: Language) => void;
};

/** Two- or three-way toggle with the green "active" pill. */
function Switch<T extends string | boolean>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="language-switch" role="radiogroup">
      {options.map((option) => (
        <button
          type="button"
          role="radio"
          key={String(option.value)}
          aria-checked={value === option.value}
          className={value === option.value ? "is-active" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Label({ title, hint, children }: { title: string; hint: string; children?: React.ReactNode }) {
  return (
    <div className="setting-label">
      <span>
        <strong>{title}</strong>
        <small>{hint}</small>
      </span>
      {children}
    </div>
  );
}

export default function SettingsScreen({ language, settings, onChange, onLanguageChange }: Props) {
  const en = language === "EN";
  const sizes = en ? ["Standard", "Large", "Extra"] : ["Estándar", "Grande", "Extra"];

  return (
    <div className="screen settings-screen">
      <div className="flow-heading settings-heading">
        <span className="eyebrow">{en ? "Personalize" : "Personalizar"}</span>
        <h2>{en ? "Settings" : "Ajustes"}</h2>
        <p>{en ? "Adjust the app to suit you" : "Ajusta la aplicación a tu medida"}</p>
      </div>

      <div className="settings-list">
        <section className="setting-card">
          <Label
            title={en ? "Entry mode" : "Modo de ingreso"}
            hint={en ? "Choose buttons or voice throughout the app" : "Elige botones o voz en toda la aplicación"}
          />
          <Switch
            value={settings.entryMode}
            onChange={(entryMode) => onChange({ entryMode })}
            options={[
              { value: "buttons", label: en ? "Buttons" : "Botones" },
              { value: "voice", label: en ? "Voice" : "Voz" },
            ]}
          />
        </section>

        <section className="setting-card">
          <Label
            title={en ? "Question layout" : "Diseño de preguntas"}
            hint={en ? "Manual entry only" : "Solo ingreso manual"}
          />
          <Switch
            value={settings.questionLayout}
            onChange={(questionLayout) => onChange({ questionLayout })}
            options={[
              { value: "one-page", label: en ? "One page" : "Una página" },
              { value: "separate", label: en ? "Separate" : "Separadas" },
            ]}
          />
        </section>

        <section className="setting-card">
          <Label
            title={en ? "Spoken feedback" : "Respuesta hablada"}
            hint={en ? "Reads selected choices aloud" : "Lee en voz alta lo que eliges"}
          />
          <Switch
            value={settings.spokenFeedback}
            onChange={(spokenFeedback) => onChange({ spokenFeedback })}
            options={[
              { value: true, label: en ? "On" : "Sí" },
              { value: false, label: en ? "Off" : "No" },
            ]}
          />
        </section>

        <section className="setting-card">
          <Label
            title={en ? "UI size" : "Tamaño de la interfaz"}
            hint={en ? "Makes every control easier to press" : "Hace que cada control sea más fácil de tocar"}
          />
          <div className="size-switch" role="radiogroup">
            {sizes.map((label, i) => (
              <button
                type="button"
                role="radio"
                key={label}
                aria-checked={settings.uiSize === i}
                className={settings.uiSize === i ? "is-active" : ""}
                onClick={() => onChange({ uiSize: i as Settings["uiSize"] })}
              >
                <span className={`size-sample size-${i}`} />
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="setting-card">
          <Label title={en ? "Font size" : "Tamaño de letra"} hint={en ? "Preview text" : "Texto de ejemplo"}>
            <output>{settings.fontAdjust > 0 ? `+${settings.fontAdjust}` : settings.fontAdjust}</output>
          </Label>
          <input
            type="range"
            min={-3}
            max={6}
            step={1}
            value={settings.fontAdjust}
            aria-label={en ? "Font size" : "Tamaño de letra"}
            onChange={(e) => onChange({ fontAdjust: Number(e.target.value) })}
          />
        </section>

        <section className="setting-card">
          <Label
            title={en ? "Font color" : "Color de letra"}
            hint={settings.fontColor ?? (en ? "App default" : "Predeterminado")}
          >
            <input
              type="color"
              className="color-picker"
              value={settings.fontColor ?? DEFAULT_FONT_COLOR}
              aria-label={en ? "Font color" : "Color de letra"}
              onChange={(e) => onChange({ fontColor: e.target.value })}
            />
          </Label>
          <button type="button" className="reset-color" onClick={() => onChange({ fontColor: null })}>
            {en ? "Use app colors" : "Usar colores de la app"}
          </button>
        </section>

        <section className="setting-card">
          <Label title={en ? "Brightness" : "Brillo"} hint={`${settings.brightness}%`}>
            <span className="sun-icon" aria-hidden="true">☼</span>
          </Label>
          <input
            type="range"
            min={50}
            max={130}
            step={5}
            value={settings.brightness}
            aria-label={en ? "Brightness" : "Brillo"}
            onChange={(e) => onChange({ brightness: Number(e.target.value) })}
          />
        </section>

        <section className="setting-card">
          <Label title={en ? "Language" : "Idioma"} hint={en ? "English" : "Español"} />
          <Switch
            value={language}
            onChange={onLanguageChange}
            options={[
              { value: "EN", label: "English" },
              { value: "ES", label: "Español" },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
