/**
 * In-memory photo store — for QR download feature.
 * Photos are stored temporarily (TTL 30 minutes) and served via /api/photos/[id].
 *
 * IMPORTANT: Uses globalThis to survive Next.js HMR module reloads in dev mode.
 * In production, data is scoped to the server process lifetime (suitable for a
 * photobooth kiosk where the server stays up during sessions).
 */

interface StoredPhoto {
  data: Buffer;
  mimeType: string;
  createdAt: number;
}

// ── Persist the store on globalThis so HMR doesn't wipe it ──────────
declare global {
  // eslint-disable-next-line no-var
  var __rgPhotoStore: Map<string, StoredPhoto> | undefined;
}

const store: Map<string, StoredPhoto> = globalThis.__rgPhotoStore ?? new Map();
globalThis.__rgPhotoStore = store;

const TTL_MS = 30 * 60 * 1000; // 30 minutes

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function cleanup() {
  const now = Date.now();
  for (const [id, photo] of store) {
    if (now - photo.createdAt > TTL_MS) {
      store.delete(id);
    }
  }
}

export function savePhoto(base64: string, mimeType = 'image/jpeg'): string {
  cleanup();
  // Strip data URL prefix if present
  const raw = base64.replace(/^data:[^;]+;base64,/, '');
  const data = Buffer.from(raw, 'base64');
  const id = generateId();
  store.set(id, { data, mimeType, createdAt: Date.now() });
  console.log(`[photo-store] Saved photo ID: ${id}, store size: ${store.size}`);
  return id;
}

export function getPhoto(id: string): StoredPhoto | null {
  const photo = store.get(id);
  if (!photo) {
    console.log(`[photo-store] Photo not found: ${id}, store size: ${store.size}`);
    return null;
  }
  // Expire check
  if (Date.now() - photo.createdAt > TTL_MS) {
    store.delete(id);
    console.log(`[photo-store] Photo expired: ${id}`);
    return null;
  }
  return photo;
}
