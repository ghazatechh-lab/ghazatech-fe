# GhazaTech CRM — Products list refresh

The Products listing now shows six essential columns: Product (thumbnail, name, SKU), Category / Brand, Price, Stock, Status, and Actions.

- Product name and **Edit** open the existing product editor and fetch the latest details from the Django CRM API.
- The stock icon opens the existing stock-adjustment dialog.
- Product name, price, and stock headers are sortable.
- Part number, variant count, and record ID no longer take up their own columns; they remain available in the editor/API.
- Other CRM lists and existing storefront styles are unchanged.
- The table scrolls horizontally on smaller screens rather than compressing labels.

## Install

Extract the ZIP from `/mnt/d/Myworks/GhazaTech/ghazatech-main/`, so `frontend/` merges with your current frontend. This ZIP contains no backend files.

```
cd /mnt/d/Myworks/GhazaTech/ghazatech-main/frontend
npm install
npm run build
npm run dev
```

For the local Docker API, set `VITE_API_BASE_URL=http://localhost:8000` in `.env.local`.

Images: if an image displays as unavailable, inspect the image URL returned by the Django API and the corresponding file in the Docker media volume. This layout-only update does not alter existing image paths.
