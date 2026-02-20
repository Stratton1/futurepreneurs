# CLAUDE.md — Futurepreneurs

**Last Updated:** 2026-02-19

---

## 1. Project Overview

**One-liner:** Futurepreneurs is a crowdfunding platform for under-18s to raise money and start their small business ideas.

**Problem statement:** Young people with business ideas have no dedicated, safe platform to raise startup capital. Existing crowdfunding platforms aren't designed for minors and lack the trust, safety, and oversight features that parents, teachers, and the public need.

**Target users:**
- Students (under 18) who want to fund a business idea
- Teachers/school staff who mentor and verify student projects
- Parents who provide consent and observe their child's progress
- Investors/backers (the public) who want to support young entrepreneurs
- Platform admins who manage and moderate the platform

**Success criteria:**
- **30 days:** Fully functional platform deployed and ready for public launch — students can create projects, teachers can verify, backers can fund, drawdowns work
- **90 days:** Live users, multiple funded projects, proven payment flow, feedback collected and first iteration shipped

---

## 2. User Profile Summary (Joseph)

- **Technical comfort:** Non-technical. All technical decisions are mine (Claude's) to make. Explanations must be in plain English.
- **Priorities:** Full working platform for public launch. Quality and completeness over speed-to-market shortcuts.
- **Non-negotiables:** Safety for minors, milestone-based drawdowns, teacher verification, parental consent, school email validation.
- **Decision-making style:** Prefers 2–3 options with a recommendation. Approves each phase before I proceed. Doesn't want jargon.

---

## 3. Communication & Collaboration Rules

- Ask 1–2 questions at a time
- Use plain English; avoid jargon unless Joseph asks
- Provide options + recommendation when decisions are needed
- **Phase approval required** — do not start a new phase until Joseph approves
- When reporting, include: what was done, what's next, and any blockers
- Keep messages concise and actionable

---

## 4. Product Scope

### MVP Features (v1 — Full Platform)

**User Accounts & Roles**
- Student sign-up with school-issued email verification
- Teacher/mentor sign-up and verification
- Parent sign-up (observer/consent role)
- Investor/backer accounts (public) with dashboard
- Guest checkout for backers (no account required)
- Admin accounts for platform management
- Profile pages for students showing their projects

**Project Creation & Management**
- Students create projects: title, description, images, video, funding goal (max £10,000), category
- Student selects a teacher/mentor from their school
- Teacher verifies and approves the project before it goes live
- Parent consent step before project goes live
- Students post project updates for backers
- Students can edit their project (before fully funded)

**Discovery & Browsing**
- Public homepage with featured and recent projects
- Browse by category (tech, food, crafts, services, etc.)
- Search by keyword
- Filter by school, category, funding progress
- Individual project pages: progress bar, description, updates, backer count

**Funding & Payments**
- Back/donate via Stripe (card, Apple Pay, Google Pay)
- All-or-nothing funding — funds only collected when goal is reached
- No time limit on campaigns
- Maximum funding goal: £10,000
- Platform fee: 2.5% on successfully funded projects
- Real-time funding progress visible to all

**Milestone-Based Drawdown System**
- Student defines milestones when creating the project (e.g., "Buy ingredients — £50")
- Once funded, student can request drawdowns against milestones
- Teacher/mentor approves each drawdown request
- Parent can view all drawdown activity
- Full audit trail of all requests, approvals, and disbursements

**Dashboards**
- **Student dashboard:** my projects, funding progress, milestones, drawdown requests, updates
- **Teacher dashboard:** students I mentor, projects to verify, drawdown requests to approve
- **Parent dashboard:** my child's projects, funding status, drawdown activity
- **Investor/backer dashboard:** projects I've backed, total donated, project updates
- **Admin dashboard:** all projects, users, payments, flagged content, platform fees, moderation tools

**Notifications**
- Email notifications for key events (project verified, funded, new backer, drawdown approved, milestone reached, etc.)
- On-platform notification centre

**Trust & Safety**
- School email validation (only school-issued emails accepted)
- Teacher verification flow
- Parental consent flow
- Content moderation tools for admin (flag/remove projects)
- Reporting system for inappropriate content

**Static / Marketing Pages**
- Landing page / homepage
- How it works page
- About page
- FAQ
- Terms of service
- Privacy policy
- Contact / support page

**Other**
- Mobile-responsive design (works great on phones and tablets)
- Social sharing (share projects on social media)
- Currency: GBP (£) only

### Post-MVP Features (Future)
- Mobile app (native iOS/Android)
- Messaging between backers and students
- School-level admin dashboard
- Government funding integration / offset
- Advanced analytics for admins
- Badge/achievement system for students
- Alumni/success stories section
- Multi-currency support

### Non-Goals (Explicitly Out of Scope for v1)
- Native mobile apps (web-responsive is sufficient)
- Direct messaging / chat between users
- Multi-currency or international support
- Government funding integration
- AI features / recommendations
- Marketplace for products (this is funding only, not e-commerce)

---

## 5. UX / UI Direction

- **Visual style:** Bright, youthful, fun colours, friendly and approachable — inspired by the clean layouts of Kickstarter/GoFundMe but with a younger, more energetic feel
- **Layout:** Clean, card-based layouts for projects. Clear calls to action. Simple navigation.
- **Typography:** Rounded, friendly fonts. Easy to read for young people and adults alike.
- **Colour palette:** Vibrant primary colours (to be defined — think energetic blues, greens, oranges/yellows). White/light backgrounds for readability.
- **Accessibility:** Good contrast ratios, readable font sizes, keyboard navigation, screen reader friendly
- **Copy tone/voice:** Encouraging, simple, friendly. Speak to young people without being patronising. Use "you" and "your". Keep it short.
- **Mobile-first:** Design for phones first, scale up to desktop

---

## 6. Technical Direction

### Recommended Stack
- **Frontend:** Next.js (React framework) — fast, modern, great for SEO, handles both the public site and dashboards
- **Styling:** Tailwind CSS — quick to build with, great for responsive/mobile-first design
- **Backend/API:** Next.js API routes + server actions — keeps everything in one codebase, simpler to deploy and maintain
- **Database:** PostgreSQL via Supabase — reliable, handles complex relationships (users, projects, milestones, payments), built-in auth
- **Authentication:** Supabase Auth — supports email verification, role-based access
- **Payments:** Stripe — handles cards, Apple Pay, Google Pay. Supports Connect for managing fund disbursements.
- **File storage:** Supabase Storage — for project images and videos
- **Email:** Resend — for transactional emails (notifications, verification)
- **Hosting:** Vercel — pairs perfectly with Next.js, handles scaling automatically
- **Admin:** Custom admin dashboard (built into the app)

### Why This Stack (Plain English)
- Everything lives in one codebase — easier to build, test, and deploy
- Next.js is the industry standard for modern web apps — fast, SEO-friendly, great on mobile
- Supabase gives us a database, user accounts, and file storage in one place
- Stripe is the gold standard for payments and can handle the "hold funds until goal is met" pattern
- Vercel deploys automatically when we push code — no server management needed

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│              Next.js + Tailwind                  │
│   (Public pages, Dashboards, Project pages)      │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│                 BACKEND / API                     │
│           Next.js API Routes / Actions           │
│  (Auth, Projects, Payments, Drawdowns, Admin)    │
└───────┬──────────┬──────────┬───────────────────┘
        │          │          │
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │Supabase│ │ Stripe │ │ Resend │
   │  (DB,  │ │(Payments│ │(Emails)│
   │  Auth, │ │  Hold & │ │        │
   │  Files)│ │Release) │ │        │
   └────────┘ └────────┘ └────────┘
```

### Data Model Overview (Key Entities)

- **User** — id, email, name, role (student/teacher/parent/investor/admin), school, verified status
- **School** — id, name, email domain, location
- **Project** — id, student_id, mentor_id, title, description, images, video, category, goal_amount, status (draft/pending/live/funded/completed), total_raised
- **Milestone** — id, project_id, title, description, amount, status (pending/approved/disbursed)
- **Backing** — id, project_id, backer_id, amount, stripe_payment_id, status
- **ParentalConsent** — id, student_id, parent_id, project_id, status, consented_at
- **DrawdownRequest** — id, milestone_id, project_id, amount, status (pending/approved/rejected), approved_by, requested_at, approved_at
- **Notification** — id, user_id, type, message, read, created_at
- **Report** — id, project_id, reporter_id, reason, status

### Integrations & External Services
- **Stripe** — payment processing, fund holding, disbursements
- **Supabase** — database, authentication, file storage
- **Resend** — transactional email
- **Vercel** — hosting and deployment

### Security & Privacy
- All secrets stored in environment variables, never committed to code
- School email validation for student accounts
- Role-based access control (students can't access teacher dashboards, etc.)
- Stripe handles all sensitive payment data (we never store card details)
- HTTPS everywhere
- GDPR-aware: platform deals with minors, so extra care with data handling
- Parental consent required for students
- Content moderation tools for admin

---

## 7. Delivery Plan

### Phase 1 — Foundation & Auth
Set up the project, database, and authentication system with all user roles.
- Project scaffolding (Next.js, Tailwind, Supabase, folder structure)
- Database schema and migrations
- Authentication: sign-up, login, email verification
- Role-based accounts (student, teacher, parent, investor, admin)
- School email validation for students
- Basic layout shell (nav, footer, responsive container)
- **Done when:** Users can sign up with the correct role, students must use school emails, and the app shell is running locally and deployed

### Phase 2 — Project Creation & Verification
Students can create projects and teachers can verify them.
- Project creation form (title, description, images, video, goal, category, milestones)
- Student selects teacher/mentor
- Teacher verification/approval flow
- Parental consent flow
- Project status management (draft → pending → live)
- **Done when:** A student can create a project, a teacher can approve it, a parent can consent, and it goes live

### Phase 3 — Public Discovery & Project Pages
The public-facing experience for browsing and viewing projects.
- Homepage with featured/recent projects
- Browse by category
- Search and filter
- Individual project pages (description, progress bar, updates, milestones, backer count)
- How it works, About, FAQ pages
- **Done when:** Anyone can visit the site, browse projects, and view individual project pages

### Phase 4 — Payments & Funding
Backers can fund projects via Stripe.
- Stripe integration (card, Apple Pay, Google Pay)
- Backing/donation flow
- All-or-nothing logic (funds held until goal reached)
- Real-time funding progress updates
- Guest checkout (back without an account)
- Platform fee (2.5%) applied on successful projects
- **Done when:** A backer can fund a project, funds are held, and released when the goal is hit (minus platform fee)

### Phase 5 — Milestone Drawdowns
Funded projects can request and receive funds via milestones.
- Drawdown request flow (student requests against a milestone)
- Teacher/mentor approval flow
- Parent visibility of drawdown activity
- Audit trail for all drawdown actions
- Fund disbursement via Stripe
- **Done when:** A student can request a drawdown, a teacher can approve it, funds are disbursed, and parent can see it all

### Phase 6 — Dashboards & Notifications
Each role gets their personalised dashboard and email notifications.
- Student dashboard
- Teacher dashboard
- Parent dashboard
- Investor/backer dashboard
- Admin dashboard (users, projects, payments, moderation, fees)
- Email notifications for key events
- On-platform notification centre
- **Done when:** Every role has a functional dashboard and receives email notifications for relevant events

### Phase 7 — Trust, Safety & Polish
Final safety features, moderation, static pages, and launch polish.
- Content moderation tools (flag/remove projects)
- Reporting system
- Terms of service, privacy policy pages
- Contact/support page
- Social sharing
- Mobile responsiveness polish
- Performance and accessibility audit
- **Done when:** Platform is launch-ready — all pages exist, moderation works, mobile looks great, and it passes basic accessibility checks

---

## 8. Repo & Engineering Standards

### Folder Structure
```
futurepreneurs/
├── CLAUDE.md
├── .env.local              # Local environment variables (never committed)
├── .env.example            # Template for required env vars
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js app router (pages and layouts)
│   │   ├── (public)/       # Public-facing pages (home, browse, project pages)
│   │   ├── (auth)/         # Auth pages (login, signup)
│   │   ├── dashboard/      # Role-based dashboards
│   │   ├── admin/          # Admin area
│   │   └── api/            # API routes
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Base UI elements (buttons, cards, inputs)
│   │   └── features/       # Feature-specific components
│   ├── lib/                # Utility functions, config, helpers
│   │   ├── supabase/       # Supabase client and helpers
│   │   ├── stripe/         # Stripe helpers
│   │   └── email/          # Email templates and helpers
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles
├── supabase/
│   └── migrations/         # Database migrations
└── tests/                  # Test files
```

### Naming Conventions
- Files/folders: `kebab-case` (e.g., `project-card.tsx`)
- Components: `PascalCase` (e.g., `ProjectCard`)
- Functions/variables: `camelCase` (e.g., `getProjectById`)
- Database tables: `snake_case` (e.g., `drawdown_requests`)
- Environment variables: `UPPER_SNAKE_CASE` (e.g., `STRIPE_SECRET_KEY`)

### Testing Strategy
- Unit tests for critical business logic (drawdown calculations, fee calculations, funding status)
- Integration tests for payment flows
- Manual testing for UI flows before each phase sign-off

### Linting / Formatting
- ESLint with Next.js defaults
- Prettier for code formatting
- TypeScript strict mode

### Commit Message Style
```
type: short description

Examples:
feat: add project creation form
fix: correct funding progress calculation
style: update homepage hero section
chore: add environment variable template
```

### Documentation
- `CLAUDE.md` is the single source of truth for project decisions and standards
- Code comments for complex business logic only (don't over-comment obvious code)
- README.md for setup instructions (generated at end)

### Running Locally
```bash
npm install
npm run dev
# App runs at http://localhost:3000
```

### Environment Variables (Template)
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend (Email)
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
PLATFORM_FEE_PERCENTAGE=2.5
```

---

## 9. Decision Log

| Date | Decision | Options Considered | Why Chosen | Consequences |
|------|----------|--------------------|------------|--------------|
| 2026-02-19 | Platform fee set at 2.5% | 2%, 2.5%, 5% | Competitive with market, sustainable for platform | Applied to successfully funded projects only |
| 2026-02-19 | All-or-nothing funding model | All-or-nothing vs keep-what-you-raise | Protects young entrepreneurs from under-funding | Backers only charged when goal is met |
| 2026-02-19 | Milestone-based drawdowns | Lump sum vs milestone-based vs scheduled | Protects funds, teaches financial discipline, teacher oversight | Students must plan spending upfront |
| 2026-02-19 | Next.js + Supabase + Stripe stack | Various combinations | One codebase, proven tools, handles auth + payments + storage | Vendor dependency on Supabase and Vercel |
| 2026-02-19 | UK only, GBP | UK vs international | Simpler compliance, focused launch | Limits initial market to UK schools |
| 2026-02-19 | Max £10,000 funding cap | Various caps | Appropriate for young entrepreneurs, limits risk | Projects cannot raise above this amount |

---

## 10. Change Log

| Date | Summary | Files/Areas Changed | Next Actions |
|------|---------|---------------------|--------------|
| 2026-02-19 | CLAUDE.md created — project kickoff | CLAUDE.md | Begin Phase 1: Foundation & Auth |
| 2026-02-19 | Phase 1 complete — auth, roles, app shell | 22 source files | Begin Phase 2 |
| 2026-02-20 | Phase 2 complete — project creation, verification, consent | 16 new + 1 modified | Begin Phase 3 |
| 2026-02-20 | Phase 3 complete — browse, project pages, static pages | 15 new + 3 modified | Begin Phase 4 |

---

## 11. "When in Doubt" Rules

1. Bias to the simplest solution that can ship
2. Prefer proven libraries over custom code where appropriate
3. Keep user-facing behaviour consistent across all roles
4. Never expose secrets; never commit credentials
5. Ask Joseph if uncertainty impacts user experience, cost, or timeline materially
6. When in doubt about safety features for minors, err on the side of more protection
7. Mobile experience is as important as desktop — always test both
8. Every user-facing action should have clear feedback (loading states, success/error messages)
9. Keep the tone fun and encouraging throughout the app — this is for young people
10. Remember: the teacher/mentor is the trust anchor of every project
