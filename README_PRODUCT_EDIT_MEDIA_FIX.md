# GhazaTech: CRM product edit + images

- CRM Products table now has a visible **Edit product** button. It fetches the current product detail from `/api/crm/products/{id}/` and opens the existing product editor, which sends multipart `PATCH` on save.
- Existing product image URL displays when accessible, and failed thumbnails show a neutral fallback. When an image is missing, the editor prompts for a new upload.
- `ProductCard` falls back to the existing placeholder visual on a broken image URL.
- No storefront styling, routing, or database models were changed.
- Server side media setup is documented in `../server-media/README_VPS_MEDIA.md`; a 404 indicates missing file or missing media server, not a React URL change.
- Run `npm install && npm run build` before deploying; configure `VITE_API_BASE_URL=https://api.ghazatech.com` in Vercel.
