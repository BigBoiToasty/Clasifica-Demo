import { categories, type CategoryId, type Classification, type Language } from "../data";
import { CategoryIcon, InfoIcon, SpeakerIcon } from "../icons";

type Props = {
  language: Language;
  draft: Classification;
  onOpenCategory: (category: CategoryId) => void;
  onHelp: (category: CategoryId) => void;
  onSummary: () => void;
  onHearSummary: () => void;
};

export default function ClassifyCategories({
  language,
  draft,
  onOpenCategory,
  onHelp,
  onSummary,
  onHearSummary,
}: Props) {
  const en = language === "EN";
  const count = Object.keys(draft.weights).length;
  const total = Object.values(draft.weights).reduce((sum, w) => sum + w, 0);

  return (
    <div className="screen flow-screen category-screen">
      <div className="flow-heading compact-heading">
        <span className="eyebrow">
          {draft.organization.toUpperCase()} · {draft.location}
        </span>
        <h2>{en ? "What material?" : "¿Qué material?"}</h2>
      </div>

      <button type="button" className="collect-voice-guide" onClick={onHearSummary}>
        <SpeakerIcon />
        {en ? "Hear summary" : "Escuchar resumen"}
      </button>

      <div className="category-list">
        {categories.map((category, index) => (
          <div className="category-row" key={category.id}>
            <button
              type="button"
              className="category-card"
              style={{ "--category-color": category.color } as React.CSSProperties}
              onClick={() => onOpenCategory(category.id)}
            >
              <span className="category-art">
                <CategoryIcon category={category.id} />
              </span>
              <span className="numbered-label">
                <small>{index + 1}</small>
                <strong>{en ? category.en : category.es}</strong>
              </span>
              <span className="card-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <button
              type="button"
              className="info-button"
              onClick={() => onHelp(category.id)}
              aria-label={`About ${category.en}`}
            >
              <InfoIcon />
            </button>
          </div>
        ))}
      </div>

      <div className="classification-footer">
        <span>
          <strong>{count}</strong>
          {en ? " items" : " elementos"} · {total.toFixed(1)} kg
        </span>
        <button type="button" onClick={onSummary}>
          {en ? "Summary" : "Resumen"}
        </button>
      </div>
    </div>
  );
}
