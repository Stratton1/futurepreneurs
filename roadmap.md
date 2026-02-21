# Roadmap — Futurepreneurs

**Last Updated:** 2026-02-21
**Live URL:** https://futurepreneurs-sigma.vercel.app/
**GitHub:** https://github.com/Stratton1/futurepreneurs
**Supabase:** https://fclidhnncjdhrinazkqn.supabase.co

**Platform:** Youth-centric crowdfunding for ages 11–17
**Compliance:** COPPA & GDPR-K compliant by design

---

## Status Key

- DONE = completed and deployed
- BUILT = code written and builds, not yet committed/deployed
- IN PROGRESS = currently being built
- NEXT = approved to start
- PLANNED = scoped but not yet started
- FUTURE = post-MVP, not yet scoped in detail

---

## Production setup (migrations and seeding)

**Migrations:** Apply all Supabase migrations to your **production** Supabase project so the schema matches the app. Run them in order via Supabase Dashboard → SQL Editor, or `supabase db push` if using linked project.

- **Committed (001–006):** initial schema, drawdown RLS, reports/backings RLS, avatar_config, display_handle, user_badges. Apply these for the deployed MVP.
- **Built but uncommitted (007–013):** learning_progress, micro_goals, reward_tiers, project_logos, pitch_drafts, group_projects, task_progress. Apply these before deploying Epics 2 & 3.

If migrations are missing, the app may show empty project lists or layout errors.

**Seeding production:** To show sample projects on the live site, either:

1. **Seed API** — Set `ALLOW_SEED=true` in your Vercel environment (or use a one-off secret). Then send a single `POST` request to `https://<your-app>/api/admin/seed` (e.g. with curl or from a secure script). This creates sample schools, users, and projects. Remove or set `ALLOW_SEED=false` after seeding.
2. **Manual** — Create schools, user profiles, and projects directly in the Supabase Dashboard (Table Editor) or by running your own SQL against the production database.

The public Browse Projects page and homepage use the **service-role** client to read live projects, so once migrations are applied and data exists, projects will appear without further RLS changes.

---

## Part 1: MVP (v1) — Full Platform Build

### Phase 1 — Foundation & Auth (DONE)

- [x] Project scaffolding (Next.js, Tailwind, Supabase, folder structure)
- [x] Database schema and initial migration
- [x] Authentication: sign-up, login, email verification
- [x] Role-based accounts (student, teacher, parent, investor, admin)
- [x] School email validation for students
- [x] Basic layout shell (nav, footer, responsive container)
- [x] Seed schools for testing

### Phase 2 — Project Creation & Verification (DONE)

