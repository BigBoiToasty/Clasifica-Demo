import {
  categories,
  categoryDescriptions,
  materialDescriptions,
  type CategoryId,
  type Language,
} from "../data";
import { CategoryIcon } from "../icons";

type Props = {
  language: Language;
  category: CategoryId;
  material?: string;
  onClose: () => void;
};

export default function HelpSheet({ language, category, material, onClose }: Props) {
  const en = language === "EN";
  const cat = categories.find((c) => c.id === category)!;

  return (
    <div className="help-overlay" role="dialog" aria-modal="true" aria-label="Sorting help">
      <div className="help-sheet">
        {material ? (
          <div className="example-visual" aria-hidden="true">
            <span>
              <CategoryIcon category={category} />
            </span>
            <i />
            <i />
            <i />
          </div>
        ) : (
          <span className="help-art">
            <CategoryIcon category={category} />
          </span>
        )}
        <h3>{material ?? (en ? cat.en : cat.es)}</h3>
        <p>{material ? materialDescriptions[material] : categoryDescriptions[category]}</p>
        <div className="help-tip">
          <strong>{en ? "Before sorting" : "Antes de clasificar"}</strong>
          <span>
            {en
              ? "Empty it, remove liquids, and keep it clean and dry."
              : "Vacía el objeto, retira líquidos y mantenlo limpio y seco."}
          </span>
        </div>
        <button type="button" className="primary-button" onClick={onClose}>
          {en ? "Got it" : "Entendido"}
        </button>
      </div>
    </div>
  );
}
