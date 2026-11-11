import { useState } from "react";
import { MAX_EVIDENCE_IMAGES, organizations, type Evidence, type Language } from "../data";
import { formatDateTime } from "../time";
import { OptionIcon, SpeakerIcon } from "../icons";
import DateTimeEditor from "../components/DateTimeEditor";

type Props = {
  language: Language;
  draft: Evidence;
  onDateChange: (date: string) => void;
  onAddImages: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  onNotesChange: (notes: string) => void;
  onHearSummary: () => void;
  onSend: () => void;
};

export default function EvidenceEntry({
  language,
  draft,
  onDateChange,
  onAddImages,
  onRemoveImage,
  onNotesChange,
  onHearSummary,
  onSend,
}: Props) {
  const en = language === "EN";
  const [editingDate, setEditingDate] = useState(false);
  const canAddMore = draft.images.length < MAX_EVIDENCE_IMAGES;

  return (
    <div className="screen flow-screen evidence-entry-screen">
      <div className="flow-heading">
        <span className="eyebrow">
          {organizations.find((o) => o.id === draft.organization)?.name} · {draft.location}
        </span>
        <h2>{en ? "Add evidence" : "Agregar evidencia"}</h2>
        <p>{en ? "Take up to four clear photos" : "Toma hasta cuatro fotos claras"}</p>
      </div>

      <div className="evidence-date-row">
        <span>
          <small>{en ? "Date & time" : "Fecha y hora"}</small>
          <strong>{formatDateTime(draft.date, language)}</strong>
        </span>
        <button type="button" onClick={() => setEditingDate(true)}>
          {en ? "Edit" : "Editar"}
        </button>
      </div>
      {editingDate && (
        <DateTimeEditor
          value={draft.date}
          language={language}
          onChange={onDateChange}
          onDone={() => setEditingDate(false)}
        />
      )}

      <button type="button" className="collect-voice-guide evidence-hear-button" onClick={onHearSummary}>
        <SpeakerIcon />
        {en ? "Hear summary" : "Escuchar resumen"}
      </button>

      <section className="evidence-image-section">
        <h3>{en ? "Images" : "Imágenes"}</h3>
        <div className="evidence-image-grid">
          {draft.images.map((image, index) => (
            <figure className="evidence-thumbnail" key={image.url} style={{ margin: 0 }}>
              <img src={image.url} alt={en ? `Evidence photo ${index + 1}` : `Foto de evidencia ${index + 1}`} />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                aria-label={en ? `Remove photo ${index + 1}` : `Quitar foto ${index + 1}`}
              >
                ×
              </button>
            </figure>
          ))}
          {canAddMore && (
            // No `capture` attribute: on phones this offers both the camera and the photo library.
            <label className="evidence-add-image">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  onAddImages(Array.from(e.target.files ?? []));
                  e.target.value = ""; // allow picking the same file again after removing it
                }}
              />
              <span className="evidence-add-icon">
                <OptionIcon index={3} />
              </span>
              <strong>{en ? "Take photo" : "Tomar foto"}</strong>
              <small>{en ? "or choose an image" : "o elige una imagen"}</small>
            </label>
          )}
        </div>
      </section>

      <section className="evidence-notes-section">
        <label htmlFor="evidence-notes">{en ? "Notes (optional)" : "Notas (opcional)"}</label>
        <textarea
          id="evidence-notes"
          value={draft.notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={en ? "Describe what the photos show..." : "Describe lo que muestran las fotos..."}
        />
      </section>

      <button
        type="button"
        className="primary-button evidence-send-button"
        disabled={draft.images.length === 0}
        onClick={onSend}
      >
        {en ? "Review and send" : "Revisar y enviar"}
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
