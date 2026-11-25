import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import Page from '../components/Page';
import Icon from '../components/Icon';
import CopyText from '../components/CopyText';
import WarrantyBadge from '../components/WarrantyBadge';
import { PhotoViewer } from '../components/Photo';
import { typeInfo, equipmentLabel } from '../lib/equipmentTypes';
import { formatDate, ageText } from '../lib/dates';

// Read-it-off-the-screen view for calls with service or warranty departments.
export default function ApplianceInfo() {
  const items = useLiveQuery(() => db.equipment.toArray(), []);
  const [q, setQ] = useState('');
  const [photo, setPhoto] = useState(null);

  const query = q.trim().toLowerCase();
  const list = (items || [])
    .filter(e => !query || [equipmentLabel(e), e.brand, e.model, e.serial].some(v => v?.toLowerCase().includes(query)))
    .sort((a, b) => equipmentLabel(a).localeCompare(equipmentLabel(b)));

  return (
    <Page title="Appliance info" back="more">
      <div className="search">
        <Icon name="search" size={18} />
        <input type="search" placeholder="Search brand, model, serial" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      {items?.length === 0 && <p className="muted center">Add equipment to see model and serial numbers here.</p>}
      {list.map(e => (
        <div className="card appliance" key={e.id}>
          <div className="appliance-head">
            <span className="list-icon">{typeInfo(e.type).icon}</span>
            <a href={`#/equipment/${e.id}`} className="appliance-name">{equipmentLabel(e)}</a>
            <WarrantyBadge expires={e.warrantyExpires} />
          </div>
          <dl className="dl dl-tight">
            <dt>Brand</dt><dd>{e.brand || '—'}</dd>
            <dt>Model</dt><dd><CopyText value={e.model} /></dd>
            <dt>Serial</dt><dd><CopyText value={e.serial} /></dd>
            <dt>Installed</dt><dd>{formatDate(e.installDate)}{e.installDate && <span className="muted"> · {ageText(e.installDate)}</span>}</dd>
            <dt>Warranty</dt><dd>{formatDate(e.warrantyExpires)}</dd>
          </dl>
          {e.dataPlatePhotoId && (
            <button className="btn btn-small" onClick={() => setPhoto(e.dataPlatePhotoId)}>
              <Icon name="camera" size={18} /> Data plate
            </button>
          )}
        </div>
      ))}
      {photo && <PhotoViewer id={photo} onClose={() => setPhoto(null)} />}
    </Page>
  );
}
