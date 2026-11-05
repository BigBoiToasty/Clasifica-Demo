import type { CategoryId } from "./data";

export function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  );
}

export function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-4v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3h4v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08a1.7 1.7 0 0 0-1.55 1Z" />
    </svg>
  );
}

export function OptionIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path className="icon-leaf" d="M54 12c-2 15-10 22-24 23 2-14 9-21 24-23Z" />
        <path className="icon-bin" d="M23 31h31l-3 35H26l-3-35Z" />
        <path d="M35 25h8M20 31h37M33 43l7-5 7 5M40 38v17" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path className="icon-bin green" d="M5 35h20l-2 28H8L5 35Z" />
        <path className="icon-bin blue" d="M30 29h20l-2 34H33l-3-34Z" />
        <path className="icon-bin purple" d="M55 35h20l-2 28H58l-3-28Z" />
        <path d="M4 35h22M29 29h22M54 35h22" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path className="icon-book" d="M13 24c12-3 21 0 27 7v37c-7-7-16-9-27-6V24Z" />
        <path className="icon-book alt" d="M67 24c-12-3-21 0-27 7v37c7-7 16-9 27-6V24Z" />
        <path d="M40 31v37M21 36h10M49 36h10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <path className="icon-camera" d="M19 29h12l4-7h12l4 7h11v34H19V29Z" />
      <circle cx="40" cy="46" r="11" />
      <path d="M15 19 8 12M65 19l7-7M40 15V5" />
    </svg>
  );
}

export function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4v-9Z" />
    </svg>
  );
}

export function CategoryIcon({ category }: { category: CategoryId }) {
  if (category === "paper") {
    return (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M18 19h34l11 11v35H18V19Z" />
        <path d="M52 19v12h11M28 39h24M28 49h24M28 59h16" />
      </svg>
    );
  }
  if (category === "plastic") {
    return (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M33 12h14v12l7 9v31c0 4-3 6-7 6H33c-4 0-7-2-7-6V33l7-9V12Z" />
        <path d="M31 38c7 4 12-4 23 0M34 12h12" />
      </svg>
    );
  }
  if (category === "other") {
    return (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M24 17h32l-3 48H27l-3-48Z" />
        <path d="M24 25h32M29 14h22M31 36h18M31 46h18" />
      </svg>
    );
  }
  if (category === "organic") {
    return (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M20 54c0-19 14-34 37-36 2 23-10 39-30 39" />
        <path d="M18 65c8-18 19-28 35-39" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <path d="M22 25h36l-4 43H26l-4-43ZM18 25h44M30 18h20M34 38l12 12M46 38 34 50" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </svg>
  );
}

export function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 10v4h4l5 4V6l-5 4H5Z" />
      <path d="M17 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}
