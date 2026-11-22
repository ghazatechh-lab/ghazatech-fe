# GhazaTech CRM — enterprise visual refinement

Updated CRM visual layer for the existing Django REST + React application.

## What's changed

- Consistent 252px expanded / 68px collapsed dark-navy sidebar treatment; the existing five navigation groups remain intact.
- Independent sidebar scrolling, fixed brand and profile controls, active indicator animation and compact link spacing.
- Smaller, more consistent dashboard cards, operational KPIs, recent-orders section, quick actions, table spacing, form and modal treatments.
- Accessible focus states, responsive mobile/tablet layouts and reduced-motion support.
- Truthful data freshness label showing the time of the latest successful API refresh. The existing 30-second refresh interval remains unchanged.
- A separate terminal stylesheet (`src/styles/crm-enterprise-finish.css`) that keeps this visual layer maintainable.

No API endpoints, permissions, authentication flow, CRUD behavior or backend Docker files are changed.

## Apply

Extract this archive in `/mnt/d/Myworks/GhazaTech/ghazatech-main/`, so the archive's `frontend/` folder overlays your existing frontend.

```bash
cd /mnt/d/Myworks/GhazaTech/ghazatech-main/frontend
npm install
npm run typecheck
npm run build
npm run dev -- --config vite.config.ts
```

The ZIP intentionally excludes `.env.local`, so it cannot overwrite your local Docker API configuration. Keep:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_BACKEND_URL=http://127.0.0.1:8000
```

In Vercel Production, keep `VITE_API_BASE_URL=https://api.ghazatech.com`.

## Validation targets

1. Dashboard values load from the authenticated CRM API, including pending operations and recent orders.
2. Sidebar navigation, collapsed tooltips, mobile drawer, storefront and sign-out work.
3. CRM Products lists existing backend records, and editing reflects saved product fields and images.
4. Every section uses the shared header, tables and status styles.
5. Test at 1440, 1024, 768 and 390 pixel viewport widths; test keyboard navigation and reduced motion.

The package has been checked for ZIP integrity and source changes. A full npm build could not be completed in this environment because dependency installation timed out, so run it locally before pushing to Vercel.
