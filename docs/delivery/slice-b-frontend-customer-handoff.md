# Slice B Frontend Customer Handoff

## Task

- Issue: `#13`
- Scope: customer catalog, product detail, cart mutation, checkout slot selection, and order history flow
- Parent block: `#11`
- Figma frames used:
  - customer root flow: `https://www.figma.com/design/VrpRnba18dTC80u5XfRfXh/Expressa-Customer?node-id=1-3`
  - order history clarification: `https://www.figma.com/design/VrpRnba18dTC80u5XfRfXh/Expressa-Customer?node-id=12-4`

## Repository Outputs

- New frontend app scaffold in `frontend/` using Vue 3, Vuetify, Vite, and Vitest
- Customer screens in `frontend/src/components/`
- Customer flow state and API integration in `frontend/src/composables/useCustomerApp.js` and `frontend/src/lib/api.js`
- Frontend verification in `frontend/src/__tests__/customer-app.spec.js`
- Screenshot evidence in:
  - `docs/delivery/slice-b-customer-catalog.png`
  - `docs/delivery/slice-b-customer-detail.png`
  - `docs/delivery/slice-b-customer-cart.png`
  - `docs/delivery/slice-b-customer-history.png`

## Runtime Notes

- Install frontend dependencies inside `frontend/` with `npm install`.
- Default frontend API mode is relative-path requests. Leave `VITE_API_BASE_URL` blank to use same-origin or the Vite proxy.
- Local dev server runs on `127.0.0.1:4173`.
- Local proxy targets:
  - `/customer`
  - `/backoffice`
  - `/admin`
  - `/healthz`
- Local manual verification was run with the backend listening on `http://127.0.0.1:80`.
- Customer identity is supplied through `x-telegram-id`, defaulting to `3001` unless overridden by `VITE_CUSTOMER_TELEGRAM_ID`.

## Verification

- Automated:
  - `npm test`
  - `npm run build`
- Manual:
  - opened catalog from the mapped root frame
  - opened a category and a product detail screen
  - added a configured item to the cart
  - changed cart quantity through the Slice B mutation contract
  - opened slot selection, submitted an order, and confirmed redirect to order history

## Visual Checklist

- Platform: pass. Rendered and checked in a mobile-width viewport matching the mapped customer frames.
- Background and accent color: pass. Implemented with `#1847e8` background and `#ff5500` accent from the Figma frames.
- Font family: pass. `Nunito` is loaded in `frontend/src/styles/main.css` and used as the customer UI typeface.
- Layout direction: pass. Screens use the Figma mobile column layout with a centered `393px` shell and bottom action bar.

## Downstream Notes

- `#15` can package the frontend as a separate runtime unit from `frontend/`.
- `#16` can reuse the screenshot evidence paths above and the local flow sequence documented here.
- No additional frontend blocker remains for the customer flow scope of `#13`.
