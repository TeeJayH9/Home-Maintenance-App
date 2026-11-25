import { useEffect, useState } from 'react';

// Minimal hash router: "#/equipment/3/edit" -> ['equipment', '3', 'edit'].
// Hash routing means GitHub Pages needs no server-side rewrite rules.
function current() {
  return window.location.hash.replace(/^#\/?/, '').split('?')[0].split('/').filter(Boolean);
}

export function useRoute() {
  const [parts, setParts] = useState(current);
  useEffect(() => {
    const onChange = () => { setParts(current()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return parts;
}

export function navigate(path, { replace = false } = {}) {
  const hash = '#/' + path.replace(/^\/+/, '');
  if (replace) {
    window.history.replaceState(null, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = hash;
  }
}

export function goBack(fallback = '') {
  if (window.history.length > 1) window.history.back();
  else navigate(fallback, { replace: true });
}
