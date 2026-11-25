// Theme preference is a per-device convenience, so localStorage is fine here.
const KEY = 'theme';

export function getThemePref() {
  try { return localStorage.getItem(KEY) || 'system'; } catch { return 'system'; }
}

export function setThemePref(pref) {
  try { localStorage.setItem(KEY, pref); } catch { /* ignore */ }
  applyTheme();
}

export function applyTheme() {
  const pref = getThemePref();
  const root = document.documentElement;
  if (pref === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', pref);
}
