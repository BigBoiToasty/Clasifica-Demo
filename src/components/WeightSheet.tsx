import { useState } from "react";
import { categoryOf, type Language } from "../data";
import { CategoryIcon } from "../icons";

type Props = {
  language: Language;
  material: string;
  initialWeight: number;
  onCancel: () => void;
  onSave: (weight: number) => void;
};

export default function WeightSheet({ language, material, initialWeight, onCancel, onSave }: Props) {
  const en = language === "EN";
  const [weight, setWeight] = useState(initialWeight);

  return (
    <div className="help-overlay" role="dialog" aria-modal="true" aria-label="Enter weight">
      <div className="help-sheet weight-sheet">
        <span className="weight-illustration">
          <CategoryIcon category={categoryOf(material)} />
        </span>
        <span className="eyebrow">{en ? "Material weight" : "Peso del material"}</span>
        <h3>{material}</h3>
        <div className="weight-control">
          <button
            type="button"
            onClick={() => setWeight(Math.max(0.1, weight - 0.5))}
            aria-label="Decrease weight"
          >
            −
          </button>
          <label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
            <span>kg</span>
          </label>
          <button
            type="button"
            className="weight-increase"
            onClick={() => setWeight(weight + 0.5)}
            aria-label={en ? "Increase weight" : "Aumentar peso"}
          >
            +
          </button>
        </div>
        <div className="weight-increments">
          {[0.5, 1, 2, 5].map((amount) => (
            <button type="button" key={amount} onClick={() => setWeight(weight + amount)}>
              +{amount.toFixed(1)}
            </button>
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {en ? "Cancel" : "Cancelar"}
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => onSave(Math.max(0.1, Math.round(weight * 10) / 10))}
          >
            {en ? "Add weight" : "Agregar peso"}
          </button>
        </div>
      </div>
    </div>
  );
}
