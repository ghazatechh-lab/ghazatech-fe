# GhazaTech Frontend → Django API

- Backend origin: `https://api.ghazatech.com` (set `VITE_API_BASE_URL` in Vercel).
- API prefixes used by React: `/api/store/`, `/api/accounts/`, `/api/orders/`, `/api/services/`, `/api/crm/`.
- The homepage now renders categories and featured items from Django rather than hardcoded database IDs. Local image assets remain available as visual fallbacks only.
- CRM session uses Django `Token` authentication; customer authentication uses separate customer token.
- Vercel SPA fallback and `/api` and `/media` proxy rules are in `vercel.json`.
- Allow `https://ghazatech-fe.vercel.app`, `https://ghazatech.com`, and `https://www.ghazatech.com` in Django CORS while using those origins.
- This is a frontend-only patch. Backend code was not supplied; deployed endpoint shapes and production data must still be validated against the running backend.
- Build: `npm ci && npm run build` from the `frontend` directory.
