import { categories, materialOptions, type CategoryId, type Language } from "../data";
import { CategoryIcon, InfoIcon } from "../icons";

type Props = {
  language: Language;
  category: CategoryId;
  weights: Record<string, number>;
  onPickMaterial: (material: string) => void;
  onHelp: (material: string) => void;
  onDone: () => void;
};

export default function ClassifyMaterial({
  language,
  category,
  weights,
  onPickMaterial,
  onHelp,
  onDone,
}: Props) {
  const en = language === "EN";
  const cat = categories.find((c) => c.id === category)!;

  return (
    <div className="screen flow-screen material-screen">
      <div className="flow-heading compact-heading">
        <span className="category-title-icon">
          <CategoryIcon category={category} />
        </span>
        <span className="eyebrow material-type-eyebrow">
          {en ? "Type of material" : "Tipo de material"}
        </span>
        <h2>{en ? cat.en : cat.es}</h2>
      </div>

      <div className="material-list">
        {materialOptions[category].map((material, index) => {
          const selected = material in weights;
          return (
            <div className="material-row" key={material}>
              <button
                type="button"
                className={`material-card ${selected ? "is-selected" : ""}`}
                onClick={() => onPickMaterial(material)}
                aria-pressed={selected}
              >
                <span
                  className="material-picture"
                  style={{ "--item-hue": `${(index * 43 + 150) % 360}` } as React.CSSProperties}
                >
                  <CategoryIcon category={category} />
                  <i>{index + 1}</i>
                </span>
                <strong>{material}</strong>
                {selected && <span className="weight-badge">{weights[material]} kg</span>}
              </button>
              <button
                type="button"
                className="info-button"
                onClick={() => onHelp(material)}
                aria-label={`How to sort ${material}`}
              >
                <InfoIcon />
              </button>
            </div>
          );
        })}
      </div>

      <button type="button" className="primary-button done-button" onClick={onDone}>
        {en ? "Done" : "Listo"}
        <span aria-hidden="true">✓</span>
      </button>
    </div>
  );
}
