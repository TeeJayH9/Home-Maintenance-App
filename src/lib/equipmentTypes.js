// Preloaded equipment types. `key` is stored on records; schedule templates
// (stage 3) are keyed by these values.
export const EQUIPMENT_TYPES = [
  { key: 'furnace', label: 'Furnace', icon: '🔥' },
  { key: 'ac', label: 'A/C', icon: '❄️' },
  { key: 'heat_pump', label: 'Heat pump', icon: '♨️' },
  { key: 'water_heater_tank', label: 'Water heater (tank)', icon: '🚿' },
  { key: 'water_heater_tankless', label: 'Water heater (tankless)', icon: '🚿' },
  { key: 'water_softener', label: 'Water softener', icon: '💧' },
  { key: 'sump_pump', label: 'Sump pump', icon: '🌊' },
  { key: 'humidifier', label: 'Humidifier', icon: '💨' },
  { key: 'air_purifier', label: 'Air purifier', icon: '🌬️' },
  { key: 'thermostat', label: 'Smart thermostat', icon: '🌡️' },
  { key: 'garage_door', label: 'Garage door opener', icon: '🚗' },
  { key: 'dishwasher', label: 'Dishwasher', icon: '🍽️' },
  { key: 'washer', label: 'Washer', icon: '🧺' },
  { key: 'dryer', label: 'Dryer', icon: '👕' },
  { key: 'refrigerator', label: 'Refrigerator', icon: '🧊' },
  { key: 'range', label: 'Range / oven', icon: '🍳' },
  { key: 'smoke_co', label: 'Smoke & CO detectors', icon: '🚨' },
  { key: 'radon', label: 'Radon mitigation', icon: '☢️' },
  { key: 'gutters', label: 'Gutters', icon: '🌧️' },
  { key: 'roof', label: 'Roof', icon: '🏠' },
  { key: 'deck', label: 'Deck', icon: '🪵' },
  { key: 'other', label: 'Other', icon: '🔧' }
];

const BY_KEY = Object.fromEntries(EQUIPMENT_TYPES.map(t => [t.key, t]));

export function typeInfo(key) {
  return BY_KEY[key] || BY_KEY.other;
}

export function equipmentLabel(eq) {
  if (!eq) return '';
  return eq.name || typeInfo(eq.type).label;
}
