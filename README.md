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
   - `VITE_GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Run:
   - `npm run dev`

## Build and test
- Build: `npm run build`
- Unit/integration tests: `npm run test:run`

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
  - `VITE_GEMINI_API_KEY`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Server-only:
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `PAYMENT_WEBHOOK_SECRET`

## API endpoints (serverless)
- `POST /api/admin/export-analytics`
- `POST /api/payments/create-intent`
- `POST /api/webhooks/payments`

## Notes
- Supabase auth fallback mode is used when env keys are missing.
- Frontend data service falls back to local constants when Supabase tables are unavailable.
