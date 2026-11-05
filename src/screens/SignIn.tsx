import logo from "../assets/obra-padre-cacho-logo.png";
import { copy, type Language } from "../data";
import { SettingsIcon } from "../icons";

type Props = {
  language: Language;
  onToggleLanguage: () => void;
  onSignIn: () => void;
};

export default function SignIn({ language, onToggleLanguage, onSignIn }: Props) {
  return (
    <div className="screen sign-in-screen">
      <div className="sign-in-actions">
        {/* ponytail: not wired up yet; gets an onClick when the Settings screen is ported */}
        <button type="button" className="settings-button" aria-label="Open settings">
          <SettingsIcon />
        </button>
        <button
          type="button"
          className="language-button"
          onClick={onToggleLanguage}
          aria-label="Change language"
        >
          {language}
        </button>
      </div>

      <div className="brand-card">
        <img
          className="brand-logo-image"
          src={logo}
          alt="Obra Padre Cacho, Organización San Vicente"
        />
      </div>

      <div className="sign-in-copy">
        <span className="eyebrow">Montevideo · Uruguay</span>
        <h2>
          Small actions,
          <br />
          lasting change.
        </h2>
      </div>

      <button type="button" className="primary-button" onClick={onSignIn}>
        {copy[language].signIn}
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
