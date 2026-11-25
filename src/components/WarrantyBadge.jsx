import { warrantyStatus, formatDate } from '../lib/dates';

export default function WarrantyBadge({ expires, long = false }) {
  const { status, days } = warrantyStatus(expires);
  if (status === 'none') return long ? <span className="badge">No warranty info</span> : null;
  if (status === 'expired') return <span className="badge badge-muted">Warranty expired{long ? ' ' + formatDate(expires) : ''}</span>;
  if (status === 'expiring') return <span className="badge badge-warn">Warranty ends in {days}d</span>;
  return <span className="badge badge-ok">Under warranty{long ? ' until ' + formatDate(expires) : ''}</span>;
}
