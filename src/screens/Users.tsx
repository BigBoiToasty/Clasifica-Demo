import { copy, users, type Language, type User } from "../data";

type Props = {
  language: Language;
  onSelect: (user: User) => void;
};

export default function Users({ language, onSelect }: Props) {
  const text = copy[language];
  return (
    <div className="screen users-screen">
      <div className="section-heading">
        <span className="eyebrow">Obra Padre Cacho</span>
        <h2>{text.select}</h2>
        <p>{text.tapProfile}</p>
      </div>

      <div className="user-list" aria-label={text.select}>
        {users.map((user, index) => (
          <button
            type="button"
            key={user.name}
            className="user-card"
            style={{ "--delay": `${index * 45}ms` } as React.CSSProperties}
            onClick={() => onSelect(user)}
          >
            <span className="user-avatar">{user.initials}</span>
            <span className="user-name">{user.name}</span>
            <span className="card-arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
