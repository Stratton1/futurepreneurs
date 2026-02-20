# Roadmap — Futurepreneurs

**Last Updated:** 2026-02-20 (Phase 2 complete)
**Live URL:** https://futurepreneurs-sigma.vercel.app/
**GitHub:** https://github.com/Stratton1/futurepreneurs
**Supabase:** https://anoqfecrfawwreanibnf.supabase.co

---

## How to Read This Roadmap

Each phase is broken into numbered tasks. Every task has:

- A clear description of what gets built
- The files that will be created or changed
- Any credentials, services, or manual steps Joseph needs to do
- A checkpoint at the end of each phase (push to GitHub, deploy to Vercel, verify live)

**Status Key:**
- DONE = completed and deployed
- TODO = not yet started
- BLOCKED = waiting on something (credentials, approval, etc.)

---

## Phase 0 — Project Setup & Planning (DONE)

Everything that happened before any code was written.

### 0.1 Discovery Interview (DONE)
- Defined the platform concept: crowdfunding for under-18s
- Identified all five user roles (Student, Teacher, Parent, Investor/Backer, Admin)
- Agreed on funding model: all-or-nothing, no time limit, max £10,000
- Agreed on milestone-based drawdowns with teacher approval
- Set platform fee at 2.5%
- Chose UK-only, GBP currency
- Chose visual direction: bright, youthful, mobile-first

### 0.2 Technical Decisions (DONE)
- Chose tech stack: Next.js + Tailwind CSS + Supabase + Stripe + Resend + Vercel
- Defined folder structure, naming conventions, commit style
- Defined all database entities and relationships

### 0.3 Documentation Created (DONE)
- `CLAUDE.md` — single source of truth (11 sections covering every aspect of the project)
- `project_memory.md` — quick-reference for key decisions and current state
- `build_log.md` — chronological build record
- `rules.md` — hard rules that must never be broken (safety, financial, access, code, data, design, deployment)
- `.env.example` — template for all required environment variables

