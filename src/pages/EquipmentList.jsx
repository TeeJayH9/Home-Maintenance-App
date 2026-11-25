import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import Page from '../components/Page';
import Icon from '../components/Icon';
import WarrantyBadge from '../components/WarrantyBadge';
import { typeInfo, equipmentLabel } from '../lib/equipmentTypes';

export default function EquipmentList() {
  const items = useLiveQuery(() => db.equipment.toArray(), []);
  const [q, setQ] = useState('');

  const query = q.trim().toLowerCase();
  const filtered = (items || [])
    .filter(e => !query || [equipmentLabel(e), typeInfo(e.type).label, e.brand, e.model, e.location]
      .some(v => v && v.toLowerCase().includes(query)))
    .sort((a, b) => equipmentLabel(a).localeCompare(equipmentLabel(b)));

  return (
    <Page title="Equipment" action={
      <a className="icon-btn" href="#/equipment/new" aria-label="Add equipment"><Icon name="plus" /></a>
    }>
      {items && items.length > 4 && (
        <div className="search">
          <Icon name="search" size={18} />
          <input type="search" placeholder="Search equipment" value={q} onChange={e => setQ(e.target.value)} />
        </div>
      )}
      {items && items.length === 0 && (
        <div className="empty">
          <p>No equipment yet.</p>
          <p className="muted">Add your furnace, water heater, sump pump and other systems to start tracking them.</p>
          <a className="btn btn-primary" href="#/equipment/new">Add equipment</a>
        </div>
      )}
      <ul className="list">
        {filtered.map(e => (
          <li key={e.id}>
            <a className="list-item" href={`#/equipment/${e.id}`}>
              <span className="list-icon">{typeInfo(e.type).icon}</span>
              <span className="list-main">
                <span className="list-title">{equipmentLabel(e)}</span>
                <span className="list-sub">
                  {[e.brand, e.location].filter(Boolean).join(' · ') || typeInfo(e.type).label}
                </span>
              </span>
              <WarrantyBadge expires={e.warrantyExpires} />
              <Icon name="chevron" size={18} className="muted" />
            </a>
          </li>
        ))}
      </ul>
    </Page>
  );
}
