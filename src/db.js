import Dexie from 'dexie';

// All stores are declared up front so later stages don't need schema migrations.
// Only indexed fields are listed here; records can hold any other fields.
export const db = new Dexie('home-maintenance');

db.version(1).stores({
  meta: 'key',                                   // single-value records: profile, settings
  equipment: '++id, type, name',
  parts: '++id, equipmentId, name',
  tasks: '++id, equipmentId, enabled',
  checklists: 'season',                          // one per season: items, open date
  checklistRuns: '++id, [season+year], season, year',
  logs: '++id, date, equipmentId, workType, taskId',
  contractors: '++id, name',
  watchItems: '++id, resolved',
  watchPhotos: '++id, watchItemId, date',
  photos: '++id'                                 // { blob, width, height, createdAt }
});

export const DEFAULT_PROFILE = {
  yearBuilt: '',
  squareFeet: '',
  stories: 2,
  roofType: '',
  roofInstallYear: '',
  sidingType: '',
  foundationType: '',
  lawnSize: '',
  location: 'Copley Township, OH',
  climateRegion: 'cold',  // see CLIMATE_REGIONS
  hoa: true,
  notes: '',
  // Month-day (MM-DD) each seasonal checklist opens. Editable on the Profile screen.
  seasonStarts: { spring: '03-15', summer: '06-01', fall: '10-01', winter: '12-01' }
};

export const CLIMATE_REGIONS = [
  { value: 'cold', label: 'Cold / snowy (Northeast Ohio, Great Lakes)' },
  { value: 'mixed', label: 'Mixed / moderate (Mid-Atlantic, Ohio Valley)' },
  { value: 'hot-humid', label: 'Hot & humid (Southeast, Gulf)' },
  { value: 'hot-dry', label: 'Hot & dry (Southwest)' },
  { value: 'marine', label: 'Marine (Pacific Northwest)' }
];

export async function getMeta(key, fallback) {
  const row = await db.meta.get(key);
  return row ? row.value : fallback;
}

export function setMeta(key, value) {
  return db.meta.put({ key, value });
}

// Ask the browser not to evict our data under storage pressure.
// Installed iOS home-screen apps are exempt from Safari's 7-day eviction anyway.
export async function requestPersistence() {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist();
    }
  } catch { /* not supported */ }
}