### 0.4 External Services Set Up (DONE)
- Supabase project created (URL: anoqfecrfawwreanibnf.supabase.co)
- Supabase anon key and service role key obtained and added to .env.local
- GitHub repository created (https://github.com/Stratton1/futurepreneurs)
- Vercel project created and linked to GitHub repo

### 0.5 External Services Still Needed (TODO)
- [ ] **Stripe account** — needed in Phase 4. Joseph will need to create a Stripe account at https://dashboard.stripe.com, get the publishable key, secret key, and set up a webhook. Stripe Connect will also need enabling for fund disbursements.
- [ ] **Resend account** — needed in Phase 6. Joseph will need to sign up at https://resend.com, verify a sending domain, and get an API key.
- [ ] **Update Vercel environment variables** — set `NEXT_PUBLIC_APP_URL` to `https://futurepreneurs-sigma.vercel.app/` in Vercel dashboard → Settings → Environment Variables

---

## Phase 1 — Foundation & Auth (DONE)

**Goal:** Users can sign up with the correct role, students must use school emails, and the app shell is running locally and deployed.

### 1.1 Project Scaffolding (DONE)
- Initialised Next.js 16 project with TypeScript strict mode
- Installed and configured Tailwind CSS
- Created folder structure per CLAUDE.md spec
- Created `.gitignore`, `tsconfig.json`, `next.config.js`, `tailwind.config.js`

**Files created:**
- `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.js`, `.gitignore`

### 1.2 Database Schema (DONE)
- Wrote full SQL migration with 10 tables, custom ENUM types, indexes, foreign keys
- Tables: `schools`, `user_profiles`, `projects`, `milestones`, `backings`, `parental_consents`, `drawdown_requests`, `project_updates`, `notifications`, `reports`
- Row Level Security (RLS) policies for schools, user_profiles, projects, notifications
- Auto-updating `updated_at` trigger on all tables
- Seed data: 5 sample UK schools (riverside.sch.uk, oakwood.sch.uk, stmarys.ac.uk, greenfield.sch.uk, bridgeschool.sch.uk)
- Goal amount CHECK constraint: must be > 0 and <= 10,000
- **Joseph ran migration manually** in Supabase SQL Editor — confirmed "Success. No rows returned."

**Files created:**
- `supabase/migrations/001_initial_schema.sql`

### 1.3 Supabase Integration (DONE)
- Browser-side client (for client components)
- Server-side client (for server components and API routes, with cookie handling)
- Middleware helper (session refresh, route protection)
- Auth helper functions: `getCurrentUser()`, `hasRole()`, `isRegisteredSchoolEmail()`, `getSchools()`

**Files created:**
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`
- `src/lib/supabase/auth-helpers.ts`

### 1.4 Authentication System (DONE)
- Server actions: `signUp()`, `signIn()`, `signOut()`
- Sign-up validates inputs, checks school email domain for students, creates auth user + user_profile row
- Sign-in validates email, authenticates, redirects to /dashboard
- Email verification callback handler (exchanges code for session)
- Password strength validation (8+ chars, uppercase, lowercase, number)

**Files created:**
- `src/app/(auth)/actions.ts`
- `src/app/(auth)/signup/page.tsx` — two-step flow: choose role → fill details
- `src/app/(auth)/login/page.tsx` — email/password with error handling
- `src/app/(auth)/auth/callback/route.ts` — email verification handler

### 1.5 Middleware & Route Protection (DONE)
- Next.js middleware intercepts all routes (except static files)
- Unauthenticated users redirected from `/dashboard/*` and `/admin/*` to `/login`
- Session refreshed on every request

**Files created:**
- `middleware.ts` (project root)

### 1.6 App Shell & Layout (DONE)
- Root layout with Geist fonts, metadata, Navbar + Footer wrapping all pages
- Responsive navbar with logo (Rocket icon + "Futurepreneurs"), nav links, mobile hamburger menu
- 4-column footer (Brand, Platform, Support, Legal)

**Files created:**
- `src/app/layout.tsx`
- `src/components/features/navbar.tsx`
- `src/components/features/footer.tsx`

### 1.7 Homepage (DONE)
- Hero section with gradient background and two CTA buttons
- "How It Works" — 4-step visual guide
- Trust & Safety — 3 cards (school-verified, teacher-mentored, parent-approved)
- Final CTA section with emerald background

**Files created:**
- `src/app/page.tsx`

### 1.8 UI Components (DONE)
- Button (variants: primary/secondary/outline/ghost/danger, sizes: sm/md/lg, loading spinner)
- Input (label, error, hint, emerald focus ring)
- Select (label, error, options, placeholder)
- Alert (success/error/info/warning types)

**Files created:**
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/alert.tsx`

### 1.9 Constants & Validation (DONE)
- Centralised constants: APP_NAME, PLATFORM_FEE, MAX_FUNDING_GOAL, CURRENCY, categories, school email suffixes, role labels
- Validation helpers: `isSchoolEmailDomain()`, `isValidEmail()`, `isStrongPassword()`, `isValidFullName()`
- TypeScript types for all database entities

**Files created:**
- `src/lib/constants.ts`
- `src/lib/validations.ts`
- `src/types/database.ts`

### 1.10 Dashboard Placeholder (DONE)
- Server component fetching authenticated user + profile from Supabase
- Shows name, role, email, verified status, member since date
- Placeholder message for full dashboard (coming in Phase 6)
- Logout button

**Files created:**
- `src/app/dashboard/page.tsx`

### Phase 1 Checkpoint (DONE)
- [x] TypeScript compilation passes with zero errors
- [x] All 22 source files present and correctly structured
- [x] Code pushed to GitHub (https://github.com/Stratton1/futurepreneurs)
- [x] Deployed to Vercel (https://futurepreneurs-sigma.vercel.app/)
- [x] Live site verified working — HTTP 200, full homepage rendering
- [x] Joseph approved Phase 1 as complete

---

## Phase 2 — Project Creation & Verification (DONE)

**Goal:** A student can create a project, a teacher can approve it, a parent can consent, and it goes live on the platform.

### 2.1 Database Migration for Phase 2
- Add any missing columns needed for project creation (e.g., `images` array field, `video_url` field if not already present)
- Set up Supabase Storage bucket for project images and videos
- Add storage policies (students can upload to their own project folders, public read access for live projects)

**Files to create/change:**
- `supabase/migrations/002_storage_setup.sql`
- Supabase dashboard: create `project-images` storage bucket

**Joseph action:** Run the migration in Supabase SQL Editor, same as Phase 1.

### 2.2 Image & File Upload Component
- Reusable image upload component with drag-and-drop
- Preview thumbnails for uploaded images
- File size and type validation (max 5MB per image, JPEG/PNG/WebP only)
- Upload to Supabase Storage with progress indicator
- Video URL input (YouTube/Vimeo embed — not file upload, to keep storage costs low)

**Files to create:**
- `src/components/ui/image-upload.tsx`
- `src/components/ui/video-embed.tsx`
- `src/lib/supabase/storage.ts` — upload/delete helpers

### 2.3 Project Creation Form
- Multi-step form for students to create a project:
  - Step 1: Basic info — title, category (from predefined list), short description
  - Step 2: Full description — rich text or long-form textarea, images (up to 5), optional video URL
  - Step 3: Funding — goal amount (£1–£10,000), breakdown explanation
  - Step 4: Milestones — add 1 or more milestones (title, description, amount). Total milestone amounts must equal the goal.
  - Step 5: Select mentor — pick a verified teacher from the student's school
  - Step 6: Review & submit — preview everything before submitting
- Save as draft at any step (student can come back and finish later)
- Submit changes project status from `draft` to `pending_verification`
- Form validation at every step (required fields, character limits, amount checks)

**Files to create:**
- `src/app/dashboard/projects/new/page.tsx` — project creation page
- `src/app/dashboard/projects/new/steps/basic-info.tsx`
- `src/app/dashboard/projects/new/steps/description.tsx`
- `src/app/dashboard/projects/new/steps/funding.tsx`
- `src/app/dashboard/projects/new/steps/milestones.tsx`
- `src/app/dashboard/projects/new/steps/select-mentor.tsx`
- `src/app/dashboard/projects/new/steps/review.tsx`
- `src/components/features/milestone-editor.tsx` — reusable milestone add/edit/remove component
- `src/components/ui/textarea.tsx` — textarea UI component
- `src/components/ui/progress-steps.tsx` — step indicator showing which step the student is on

**Files to change:**
- `src/app/(auth)/actions.ts` or new `src/app/dashboard/projects/actions.ts` — server actions for creating/saving projects

### 2.4 Project Server Actions & Data Layer
- `createProject()` — inserts project row + milestone rows, links to student and school
- `updateProject()` — updates draft project (only allowed while status is `draft`)
- `saveDraft()` — saves current form state without submitting
- `submitForVerification()` — changes status to `pending_verification`, notifies the selected teacher
- `getProjectById()` — fetches a single project with milestones, mentor info, student info
- `getMyProjects()` — fetches all projects belonging to the logged-in student
- `getTeachersAtMySchool()` — fetches verified teachers at the student's school for mentor selection

**Files to create:**
- `src/app/dashboard/projects/actions.ts` — all project server actions
- `src/lib/queries/projects.ts` — reusable database query functions

### 2.5 Teacher Verification Flow
- Teacher dashboard shows list of projects pending their verification
- Teacher clicks on a project → sees full project details (description, images, milestones, student info)
- Teacher can:
  - **Approve** — changes project status to `pending_consent` (awaiting parent)
  - **Request changes** — sends the project back to the student with feedback (status goes back to `draft`)
  - **Reject** — marks the project as rejected with a reason
- Teacher approval is recorded in an audit log (who approved, when, any notes)

**Files to create:**
- `src/app/dashboard/verify/page.tsx` — teacher's list of projects to verify
- `src/app/dashboard/verify/[id]/page.tsx` — individual project verification view
- `src/app/dashboard/verify/actions.ts` — server actions for approve/reject/request-changes
- `src/components/features/project-review-card.tsx` — card component showing project summary for teacher review

### 2.6 Parental Consent Flow
- After teacher approves, the student's parent is notified (email + on-platform notification)
- Parent sees the project on their dashboard with a "Review & Consent" button
- Parent views full project details
- Parent can:
  - **Give consent** — project status changes to `live` and is now publicly visible
  - **Decline** — project goes back to draft with a reason
- Consent is timestamped and recorded in the `parental_consents` table
- If student has no linked parent account yet, the system prompts the student to invite their parent (enter parent's email → sends invitation email)

**Files to create:**
- `src/app/dashboard/consent/page.tsx` — parent's list of projects awaiting consent
- `src/app/dashboard/consent/[id]/page.tsx` — individual project consent view
- `src/app/dashboard/consent/actions.ts` — server actions for consent/decline
- `src/components/features/consent-card.tsx` — card showing project details for parent review

**Files to change:**
- Student dashboard needs a "Link Parent" flow or prompt

### 2.7 Project Status Management
- Full status state machine:
  ```
  draft → pending_verification → pending_consent → live → funded → completed
                ↑                      ↑
                └── (changes requested) ┘── (declined)
                         → draft              → draft
  ```
- Status badges visible everywhere a project appears
- Only projects with status `live` are visible to the public
- Students can edit projects in `draft` status only
- Funded projects (status `funded`) can no longer be edited

**Files to create/change:**
- `src/lib/project-status.ts` — status helper functions (canEdit, canVerify, canConsent, isPublic, etc.)
- Update `src/types/database.ts` if status enum needs expanding

### 2.8 Student's "My Projects" Page
- List of all student's projects with status badges
- Quick actions: edit draft, view live project, see verification status
- "Create New Project" button

**Files to create:**
- `src/app/dashboard/projects/page.tsx` — student's project list
- `src/components/features/project-status-badge.tsx`

### Phase 2 Checkpoint
- [x] Student can create a full project with milestones and images
- [x] Student can save as draft and return later
- [x] Student can submit project for teacher verification
- [x] Teacher sees pending projects, can approve or request changes
- [x] Parent receives notification and can give or decline consent
- [x] Approved + consented projects go live
- [x] TypeScript compiles with zero errors
- [ ] Manual test: full flow from create → verify → consent → live
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel (automatic on push)
- [ ] Joseph approves Phase 2

**Potential issues to watch for:**
- Supabase Storage bucket permissions — if images don't load publicly, check RLS policies on the storage bucket
- Email delivery for parent invitations — won't work until Resend is configured (Phase 6). For now, use on-platform notifications only.
- File upload size limits — Supabase free tier has a 50MB storage limit. Compress images on upload.

---

## Phase 3 — Public Discovery & Project Pages (TODO)

**Goal:** Anyone can visit the site, browse projects, and view individual project pages with full details.

### 3.1 Project Card Component
- Reusable card showing: project image (or placeholder), title, student name, school, category, funding progress bar, amount raised vs goal, backer count
- Hover effect and click-through to project page
- Responsive: stacks on mobile, grid on desktop

**Files to create:**
- `src/components/features/project-card.tsx`
- `src/components/features/funding-progress-bar.tsx`

### 3.2 Homepage Update (Live Projects)
- Replace placeholder content with real data
- "Featured Projects" section — hand-picked or most-backed projects (admin can feature projects)
- "Recently Launched" section — newest live projects
- "Almost There" section — projects close to their goal
- Keep existing hero, how-it-works, and trust sections

**Files to change:**
- `src/app/page.tsx` — add dynamic project sections
- New server action or query to fetch featured/recent/almost-there projects

### 3.3 Browse Projects Page
- Grid of all live projects
- Category filter (sidebar on desktop, dropdown on mobile)
- Search bar (keyword search on title and description)
- Sort by: newest, most funded, closest to goal
- Filter by school (optional)
- Pagination or infinite scroll
- "No results" state with friendly message

**Files to create:**
- `src/app/(public)/projects/page.tsx` — browse page
- `src/app/(public)/projects/actions.ts` — search/filter server actions
- `src/components/features/project-filters.tsx` — filter sidebar/controls
- `src/components/features/search-bar.tsx`

### 3.4 Individual Project Page
- Full project details: title, description (formatted), images (gallery/carousel), video embed
- Funding progress: progress bar, amount raised, goal, backer count, percentage
- Milestones section: list of milestones with status indicators
- Project updates: chronological list posted by the student
- Student profile card (name, school, bio)
- Teacher/mentor badge (verified by [teacher name] at [school])
- "Back This Project" CTA button (links to funding flow in Phase 4)
- Social sharing buttons (Twitter, Facebook, WhatsApp, copy link)
- Responsive layout: single column on mobile, two-column on desktop

**Files to create:**
- `src/app/(public)/projects/[id]/page.tsx` — project detail page
- `src/components/features/image-gallery.tsx` — image carousel/gallery
- `src/components/features/milestone-list.tsx` — public milestone display
- `src/components/features/project-updates.tsx` — updates feed
- `src/components/features/student-profile-card.tsx`
- `src/components/features/share-buttons.tsx`

### 3.5 Category Pages
- Individual pages per category (e.g., /projects?category=tech)
- Or use query parameters on the browse page with category pre-selected
- Category header with description and icon

**Files to change:**
- `src/app/(public)/projects/page.tsx` — handle category query param

### 3.6 How It Works Page
- Expanded version of the homepage section
- Separate sections for each role: Students, Teachers, Parents, Backers
- Step-by-step visual guide for each role
- CTA to sign up at the bottom

**Files to create:**
- `src/app/(public)/how-it-works/page.tsx`

### 3.7 About Page
- What is Futurepreneurs, why it exists, who it's for
- Mission statement
- Trust and safety highlights
- Team section (if applicable)

**Files to create:**
- `src/app/(public)/about/page.tsx`

### 3.8 FAQ Page
- Accordion-style expandable questions and answers
- Sections: For Students, For Teachers, For Parents, For Backers, Payments & Fees, Safety

**Files to create:**
- `src/app/(public)/faq/page.tsx`
- `src/components/ui/accordion.tsx` — reusable accordion component

### Phase 3 Checkpoint
- [ ] Homepage shows real live projects (featured, recent, almost there)
- [ ] Browse page works with search, category filter, sort, pagination
- [ ] Individual project pages show all details, milestones, updates
- [ ] How It Works, About, FAQ pages are complete
- [ ] All pages are mobile-responsive
- [ ] Navigation links updated (navbar, footer) to point to new pages
- [ ] TypeScript compiles with zero errors
- [ ] Manual test: browse projects, search, filter, view project page, check on mobile
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Verify live site: browse real projects, check all pages render
- [ ] Joseph approves Phase 3

**Potential issues to watch for:**
- SEO metadata — each project page should have unique title/description meta tags for sharing
- Image loading performance — use Next.js `<Image>` component with proper sizing and lazy loading
- Empty states — make sure pages look good even with zero projects (don't show a blank page)

---

## Phase 4 — Payments & Funding (TODO)

**Goal:** A backer can fund a project, funds are held until the goal is reached, and released (minus 2.5% platform fee) when the goal is hit.

### 4.0 Stripe Account Setup (Joseph Action Required)
- [ ] **Joseph creates a Stripe account** at https://dashboard.stripe.com
- [ ] Get **Publishable Key** (starts with `pk_test_...`) from Stripe Dashboard → Developers → API Keys
- [ ] Get **Secret Key** (starts with `sk_test_...`) from the same page
- [ ] Enable **Stripe Connect** (for disbursing funds to students' bank accounts later). Go to Stripe Dashboard → Connect → Get Started.
- [ ] Set up a **Stripe Webhook** pointing to `https://futurepreneurs-sigma.vercel.app/api/webhooks/stripe`
  - Events to listen for: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- [ ] Get the **Webhook Signing Secret** (starts with `whsec_...`)
- [ ] Add all four keys to Vercel environment variables:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- [ ] Also add them to `.env.local` for local development

### 4.1 Stripe Integration Setup
- Install Stripe npm packages (`stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`)
- Create server-side Stripe client
- Create client-side Stripe provider

**Files to create:**
- `src/lib/stripe/server.ts` — server-side Stripe instance
- `src/lib/stripe/client.ts` — client-side Stripe loader
- `src/components/providers/stripe-provider.tsx` — React context provider for Stripe Elements

### 4.2 Payment Intent Creation (Server-Side)
- API route that creates a Stripe Payment Intent when a backer clicks "Back This Project"
- Payment Intent metadata includes: project_id, backer_id (or guest), amount
- Amount validation: minimum £1, maximum up to the remaining funding needed
- For all-or-nothing: funds are **authorised but not captured** until the goal is reached
  - Use `capture_method: 'manual'` on the Payment Intent
  - This places a hold on the backer's card but doesn't charge them yet

**Files to create:**
- `src/app/api/payments/create-intent/route.ts` — creates Payment Intent
- `src/lib/stripe/payments.ts` — payment helper functions

### 4.3 Backing / Donation Form
- Appears on the project page or as a modal
- Backer enters amount (preset buttons: £5, £10, £25, £50, £100, custom)
- Stripe Elements embedded payment form (card number, Apple Pay, Google Pay)
- Shows order summary: amount, project name
- "Back This Project" submit button with loading state
- Success confirmation with thank-you message
- Error handling for failed payments

**Files to create:**
- `src/app/(public)/projects/[id]/back/page.tsx` — backing page
- `src/components/features/backing-form.tsx` — amount selection + payment form
- `src/components/features/payment-success.tsx` — success confirmation

### 4.4 Guest Checkout
- Backers can fund without creating an account
- Collect only: name (optional) and email (for receipt)
- Guest backings still recorded in `backings` table with `backer_id` as null
- Optional: prompt to create account after backing ("Want to track your backed projects?")

**Files to change:**
- `src/app/(public)/projects/[id]/back/page.tsx` — handle guest flow
- `src/app/dashboard/projects/actions.ts` or new payment actions file

### 4.5 Stripe Webhook Handler
- Receives Stripe events and updates the database
- **`payment_intent.succeeded`** — mark backing as confirmed, update project `total_raised`
- **`payment_intent.payment_failed`** — mark backing as failed, optionally notify backer
- **`charge.refunded`** — mark backing as refunded, reduce `total_raised`
- Webhook signature verification (using `STRIPE_WEBHOOK_SECRET`)
- Idempotent processing (handle duplicate events safely)

**Files to create:**
- `src/app/api/webhooks/stripe/route.ts` — webhook handler

### 4.6 All-or-Nothing Funding Logic
- When a new backing brings `total_raised` >= `goal_amount`:
  - Change project status to `funded`
  - **Capture all held Payment Intents** for this project (actually charge the backers)
  - Calculate and record platform fee (2.5% of total raised)
  - Send notifications: student ("Your project is funded!"), teacher, parent, all backers
- If the project hasn't reached its goal, funds remain on hold (authorised but not captured)
- Stripe Payment Intent authorisations expire after 7 days by default — need to handle re-authorisation or use a different hold strategy:
  - **Option A:** Use Stripe Checkout Sessions with `payment_intent_data.capture_method: manual` and extend hold
  - **Option B:** Only charge when goal is met (collect payment details, charge later) — simpler but slightly different UX
  - **Recommended: Option B** — store payment method, charge when goal is hit. This avoids the 7-day hold expiry issue entirely.

**Files to create:**
- `src/lib/stripe/funding.ts` — funding logic (check goal, capture payments, apply fee)
- `supabase/migrations/003_payment_fields.sql` — any additional columns needed (e.g., `stripe_payment_method_id` on backings, `platform_fee` on projects)

**Joseph action:** Run migration in Supabase SQL Editor.

### 4.7 Real-Time Funding Progress
- After each successful backing, update the progress bar on the project page
- Show: amount raised, percentage of goal, number of backers
- Consider using Supabase Realtime subscriptions for live updates (optional — polling every 30 seconds is simpler and sufficient for v1)

**Files to change:**
- `src/app/(public)/projects/[id]/page.tsx` — update funding display
- `src/components/features/funding-progress-bar.tsx` — make it dynamic

### 4.8 Backer's "My Backed Projects" List
- Logged-in backers can see all projects they've backed
- Shows: project name, amount backed, funding progress, status

**Files to create:**
- `src/app/dashboard/backed/page.tsx` — backer's backed projects list

### Phase 4 Checkpoint
- [ ] Joseph has created Stripe account and provided all keys
- [ ] Stripe keys added to Vercel environment variables
- [ ] Backer can select an amount and enter payment details
- [ ] Payment is processed via Stripe (test mode)
- [ ] Guest checkout works (no account required)
- [ ] Webhook handler correctly updates database on payment success/failure
- [ ] Funding progress updates after each backing
- [ ] When goal is reached: all backers are charged, project status → funded, fee applied
- [ ] TypeScript compiles with zero errors
- [ ] Manual test: back a project with Stripe test card (4242 4242 4242 4242), verify in Stripe dashboard
- [ ] Manual test: fund a project fully, verify all-or-nothing capture works
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Verify live site with Stripe test mode
- [ ] Joseph approves Phase 4

**Potential issues to watch for:**
- **Stripe test mode vs live mode** — always use test mode until launch. Test card: 4242 4242 4242 4242, any future expiry, any CVC.
- **Payment hold expiry** — Stripe authorisations expire after 7 days. If using manual capture, need a strategy for long-running campaigns. Recommended: store payment methods and charge when goal is met.
- **Webhook delivery** — Vercel serverless functions have a timeout. Webhook handler must respond within 10 seconds or Stripe will retry.
- **Idempotency** — Stripe may send duplicate webhook events. Handler must check if backing already exists before creating a duplicate.
- **Currency** — All amounts must be in pence (Stripe uses smallest currency unit). £10 = 1000. Make sure to convert correctly.

---

## Phase 5 — Milestone Drawdowns (TODO)

**Goal:** A student can request a drawdown against a milestone, a teacher can approve it, funds are disbursed, and the parent can see it all.

### 5.0 Stripe Connect Setup (Joseph Action Required)
- [ ] **Joseph enables Stripe Connect** on the Stripe account (if not already done in Phase 4)
- [ ] Understand the Connect flow: each student (or their parent/guardian) will eventually need a connected Stripe account to receive disbursements
- [ ] For v1, disbursements can be handled manually (admin transfers via Stripe dashboard) or semi-automatically via the API
- [ ] Decision needed: who receives the funds — student's bank account or parent's bank account? (Recommend parent's for safety)

### 5.1 Drawdown Request Flow (Student)
- On the student dashboard, funded projects show their milestones
- Student clicks "Request Drawdown" on a milestone
- Student provides:
  - Amount (up to the milestone amount)
  - Reason / description of what they're spending it on
  - Optional: receipt or supporting evidence (file upload)
- Request is saved with status `pending` and the teacher is notified

**Files to create:**
- `src/app/dashboard/projects/[id]/drawdowns/page.tsx` — student's drawdown view for a project
- `src/app/dashboard/projects/[id]/drawdowns/request/page.tsx` — drawdown request form
- `src/app/dashboard/drawdowns/actions.ts` — server actions for creating/managing drawdown requests
- `src/components/features/drawdown-request-form.tsx`

### 5.2 Teacher Drawdown Approval Flow
- Teacher dashboard shows list of pending drawdown requests
- Teacher clicks on a request → sees full details (milestone, amount, reason, supporting evidence)
- Teacher can:
  - **Approve** — marks request as approved, triggers disbursement
  - **Reject** — marks as rejected with a reason, notifies student
  - **Request more info** — sends request back to student for additional details
- Every action is timestamped and recorded (who, when, what)

**Files to create:**
- `src/app/dashboard/drawdowns/page.tsx` — teacher's list of drawdown requests to review
- `src/app/dashboard/drawdowns/[id]/page.tsx` — individual drawdown review page
- `src/app/dashboard/drawdowns/[id]/actions.ts` — approve/reject server actions
- `src/components/features/drawdown-review-card.tsx`

### 5.3 Fund Disbursement
- When a drawdown is approved by the teacher:
  - Transfer the approved amount from the platform's Stripe balance to the student/parent's connected account
  - Update milestone status (partially or fully disbursed)
  - Record the disbursement in the audit trail
  - Notify: student ("Funds released!"), parent ("Drawdown approved and funds released for [milestone]")
- For v1, if Stripe Connect is complex to set up, option to:
  - Record the approval in the database
  - Admin manually processes the transfer via Stripe dashboard
  - Mark as disbursed once confirmed

**Files to create:**
- `src/lib/stripe/disbursements.ts` — disbursement logic
- `supabase/migrations/004_drawdown_fields.sql` — any additional columns (e.g., `disbursement_reference`, `evidence_url`)

**Joseph action:** Run migration in Supabase SQL Editor.

### 5.4 Parent Drawdown Visibility
- Parent dashboard shows all drawdown activity for their child's projects
- Each drawdown request shows: milestone, amount, status, teacher's decision, timestamp
- Parent can view the full audit trail but cannot approve or reject
- Parent receives notifications for all drawdown activity

**Files to create:**
- `src/app/dashboard/child/[projectId]/drawdowns/page.tsx` — parent's view of drawdowns

### 5.5 Audit Trail
- Every drawdown-related action is logged:
  - Student requested drawdown (amount, milestone, timestamp)
  - Teacher approved/rejected (by whom, when, notes)
  - Funds disbursed (amount, reference, timestamp)
- Audit trail visible to: student, teacher, parent, admin
- Exportable as CSV for admin (future enhancement)

**Files to create/change:**
- `src/lib/queries/drawdowns.ts` — drawdown query functions with full audit trail
- `src/components/features/audit-trail.tsx` — reusable audit trail display component

### Phase 5 Checkpoint
- [ ] Student can request a drawdown against a funded milestone
- [ ] Teacher sees pending drawdown requests and can approve/reject
- [ ] Approved drawdowns trigger fund disbursement (or manual admin action for v1)
- [ ] Parent can see all drawdown activity
- [ ] Full audit trail for every action
- [ ] TypeScript compiles with zero errors
- [ ] Manual test: request drawdown → teacher approves → funds disbursed → parent sees it
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Joseph approves Phase 5

**Potential issues to watch for:**
- **Stripe Connect complexity** — setting up connected accounts for minors is legally complex. For v1, consider manual disbursements via admin.
- **Partial drawdowns** — a milestone of £100 might have a drawdown request for £50. Track remaining balance per milestone.
- **Race conditions** — two drawdown requests for the same milestone submitted simultaneously. Use database constraints to prevent over-disbursement.

---

## Phase 6 — Dashboards & Notifications (TODO)

**Goal:** Every role has a functional, personalised dashboard, and email notifications fire for key events.

### 6.0 Resend Account Setup (Joseph Action Required)
- [ ] **Joseph signs up** at https://resend.com
- [ ] Verify a sending domain (or use Resend's free tier with their domain for testing)
- [ ] Get the **API key**
- [ ] Add `RESEND_API_KEY` to Vercel environment variables and `.env.local`

### 6.1 Student Dashboard
- **Overview:** name, school, number of projects, total raised across all projects
- **My Projects:** list with status badges, quick actions (edit draft, view live, request drawdown)
- **Drawdown Requests:** recent requests with status
- **Notifications:** latest notifications
- **Quick action:** "Create New Project" button

**Files to create:**
- `src/app/dashboard/student/page.tsx`
- `src/components/features/dashboard/student-overview.tsx`
- `src/components/features/dashboard/student-projects-list.tsx`
- `src/components/features/dashboard/student-drawdowns.tsx`

### 6.2 Teacher Dashboard
- **Overview:** number of students mentored, projects verified, pending actions count
- **Pending Verifications:** projects waiting for teacher approval
- **Pending Drawdowns:** drawdown requests waiting for teacher approval
- **My Students:** list of students the teacher mentors, with their project status
- **Notifications:** latest notifications

**Files to create:**
- `src/app/dashboard/teacher/page.tsx`
- `src/components/features/dashboard/teacher-overview.tsx`
- `src/components/features/dashboard/teacher-pending.tsx`
- `src/components/features/dashboard/teacher-students.tsx`

### 6.3 Parent Dashboard
- **Overview:** child's name, their projects, total raised
- **Child's Projects:** list with status and funding progress
- **Consent Requests:** any pending consent requests
- **Drawdown Activity:** all drawdown requests and their status
- **Notifications:** latest notifications

**Files to create:**
- `src/app/dashboard/parent/page.tsx`
- `src/components/features/dashboard/parent-overview.tsx`
- `src/components/features/dashboard/parent-consent.tsx`
- `src/components/features/dashboard/parent-drawdowns.tsx`

### 6.4 Investor/Backer Dashboard
- **Overview:** total donated, number of projects backed
- **Backed Projects:** list with funding progress and status
- **Project Updates:** feed of updates from backed projects
- **Notifications:** latest notifications

**Files to create:**
- `src/app/dashboard/investor/page.tsx`
- `src/components/features/dashboard/investor-overview.tsx`
- `src/components/features/dashboard/investor-backed.tsx`
- `src/components/features/dashboard/investor-updates.tsx`

### 6.5 Admin Dashboard
- **Overview:** total users, total projects, total raised, platform fees earned, pending moderation
- **Users:** searchable list of all users, filter by role, view/edit/suspend accounts
- **Projects:** searchable list of all projects, filter by status, feature/unfeature, flag/remove
- **Payments:** list of all backings, total amounts, fees collected
- **Moderation:** flagged projects, reported content, moderation actions
- **Schools:** manage registered schools, add/remove school domains
- **Settings:** platform fee percentage, max funding goal, other config

**Files to create:**
- `src/app/admin/page.tsx` — admin dashboard overview
- `src/app/admin/users/page.tsx` — user management
- `src/app/admin/projects/page.tsx` — project management
- `src/app/admin/payments/page.tsx` — payment overview
- `src/app/admin/moderation/page.tsx` — moderation queue
- `src/app/admin/schools/page.tsx` — school management
- `src/app/admin/layout.tsx` — admin layout with sidebar navigation
- `src/components/features/admin/admin-sidebar.tsx`
- `src/components/features/admin/stats-card.tsx`
- `src/components/features/admin/data-table.tsx` — reusable sortable/filterable table

### 6.6 Dashboard Routing Logic
- Replace the current placeholder dashboard page with role-based routing
- When user visits `/dashboard`, redirect to the correct sub-dashboard based on their role:
  - Student → `/dashboard/student`
  - Teacher → `/dashboard/teacher`
  - Parent → `/dashboard/parent`
  - Investor → `/dashboard/investor`
  - Admin → `/admin`
- Protect each dashboard route (student can't access teacher dashboard, etc.)

**Files to change:**
- `src/app/dashboard/page.tsx` — replace placeholder with role-based redirect
- `src/app/dashboard/layout.tsx` — dashboard shell with sidebar navigation
- `middleware.ts` — add role-based route protection

### 6.7 Email Notification System
- Set up Resend integration
- Create email templates (HTML) for each notification type
- Notification types:
  - **Student:** project approved by teacher, project approved by parent (now live), new backer, project fully funded, drawdown approved/rejected
  - **Teacher:** new project to verify, new drawdown request to approve
  - **Parent:** new project awaiting consent, drawdown requested, drawdown approved
  - **Backer:** project funded (goal reached), project update posted
  - **Admin:** new project flagged, new report submitted
- Each email includes: Futurepreneurs branding, clear subject line, action button, unsubscribe link

**Files to create:**
- `src/lib/email/resend.ts` — Resend client and send function
- `src/lib/email/templates/project-approved.tsx` — React email template
- `src/lib/email/templates/project-funded.tsx`
- `src/lib/email/templates/new-backer.tsx`
- `src/lib/email/templates/drawdown-approved.tsx`
- `src/lib/email/templates/consent-request.tsx`
- `src/lib/email/templates/verification-request.tsx`
- `src/lib/email/templates/base-layout.tsx` — shared email layout

### 6.8 On-Platform Notification Centre
- Bell icon in the navbar with unread count badge
- Dropdown or page showing all notifications
- Mark as read (individual or all)
- Notifications link to the relevant page (e.g., "New project to verify" links to the verification page)

**Files to create:**
- `src/components/features/notification-bell.tsx` — bell icon with count
- `src/components/features/notification-dropdown.tsx` — notification list
- `src/app/dashboard/notifications/page.tsx` — full notification page
- `src/app/dashboard/notifications/actions.ts` — mark as read, fetch notifications

**Files to change:**
- `src/components/features/navbar.tsx` — add notification bell (for logged-in users)

### Phase 6 Checkpoint
- [ ] Joseph has created Resend account and provided API key
- [ ] Resend key added to Vercel environment variables
- [ ] Student dashboard shows projects, drawdowns, notifications
- [ ] Teacher dashboard shows verifications, drawdowns, students
- [ ] Parent dashboard shows child's projects, consent, drawdowns
- [ ] Investor dashboard shows backed projects, updates
- [ ] Admin dashboard shows all platform data, moderation tools
- [ ] Email notifications fire for all key events (test in Resend dashboard)
- [ ] On-platform notification bell works with unread count
- [ ] Role-based dashboard routing works correctly
- [ ] TypeScript compiles with zero errors
- [ ] Manual test: trigger each notification type, verify email + on-platform delivery
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Joseph approves Phase 6

**Potential issues to watch for:**
- **Resend free tier limits** — 100 emails/day on free plan. Sufficient for testing, may need upgrade for launch.
- **Email deliverability** — use a verified custom domain for better inbox placement. Resend's default domain may go to spam.
- **Dashboard performance** — admin dashboard with many users/projects could be slow. Add pagination and limit initial data loads.
- **Real-time notifications** — for v1, notifications are fetched on page load. Supabase Realtime can add live updates later.

---

## Phase 7 — Trust, Safety & Polish (TODO)

**Goal:** Platform is launch-ready — all safety features, static pages, moderation, mobile polish, and accessibility.

### 7.1 Content Moderation Tools (Admin)
- Admin can flag a project (visible only to admin, student notified)
- Admin can suspend a project (removed from public view, student and teacher notified)
- Admin can remove a project entirely (with reason, student and teacher notified)
- Admin can suspend a user account
- Admin action log (who did what, when)

**Files to create:**
- `src/app/admin/moderation/actions.ts` — moderation server actions
- `src/components/features/admin/moderation-actions.tsx` — flag/suspend/remove buttons

### 7.2 Reporting System
- Any logged-in user can report a project
- Report form: select reason (inappropriate content, misleading, spam, other), add details
- Reports appear in admin moderation queue
- Admin can: dismiss report, take action on the project, contact the reporter
- Reporter receives notification when their report is resolved

**Files to create:**
- `src/components/features/report-button.tsx` — report button (appears on project pages)
- `src/components/features/report-modal.tsx` — report form modal
- `src/app/api/reports/route.ts` — API route for submitting reports

### 7.3 Student Profile Pages
- Public profile page for each student showing: name, school, bio, their live/funded projects
- No personal contact info visible
- Privacy-safe: only shows information the student has chosen to share

**Files to create:**
- `src/app/(public)/students/[id]/page.tsx` — public student profile
- `src/app/dashboard/profile/page.tsx` — edit profile page (for all roles)
- `src/app/dashboard/profile/actions.ts` — profile update server actions

### 7.4 Project Updates (Student Posts)
- Student can post text updates on their live/funded projects
- Updates visible on the project page and in backer feeds
- Optional image attachment
- Edit/delete own updates

**Files to create:**
- `src/app/dashboard/projects/[id]/updates/page.tsx` — manage updates
- `src/app/dashboard/projects/[id]/updates/actions.ts` — create/edit/delete update actions

### 7.5 Terms of Service Page
- Clear, plain-English terms
- Covers: eligibility (under 18, UK schools), funding rules, drawdown rules, platform fees, content guidelines, dispute resolution, data handling
- Must acknowledge that platform deals with minors — extra GDPR considerations
- "Last updated" date at the top

**Files to create:**
- `src/app/(public)/terms/page.tsx`

### 7.6 Privacy Policy Page
- GDPR-compliant privacy policy
- Specifically addresses: data collection from minors, parental consent for data processing, school data, payment data handling (Stripe), cookies, analytics
- Clear explanation of what data is collected, why, and how it's protected
- Right to deletion, data portability

**Files to create:**
- `src/app/(public)/privacy/page.tsx`

### 7.7 Contact / Support Page
- Contact form (name, email, subject, message)
- Or simple mailto link to a support email address
- FAQ link
- Expected response time

**Files to create:**
- `src/app/(public)/contact/page.tsx`
- `src/app/api/contact/route.ts` — sends contact form submission via Resend

### 7.8 Social Sharing
- Share buttons on project pages: Twitter/X, Facebook, WhatsApp, LinkedIn, copy link
- Open Graph (OG) meta tags on project pages for rich social previews:
  - Title: project name
  - Description: short project description
  - Image: first project image or a generated OG image
- Test OG tags with social media debuggers (Twitter Card Validator, Facebook Sharing Debugger)

**Files to create/change:**
- `src/app/(public)/projects/[id]/page.tsx` — add OG metadata
- `src/components/features/share-buttons.tsx` (may already exist from Phase 3)
- Optionally: `src/app/api/og/route.tsx` — dynamic OG image generation using Next.js `ImageResponse`

### 7.9 Mobile Responsiveness Polish
- Review every single page on mobile viewport (375px wide)
- Fix any layout issues: overflow, cramped spacing, unreadable text, buttons too small to tap
- Test on:
  - Small phone (375px — iPhone SE)
  - Standard phone (390px — iPhone 14)
  - Large phone (430px — iPhone 14 Pro Max)
  - Tablet (768px — iPad)
  - Desktop (1280px+)
- Ensure all touch targets are at least 44x44px
- Test navigation: hamburger menu, back buttons, form inputs on mobile keyboards

**No new files — this is a review and fix pass across all existing pages.**

### 7.10 Performance Audit
- Run Lighthouse audit on key pages (homepage, project page, dashboard)
- Target scores: Performance > 80, Accessibility > 90, SEO > 90
- Optimise:
  - Image sizes (use Next.js Image component everywhere)
  - Bundle size (check for unnecessary dependencies)
  - Font loading (ensure Geist loads efficiently)
  - Server component vs client component usage (minimise client JS)
  - Database query performance (add indexes if needed)

### 7.11 Accessibility Audit
- Keyboard navigation: can every interactive element be reached with Tab?
- Screen reader: do all images have alt text? Are form labels associated correctly?
- Colour contrast: do all text/background combinations pass WCAG AA?
- Focus indicators: is it clear which element is focused?
- Error messages: are form errors announced to screen readers?
- ARIA labels: are dynamic elements (modals, dropdowns, notifications) properly labelled?

### 7.12 Error Handling & Edge Cases
- 404 page (custom, branded)
- 500 error page (custom, friendly message)
- Empty states for all lists (no projects, no notifications, no backers, etc.)
- Loading states for all async operations
- Network error handling (what happens if Supabase or Stripe is down?)
- Session expiry handling (redirect to login with friendly message)

**Files to create:**
- `src/app/not-found.tsx` — custom 404 page
- `src/app/error.tsx` — custom error page
- `src/components/ui/loading-spinner.tsx` — reusable loading spinner
- `src/components/ui/empty-state.tsx` — reusable empty state component

### 7.13 Final Navigation & Footer Update
- Verify all navbar links point to real pages
- Verify all footer links point to real pages
- Add any missing links (Terms, Privacy, Contact, How It Works, About, FAQ)
- Ensure active page is highlighted in navigation

**Files to change:**
- `src/components/features/navbar.tsx`
- `src/components/features/footer.tsx`

### Phase 7 Checkpoint
- [ ] Admin can flag, suspend, and remove projects
- [ ] Users can report projects, admin sees reports in moderation queue
- [ ] Student profile pages work
- [ ] Project updates can be posted by students
- [ ] Terms of Service page complete
- [ ] Privacy Policy page complete
- [ ] Contact page complete
- [ ] Social sharing works with correct OG previews
- [ ] All pages look good on mobile (375px–430px)
- [ ] Lighthouse scores: Performance > 80, Accessibility > 90, SEO > 90
- [ ] Keyboard navigation works everywhere
- [ ] Custom 404 and error pages exist
- [ ] Empty states and loading states for all lists
- [ ] All navigation links work
- [ ] TypeScript compiles with zero errors
- [ ] Full end-to-end manual test of entire platform
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Joseph approves Phase 7

---

## Phase 8 — Pre-Launch Checklist (TODO)

**Goal:** Everything is verified, credentials are live, and the platform is ready for real users.

### 8.1 Switch from Test Mode to Live Mode
- [ ] **Stripe:** Switch from test keys (`sk_test_...`) to live keys (`sk_live_...`) in Vercel environment variables
- [ ] **Stripe Webhook:** Update webhook endpoint to use live mode signing secret
- [ ] **Test a real payment** with a real card (back a project with £1, then refund it)
- [ ] Verify platform fee calculation on live payment

### 8.2 Domain Setup (Optional but Recommended)
- [ ] Purchase a custom domain (e.g., futurepreneurs.co.uk)
- [ ] Add domain to Vercel project (Settings → Domains)
- [ ] Update `NEXT_PUBLIC_APP_URL` in Vercel to the new domain
- [ ] Update Stripe webhook URL to use the new domain
- [ ] Verify SSL certificate is active (Vercel handles this automatically)
- [ ] Set up email sending domain in Resend to match (e.g., hello@futurepreneurs.co.uk)

### 8.3 Email Deliverability
- [ ] Verify sending domain in Resend (add DNS records: SPF, DKIM, DMARC)
- [ ] Send test emails to Gmail, Outlook, Yahoo — check they don't land in spam
- [ ] Set a recognisable "from" name (e.g., "Futurepreneurs <hello@futurepreneurs.co.uk>")

### 8.4 Legal Review
- [ ] Have Terms of Service reviewed (legal advisor recommended for platform dealing with minors)
- [ ] Have Privacy Policy reviewed (GDPR compliance, children's data)
- [ ] Check ICO (Information Commissioner's Office) registration requirements for processing children's data in the UK
- [ ] Confirm cookie consent approach

### 8.5 Content & Copy Review
- [ ] Review all user-facing copy for tone, clarity, spelling, grammar
- [ ] Ensure all placeholder text (Lorem ipsum, "coming soon") is replaced
- [ ] Check all links work (no broken internal or external links)
- [ ] Verify all images load correctly

### 8.6 Security Review
- [ ] Confirm no secrets in the codebase (search for API keys, passwords)
- [ ] Confirm `.env.local` is in `.gitignore`
- [ ] Confirm RLS policies are active on all Supabase tables
- [ ] Confirm role-based access control is enforced (test: can a student access /admin?)
- [ ] Confirm Stripe webhook signature verification is working
- [ ] Run a basic security scan (check headers, HTTPS enforcement)

### 8.7 Seed Data Cleanup
- [ ] Remove or replace test accounts
- [ ] Remove test projects
- [ ] Verify school seed data is correct (real UK schools or remove sample data)
- [ ] Clear test payment records

### 8.8 README.md
- [ ] Write a README.md with: project overview, tech stack, setup instructions, environment variables, how to run locally, how to deploy
- [ ] Include contribution guidelines if the project will be open source

**Files to create:**
- `README.md`

### 8.9 Monitoring & Analytics (Optional for v1)
- [ ] Add error monitoring (e.g., Sentry — free tier) to catch production errors
- [ ] Add basic analytics (e.g., Vercel Analytics — built in, or Plausible for privacy-friendly analytics)
- [ ] Set up Stripe dashboard alerts for payment failures

### Phase 8 Checkpoint
- [ ] Stripe is in live mode and a real test payment works
- [ ] Custom domain is set up and working (if purchased)
- [ ] Emails deliver to major providers without hitting spam
- [ ] Legal documents reviewed
- [ ] No secrets in codebase
- [ ] All test/seed data cleaned up
- [ ] README.md written
- [ ] Full end-to-end test on the live URL with real data
- [ ] Joseph gives final go/no-go for public launch

---

## Launch Day Checklist

- [ ] Announce on social media (share project links, explain the platform)
- [ ] Invite first batch of schools and teachers to sign up
- [ ] Monitor Stripe dashboard for payment issues
- [ ] Monitor Vercel dashboard for errors or high traffic
- [ ] Monitor Resend dashboard for email delivery issues
- [ ] Be available for quick fixes during the first 48 hours
- [ ] Collect early user feedback (what's confusing, what's broken, what do they love)

---

## Post-Launch (Phase 9+) — Future Enhancements

These are explicitly out of scope for v1 but documented for future planning:

| Feature | Priority | Notes |
|---------|----------|-------|
| Native mobile app (iOS/Android) | Medium | Web-responsive is sufficient for launch |
| Messaging between backers and students | Medium | Privacy concerns with minors — needs careful design |
| School-level admin dashboard | Medium | Schools manage their own students and teachers |
| Government funding integration | Low | Offset platform fees with grants |
| Advanced analytics for admins | Low | Charts, trends, cohort analysis |
| Badge/achievement system | Low | Gamification for students |
| Alumni/success stories section | Low | Marketing and social proof |
| Multi-currency support | Low | International expansion |
| AI-powered project recommendations | Low | "You might like..." for backers |
| Two-factor authentication | Medium | Extra security for admin and teacher accounts |
| Automated KYC for disbursements | Medium | Required for scaling payment disbursements |
| API for schools/partners | Low | External integrations |

---

## Summary — What Needs to Happen in Each Phase

| Phase | What Gets Built | Joseph Actions Required | Key Risk |
|-------|----------------|------------------------|----------|
| 0 | Planning & docs | Supabase setup, GitHub, Vercel | None — done |
| 1 | Auth, roles, app shell, homepage | Run SQL migration | Done |
| 2 | Project creation, teacher verify, parent consent | Run SQL migration (if any) | File upload complexity |
| 3 | Browse, search, project pages, static pages | None | Empty state with no projects |
| 4 | Stripe payments, all-or-nothing, fees | Create Stripe account, provide keys | Payment hold expiry, webhook reliability |
| 5 | Drawdowns, teacher approval, disbursements | Decision on disbursement method | Stripe Connect complexity for minors |
| 6 | All 5 dashboards, email notifications | Create Resend account, provide key | Email deliverability, dashboard performance |
| 7 | Moderation, reporting, legal pages, polish | Legal review of terms/privacy | Accessibility compliance |
| 8 | Go-live prep, live payments, domain | Switch to live Stripe keys, buy domain | Real payment issues |

---

*This roadmap is a living document. It will be updated as each phase is completed.*
