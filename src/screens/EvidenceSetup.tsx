import { clientPlaces, organizations, type Evidence, type Language } from "../data";
import { OptionIcon } from "../icons";

type Props = {
  language: Language;
  draft: Evidence;
  onSelectOrganization: (id: string, name: string) => void;
  onSelectLocation: (location: string) => void;
  onContinue: () => void;
};

export default function EvidenceSetup({
  language,
  draft,
  onSelectOrganization,
  onSelectLocation,
  onContinue,
}: Props) {
  const en = language === "EN";
  const locations = clientPlaces[draft.organization] ?? [];

  return (
    <div className="screen flow-screen evidence-setup-screen">
      <div className="flow-heading">
        <span className="eyebrow">{en ? "New evidence" : "Nueva evidencia"}</span>
        <h2>{en ? "Evidences" : "Evidencias"}</h2>
        <p>{en ? "Choose where the evidence was taken" : "Elige dónde se tomó la evidencia"}</p>
      </div>

      <span className="evidence-camera-art">
        <OptionIcon index={3} />
      </span>

      <div className="flow-heading inline-flow-heading">
        <strong>{en ? "Client" : "Cliente"}</strong>
      </div>
      <section className="choice-section">
        <div className="organization-grid">
          {organizations.map((item, index) => {
            const selected = draft.organization === item.id;
            return (
              <button
                type="button"
                key={item.id}
                className={`visual-choice ${selected ? "is-selected" : ""}`}
                onClick={() => onSelectOrganization(item.id, item.name)}
                aria-pressed={selected}
              >
                <span className="organization-logo">{item.name.slice(0, 3)}</span>
                <span>
                  <small>{index + 1}</small>
                  <strong>{item.name}</strong>
                </span>
                <span className="selection-check" aria-hidden="true">
                  ✓
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flow-heading inline-flow-heading">
        <strong>{en ? "Location" : "Ubicación"}</strong>
      </div>
      <section className="choice-section">
        {locations.length === 0 ? (
          <p className="collect-choice-hint">
            {en ? "Choose a client first." : "Elige un cliente primero."}
          </p>
        ) : (
          <div className="location-grid">
            {locations.map((item, index) => {
              const selected = draft.location === item;
              return (
                <button
                  type="button"
                  key={item}
                  className={`location-choice ${selected ? "is-selected" : ""}`}
                  onClick={() => onSelectLocation(item)}
                  aria-pressed={selected}
                >
                  <span className="choice-number">{index + 1}</span>
                  <strong>{item}</strong>
                  <span className="selection-check" aria-hidden="true">
                    ✓
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <button
        type="button"
        className="primary-button flow-continue"
        disabled={!draft.organization || !draft.location}
        onClick={onContinue}
      >
        {en ? "Continue" : "Continuar"}
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
