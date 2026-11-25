import { useEffect, useState } from 'react';
import { db } from '../db';
import Page from '../components/Page';
import PhotoPicker from '../components/PhotoPicker';
import { TextField, TextArea, Select, Field } from '../components/Field';
import { EQUIPMENT_TYPES } from '../lib/equipmentTypes';
import { saveEquipment } from '../lib/equipment';
import { deletePhoto } from '../lib/photos';
import { navigate, goBack } from '../lib/router';

const EMPTY = {
  type: 'furnace', name: '', brand: '', model: '', serial: '',
  installDate: '', warrantyExpires: '', location: '', notes: '', dataPlatePhotoId: null
};

const LOCATIONS = ['Basement', 'Utility room', 'Garage', 'Kitchen', 'Laundry room', 'Attic', 'Exterior', 'Yard', '1st floor', '2nd floor'];

export default function EquipmentEdit({ id }) {
  const isNew = !id;
  const [form, setForm] = useState(isNew ? EMPTY : null);
  const [originalPhoto, setOriginalPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    db.equipment.get(id).then(e => {
      if (!e) return navigate('equipment', { replace: true });
      setForm({ ...EMPTY, ...e });
      setOriginalPhoto(e.dataPlatePhotoId || null);
    });
  }, [id, isNew]);

  if (!form) return <Page title="Edit equipment" back="equipment" />;

  const set = key => value => setForm(f => ({ ...f, [key]: value }));

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const newId = await saveEquipment(form, originalPhoto);
    // Stage 3 will hook in here to suggest starter maintenance tasks for new equipment.
    navigate(`equipment/${newId}`, { replace: true });
  }

  async function onCancel() {
    // Discard a photo picked during this edit that never got saved.
    if (form.dataPlatePhotoId && form.dataPlatePhotoId !== originalPhoto) await deletePhoto(form.dataPlatePhotoId);
    goBack('equipment');
  }

  return (
    <Page title={isNew ? 'Add equipment' : 'Edit equipment'} back="equipment">
      <form className="form" onSubmit={onSubmit}>
        <Select label="Type" value={form.type} onChange={set('type')}
          options={EQUIPMENT_TYPES.map(t => ({ value: t.key, label: `${t.icon}  ${t.label}` }))} />
        <TextField label="Name (optional)" value={form.name} onChange={set('name')}
          placeholder="e.g. Basement furnace" hint="Defaults to the type if left blank." />
        <div className="grid-2">
          <TextField label="Brand" value={form.brand} onChange={set('brand')} autoCapitalize="words" />
          <TextField label="Location" value={form.location} onChange={set('location')} list="locations" />
        </div>
        <datalist id="locations">{LOCATIONS.map(l => <option key={l} value={l} />)}</datalist>
        <TextField label="Model number" value={form.model} onChange={set('model')}
          autoCapitalize="characters" autoCorrect="off" spellCheck={false} className="mono" />
        <TextField label="Serial number" value={form.serial} onChange={set('serial')}
          autoCapitalize="characters" autoCorrect="off" spellCheck={false} className="mono" />
        <div className="grid-2">
          <TextField label="Installed / purchased" type="date" value={form.installDate} onChange={set('installDate')} />
          <TextField label="Warranty expires" type="date" value={form.warrantyExpires} onChange={set('warrantyExpires')} />
        </div>
        <Field label="Data plate photo">
          <PhotoPicker value={form.dataPlatePhotoId} onChange={set('dataPlatePhotoId')} label="Photograph data plate" />
        </Field>
        <TextArea label="Notes" value={form.notes} onChange={set('notes')} rows={4} />
        <div className="form-actions">
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Page>
  );
}