- [x] Project creation form (title, description, images, goal, category, milestones)
- [x] Student selects teacher/mentor
- [x] Teacher verification/approval flow
- [x] Parental consent flow (auto-create from student's linked parent)
- [x] Project status management (draft → pending → live)
- [x] RLS fix: admin client (`createAdminClient`) for cross-user operations (notifications, consent records, profile lookups)
- [x] Profile page with family relationship management (link parent/child)

### Phase 3 — Public Discovery & Project Pages (DONE)

- [x] Homepage with featured/recent projects
- [x] Browse by category with search and filter
- [x] Individual project pages (description, progress, milestones, backer count)
- [x] How It Works, About, FAQ, Contact pages
- [x] Animated, polished design with custom typography (Outfit)

### Phase 4 — Payments & Funding (DONE)

- [x] Stripe account setup (test mode keys, webhook configured)
- [x] Stripe integration (card, Apple Pay, Google Pay)
- [x] Backing/donation flow
- [x] All-or-nothing logic (funds held until goal reached)
- [x] Real-time funding progress updates
- [x] Guest checkout (back without an account)
- [x] Platform fee (2.5%) applied on successful projects

### Phase 5 — Milestone Drawdowns (DONE)

- [x] Drawdown request flow (student requests against a milestone)
- [x] Teacher/mentor approval flow
- [x] Parent visibility of drawdown activity
- [x] Audit trail for all drawdown actions
- [x] Fund disbursement via Stripe

### Phase 6 — Dashboards & Notifications (DONE)

- [x] Student dashboard
- [x] Teacher dashboard
- [x] Parent dashboard
- [x] Investor/backer dashboard (including “Backed projects” page)
- [x] Admin dashboard (overview, users, projects, reports)
- [x] Email notifications for key events (Resend)
- [x] On-platform notification centre

### Phase 7 — Trust, Safety & Polish (DONE)

- [x] Content moderation tools (resolve/dismiss reports, remove project)
- [x] Reporting system (Report project UI + createReport action)
- [x] Terms of service and privacy policy pages
- [x] Contact/support page
- [x] Social sharing
- [x] Mobile responsiveness polish
- [x] Performance and accessibility audit

---

## Part 2: Post-MVP Roadmap

### Epic 1: Safe Identity & Gamification (DONE)

- [x] **Zero-PII Avatars** — Avatar builder (hairstyles, colours, accessories); AvatarDisplay from config/URL/initial; profile integration; StudentProfileCard and public queries use avatar_config.
- [x] **Safe Usernames** — Auto-generated display handles (e.g. BrightSpark42); assign on first profile load for students; regenerate in profile; public project card and detail use display_handle.
- [x] **Trophy Room** — Badges: First Project, Fully Funded, Milestone Master; user_badges table; award on project create, webhook funded, drawdown approval; /dashboard/trophy-room page; backfill script.

### Epic 2: Educational Hub & Onboarding (BUILT — needs commit, migrations 007 + 013, deploy)

- [x] **Learning Platform (Expanded)** — Comprehensive "Founder's Bootcamp" with **7 modules, 29 lessons, 145+ quiz questions, 60+ practical tasks**. Based on JA/DECA educational frameworks, targeting ages 14–18.
  - Module 1: The Entrepreneurial Mindset (3 lessons) — growth mindset, design thinking, needs vs wants
  - Module 2: The Blueprint (7 lessons) — Lean Canvas, MVP, revenue models, school-based enterprise, market research, goal setting
  - Module 3: Crafting the Perfect Pitch (5 lessons) — pitch anatomy, storytelling, financials, video, safe branding
  - Module 4: Budgeting & Financial Literacy (3 lessons) — materials budgets, micro-goals, stretch goals & rewards
  - Module 5: Launch & Marketing (5 lessons) — inner circle, social media, visuals, sponsorships, engagement updates
  - Module 6: Managing Your Business (3 lessons) — dashboard navigation, dual-approval system, gratitude & impact
  - Module 7: Resource Library & Toolkits (3 resource pages) — student, parent, and educator resources with downloadable templates
- [x] **Multi-Question Quiz System** — QuizSection component that steps through 5+ questions per lesson with progress bar, per-question feedback, and final summary with score. Scores saved to database.
- [x] **Task Checklist System** — LessonTask types (reflection, research, exercise, download) with coloured cards, checkbox toggling, download buttons. Database: `task_progress` table (migration 013).
- [x] **Learning Progress Page** — `/dashboard/learning/progress` with per-module progress bars, average quiz scores, and overall completion stats.
- [x] **Module Architecture** — Split from monolithic 986-line file into 7 per-module files under `src/lib/learning/modules/` with re-export shim for backward compatibility.
- [x] **Downloadable Resources** — Placeholder PDFs in `/public/resources/` (Lean Canvas, Video Storyboard, Budget Template, Pitch Script Outline).
- [x] **Public Learn Page Updated** — Shows all 7 modules with icons, lesson counts, and correct colour coding.
- [x] **Guided Setup Flows** — GuidedTip component with "Why?" explanations linked from project creation steps. "First time? Start here" entry point from student dashboard linking to /learn.
- [x] **Components** — LearningModuleCard, LessonProgressBar, QuizSection, QuizQuestion, TaskChecklist, GuidedTip.

### Epic 2b: Dashboard Polish & Fixes (BUILT — needs commit, deploy)

- [x] **Student Dashboard Redesign** — Gradient hero banner with time-of-day greeting, avatar display, display handle, and role badge. Animated stats row (Projects, Learning %, Badges, Total Raised) with staggered AnimateIn. Colorful quick action cards with distinct gradients per card, hover effects, and arrow indicators. Learning progress mini-widget with "Continue" CTA pointing to next incomplete lesson. Non-student roles keep their existing layout.
- [x] **Navbar Name Removal** — Removed user's full name from the navbar header bar (both desktop and mobile) for cleaner appearance and privacy.
- [x] **Profile Page Defensive Error Handling** — Added try-catch wrapping around school, parent, children, and mentored projects queries so individual section failures don't crash the whole page.

### Epic 3: Campaign Management & Teamwork (DONE — needs commit, migrations 008–012, deploy)

- [x] **AI Campaign Co-Pilot (Guided Pitch Builder)** — 5-question wizard (Problem, Solution, Audience, Funds, Uniqueness) with AI generation via Hugging Face (Meta-Llama). Student editing dashboard with apply-to-project flow. Automated PII scrubbing + content moderation (`src/lib/ai/content-moderation.ts`). Rate limiting (3 generations/24h). Migration 011 (`pitch_drafts`, `ai_generation_log`).
- [x] **Business Logo Creator** — Template-based SVG generator (8 shapes: circle, square, shield, hexagon, badge, banner, diamond, oval; 10 colour palettes; 20+ Lucide icons). Real-time preview. Teacher approval before public display. Migration 010 (`logo_config` JSONB on projects).
- [x] **Video Embed** — YouTube/Vimeo embed with privacy-enhanced mode. VideoEmbed component on project pages and teacher verification.
- [x] **Scaffolded Micro-Goals** — Auto-generated at 25/50/75/100% of funding goal. Visual progress tracker with celebration animations (confetti component). Migration 008 (`micro_goals` table).
- [x] **Safe Reward Tiers** — Students create tiers (title, description, min amount, max claims). Teacher approval required before public display. Reward selection UI for backers. Server-side max_claims enforcement in checkout API. Migration 009 (`reward_tiers` table + `reward_tier_id` on backings).
- [x] **Group / Club Fundraising Mode** — `project_type` (individual/group) and `group_name` columns on projects. Polished type selector with icons and descriptions on both create and edit pages. Review step shows project type. Migration 012 (`project_collaborators` table).
- [x] **Multi-User / One Project** — Invite collaborator form, team member list, pending invitations on dashboard. Accept/decline flow with RLS.
- [x] **Collaborator email notifications** — Invite, accept, and decline actions all send Resend email notifications to the relevant party.
- [x] **Reward tier max_claims enforcement** — Server-side validation in checkout API: checks approval status, minimum amount, and sold-out status before creating Stripe session.
- [x] **Group project creation UI polish** — Polished type selector with icons (User/Users), descriptions, info callouts, group name field with guidance, and edit page now supports switching project type.

### Epic 4: Youth-Centric Digital Wallet & Card System (BUILT — needs Stripe activation, migration 015, deploy)

> **Model:** Zero-Trust Spending — every transaction requires explicit approval from BOTH the student's Parent AND their verified Mentor before funds deploy. Fully COPPA and GDPR-K compliant. Custodial Account model where a verified adult holds legal liability, but the minor gets an empowering, educational dashboard.

#### 4.1 System Architecture & Tech Stack

- [x] **Database Schema** — Migration 015: 7 new tables (custodial_accounts, wallet_balances, issued_cards, spending_requests, approval_logs, vendor_allowlists, blocked_mcc_categories) with full RLS policies, indexes, triggers, and seed data for blocked MCCs.
- [x] **TypeScript Types** — Complete type definitions in `src/types/wallet.ts` for all wallet entities plus composite types for dashboard views.
- [x] **Stripe Connect (Custom Accounts)** — `src/lib/stripe/connect.ts` — Create Connected Accounts, generate onboarding links, check KYC status, create payouts.
- [x] **Stripe Treasury (Wallet)** — `src/lib/stripe/treasury.ts` — Create Financial Accounts, transfer funds, get balances, create outbound payments.
- [x] **Stripe Issuing (Virtual Cards)** — `src/lib/stripe/issuing.ts` — Create virtual cards (frozen by default), freeze/unfreeze, set spending controls, cancel cards.

#### 4.2 Custodial Onboarding Flow

- [x] **Parent Onboarding Wizard** — Step-by-step UI (`/dashboard/wallet/onboard`) with child selection, Stripe hosted KYC redirect, status checking, and completion confirmation.
- [x] **Onboarding Server Actions** — `initiateOnboarding()`, `checkOnboardingStatus()`, `refreshOnboardingLink()`, `updateSpendingLimits()` in `src/app/dashboard/wallet/actions.ts`.
- [x] **Onboarding API Routes** — `POST /api/wallet/onboard`, `GET /api/wallet/onboard/status` for KYC initiation and status checking.
- [x] **Stripe Connect Webhook** — `POST /api/webhooks/stripe-connect` handles `account.updated` events, updates KYC status, sends notifications to parent and student on verification completion or failure.

#### 4.3 Dual-Approval Spending Flow

- [x] **Spending Request Creation** — Student submits purchase request with vendor, amount, reason, optional milestone. Validates wallet balance, velocity limits, custodial account status. Notifies parent via platform + email.
- [x] **Parent Approval** — Parent reviews and approves/declines. On approval, funds held in wallet, request moves to `pending_mentor`, mentor notified.
- [x] **Mentor Approval** — Mentor reviews parent-approved requests. On approval, 1-hour cooling-off period starts, student notified.
- [x] **Decline & Reversal** — Either approver can decline with reason. Either can reverse during cooling-off period. Held funds returned to available balance.
- [x] **Full Audit Trail** — `approval_logs` table records every approval, decline, and reversal decision with timestamp and reason.

#### 4.4 Card Funding & Transaction Execution

- [x] **Execute Transaction** — `src/lib/wallet/execute-transaction.ts` orchestrates: unfreeze card → set 30-min window → notify student. Fallback path for no-card (payout to parent bank).
- [x] **Auto-Refreeze Cron** — `/api/cron/refreeze-cards` runs every 5 minutes, refreezes expired cards, returns unused funds to wallet.
- [x] **Fund Approved Requests** — Same cron funds approved requests past their cooling-off period.
- [x] **Stripe Issuing Webhook** — `/api/webhooks/stripe-issuing` handles real-time authorization decisions (MCC check, amount validation), tracks authorizations, marks transactions complete.
- [x] **Receipt Reminder Cron** — `/api/cron/receipt-reminders` runs daily, reminds students to upload receipts for purchases older than 24 hours.

#### 4.5 Spending Guardrails

- [x] **MCC Blocking** — `src/lib/wallet/mcc-validation.ts` checks against `blocked_mcc_categories` table (gambling, alcohol, tobacco, adult content, cash advances). Enforced at webhook authorization.
- [x] **Vendor Allowlists** — Per-project allowlists managed by teachers at `/dashboard/wallet/[projectId]/vendors`. If allowlist exists, only listed vendors permitted.
- [x] **Velocity Limits** — `src/lib/wallet/velocity-limits.ts` enforces daily (£50), weekly (£200), and per-transaction (£100) limits. Parent can adjust via dashboard.
- [x] **Cooling-Off Period** — 1-hour mandatory delay between dual approval and card funding. Either approver can reverse during this window.
- [x] **Receipt Upload** — Student uploads receipt after purchase. Cron sends reminders at 24h and 48h if missing.

#### 4.6 Platform Dashboards (Wallet Views)

- [x] **Student Wallet** — `/dashboard/wallet` — Balance overview (available, held), per-project balances, spending request list with status badges, "Request Purchase" CTA.
- [x] **Parent Financial Dashboard** — `/dashboard/wallet/parent` — Children overview with balances, approval queue with one-tap approve/decline, recent activity history.
- [x] **Mentor Financial Dashboard** — `/dashboard/wallet/mentor` — Pending approval queue (parent-approved requests only), recent activity with status.
- [x] **Admin Financial Dashboard** — `/admin/wallet` — Platform aggregates, KYC status overview, custodial accounts table, recent spending requests.
- [x] **Spending Request Form** — `/dashboard/wallet/request` — Student-friendly form with step-by-step explanation.
- [x] **Wallet Settings** — `/dashboard/wallet/settings` — Account status, virtual card display, spending limits, info about how the wallet works.
- [x] **Dashboard Integration** — Wallet quick-action cards added to student, parent, and teacher dashboard pages.

#### 4.7 Transition to Adulthood (Age 18+)

- [x] **DOB Encryption** — `src/lib/wallet/dob-encryption.ts` with AES-256-GCM encryption, age calculation, days-until-age utilities.
- [x] **Age Transition Cron** — `/api/cron/age-transition` runs daily, checks for 90-day warnings and 18th birthday transitions.
- [x] **Transition Notifications** — Student and parent both notified at 90 days before and on the day of transition.

#### 4.8 Integration & Infrastructure

- [x] **Drawdown → Wallet Integration** — When teacher approves a drawdown, funds automatically added to student's wallet balance if custodial account exists.
- [x] **Vercel Cron Configuration** — `vercel.json` configures 3 cron jobs (refreeze every 5min, receipts daily 9am, age-transition midnight).
- [x] **Fallback Path** — System works without Stripe Treasury/Issuing. Without cards, funds payout to parent's bank via Connect. Full dual-approval flow and audit trail still operational.

### Epic 5: Oversight, Privacy & Verification (PARTIAL — some items BUILT with Epic 3)

- [x] **Teacher Approval for Logos & Rewards** — Logo approval and reward tier approval cards integrated into teacher verification flow (BUILT, uncommitted)
- [ ] **Enhanced Parent Dashboard** — An expanded hub for parents to monitor activity, view spending breakdowns, see milestone progress, and manage consent settings — all in one place.
- [ ] **Privacy Checkpoints (The Approval Flow)** — Mandatory review gates at key moments (project creation, going live, first drawdown) requiring parent or teacher sign-off before the student can proceed, with clear audit trails.
- [ ] **Teacher / School Verification Badges** — Visual trust badges displayed on project pages showing that a real teacher at a verified school has reviewed and approved the project, boosting backer confidence.

### Epic 6: Post-Campaign & Community

- [ ] **The "Circle of Gratitude" Impact Reports** — A structured, guided template for students to post updates and photos showing backers exactly how their funds were used, what was achieved, and what they learned along the way.
- [ ] **In-App Mentorship Chat** — Safely moderated, text-based channels where students can get advice from verified alumni, local business owners, or professional mentors — with all messages reviewed for safety.

### Epic 7: Additional Funding Mechanics

- [ ] **Stretch Goals** — Allowing projects to set secondary funding targets (e.g. "If we hit £600, we will also buy a logo design") that unlock automatically if the initial goal is met early.
- [ ] **Corporate Matching Grants Integration** — Automated matching from corporate sponsors who pledge to double contributions to qualifying student projects, increasing funding impact.
- [ ] **Youth Grant Matching Integration** — Integration with youth entrepreneurship grant programmes (e.g. Prince's Trust, Young Enterprise) that can top up or match student-raised funds.

---

## Known Improvements (Identified Feb 2026 Testing)

**Bugs:**
- Homepage sparkle particles hydration mismatch (cosmetic — `Math.random()` differs server vs client). Fix: use seeded random or client-only generation.

**UX Improvements:**
- Public `/learn` page module cards should link to public module preview pages
- Long pages (Learn, About, How It Works) could benefit from a "Back to top" button
- Browse page search could have autocomplete or recent search suggestions
- Dashboard learning page could show a "Recommended next" section at top

**Accessibility:**
- Homepage flip cards lack keyboard interaction (Enter/Space keypresses)
- Quiz option buttons could benefit from ARIA labels for correct/incorrect state

**Content:**
- Placeholder PDFs in `/public/resources/` need real designed content before launch
- Module 7 (Resource Library) download tasks reference these placeholder PDFs

---

## Future Considerations (Not Yet Scoped)

- Native mobile app (iOS / Android)
- Multi-currency and international school support
- Government funding integration and offset
- Advanced analytics dashboard for admins
- School-level admin dashboard
- Alumni / success stories showcase
- AI-powered project recommendations for backers
- Marketplace for student products (post-funding e-commerce)

---

## Principles

1. **Safety first** — Every feature is designed with child protection as the top priority
2. **Learn by doing** — The platform itself is an educational tool; students learn business skills through the process
3. **Teacher as trust anchor** — Teachers verify, mentor, and approve at every critical step
4. **Transparency** — Parents and backers can see everything, always
5. **Fun and encouraging** — The tone, design, and experience should make young people feel empowered, not intimidated
6. **COPPA & GDPR-K compliant** — No collection of unnecessary personal data from minors; parental consent at every stage; right to deletion; data minimisation throughout
7. **Zero-Trust Spending** — Every transaction requires dual approval (Parent + Mentor) before funds can be deployed; no exceptions for any amount
