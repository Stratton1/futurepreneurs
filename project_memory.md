# Project Memory — Futurepreneurs

**Purpose:** Quick-reference file for key decisions, patterns, and context that should persist across sessions.

**Last Updated:** 2026-02-21

---

## Key Facts

- **Owner:** Joseph (non-technical, prefers plain English)
- **Platform:** Crowdfunding for under-18s to fund business ideas
- **Currency:** GBP (£) only, UK-focused
- **Max funding:** £10,000 per project
- **Funding model:** All-or-nothing, no time limit
- **Platform fee:** 2.5% on successfully funded projects
- **Drawdowns:** Milestone-based, teacher-approved

## User Roles

| Role | Key Capabilities |
|------|-----------------|
| Student | Creates projects, sets milestones, requests drawdowns. Must use school email. |
| Teacher/Mentor | Verifies students, approves projects and drawdowns. Trust anchor. |
| Parent | Gives consent, observes activity. Cannot approve/reject. |
| Investor/Backer | Browses and funds projects. Can use guest checkout. |
| Admin | Manages platform, moderates content, views all data. |

## Tech Stack

- Next.js 16.1.6 (App Router) + Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage) — project ID: `fclidhnncjdhrinazkqn`
- Stripe (Payments, Connect for disbursements)
- Resend (Transactional email)
- Vercel (Hosting)
- TypeScript strict mode

## Important Patterns & Conventions

- File names: `kebab-case`
- Components: `PascalCase`
- DB tables: `snake_case`
- Env vars: `UPPER_SNAKE_CASE`
- Commit style: `type: short description`

## Critical Pattern: Admin Client for Cross-User Operations

**Problem:** RLS policies on `user_profiles` only allow `SELECT` where `auth.uid() = id`. Tables like `parental_consents` and `notifications` have no INSERT policies. This means server actions that create records for OTHER users (e.g. teacher creating a consent record for a parent, or inserting a notification for a student) fail silently.

**Solution:** `createAdminClient()` in `src/lib/supabase/server.ts` uses the service role key to bypass RLS. Use it in any server action that reads/writes data for users other than the currently logged-in user. User identity is still verified via `getCurrentUser()` before using the admin client.

**Where it's used:**
- `src/app/dashboard/projects/actions.ts` — approveProject, submitForVerification, giveConsent, declineConsent, requestChanges, rejectProject
- `src/app/dashboard/profile/actions.ts` — linkParent, linkChild, unlinkParent
- `src/app/dashboard/profile/page.tsx` — reading parent/child/student profiles
- `src/lib/queries/projects.ts` — getProjectsPendingConsent, getProjectsPendingVerification (with `useAdmin` flag), getTeachersAtSchool
- Admin dashboard pages

## School Email Validation

- Students MUST sign up with a school-issued email (e.g., `.sch.uk`, `.ac.uk`, or domain matched to a registered school)
- The `schools` table stores approved school email domains
- Validation happens at sign-up time

## Safety Non-Negotiables

1. School email validation for all students
2. Teacher must verify every project before it goes live
3. Parent must consent before project goes live
4. Milestone-based drawdowns only (no lump sums)
5. Teacher approves every drawdown request
6. Full audit trail on all financial actions
7. Content moderation tools for admin
8. GDPR-aware — extra care with minors' data

## Project Status Flow

```
draft → pending_verification → pending_consent → live → funded → completed
         ↑ (changes requested)    ↑ (declined)
              → draft                  → draft
```

## Key Architecture Patterns (Phases 1-7 + Epic 1)

- **Phase 2:** Server actions in `actions.ts` for project CRUD + verification + consent. Query functions in `queries/projects.ts`. 6-step creation wizard.
- **Phase 3:** Public queries in `queries/public-projects.ts`. Browse at `/projects` with URL params. OG metadata via `generateMetadata()`.
- **Phase 4:** Stripe Checkout via `/api/checkout`. Webhook at `/api/webhooks/stripe`. All-or-nothing logic. Guest checkout. Amounts in pence.
- **Phase 5:** Drawdown request/approval flow. Admin client for cross-user RLS. Milestone status tracking.
- **Phase 6:** Notification centre + email via Resend. Admin dashboard with `createAdminClient()`. Investor backed page.
- **Phase 7:** Report system + admin moderation. Content flagging.
- **Epic 1:** Avatar builder (JSONB config), safe display handles, Trophy Room badges.

## Key Architecture Patterns (Epic 2 — Educational Hub)

