# Build Log — Futurepreneurs

**Purpose:** Chronological record of everything built, changed, or decided during development.

**Last Updated:** 2026-02-20

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
- Deployed to Vercel: https://futurepreneurs-sigma.vercel.app/
- Joseph approved Phase 1

---

## Phase 2 — Project Creation & Verification

### Entry: Phase 2 Complete
- **Date:** 2026-02-20
- **Status:** Complete
- **Goal:** Students can create projects, teachers can verify, parents can consent, projects go live

### What was built
1. **New UI components:**
   - Textarea component (label, error, hint, auto-resize)
   - ProgressSteps component (numbered step indicator with completion states)
   - ImageUpload component (drag-and-drop, preview thumbnails, file validation)
   - ProjectStatusBadge component (colour-coded status pills for all 7 project statuses)

2. **Project status helper functions:**
   - canEdit, canSubmitForVerification, canVerify, canConsent, isPubliclyVisible, canFund, canRequestDrawdown
   - Status transition functions (after verification, after consent, on changes requested)

3. **Database query layer:**
   - getProjectById (with milestones, student, mentor)
   - getStudentProjects (all projects for a student)
   - getProjectsPendingVerification (for teacher dashboard)
   - getProjectsPendingConsent (for parent dashboard)
   - getTeachersAtSchool (for mentor selection)
   - getTeacherMentoredProjects (all projects a teacher mentors)

4. **Project server actions (10 actions):**
   - createProject — full validation, creates project + milestones, saves as draft
   - updateProject — edit draft projects only
   - submitForVerification — changes status, notifies teacher
   - approveProject — teacher approves, moves to pending_consent, notifies student + parent
   - requestChanges — teacher sends feedback, project returns to draft
   - rejectProject — teacher rejects with reason, project cancelled
   - giveConsent — parent approves, project goes live, notifies student + teacher
   - declineConsent — parent declines with reason, project returns to draft
   - linkParentToProject — student invites parent by email
   - API route for fetching teachers at student's school

5. **Student project creation form (6-step wizard):**
   - Step 1: Basics (title, category, short description)
   - Step 2: Details (full description, image upload, video URL)
   - Step 3: Funding (goal amount with £10,000 cap)
   - Step 4: Milestones (add/remove milestones, amounts must equal goal)
   - Step 5: Mentor (select teacher from school)
   - Step 6: Review (preview all fields before creating)
   - Validation at every step, success confirmation

6. **Student My Projects page:**
   - Lists all projects with status badges
   - Edit and Submit buttons for drafts
   - Invite Parent button for projects awaiting consent
   - Empty state for new students

7. **Teacher verification flow:**
   - List of pending projects with student info and details
   - Individual project review page (full details, milestones, funding)
   - Approve / Request Changes / Reject actions with feedback forms
   - All mentored projects overview

8. **Parental consent flow:**
   - List of projects awaiting consent
   - Individual project review page (details, milestones, mentor info)
   - Give Consent / Decline actions
   - Explanatory text about what consent means

9. **Student invite parent page:**
   - Enter parent email to link them to a project
   - Validates parent account exists

10. **Dashboard updated:**
    - Role-specific quick action cards (My Projects, Verify Projects, Consent Requests, Browse Projects)
    - Removed "coming soon" placeholder

### Files created (16 new files)
- `src/components/ui/textarea.tsx` — Textarea component
- `src/components/ui/progress-steps.tsx` — Step indicator component
- `src/components/ui/image-upload.tsx` — Image upload with drag-and-drop
- `src/components/features/project-status-badge.tsx` — Status badge component
- `src/lib/project-status.ts` — Project status helper functions
- `src/lib/queries/projects.ts` — Database query functions
- `src/app/dashboard/projects/actions.ts` — All project server actions
- `src/app/dashboard/projects/page.tsx` — Student My Projects page
- `src/app/dashboard/projects/submit-button.tsx` — Submit for verification button
- `src/app/dashboard/projects/new/page.tsx` — 6-step project creation form
- `src/app/dashboard/projects/[id]/invite-parent/page.tsx` — Invite parent page
- `src/app/dashboard/verify/page.tsx` — Teacher verification list
- `src/app/dashboard/verify/[id]/page.tsx` — Project verification detail page
- `src/app/dashboard/verify/[id]/verification-actions.tsx` — Approve/reject/request changes
- `src/app/dashboard/consent/page.tsx` — Parent consent list
- `src/app/dashboard/consent/[id]/page.tsx` — Consent detail page
- `src/app/dashboard/consent/[id]/consent-actions.tsx` — Give/decline consent
- `src/app/api/teachers/route.ts` — API route for teacher list

