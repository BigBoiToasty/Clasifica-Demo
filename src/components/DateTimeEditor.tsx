import type { Language } from "../data";

type Props = {
  value: string;
  language: Language;
  onChange: (value: string) => void;
  onDone: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function DateTimeEditor({ value, language, onChange, onDone }: Props) {
  const en = language === "EN";
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const currentYear = Number(
    new Intl.DateTimeFormat("en", { timeZone: "America/Montevideo", year: "numeric" }).format(
      new Date(),
    ),
  );
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 2 + i);
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(en ? "en-US" : "es-UY", { month: "long", timeZone: "UTC" }).format(
      new Date(Date.UTC(2024, i, 1)),
    ),
  );
  const daysInMonth = new Date(year, month, 0).getDate();

  function update(part: "year" | "month" | "day" | "hour" | "minute", next: number) {
    const d = { year, month, day, hour, minute, [part]: next };
    d.day = Math.min(d.day, new Date(d.year, d.month, 0).getDate());
    onChange(`${d.year}-${pad(d.month)}-${pad(d.day)}T${pad(d.hour)}:${pad(d.minute)}`);
  }

  const range = (n: number, start = 0) => Array.from({ length: n }, (_, i) => i + start);

  return (
    <div className="date-wheel-editor" role="group" aria-label="Edit date and time">
      <div className="date-wheel-grid">
        <label>
          <span>{en ? "Month" : "Mes"}</span>
          <select value={month} onChange={(e) => update("month", Number(e.target.value))}>
            {monthNames.map((name, i) => (
              <option value={i + 1} key={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{en ? "Day" : "Día"}</span>
          <select value={day} onChange={(e) => update("day", Number(e.target.value))}>
            {range(daysInMonth, 1).map((n) => (
              <option value={n} key={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{en ? "Year" : "Año"}</span>
          <select value={year} onChange={(e) => update("year", Number(e.target.value))}>
            {years.map((n) => (
              <option value={n} key={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{en ? "Hour" : "Hora"}</span>
          <select value={hour} onChange={(e) => update("hour", Number(e.target.value))}>
            {range(24).map((n) => (
              <option value={n} key={n}>
                {pad(n)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{en ? "Minute" : "Minuto"}</span>
          <select value={minute} onChange={(e) => update("minute", Number(e.target.value))}>
            {range(60).map((n) => (
              <option value={n} key={n}>
                {pad(n)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="button" onClick={onDone}>
        {en ? "Done" : "Listo"}
      </button>
    </div>
  );
}
