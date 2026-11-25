export async function storageEstimate() {
  try {
    const est = await navigator.storage?.estimate?.();
    const persisted = await navigator.storage?.persisted?.();
    if (!est) return { usage: 0, quota: 0, percent: 0, persisted: !!persisted };
    const usage = est.usage || 0;
    const quota = est.quota || 0;
    return { usage, quota, percent: quota ? (usage / quota) * 100 : 0, persisted: !!persisted };
  } catch {
    return { usage: 0, quota: 0, percent: 0, persisted: false };
  }
}

export function formatBytes(n) {
  if (!n) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
