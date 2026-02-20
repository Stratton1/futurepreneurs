# Project Memory — Futurepreneurs

**Purpose:** Quick-reference file for key decisions, patterns, and context that should persist across sessions.

**Last Updated:** 2026-02-20 (Phase 6 & 7 complete)

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

- Next.js 14+ (App Router) + Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage)
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

## Key Architecture Patterns (Phase 2)

- Server actions in `src/app/dashboard/projects/actions.ts` handle all project CRUD + verification + consent
- Query functions in `src/lib/queries/projects.ts` for reusable database reads
- Status helpers in `src/lib/project-status.ts` for status-based logic
- Project creation uses a 6-step client-side wizard (single page with step state)
- Notifications created in server actions (stored in notifications table)
- Teacher list fetched via API route `/api/teachers` (needed for client component)

## Key Architecture Patterns (Phase 3)

- Public project queries in `src/lib/queries/public-projects.ts` with filtering, sorting, pagination
- Browse page at `/projects` with URL-based search params for category, sort, search, pagination
- Project detail page at `/projects/[id]` with dynamic OG metadata via `generateMetadata()`
- Share buttons component for Twitter, Facebook, WhatsApp, copy link
- Image gallery with carousel navigation and thumbnails
- Accordion component for FAQ page
- All public pages are server components; interactive elements (search, filters, gallery, accordion, share) are client components

## Key Architecture Patterns (Phase 4)

- Checkout: POST /api/checkout creates pending backing + Stripe Checkout Session; redirect to sessionUrl. Webhook handles checkout.session.completed (backing → held, project totals updated; if goal met → project funded, backings → collected), charge.refunded, payment_intent.payment_failed.
- Back-project form: client component with native dialog; amount presets + custom, name, email, anonymous; optional currentUser for prefilling and backerId. Platform fee 2.5% copy in form; fee applied at disbursement (Phase 5).
- Success page: /projects/[id]/back/success with session_id; thank-you or error message, link back to project.

## Key Architecture Patterns (Phase 5)

- Drawdowns: student creates request (project funded, milestone has remaining); teacher approves/rejects via /dashboard/drawdowns. Parent sees read-only list on same route. RLS on drawdown_requests; server actions use admin client and enforce role/ownership.
- Queries: getDrawdownRequestsByProject, getPendingDrawdownsForTeacher, getDrawdownsForParent; getMilestoneRemaining / getApprovedAmountForMilestone for eligibility.
- Milestone status: pending → approved (first approved drawdown) → disbursed (when approved sum ≥ milestone amount). stripe_transfer_id reserved for Epic 4.

## Key Architecture Patterns (Phase 6)

- Notifications: getNotificationsForUser, markNotificationRead, markAllNotificationsRead in `src/lib/queries/notifications.ts`. Notification centre at /dashboard/notifications; Notifications card on dashboard home for all roles.
- Backings: getBackingsForUser in `src/lib/queries/backings.ts`; RLS allows SELECT where backer_id = auth.uid(). Investor “Backed projects” at /dashboard/backed.
- Admin: /admin layout checks role === 'admin' else redirect. Overview (counts), Users, Projects, Reports pages; all use createAdminClient() for RLS bypass.
- Resend: sendNotificationEmail(userId, subject, html) in `src/lib/email/resend.ts`; called after each in-app notification in project and drawdown actions. No send if RESEND_API_KEY missing.

## Key Architecture Patterns (Phase 7)

- Reports: RLS allows INSERT where reporter_id = auth.uid(). createReport(projectId, reason, details) in project page actions; Report project UI (modal) for logged-in users on public project page.
- Admin moderation: resolveReport, dismissReport, removeProject in `src/app/admin/reports/actions.ts`; Remove project sets status to cancelled and notifies student.

## Key Architecture Patterns (Epic 1)

- **Avatars:** user_profiles.avatar_config (JSONB): hairStyle, hairColor, skinTone, accessories. AvatarDisplay renders from config, else avatar_url, else initial. AvatarBuilder on profile for students; updateAvatarConfig action.
- **Display handles:** user_profiles.display_handle (unique). generateDisplayHandle() in safe-username.ts; assign on first profile load for students; regenerate in DisplayHandleSection. Public project card/detail and StudentProfileCard use display_handle for student name.
- **Badges:** user_badges (user_id, badge_type, project_id). awardFirstProject (on first project), awardFullyFunded (webhook when goal met), awardMilestoneMaster (first drawdown approved). getBadgesForUser for Trophy Room. RLS: users SELECT own badges; inserts via admin client.

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
- **Phase 2: Project Creation & Verification** — COMPLETE (deployed)
- **Phase 3: Public Discovery & Project Pages** — COMPLETE (deployed)
- **Phase 4: Payments & Funding** — COMPLETE (back form, Stripe Checkout, success page, guest checkout, Apple/Google Pay)
- **Phase 5: Milestone Drawdowns** — COMPLETE (request, approve/reject, parent view, audit trail, disbursement recorded)
- **Phase 6: Dashboards & Notifications** — COMPLETE (notification centre, backed page, admin dashboard, Resend email)
- **Phase 7: Trust, Safety & Polish** — COMPLETE (report project, admin moderation, RLS reports/backings, polish, docs)
- **Epic 1: Safe Identity & Gamification** — COMPLETE (zero-PII avatars, safe usernames, Trophy Room)
- **Next:** Epic 2 (Educational Hub) or launch prep

## Deployment

- **Live URL:** https://futurepreneurs-sigma.vercel.app/
- **GitHub:** https://github.com/Stratton1/futurepreneurs
- **Vercel team:** team_ZI5YAx1Srbvg1a3Ggm329fOD

## Blockers / Open Questions

- None currently — Stripe and Resend (Phase 6) integrated; optional RESEND_FROM in .env for production sender
