/** Single source of truth for Django API requests. */
const configuredOrigin = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
export const API_ORIGIN = configuredOrigin || (import.meta.env.DEV ? '' : 'https://api.ghazatech.com');
/** Accept relative /api paths, or an absolute URL. */
export const apiUrl = (path: string) => /^https?:\/\//i.test(path) ? path : `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
/** Django may return relative media paths. */
export const mediaUrl = (path: string | null | undefined) => path ? apiUrl(path) : '';
