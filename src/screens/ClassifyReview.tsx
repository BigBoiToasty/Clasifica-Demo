import { useState } from "react";
import {
  categories,
  categoryOf,
  organizations,
  type Classification,
  type Language,
} from "../data";
import { formatDateTime } from "../time";
import { CategoryIcon, OptionIcon, SpeakerIcon, TrashIcon } from "../icons";
import DateTimeEditor from "../components/DateTimeEditor";

type Props = {
  language: Language;
  draft: Classification;
  onDateChange: (date: string) => void;
  onEditMaterial: (material: string) => void;
  onRemoveMaterial: (material: string) => void;
  onHearSummary: () => void;
  onAddBag: () => void;
  onSend: () => void;
};

export default function ClassifyReview({
  language,
  draft,
  onDateChange,
  onEditMaterial,
  onRemoveMaterial,
  onHearSummary,
  onAddBag,
  onSend,
}: Props) {
  const en = language === "EN";
  const [editingDate, setEditingDate] = useState(false);
  const materials = Object.keys(draft.weights);
  const total = Object.values(draft.weights).reduce((sum, w) => sum + w, 0);
  const orgName = organizations.find((o) => o.id === draft.organization)?.name;

  return (
    <div className="screen flow-screen collect-summary-screen classification-summary-screen">
      <div className="collect-summary-heading">
        <span className="eyebrow">{en ? "Classification in progress" : "Clasificación en curso"}</span>
        <h2>{en ? "Classify" : "Clasificar"}</h2>
        <div className="collect-summary-date">
          <strong>{formatDateTime(draft.date, language)}</strong>
          <button type="button" onClick={() => setEditingDate(true)}>
            {en ? "Edit" : "Editar"}
          </button>
        </div>
        <p>
          {orgName} · {draft.location}
        </p>
        <div className="collect-totals">
          <span>
            <strong>{materials.length}</strong> {en ? "materials" : "materiales"}
          </span>
          <span>
            <strong>{total.toFixed(1)}</strong> kg
          </span>
        </div>
      </div>

      {editingDate && (
        <DateTimeEditor
          value={draft.date}
          language={language}
          onChange={onDateChange}
          onDone={() => setEditingDate(false)}
        />
      )}

      <button type="button" className="collect-voice-guide summary-guide" onClick={onHearSummary}>
        <SpeakerIcon />
        {en ? "Hear summary" : "Escuchar resumen"}
      </button>

      <div className="collection-entry-list">
        {materials.map((material) => {
          const category = categories.find((c) => c.id === categoryOf(material))!;
          return (
            <article
              className="collection-entry-card classification-entry-card"
              key={material}
              style={{ "--collect-color": category.color } as React.CSSProperties}
            >
              <span className="collection-entry-icon">
                <CategoryIcon category={category.id} />
              </span>
              <span>
                <strong>{material}</strong>
                <small>{draft.weights[material]} kg</small>
              </span>
              <button type="button" onClick={() => onEditMaterial(material)}>
                {en ? "Edit" : "Editar"}
              </button>
              <button
                type="button"
                className="collection-delete"
                onClick={() => onRemoveMaterial(material)}
                aria-label={en ? "Delete material" : "Eliminar material"}
              >
                <TrashIcon />
              </button>
            </article>
          );
        })}
        {materials.length === 0 && (
          <div className="collect-empty-state">
            <span className="collect-empty-art">
              <OptionIcon index={1} />
            </span>
            <strong>{en ? "No materials added yet" : "Aún no hay materiales"}</strong>
            <p>
              {en
                ? "Review this empty classification, then add the first material."
                : "Revisa esta clasificación vacía y luego agrega el primer material."}
            </p>
          </div>
        )}
      </div>

      <footer className="collect-action-bar">
        <button type="button" onClick={onAddBag}>
          <span aria-hidden="true">+</span>
          {en ? "Add bag" : "Agregar bolsa"}
        </button>
        <button type="button" disabled={materials.length === 0} onClick={onSend}>
          {en ? "Send" : "Enviar"}
          <span aria-hidden="true">→</span>
        </button>
      </footer>
    </div>
  );
}
