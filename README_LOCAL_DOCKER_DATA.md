# Local Django data: frontend and CRM

## Root folder
Unzip from `/mnt/d/Myworks/GhazaTech/ghazatech-main/` — this archive has a `frontend/` top-level folder. No backend files are changed.

## Start the local Django backend
```bash
cd /mnt/d/Myworks/GhazaTech/ghazatech-main/ghazatech-be
docker compose --env-file .env.docker up -d --build backend
curl -i http://localhost:8000/api/store/products/
```

## Start Vite
```bash
cd /mnt/d/Myworks/GhazaTech/ghazatech-main/frontend
cat .env.local
npm run dev
```
Restart Vite after changes to `.env.local`. Do not use `https://api.ghazatech.com` in `.env.local` while checking local Docker database records. Both CRM and storefront should send `/api/...` via the Vite proxy (same-origin on localhost:5173), which now targets `http://127.0.0.1:8000`. This ZIP includes the local `.env.local`, which is ignored by Git.

## Verify exact data source
```bash
curl -sS http://localhost:8000/api/store/products/ | head -c 600; echo
curl -sS http://localhost:5173/api/store/products/ | head -c 600; echo
docker compose --env-file .env.docker exec backend python manage.py shell -c 'from store.models import Product; print([(p.id,p.name,p.is_active) for p in Product.objects.all()])'
```
The first and second product requests should show the same local API results. The Django ORM query includes inactive products; the public storefront typically shows only active products and homepage shows only featured products. CRM `GET /api/crm/products/` is staff-authenticated and may have different filtering/pagination. Check browser Network -> Request URL if records differ.

## Vercel production
Keep `VITE_API_BASE_URL=https://api.ghazatech.com` in Vercel settings. Do not commit `.env.local`. These changes do not update or synchronize the local and production PostgreSQL databases.
