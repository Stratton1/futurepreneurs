# Build Log — Futurepreneurs

**Purpose:** Chronological record of everything built, changed, or decided during development.

**Last Updated:** 2026-02-19

---

## 2026-02-19 — Project Kickoff

### What happened
- Completed discovery interview with Joseph
- Created CLAUDE.md (full project spec and standards)
- Created project_memory.md, build_log.md, rules.md
- Agreed on 7-phase delivery plan
- Joseph approved Phase 1 start

### Decisions made
- Stack: Next.js + Supabase + Stripe + Resend + Vercel
- Funding model: All-or-nothing, no time limit, max £10,000
- Platform fee: 2.5% on successful projects
- Drawdowns: Milestone-based, teacher-approved
- Currency: GBP only, UK-focused
- Design: Bright, youthful, mobile-first

### Files created
- `CLAUDE.md`
- `project_memory.md`
- `build_log.md`
- `rules.md`

### Next steps
- Scaffold Next.js project
- Set up database schema
- Build auth system with role-based sign-up
- Create basic app shell (nav, footer, layout)

---

## Phase 1 — Foundation & Auth

### Entry: Phase 1 Complete
- **Status:** Complete
- **Goal:** Users can sign up with correct role, students must use school emails, app shell running

### What was built
1. **Project scaffolding** — Next.js 16 + Tailwind CSS + TypeScript (strict mode)
2. **Database schema** — Full SQL migration with all tables, enums, indexes, RLS policies, triggers, and seed data (5 sample schools)
3. **TypeScript types** — Complete type definitions for all database entities
4. **Supabase integration** — Client (browser), server, and middleware helpers for auth
5. **Authentication system:**
   - Server actions for sign-up, sign-in, sign-out
   - Role selection (student, teacher, parent, investor)
   - School email validation for students (checks against registered school domains)
   - Password strength validation
   - Email verification flow with callback handler
6. **Middleware** — Route protection for /dashboard and /admin (redirects to login if not authenticated)
7. **App shell:**
   - Responsive navbar with logo, navigation links, mobile hamburger menu
   - Footer with platform, support, and legal links
   - Root layout with metadata
8. **Homepage** — Hero section, "How it Works" 4-step guide, trust/safety section, CTA section
9. **Sign-up page** — 2-step flow: choose role → fill details, with school email hint for students
10. **Login page** — Email/password with error handling
11. **Dashboard page** — Shows user profile info, role, verification status, member since date
12. **UI components** — Button, Input, Select, Alert (all with proper styling and accessibility)
13. **Constants & validation** — Centralised app constants, email/password/name validators

### Files created (22 source files)
- `src/app/page.tsx` — Homepage
- `src/app/layout.tsx` — Root layout with nav + footer
- `src/app/(auth)/actions.ts` — Auth server actions
- `src/app/(auth)/signup/page.tsx` — Sign-up page
- `src/app/(auth)/login/page.tsx` — Login page
- `src/app/(auth)/auth/callback/route.ts` — Email verification callback
- `src/app/dashboard/page.tsx` — Dashboard (placeholder)
- `src/components/ui/button.tsx` — Button component
- `src/components/ui/input.tsx` — Input component
- `src/components/ui/select.tsx` — Select component
- `src/components/ui/alert.tsx` — Alert component
- `src/components/features/navbar.tsx` — Navigation bar
- `src/components/features/footer.tsx` — Footer
- `src/lib/constants.ts` — App constants
- `src/lib/validations.ts` — Input validation helpers
- `src/lib/supabase/client.ts` — Browser Supabase client
- `src/lib/supabase/server.ts` — Server Supabase client
- `src/lib/supabase/middleware.ts` — Auth middleware helper
- `src/lib/supabase/auth-helpers.ts` — Auth utility functions
- `src/types/database.ts` — TypeScript type definitions
- `middleware.ts` — Next.js middleware (route protection)
- `supabase/migrations/001_initial_schema.sql` — Database schema
- `.env.example` — Environment variable template
- `.env.local` — Local env vars (placeholder values)

### Verification
- TypeScript compilation: **PASS** (zero errors)
- All files present and correctly structured