- **Learning content:** 4 modules (Business Plan, Pitch Writing, Marketing, Managing Money), 22 lessons total, defined in `src/lib/learning-modules.ts`
- **Public pages:** `/learn`, `/learn/[moduleId]`, `/learn/[moduleId]/[lessonId]` — browse, read, take quizzes
- **Student dashboard:** `/dashboard/learning` — track progress, completion badges
- **Database:** `learning_progress` table (migration 007), RLS per-user
- **Queries:** `src/lib/queries/learning.ts` — progress tracking, completion counts
- **Components:** LearningModuleCard, LessonProgressBar, QuizQuestion, GuidedTip

## Key Architecture Patterns (Epic 3 — Campaign Management)

- **Pitch Builder:** AI-assisted (Hugging Face Llama) 5-question wizard → generates pitch. `src/lib/ai/pitch-builder.ts`, migration 011 (`pitch_drafts`, `ai_generation_log`). PII scrubbing via `src/lib/ai/content-moderation.ts`.
- **Logo Builder:** Template-based SVG (8 shapes, 10 colours, 20+ icons). `src/app/dashboard/projects/[id]/logo/`. Migration 010 (`logo_config` JSONB on projects). Teacher approval flow.
- **Reward Tiers:** Student creates, teacher approves. Migration 009 (`reward_tiers` table + `reward_tier_id` on backings). Queries in `src/lib/queries/reward-tiers.ts`.
- **Micro-Goals:** Auto-generated at 25/50/75/100% of goal. Migration 008. Visual progress tracker.
- **Team/Collaborators:** `project_collaborators` table, invitation flow. Migration 012. `project_type` (individual/group) on projects.
- **Video Embed:** YouTube/Vimeo with privacy mode. VideoEmbed component.

## Stripe Integration (Phase 4)

- **Stripe account:** Created (test mode)
- **Publishable key:** configured in .env.local and Vercel
- **Secret key:** configured in .env.local and Vercel
- **Webhook secret:** configured in .env.local and Vercel
- **Webhook endpoint:** `https://futurepreneurs-sigma.vercel.app/api/webhooks/stripe`
- **Webhook events:** payment_intent.succeeded, payment_intent.payment_failed, charge.refunded
- **Currency:** All amounts in pence (£10 = 1000). Stripe uses smallest currency unit.
- **Test card:** 4242 4242 4242 4242, any future expiry, any CVC

## Current Phase

- **Phase 1: Foundation & Auth** — COMPLETE (deployed)
- **Phase 2: Project Creation & Verification** — COMPLETE (deployed, RLS fixes applied)
- **Phase 3: Public Discovery & Project Pages** — COMPLETE (deployed)
- **Phase 4: Payments & Funding** — COMPLETE (deployed)
- **Phase 5: Milestone Drawdowns** — COMPLETE (deployed)
- **Phase 6: Dashboards & Notifications** — COMPLETE (deployed)
- **Phase 7: Trust, Safety & Polish** — COMPLETE (deployed)
- **Epic 1: Safe Identity & Gamification** — COMPLETE (deployed)
- **Epic 2: Educational Hub** — BUILT (~95%), NOT YET COMMITTED/DEPLOYED. Migrations 007 not applied.
- **Epic 3: Campaign Management** — BUILT (~82%), NOT YET COMMITTED/DEPLOYED. Migrations 008-012 not applied.
- **Epic 5: Oversight (partial)** — Logo/reward approval in verification pages. ~80% built, uncommitted.
- **Next:** Commit & deploy Epics 2/3, apply migrations, test, then Epic 4 (Wallet/Card) or launch prep.

## Deployment

- **Live URL:** https://futurepreneurs-sigma.vercel.app/
- **GitHub:** https://github.com/Stratton1/futurepreneurs
- **Vercel team:** team_ZI5YAx1Srbvg1a3Ggm329fOD
- **Vercel project:** prj_IlqjKk10FzEFDB9C8oJz2AceJmll

## Database

- **Supabase project:** fclidhnncjdhrinazkqn (new — migrated from anoqfecrfawwreanibnf)
- **Committed migrations:** 001-006 (applied to production)
- **Uncommitted migrations:** 007-012 (built, need to be committed and applied)
- **Test accounts:** Seeded via `scripts/seed-test-accounts.ts` (password: TestPass123!)

## Blockers / Open Questions

- Migrations 007-012 need to be applied to the Supabase database before Epic 2/3 features can work on production
- Epic 3 collaborator invitation email notifications not yet integrated with Resend
- Group project creation UI may need polish
- Reward tier max_claims enforcement in checkout needs testing
