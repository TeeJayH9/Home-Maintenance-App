import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

// Renders a photo stored in the `photos` table by id.
export function usePhotoURL(id) {
  const row = useLiveQuery(() => (id ? db.photos.get(id) : undefined), [id]);
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!row?.blob) { setUrl(null); return; }
    const u = URL.createObjectURL(row.blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [row]);
  return url;
}

export default function Photo({ id, alt = '', className = '', onClick }) {
  const url = usePhotoURL(id);
  if (!url) return <div className={'photo-placeholder ' + className} />;
  return <img src={url} alt={alt} className={'photo ' + className} onClick={onClick} />;
}

// Full-screen viewer; pinch-zoom works natively on the image.
export function PhotoViewer({ id, onClose }) {
  const url = usePhotoURL(id);
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="viewer" onClick={onClose} role="dialog" aria-label="Photo">
      {url && <img src={url} alt="" />}
      <button className="viewer-close" aria-label="Close">✕</button>
    </div>
  );
}
