import { useEffect, useState } from 'react';
import Page from '../components/Page';
import Icon from '../components/Icon';
import { getThemePref, setThemePref } from '../lib/theme';
import { storageEstimate, formatBytes } from '../lib/storage';

const LINKS = [
  { href: '#/profile', icon: 'house', label: 'Home profile', sub: 'Year built, roof, siding, seasons' },
  { href: '#/appliances', icon: 'info', label: 'Appliance info', sub: 'Model & serial numbers, warranties' }
];

export default function More() {
  const [theme, setTheme] = useState(getThemePref);
  const [storage, setStorage] = useState(null);

  useEffect(() => { storageEstimate().then(setStorage); }, []);

  function changeTheme(v) { setTheme(v); setThemePref(v); }

  return (
    <Page title="More">
      <ul className="list">
        {LINKS.map(l => (
          <li key={l.href}>
            <a className="list-item" href={l.href}>
              <span className="list-icon"><Icon name={l.icon} /></span>
              <span className="list-main">
                <span className="list-title">{l.label}</span>
                <span className="list-sub">{l.sub}</span>
              </span>
              <Icon name="chevron" size={18} className="muted" />
            </a>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Appearance</h2>
      <div className="segmented" role="radiogroup" aria-label="Theme">
        {[['system', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(([v, label]) => (
          <button key={v} role="radio" aria-checked={theme === v} className={theme === v ? 'on' : ''}
            onClick={() => changeTheme(v)}>{label}</button>
        ))}
      </div>

      <h2 className="section-title">Storage</h2>
      <div className="card">
        {storage ? (
          <>
            <div className="row between"><span>Used on this device</span><strong>{formatBytes(storage.usage)}</strong></div>
            {storage.quota > 0 && (
              <>
                <div className="meter mt-sm"><span style={{ width: `${Math.min(100, storage.percent)}%` }} /></div>
                <p className="field-hint">{storage.percent.toFixed(1)}% of about {formatBytes(storage.quota)} available to this app.</p>
              </>
            )}
            <p className="field-hint">{storage.persisted ? 'Storage is marked persistent.' : 'Install to your home screen so iOS keeps this data.'}</p>
          </>
        ) : <p className="muted">Checking…</p>}
        <p className="field-hint">Backup (JSON export/import) arrives in stage 6.</p>
      </div>
    </Page>
  );
}
