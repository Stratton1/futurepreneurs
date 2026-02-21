# Futurepreneurs

A crowdfunding platform for under-18s to raise money and start their small business ideas. Students create projects, teachers verify them, parents give consent, and the public backs them — all with milestone-based fund management and safety built in.

**Live:** https://futurepreneurs-sigma.vercel.app/

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS + TypeScript
- **Database & Auth:** Supabase (PostgreSQL, Auth, Storage)
- **Payments:** Stripe (Checkout, Apple Pay, Google Pay)
- **Email:** Resend (transactional notifications)
- **Hosting:** Vercel (auto-deploy from main)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and Stripe keys (see below)

# 3. Run the development server
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Create `.env.local` with:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (optional — emails skip if missing)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
PLATFORM_FEE_PERCENTAGE=2.5
```

## Database Setup

1. Create a Supabase project at https://supabase.com
2. Apply migrations in order via Supabase Dashboard > SQL Editor:
   - `supabase/migrations/001_initial_schema.sql` through `006_user_badges.sql` (core platform)
   - `007_learning_progress.sql` through `012_group_projects.sql` (Epics 2 & 3, if deploying those features)
3. Seed test accounts: `npx tsx scripts/seed-test-accounts.ts`

All test accounts use password: `TestPass123!`

## Deployment

Push to `main` — Vercel auto-deploys. Ensure all environment variables are set in Vercel dashboard.

For production seeding, see the "Production setup" section in [roadmap.md](roadmap.md).

## Project Structure

```
src/
  app/           Next.js pages and API routes
    (public)/    Public pages (home, browse, project pages, learn)
    (auth)/      Login, signup
    dashboard/   Role-based dashboards
    admin/       Admin area
    api/         API routes (checkout, webhooks, etc.)
  components/    Reusable UI and feature components
  lib/           Utilities, Supabase/Stripe helpers, queries
  types/         TypeScript type definitions
supabase/
  migrations/    Database migrations (apply in order)
```

## Key Documentation

- [CLAUDE.md](CLAUDE.md) — Full project specification, product scope, and technical decisions
- [roadmap.md](roadmap.md) — Build progress, feature status, and future plans
- [rules.md](rules.md) — Hard rules for safety, access control, and engineering
