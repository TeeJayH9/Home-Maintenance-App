import { db } from '../db';

// Resize + JPEG-compress an image File before saving it to IndexedDB.
// A 12MP iPhone photo (~3-5 MB) typically ends up around 150-300 KB.
export async function compressImage(file, { maxDim = 1600, quality = 0.75 } = {}) {
  const bitmap = await loadImage(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  const blob = await new Promise((res, rej) =>
    canvas.toBlob(b => (b ? res(b) : rej(new Error('Could not compress image'))), 'image/jpeg', quality)
  );
  return { blob, width, height };
}

async function loadImage(file) {
  // createImageBitmap respects EXIF orientation with this option (Safari 17+, Chrome).
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch { /* fall through to <img> */ }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function savePhoto(file) {
  const { blob, width, height } = await compressImage(file);
  return db.photos.add({ blob, width, height, createdAt: new Date().toISOString() });
}

export function deletePhoto(id) {
  return id ? db.photos.delete(id) : Promise.resolve();
}
