import { copy, type Language, type User } from "../data";
import { OptionIcon } from "../icons";
import { formatDateTime } from "../time";

/** The entry most recently sent from this dashboard, shown as an "Edit last …" shortcut. */
export type LastEntry = {
  kind: "classification" | "evidence";
  client: string;
  location: string;
  date: string;
};

type Props = {
  language: Language;
  user: User;
  lastEntry?: LastEntry | null;
  onEditLastEntry: () => void;
  onOption: (option: string, index: number) => void;
};

const editLabel = {
  classification: { EN: "Edit last classification", ES: "Editar última clasificación" },
  evidence: { EN: "Edit last evidence", ES: "Editar última evidencia" },
};

export default function Dashboard({ language, user, lastEntry, onEditLastEntry, onOption }: Props) {
  const text = copy[language];
  return (
    <div className="screen dashboard-screen">
      <div className="welcome-card">
        <span className="welcome-avatar">{user.initials}</span>
        <span>
          <small>{text.welcome}</small>
          <strong>{user.name.split(" ")[0]}</strong>
          <p>{text.choose}</p>
        </span>
      </div>

      <div className="option-grid">
        {text.options.map((option, index) => (
          <button
            type="button"
            className={`option-card option-${index + 1}`}
            key={option}
            style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}
            onClick={() => onOption(option, index)}
          >
            <span className="option-number">0{index + 1}</span>
            <strong>{option}</strong>
            <span className="option-art">
              <OptionIcon index={index} />
            </span>
            <span className="option-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>

      {lastEntry && (
        <button
          type="button"
          className={`recent-edit-button recent-${lastEntry.kind}-button`}
          onClick={onEditLastEntry}
        >
          <span aria-hidden="true">↶</span>
          <span>
            <strong>{editLabel[lastEntry.kind][language]}</strong>
            <small>
              {lastEntry.client} · {lastEntry.location} · {formatDateTime(lastEntry.date, language)}
            </small>
          </span>
        </button>
      )}
    </div>
  );
}
