const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "14 March 1977" from an ISO date string. Returns "" if missing/invalid. */
export function formatLongDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Four-digit year, or "" */
export function year(value) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : String(d.getUTCFullYear());
}

/** Whole years between two ISO dates, or null. */
export function ageBetween(birth, death) {
  if (!birth || !death) return null;
  const b = new Date(birth);
  const d = new Date(death);
  if (Number.isNaN(b.getTime()) || Number.isNaN(d.getTime())) return null;
  let age = d.getUTCFullYear() - b.getUTCFullYear();
  const m = d.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && d.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

/** Short display name used throughout copy: explicit display_name, else first name. */
export function shortName(memorial) {
  if (!memorial) return "";
  if (memorial.display_name) return memorial.display_name;
  if (memorial.full_name) return memorial.full_name.trim().split(/\s+/)[0];
  return "";
}

/** "Sat, 6 Sep 2025" */
export function formatServiceDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const mon = MONTHS[d.getUTCMonth()].slice(0, 3);
  return `${days[d.getUTCDay()]}, ${d.getUTCDate()} ${mon} ${d.getUTCFullYear()}`;
}

/** "11:00" (UTC) */
export function formatTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}
