import { useState } from "react";
import { categories, organizations, type Language } from "../data";
import { categoryLabel, totalWeight, type Collection } from "../collect";
import { formatDateTime } from "../time";
import { CategoryIcon, OptionIcon, SpeakerIcon, TrashIcon } from "../icons";
import DateTimeEditor from "../components/DateTimeEditor";

type Props = {
  language: Language;
  draft: Collection;
  onDateChange: (date: string) => void;
  onEditBag: (bagId: string) => void;
  onRemoveBag: (bagId: string) => void;
  /** Read collectionSummaryText(draft, language) aloud. */
  onHearSummary: () => void;
  onAddBag: () => void;
  onSend: () => void;
};

export default function CollectReview({
  language,
  draft,
  onDateChange,
  onEditBag,
  onRemoveBag,
  onHearSummary,
  onAddBag,
  onSend,
}: Props) {
  const en = language === "EN";
  const [editingDate, setEditingDate] = useState(false);
  const total = totalWeight(draft.bags);
  const orgName = organizations.find((o) => o.id === draft.organization)?.name;

  return (
    <div className="screen flow-screen collect-summary-screen">
      <div className="collect-summary-heading">
        <span className="eyebrow">{en ? "Collection in progress" : "Recolección en curso"}</span>
        <h2>{en ? "Collect" : "Recolectar"}</h2>
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
            <strong>{draft.bags.length}</strong> {en ? "bags" : "bolsas"}
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
        {draft.bags.map((bag, index) => {
          const category = categories.find((c) => c.id === bag.category)!;
          return (
            <article
              className="collection-entry-card"
              key={bag.id}
              style={{ "--collect-color": category.color } as React.CSSProperties}
            >
              <span className="collection-entry-icon">
                <CategoryIcon category={category.id} />
              </span>
              <span>
                <strong>
                  {en ? "Bag" : "Bolsa"} {index + 1} · {categoryLabel(bag.category, language)}
                </strong>
                <small>{bag.weightKg} kg</small>
              </span>
              <button type="button" onClick={() => onEditBag(bag.id)}>
                {en ? "Edit" : "Editar"}
              </button>
              <button
                type="button"
                className="collection-delete"
                onClick={() => onRemoveBag(bag.id)}
                aria-label={en ? "Delete bag" : "Eliminar bolsa"}
              >
                <TrashIcon />
              </button>
            </article>
          );
        })}
        {draft.bags.length === 0 && (
          <div className="collect-empty-state">
            <span className="collect-empty-art">
              <OptionIcon index={0} />
            </span>
            <strong>{en ? "No bags added yet" : "Aún no hay bolsas"}</strong>
            <p>
              {en
                ? "Review this empty collection, then add the first bag."
                : "Revisa esta recolección vacía y luego agrega la primera bolsa."}
            </p>
          </div>
        )}
      </div>

      <footer className="collect-action-bar">
        <button type="button" onClick={onAddBag}>
          <span aria-hidden="true">+</span>
          {en ? "Add bag" : "Agregar bolsa"}
        </button>
        <button type="button" disabled={draft.bags.length === 0} onClick={onSend}>
          {en ? "Send" : "Enviar"}
          <span aria-hidden="true">→</span>
        </button>
      </footer>
    </div>
  );
}
