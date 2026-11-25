// Dates are stored as 'YYYY-MM-DD' strings (local time) to avoid timezone drift.

export function todayISO() {
  return toISO(new Date());
}

export function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISO(s) {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(a, b) {
  return Math.round((parseISO(b) - parseISO(a)) / 86400000);
}

export function formatDate(s) {
  const d = parseISO(s);
  if (!d) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Warranty status relative to today: { status: 'none'|'active'|'expiring'|'expired', days }
export function warrantyStatus(expires) {
  if (!expires) return { status: 'none', days: null };
  const days = daysBetween(todayISO(), expires);
  if (days < 0) return { status: 'expired', days };
  if (days <= 90) return { status: 'expiring', days };
  return { status: 'active', days };
}

export function ageText(fromISO) {
  const d = parseISO(fromISO);
  if (!d) return '';
  const now = new Date();
  let years = now.getFullYear() - d.getFullYear();
  let months = now.getMonth() - d.getMonth();
  if (now.getDate() < d.getDate()) months--;
  if (months < 0) { years--; months += 12; }
  if (years <= 0) return `${Math.max(months, 0)} mo old`;
  return months ? `${years} yr ${months} mo old` : `${years} yr old`;
}
