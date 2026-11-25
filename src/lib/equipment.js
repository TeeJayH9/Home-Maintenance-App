import { db } from '../db';
import { deletePhoto } from './photos';

export async function saveEquipment(record, originalPhotoId) {
  const now = new Date().toISOString();
  const data = { ...record, updatedAt: now };
  if (!data.id) data.createdAt = now;
  const id = await db.equipment.put(data);
  // Clean up a replaced/removed data-plate photo only once the save succeeds.
  if (originalPhotoId && originalPhotoId !== record.dataPlatePhotoId) await deletePhoto(originalPhotoId);
  return id;
}

// Deletes the equipment and everything that belongs only to it (photo, parts, tasks).
// Log entries are kept for history; they keep their equipment name snapshot.
export async function deleteEquipment(id) {
  await db.transaction('rw', db.equipment, db.parts, db.tasks, db.photos, async () => {
    const eq = await db.equipment.get(id);
    if (eq?.dataPlatePhotoId) await db.photos.delete(eq.dataPlatePhotoId);
    await db.parts.where('equipmentId').equals(id).delete();
    await db.tasks.where('equipmentId').equals(id).delete();
    await db.equipment.delete(id);
  });
}
