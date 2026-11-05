import { copy, type Language, type User } from "../data";
import { OptionIcon } from "../icons";
import { formatDateTime } from "../time";

type Props = {
  language: Language;
  user: User;
  /** Set after a classification is sent; shows the "Edit last classification" shortcut. */
  lastClassificationDate?: string;
  onEditLastClassification: () => void;
  onOption: (option: string, index: number) => void;
};

export default function Dashboard({
  language,
  user,
  lastClassificationDate,
  onEditLastClassification,
  onOption,
}: Props) {
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

      {lastClassificationDate && (
        <button
          type="button"
          className="recent-edit-button recent-classification-button"
          onClick={onEditLastClassification}
        >
          <span aria-hidden="true">↶</span>
          <span>
            <strong>
              {language === "EN" ? "Edit last classification" : "Editar última clasificación"}
            </strong>
            <small>{formatDateTime(lastClassificationDate, language)}</small>
          </span>
        </button>
      )}
    </div>
  );
}
