# AfriGlam Frontend + Backend Scaffold

This repository is a Vite React storefront/admin app prepared for:
- Vercel hosting (SPA + serverless endpoints in `api/`)
- Supabase (Auth + Postgres + RLS policies in `supabase/migrations/`)

## Prerequisites
- Node.js 20+
- A Supabase project
- A Vercel project connected to this repository

## Local setup
1. Install dependencies:
   - `npm install`
2. Copy env template:
   - duplicate `.env.example` to `.env.local`
3. Set values in `.env.local`:
   - Client-safe:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_GEMINI_API_KEY` (optional)
   - Server-only:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `APP_ORIGIN`
     - `PAYMENT_WEBHOOK_SECRET`
     - `PAYSTACK_SECRET_KEY`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_WEBHOOK_SECRET`
4. Run:
   - `npm run dev`

## Build and test
- Build: `npm run build`
- Unit/integration tests: `npm run test:run`
- Browser smoke (demo mode, uses local Edge/Chrome channel by default): `npm run smoke`
  - Uses Playwright `webServer` to start `npm run dev -- --host --port 4173`
  - If you prefer bundled Chromium instead of a system browser, run `npx playwright install chromium` once.

## Supabase setup
Apply migrations in order:
- `supabase/migrations/001_init_schema.sql`
- `supabase/migrations/002_rls_policies.sql`
- optional seed data: `supabase/seed.sql`

## Vercel deployment
This project includes `vercel.json` with:
- Vite build command/output
- SPA rewrite to `index.html`
- static asset cache headers

Set env vars in Vercel:
- Client-safe:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_GEMINI_API_KEY` (optional)
- Server-only:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `APP_ORIGIN`
  - `PAYMENT_WEBHOOK_SECRET`
  - `PAYSTACK_SECRET_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`

## API endpoints (serverless)
- `POST /api/admin/export-analytics`
- `POST /api/payments/create-intent`
- `POST /api/webhooks/payments`

## Notes
- Production builds fail fast when required client env vars are missing.
- Checkout totals are computed on the server from the product catalog instead of client-sent prices.
- Non-production environments can still run in a limited demo mode when browser Supabase config is absent.
