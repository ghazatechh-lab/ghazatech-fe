# GhazaTech customer storefront refinement

This update was applied against `ghazatech-crm-enterprise-refinement-20261123.zip` and retains the existing `frontend/` project layout. The `/crm` route, AdminCRM source, CRMSidebar, CRM theme files, backend, authentication endpoints, and database code are not edited.

## Included
- Shared accessible customer toast system with success/error/warning/info/loading presentation, duplicate suppression, auto-dismiss and close controls.
- Shared customer confirmation dialog with escape/focus handling; cart-clear confirmation.
- Cart stock quantity ceilings, duplicate checkout prevention, successful-order notifications, error feedback, and item-removal messaging.
- Customer login success, registration, password reset, profile save and logout notifications.
- Repair, support and warranty operation feedback, shown only after API response.
- Customer-only scoped visual improvements and reduced-motion support.
- Product card refinement, correct image error reset, removal of unverified product `TESTED` badge.
- Storefront-only Lenis initialization, reduced-motion guard.
- Removes nonfunctional wishlist shortcut and hardcoded homepage brands, now fetching brand list from `/api/store/brands/`.
- Removes a fabricated inventory-count marketing claim.

## Not verified here
- Package dependency installation stalled in the execution environment. No claim of a passing TypeScript typecheck, lint, Vite production build, browser functional test, or API integration test is made.
- TypeScript/TSX parser syntax diagnostics across `src/` passed (zero syntax diagnostics), and ZIP integrity was tested.
- Existing checkout delivery and VAT presentation were preserved. Confirm these match backend totals before production release.
- Complete multi-viewport visual and end-to-end tests, additional frontend form polish, and all potential outstanding issues require local testing.

## Local installation
Unzip from `/mnt/d/Myworks/GhazaTech/ghazatech-main` so changes merge into `frontend/`.

```sh
cd /mnt/d/Myworks/GhazaTech/ghazatech-main/frontend
npm ci
npm run typecheck
npm run lint
npm run build
npm run dev -- --config vite.config.ts
```

Local `.env.local`: `VITE_API_BASE_URL=http://127.0.0.1:8000` and `VITE_BACKEND_URL=http://127.0.0.1:8000`; make sure local Docker backend is running. Vercel Production should have `VITE_API_BASE_URL=https://api.ghazatech.com`. Do not commit `.env.local`.

## Suggested verification
- Customer login, registration, email verification, password reset.
- Homepage category/brand/product data matches Django, working search/filter.
- Add/remove/quantity/cart clear confirmation; stock ceiling; checkout success/failure and preserved cart on failure.
- Customer profile save and logout; repair request with reference; warranty lookup; support request.
- Image loading and failures, modal accessibility, mobile widths 320–430px, tablet 768px, large desktops, reduced motion.
