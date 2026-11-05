import type { Language } from "./data";

// All dates are "YYYY-MM-DDTHH:mm" strings in Uruguay time (UTC-3, no DST).

export function uruguayNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Montevideo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const v = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${v.year}-${v.month}-${v.day}T${v.hour}:${v.minute}`;
}

export function formatDateTime(value: string, language: Language) {
  return new Date(`${value}:00-03:00`).toLocaleString(language === "EN" ? "en-US" : "es-UY", {
    timeZone: "America/Montevideo",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
