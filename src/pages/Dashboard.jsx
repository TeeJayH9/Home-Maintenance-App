import { useLiveQuery } from 'dexie-react-hooks';
import { db, getMeta } from '../db';
import Page from '../components/Page';
import Icon from '../components/Icon';
import WarrantyBadge from '../components/WarrantyBadge';
import { equipmentLabel, typeInfo } from '../lib/equipmentTypes';
import { warrantyStatus } from '../lib/dates';

// Stage 1 dashboard. Overdue/due-soon tasks, the active seasonal checklist,
// low-stock parts and watch items join this screen in later stages.
export default function Dashboard() {
  const equipment = useLiveQuery(() => db.equipment.toArray(), []);
  const profile = useLiveQuery(() => getMeta('profile', null), []);

  if (!equipment) return <Page title="Home" />;

  const expiring = equipment.filter(e => warrantyStatus(e.warrantyExpires).status === 'expiring');
  const missingInfo = equipment.filter(e => !e.model || !e.serial);

  return (
    <Page title="Home">
      {profile === null && (
        <a className="card card-link callout" href="#/profile">
          <Icon name="house" />
          <div>
            <strong>Set up your home profile</strong>
            <div className="muted">Year built, roof, siding and season start dates.</div>
          </div>
          <Icon name="chevron" size={18} />
        </a>
      )}

      <div className="stats">
        <a className="stat" href="#/equipment">
          <span className="stat-num">{equipment.length}</span>
          <span className="stat-label">Equipment</span>
        </a>
        <a className="stat" href="#/appliances">
          <span className="stat-num">{equipment.filter(e => warrantyStatus(e.warrantyExpires).status === 'active' || warrantyStatus(e.warrantyExpires).status === 'expiring').length}</span>
          <span className="stat-label">Under warranty</span>
        </a>
      </div>

      {equipment.length === 0 && (
        <div className="empty">
          <p>Start by adding your equipment.</p>
          <a className="btn btn-primary" href="#/equipment/new"><Icon name="plus" /> Add equipment</a>
        </div>
      )}

      {expiring.length > 0 && (
        <section className="card">
          <h2 className="card-title">Warranties ending soon</h2>
          <ul className="list list-plain">
            {expiring.map(e => (
              <li key={e.id}>
                <a className="list-item" href={`#/equipment/${e.id}`}>
                  <span className="list-icon">{typeInfo(e.type).icon}</span>
                  <span className="list-main"><span className="list-title">{equipmentLabel(e)}</span></span>
                  <WarrantyBadge expires={e.warrantyExpires} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {missingInfo.length > 0 && (
        <section className="card">
          <h2 className="card-title">Missing model or serial</h2>
          <ul className="list list-plain">
            {missingInfo.map(e => (
              <li key={e.id}>
                <a className="list-item" href={`#/equipment/${e.id}/edit`}>
                  <span className="list-icon">{typeInfo(e.type).icon}</span>
                  <span className="list-main"><span className="list-title">{equipmentLabel(e)}</span>
                    <span className="list-sub">Snap the data plate next time you're nearby</span></span>
                  <Icon name="chevron" size={18} className="muted" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Page>
  );
}