### Files modified (1 file)
- `src/app/dashboard/page.tsx` — Added role-specific quick actions, removed placeholder

### Verification
- TypeScript compilation: **PASS** (zero errors)
- All 16 new files + 1 modified file present and correctly structured
- Code pushed to GitHub by Joseph
- Joseph approved Phase 2

---

## Phase 3 — Public Discovery & Project Pages

### Entry: Phase 3 Complete
- **Date:** 2026-02-20
- **Status:** Complete
- **Goal:** Public-facing experience — browse, search, filter projects; view project details; static pages

### What was built
1. **Funding progress bar component:**
   - Three sizes (sm/md/lg), raised/goal amounts, backer count, percentage
   - Green bar, emerald when fully funded

2. **Project card component:**
   - Image (or gradient placeholder), category badge, title, short description
   - Student name + school, funding progress bar
   - Links to `/projects/{id}`

3. **Public project query layer:**
   - `getPublicProjects()` — browse with category, search (ilike), sort, pagination
   - `getFeaturedProjects()` — featured live/funded projects
   - `getRecentProjects()` — newest live/funded projects
   - `getAlmostThereProjects()` — projects ≥50% funded
   - `getPublicProjectById()` — full project with milestones, student, mentor, school
   - `getProjectCountsByCategory()` — counts for filter badges
   - All queries filter by status IN ('live', 'funded', 'completed')

4. **Browse projects page (`/projects`):**
   - Search bar with URL param management
   - Category pill filters with counts
   - Sort dropdown (newest, most funded, closest to goal)
   - 3-column responsive grid of project cards
   - Pagination with numbered page links
   - Empty states for no results

5. **Individual project detail page (`/projects/[id]`):**
   - Two-column layout (content + sidebar)
   - Image gallery with carousel and thumbnails
   - Full description, video link, milestones section
   - Sidebar: funding card with progress bar, "Back This Project" button (placeholder for Phase 4)
   - Student profile card, verified teacher badge
   - Share buttons (Twitter, Facebook, WhatsApp, copy link)
   - Dynamic OG metadata via generateMetadata()

6. **Homepage updated:**
   - Dynamic "Featured Projects" section (fetched from DB)
   - Dynamic "Recently Launched" section (deduplicated from featured)
   - Updated CTA links to point to /projects

7. **How It Works page:**
   - Sections for each role: Students (6 steps), Teachers (3 cards), Parents (3 cards), Backers (3 cards)
   - CTA section

8. **About page:**
   - Mission statement, values grid (6 items)
   - "What makes us different" section (3 cards)
   - UK-focused section with contact CTA

9. **FAQ page:**
   - Accordion sections: General (4), Students (5), Teachers (3), Backers (4), Parents (3)
   - CTA to contact page

10. **Accordion UI component:**
    - Expandable items with chevron rotation animation
    - Single open at a time

11. **Navigation updated:**
    - Navbar "Browse Projects" → `/projects` (desktop + mobile)
    - Footer "Browse Projects" → `/projects`

### Files created (12 new files)
- `src/components/features/funding-progress-bar.tsx`
- `src/components/features/project-card.tsx`
- `src/lib/queries/public-projects.ts`
- `src/components/features/search-bar.tsx`
- `src/components/features/project-filters.tsx`
- `src/app/(public)/projects/page.tsx`
- `src/components/features/share-buttons.tsx`
- `src/components/features/image-gallery.tsx`
- `src/components/features/milestone-list.tsx`
- `src/components/features/student-profile-card.tsx`
- `src/app/(public)/projects/[id]/page.tsx`
- `src/components/ui/accordion.tsx`
- `src/app/(public)/how-it-works/page.tsx`
- `src/app/(public)/about/page.tsx`
- `src/app/(public)/faq/page.tsx`

### Files modified (3 files)
- `src/app/page.tsx` — added dynamic featured/recent project sections
- `src/components/features/navbar.tsx` — Browse Projects link → /projects
- `src/components/features/footer.tsx` — Browse Projects link → /projects

### Verification
- TypeScript compilation: **PASS** (zero errors)
- All 15 new files + 3 modified files present and correctly structured
