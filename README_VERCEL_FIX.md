# CRM API integration fix

This update fixes POST /api/crm/login/ accidentally going to Vercel and receiving 405/index.html.

## Deploy

1. Extract this archive; place its contents into your GitHub frontend repository root (the folder containing package.json).
2. In Vercel Project > Settings > Environment Variables set VITE_API_BASE_URL=https://api.ghazatech.com (Production and Preview as required).
3. Trigger a new Vercel deployment; Vite reads env variables at **build** time.
4. Open https://ghazatech-fe.vercel.app/crm/ and use Network tab. Login POST should go to https://api.ghazatech.com/api/crm/login/.
5. Django CORS_ALLOWED_ORIGINS must include https://ghazatech-fe.vercel.app and the final custom domain.

All API clients now use a single API_ORIGIN helper, and production builds fall back to https://api.ghazatech.com if the environment variable is missing. Local Vite development still defaults to the local /api proxy. Existing vercel.json also retains /api rewrite as a fallback.
