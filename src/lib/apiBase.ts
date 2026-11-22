/** Shared API origin for the Django backend (never the Vercel frontend). */
const rawOrigin = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
const configuredOrigin = rawOrigin.replace(/\/api$/i, '');
export const API_ORIGIN = configuredOrigin || (import.meta.env.DEV ? '' : 'https://api.ghazatech.com');

export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Resolve relative Django media URLs, preserving absolute and static assets. */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path;
  return apiUrl(path);
}
