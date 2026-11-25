import { useEffect, useState } from 'react';
import { DEFAULT_PROFILE, CLIMATE_REGIONS, getMeta, setMeta } from '../db';
import Page from '../components/Page';
import { TextField, TextArea, Select, Field } from '../components/Field';

const ROOF_TYPES = ['Asphalt shingle (architectural)', 'Asphalt shingle (3-tab)', 'Metal', 'Slate', 'Cedar shake', 'Flat / EPDM', 'Tile'];
const SIDING_TYPES = ['Vinyl', 'Brick', 'Fiber cement (Hardie)', 'Wood', 'Stone veneer', 'Stucco', 'Aluminum', 'Mixed'];
const FOUNDATION_TYPES = ['Full basement (finished)', 'Full basement (unfinished)', 'Partial basement', 'Crawl space', 'Slab', 'Walkout basement'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SEASONS = [['spring', 'Spring'], ['summer', 'Summer'], ['fall', 'Fall'], ['winter', 'Winter']];

function MonthDay({ label, value, onChange }) {
  const [m, d] = value.split('-');
  const days = new Date(2001, Number(m), 0).getDate(); // non-leap year
  return (
    <Field label={label}>
      <div className="row gap">
        <select value={m} onChange={e => {
          const max = new Date(2001, Number(e.target.value), 0).getDate();
          onChange(`${e.target.value}-${String(Math.min(Number(d), max)).padStart(2, '0')}`);
        }}>
          {MONTHS.map((name, i) => <option key={name} value={String(i + 1).padStart(2, '0')}>{name}</option>)}
        </select>
        <select value={d} onChange={e => onChange(`${m}-${e.target.value}`)}>
          {Array.from({ length: days }, (_, i) => String(i + 1).padStart(2, '0'))
            .map(v => <option key={v} value={v}>{Number(v)}</option>)}
        </select>
      </div>
    </Field>
  );
}

export default function Profile() {
  const [p, setP] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMeta('profile', null).then(v => setP({ ...DEFAULT_PROFILE, ...v, seasonStarts: { ...DEFAULT_PROFILE.seasonStarts, ...v?.seasonStarts } }));
  }, []);

  if (!p) return <Page title="Home profile" back="more" />;

  const set = key => value => { setSaved(false); setP(prev => ({ ...prev, [key]: value })); };
  const setSeason = key => value => { setSaved(false); setP(prev => ({ ...prev, seasonStarts: { ...prev.seasonStarts, [key]: value } })); };

  async function onSubmit(e) {
    e.preventDefault();
    await setMeta('profile', p);
    setSaved(true);
  }

  return (
    <Page title="Home profile" back="more">
      <form className="form" onSubmit={onSubmit}>
        <h2 className="section-title">The house</h2>
        <TextField label="Location" value={p.location} onChange={set('location')} />
        <div className="grid-2">
          <TextField label="Year built" inputMode="numeric" value={p.yearBuilt} onChange={set('yearBuilt')} />
          <TextField label="Square feet" inputMode="numeric" value={p.squareFeet} onChange={set('squareFeet')} />
        </div>
        <div className="grid-2">
          <TextField label="Stories" type="number" min="1" max="5" value={p.stories} onChange={set('stories')} />
          <TextField label="Lawn size" value={p.lawnSize} onChange={set('lawnSize')} placeholder="e.g. 0.3 acre" />
        </div>

        <h2 className="section-title">Exterior & structure</h2>
        <TextField label="Roof type" value={p.roofType} onChange={set('roofType')} list="roof-types" />
        <TextField label="Roof install year" inputMode="numeric" value={p.roofInstallYear} onChange={set('roofInstallYear')} />
        <TextField label="Siding type" value={p.sidingType} onChange={set('sidingType')} list="siding-types" />
        <TextField label="Foundation / basement" value={p.foundationType} onChange={set('foundationType')} list="foundation-types" />
        <datalist id="roof-types">{ROOF_TYPES.map(v => <option key={v} value={v} />)}</datalist>
        <datalist id="siding-types">{SIDING_TYPES.map(v => <option key={v} value={v} />)}</datalist>
        <datalist id="foundation-types">{FOUNDATION_TYPES.map(v => <option key={v} value={v} />)}</datalist>

        <h2 className="section-title">Climate & seasons</h2>
        <Select label="Climate region" value={p.climateRegion} onChange={set('climateRegion')}
          options={CLIMATE_REGIONS} hint="Used to tune seasonal checklists and task timing." />
        <p className="field-hint">Each seasonal checklist opens on these dates every year.</p>
        <div className="grid-2">
          {SEASONS.map(([key, label]) => (
            <MonthDay key={key} label={label} value={p.seasonStarts[key]} onChange={setSeason(key)} />
          ))}
        </div>

        <h2 className="section-title">HOA</h2>
        <label className="toggle">
          <input type="checkbox" checked={!!p.hoa} onChange={e => set('hoa')(e.target.checked)} />
          <span>Home is in an HOA</span>
        </label>
        {p.hoa && (
          <>
            <TextField label="HOA name / management contact" value={p.hoaContact} onChange={set('hoaContact')} />
            <TextArea label="HOA rules to remember" value={p.hoaNotes} onChange={set('hoaNotes')}
              placeholder="e.g. Exterior paint colors need approval; trash cans out of sight" />
          </>
        )}

        <h2 className="section-title">Notes</h2>
        <TextArea label="Notes" value={p.notes} onChange={set('notes')} rows={4}
          placeholder="Shutoff locations, paint colors, quirks…" />

        <div className="form-actions sticky-actions">
          {saved && <span className="saved-msg">Saved ✓</span>}
          <button type="submit" className="btn btn-primary">Save profile</button>
        </div>
      </form>
    </Page>
  );
}
