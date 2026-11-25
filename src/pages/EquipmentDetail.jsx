import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import Page from '../components/Page';
import Icon from '../components/Icon';
import Photo, { PhotoViewer } from '../components/Photo';
import CopyText from '../components/CopyText';
import WarrantyBadge from '../components/WarrantyBadge';
import { typeInfo, equipmentLabel } from '../lib/equipmentTypes';
import { deleteEquipment } from '../lib/equipment';
import { formatDate, ageText } from '../lib/dates';
import { navigate } from '../lib/router';

export default function EquipmentDetail({ id }) {
  const eq = useLiveQuery(() => db.equipment.get(id), [id]);
  const [viewing, setViewing] = useState(false);

  if (eq === undefined) return <Page title="" back="equipment" />;
  if (!eq) return <Page title="Not found" back="equipment"><p className="muted">This equipment was deleted.</p></Page>;

  const t = typeInfo(eq.type);

  async function onDelete() {
    if (!confirm(`Delete ${equipmentLabel(eq)}? Its parts and scheduled tasks will be removed too. Past log entries are kept.`)) return;
    await deleteEquipment(id);
    navigate('equipment', { replace: true });
  }

  return (
    <Page title={equipmentLabel(eq)} back="equipment" action={
      <a className="icon-btn" href={`#/equipment/${id}/edit`} aria-label="Edit"><Icon name="edit" /></a>
    }>
      <div className="card hero">
        <span className="hero-icon">{t.icon}</span>
        <div>
          <div className="hero-title">{equipmentLabel(eq)}</div>
          <div className="muted">{[t.label, eq.brand, eq.location].filter(Boolean).join(' · ')}</div>
          <div className="mt-sm"><WarrantyBadge expires={eq.warrantyExpires} long /></div>
        </div>
      </div>

      <div className="card">
        <dl className="dl">
          <dt>Model</dt><dd><CopyText value={eq.model} /></dd>
          <dt>Serial</dt><dd><CopyText value={eq.serial} /></dd>
          <dt>Installed</dt>
          <dd>{formatDate(eq.installDate)}{eq.installDate && <span className="muted"> · {ageText(eq.installDate)}</span>}</dd>
          <dt>Warranty</dt><dd>{formatDate(eq.warrantyExpires)}</dd>
          <dt>Location</dt><dd>{eq.location || '—'}</dd>
        </dl>
      </div>

      {eq.dataPlatePhotoId && (
        <div className="card">
          <h2 className="card-title">Data plate</h2>
          <Photo id={eq.dataPlatePhotoId} className="thumb-wide" onClick={() => setViewing(true)} alt="Data plate" />
          <p className="field-hint">Tap to enlarge. Pinch to zoom.</p>
        </div>
      )}

      {eq.notes && (
        <div className="card">
          <h2 className="card-title">Notes</h2>
          <p className="pre">{eq.notes}</p>
        </div>
      )}

      <div className="card muted-card">
        <h2 className="card-title">Parts & maintenance</h2>
        <p className="muted">Parts (stage 2) and the maintenance schedule (stage 3) will appear here.</p>
      </div>

      <button className="btn danger-text full" onClick={onDelete}><Icon name="trash" /> Delete equipment</button>
      {viewing && <PhotoViewer id={eq.dataPlatePhotoId} onClose={() => setViewing(false)} />}
    </Page>
  );
}
