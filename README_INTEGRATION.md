# GhazaTech — Bolt Design + Django REST Framework

This project uses the supplied Bolt React/Tailwind design and existing `ghazatech-be` Django backend. **Supabase is not used.**

## Backend (Docker)

```bash
cd ghazatech-main/ghazatech-be
cp .env.docker.example .env.docker
# Set DJANGO_SECRET_KEY and DB_PASSWORD in .env.docker
docker compose --env-file .env.docker up -d --build
docker exec ghazatech-be python manage.py seed_ghazatech_products
```

## Frontend (Vite)

```bash
cd ghazatech-main/frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` and `/media` to Django on port 8000. For deployed frontend builds set `VITE_API_BASE_URL` to your public backend origin and configure Django CORS/HTTPS/media as appropriate.

## Important
- Store products, categories, brands, repair requests and support tickets come from Django, **not Supabase**.
- Product routes use Django numeric product IDs (e.g., `/product/3`) because the backend product model has no slug field.
- Repair tracking requires both reference number and mobile number as enforced by the backend.
- Checkout submits actual orders to `/api/orders/checkout/` and displays success only after a successful response.
- Warranty creation and issuance remains controlled by the existing backend's delivery status.
- Warranty lookup is a React page linked to the existing delivered-order warranty API. Certificate rendering is provided by the existing backend.
- React account/login and wishlist pages are not implemented in the supplied design; Django admin remains available.
