import { useMemo, useState } from "react";
import type { Language } from "../data";
import { SpeakerIcon, TrashIcon } from "../icons";

export type EntryStatus = "collected" | "classified";

export interface HistoryEntry {
  id: string;
  status: EntryStatus;
  /** Date the entry was made, as "YYYY-MM-DD". */
  dateEntered: string;
  client: string;
  location: string;
  weightKg: number;
  bags: number;
}

/** The only fields a user is allowed to edit. */
export type EntryEdit = Pick<HistoryEntry, "weightKg" | "bags">;

export const SAMPLE_ENTRIES: HistoryEntry[] = [
  { id: "1", status: "collected", dateEntered: "2026-10-29", client: "WTC", location: "Torres 1 2 3", weightKg: 0, bags: 0 },
  { id: "2", status: "collected", dateEntered: "2026-08-30", client: "Banco Itau", location: "WTC 4", weightKg: 0, bags: 0 },
  { id: "3", status: "classified", dateEntered: "2026-07-12", client: "WTC", location: "Torre 2", weightKg: 12.5, bags: 3 },
  { id: "4", status: "classified", dateEntered: "2026-06-03", client: "Banco Itau", location: "WTC 4", weightKg: 8, bags: 2 },
];

/** "2026-10-29" -> "October 29, 2026" (parsed as a local date, so it never shifts a day). */
export function formatDate(isoDate: string, language: Language = "EN"): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(language === "EN" ? "en-US" : "es-UY", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Entries of one status that match the search text, newest first. */
export function filterEntries(
  entries: HistoryEntry[],
  status: EntryStatus,
  query: string,
  language: Language = "EN",
): HistoryEntry[] {
  const q = query.trim().toLowerCase();
  return entries
    .filter((e) => e.status === status)
    .filter(
      (e) =>
        q === "" ||
        e.client.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.dateEntered.includes(q) ||
        formatDate(e.dateEntered, language).toLowerCase().includes(q),
    )
    .sort((a, b) => b.dateEntered.localeCompare(a.dateEntered));
}

/** Validates the edit form. Returns either the parsed values or an error message. */
export function parseEdit(weightText: string, bagsText: string, en = true): { value?: EntryEdit; error?: string } {
  const weightKg = Number(weightText.replace(",", ".").trim());
  if (weightText.trim() === "" || !Number.isFinite(weightKg) || weightKg < 0) {
    return { error: en ? "Weight must be a number of 0 or more." : "El peso debe ser un número mayor o igual a 0." };
  }
  if (!/^\d+$/.test(bagsText.trim())) {
    return { error: en ? "Number of bags must be a whole number of 0 or more." : "La cantidad de bolsas debe ser un número entero." };
  }
  return { value: { weightKg, bags: parseInt(bagsText.trim(), 10) } };
}

type Props = {
  language: Language;
  entries: HistoryEntry[];
  onUpdateEntry: (id: string, edit: EntryEdit) => void;
  onDeleteEntry: (id: string) => void;
  onRestoreEntry: (entry: HistoryEntry) => void;
  onHearSummary: (summary: string) => void;
};

export default function HistoryScreen({
  language,
  entries,
  onUpdateEntry,
  onDeleteEntry,
  onRestoreEntry,
  onHearSummary,
}: Props) {
  const en = language === "EN";
  const [status, setStatus] = useState<EntryStatus>("collected");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<HistoryEntry | null>(null);
  const [deleting, setDeleting] = useState<HistoryEntry | null>(null);
  // The entry just deleted, kept until you leave this page so "Undo" can bring it back.
  const [undo, setUndo] = useState<HistoryEntry | null>(null);

  const visible = useMemo(
    () => filterEntries(entries, status, query, language),
    [entries, status, query, language],
  );
  const count = (s: EntryStatus) => entries.filter((e) => e.status === s).length;

  function hearSummary() {
    const list = entries.filter((e) => e.status === status);
    const weight = list.reduce((sum, e) => sum + e.weightKg, 0);
    const bags = list.reduce((sum, e) => sum + e.bags, 0);
    onHearSummary(
      en
        ? `You have ${list.length} ${status} entries, totaling ${weight} kilograms in ${bags} bags.`
        : `Tienes ${list.length} registros ${status === "collected" ? "recolectados" : "clasificados"}, con ${weight} kilos en ${bags} bolsas.`,
    );
  }

  const tabs: { key: EntryStatus; label: string }[] = [
    { key: "collected", label: en ? "Collected" : "Recolectado" },
    { key: "classified", label: en ? "Classified" : "Clasificado" },
  ];

  return (
    <div className="screen flow-screen history-screen">
      <div className="flow-heading">
        <span className="eyebrow">{en ? "Saved activity" : "Actividad guardada"}</span>
        <h2>{en ? "History" : "Historial"}</h2>
        <p>{en ? "Review or edit previous work" : "Revisa o edita trabajos anteriores"}</p>
      </div>

      <div className="history-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            type="button"
            role="tab"
            key={tab.key}
            aria-selected={status === tab.key}
            className={status === tab.key ? "is-active" : ""}
            onClick={() => setStatus(tab.key)}
          >
            {tab.label} ({count(tab.key)})
          </button>
        ))}
      </div>

      <div className="history-search" style={{ gridTemplateColumns: "1fr" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={en ? "Search client, location, or date" : "Buscar cliente, ubicación o fecha"}
        />
      </div>

      <button type="button" className="collect-voice-guide history-hear-button" onClick={hearSummary}>
        <SpeakerIcon />
        {en ? "Hear summary" : "Escuchar resumen"}
      </button>

      <div className="history-list">
        {visible.map((entry) => (
          <article
            key={entry.id}
            className={`history-card ${entry.status === "classified" ? "history-classification-card" : ""}`}
          >
            <span className="history-color-mark" />
            <div>
              <strong>{formatDate(entry.dateEntered, language)}</strong>
              <small>{en ? "Client" : "Cliente"}: {entry.client}</small>
              <small>{en ? "Location" : "Ubicación"}: {entry.location}</small>
              <small>{en ? "Weight" : "Peso"}: {entry.weightKg} kg</small>
              <small>{en ? "Number of bags" : "Cantidad de bolsas"}: {entry.bags}</small>
            </div>
            <button
              type="button"
              className="history-delete"
              onClick={() => setDeleting(entry)}
              aria-label={en ? "Delete entry" : "Eliminar registro"}
            >
              <TrashIcon />
            </button>
            <button type="button" onClick={() => setEditing(entry)}>
              {en ? "Edit" : "Editar"}
            </button>
          </article>
        ))}
        {visible.length === 0 && (
          <div className="history-empty">
            <strong>{en ? "No entries found" : "No se encontraron registros"}</strong>
            <small>{en ? "Try another search" : "Prueba otra búsqueda"}</small>
          </div>
        )}
      </div>

      {undo && (
        <div
          role="status"
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 12,
            padding: "8px 8px 8px 16px",
            borderRadius: 16,
            color: "#fff",
            background: "#102f2a",
            boxShadow: "0 10px 30px rgb(0 0 0 / 25%)",
            fontWeight: 700,
          }}
        >
          <span>{en ? "Entry deleted" : "Registro eliminado"}</span>
          <button
            type="button"
            onClick={() => {
              onRestoreEntry(undo);
              setUndo(null);
            }}
            style={{
              minHeight: 48,
              padding: "0 18px",
              border: 0,
              borderRadius: 12,
              color: "#053d2e",
              background: "#65e6bd",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {en ? "Undo" : "Deshacer"}
          </button>
        </div>
      )}

      {editing && (
        <EditEntrySheet
          key={editing.id}
          language={language}
          entry={editing}
          onCancel={() => setEditing(null)}
          onSave={(edit) => {
            onUpdateEntry(editing.id, edit);
            setEditing(null);
          }}
        />
      )}

      {deleting && (
        <DeleteEntrySheet
          language={language}
          entry={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            onDeleteEntry(deleting.id);
            setUndo(deleting);
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}

function EditEntrySheet({
  language,
  entry,
  onCancel,
  onSave,
}: {
  language: Language;
  entry: HistoryEntry;
  onCancel: () => void;
  onSave: (edit: EntryEdit) => void;
}) {
  const en = language === "EN";
  const [weightText, setWeightText] = useState(String(entry.weightKg));
  const [bagsText, setBagsText] = useState(String(entry.bags));
  const [error, setError] = useState("");

  function save() {
    const result = parseEdit(weightText, bagsText, en);
    if (!result.value) return setError(result.error ?? "");
    onSave(result.value);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 48,
    padding: "0 14px",
    marginBottom: 12,
    border: "1px solid #d1d5db",
    borderRadius: 12,
    font: "inherit",
  };

  return (
    <div className="help-overlay" role="dialog" aria-modal="true" aria-label={en ? "Edit entry" : "Editar registro"}>
      <div className="help-sheet">
        <span className="eyebrow">{en ? "Edit entry" : "Editar registro"}</span>
        <h3>
          {entry.client} · {entry.location}
        </h3>
        <p>{formatDate(entry.dateEntered, language)}</p>

        <label>
          <small>{en ? "Weight (kg)" : "Peso (kg)"}</small>
          <input style={inputStyle} inputMode="decimal" value={weightText} onChange={(e) => setWeightText(e.target.value)} />
        </label>
        <label>
          <small>{en ? "Number of bags" : "Cantidad de bolsas"}</small>
          <input style={inputStyle} inputMode="numeric" value={bagsText} onChange={(e) => setBagsText(e.target.value)} />
        </label>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button type="button" className="primary-button" style={{ background: "#e5e7eb", color: "#123d34" }} onClick={onCancel}>
            {en ? "Cancel" : "Cancelar"}
          </button>
          <button type="button" className="primary-button" onClick={save}>
            {en ? "Save" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteEntrySheet({
  language,
  entry,
  onCancel,
  onConfirm,
}: {
  language: Language;
  entry: HistoryEntry;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const en = language === "EN";
  return (
    <div className="help-overlay" role="alertdialog" aria-modal="true" aria-label={en ? "Delete entry" : "Eliminar registro"}>
      <div className="help-sheet">
        <span className="eyebrow">{en ? "Delete entry" : "Eliminar registro"}</span>
        <h3>{en ? "Delete this entry?" : "¿Eliminar este registro?"}</h3>
        <p>
          {entry.client} · {entry.location} · {formatDate(entry.dateEntered, language)}
        </p>
        <p>{en ? "This cannot be undone." : "Esto no se puede deshacer."}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button type="button" className="primary-button" style={{ background: "#e5e7eb", color: "#123d34" }} onClick={onCancel}>
            {en ? "Cancel" : "Cancelar"}
          </button>
          <button type="button" className="primary-button" style={{ background: "#dc2626", color: "#fff" }} onClick={onConfirm}>
            {en ? "Delete" : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
