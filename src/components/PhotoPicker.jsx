import { useRef, useState } from 'react';
import Icon from './Icon';
import Photo, { PhotoViewer } from './Photo';
import { savePhoto } from '../lib/photos';

// Pick or take a single photo. Calls onChange(newPhotoId | null).
// The old photo row is cleaned up by the caller on save, so cancel doesn't lose data.
export default function PhotoPicker({ value, onChange, label = 'Add photo' }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [viewing, setViewing] = useState(false);

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await savePhoto(file));
    } catch (err) {
      setError(err.message || 'Could not read that image');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="photo-picker">
      {value ? (
        <div className="photo-picker-preview">
          <Photo id={value} className="thumb-lg" onClick={() => setViewing(true)} />
          <div className="row gap">
            <button type="button" className="btn" onClick={() => input.current.click()}>Replace</button>
            <button type="button" className="btn danger-text" onClick={() => onChange(null)}>Remove</button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn btn-dashed" onClick={() => input.current.click()} disabled={busy}>
          <Icon name="camera" /> {busy ? 'Saving…' : label}
        </button>
      )}
      {error && <p className="error">{error}</p>}
      <input ref={input} type="file" accept="image/*" hidden onChange={onFile} />
      {viewing && <PhotoViewer id={value} onClose={() => setViewing(false)} />}
    </div>
  );
}
