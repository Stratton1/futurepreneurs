# Roadmap — Futurepreneurs

**Last Updated:** 2026-02-20
**Live URL:** https://futurepreneurs-sigma.vercel.app/
**GitHub:** https://github.com/Stratton1/futurepreneurs
**Supabase:** https://anoqfecrfawwreanibnf.supabase.co

**Platform:** Youth-centric crowdfunding for ages 11–17
**Compliance:** COPPA & GDPR-K compliant by design

---

## Status Key

- DONE = completed and deployed
- IN PROGRESS = currently being built
- NEXT = approved to start
- PLANNED = scoped but not yet started
- FUTURE = post-MVP, not yet scoped in detail

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
- [x] Parental consent flow
- [x] Project status management (draft → pending → live)

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

### Epic 2: Educational Hub & Onboarding

- [ ] **Learning Platform** — A centralised resource centre with bite-sized guides, video tutorials, and interactive modules teaching students how to write a business plan, create a pitch, market a project, and manage funds responsibly.
- [ ] **Guided Setup Flows** — Step-by-step interactive wizards that walk students through every stage of creating a campaign, explaining the "why" behind each requirement (e.g. "Why do I need milestones?") so they learn as they build.

### Epic 3: Campaign Management & Teamwork

- [ ] **Guided Video Pitch Integration** — Safe, moderated tools to record or embed a short video pitch directly on the project page, with content review by teachers before publishing.
- [ ] **Scaffolded Micro-Goals** — Tools to break down a large funding target into smaller, achievable steps (e.g. "Week 1: Raise £50 for ingredients") with visual progress tracking and celebratory animations.
- [ ] **Safe Reward Tiers** — A structured system for students to offer backers tangible or digital rewards (e.g. thank-you cards, early access, custom items) with teacher approval on all reward descriptions.
- [ ] **Group / Club Fundraising Mode** — Dedicated project pages for school clubs, sports teams, or student groups to raise funds together under a single campaign with shared management tools.
- [ ] **Multi-User / One Project** — Collaboration tools allowing multiple students to safely co-manage a single campaign — shared editing, split responsibilities, and joint milestone tracking.

### Epic 4: Youth-Centric Digital Wallet & Card System (FUTURE)

> **Model:** Zero-Trust Spending — every transaction requires explicit approval from BOTH the student's Parent AND their verified Mentor before funds deploy. Fully COPPA and GDPR-K compliant. Custodial Account model where a verified adult holds legal liability, but the minor gets an empowering, educational dashboard.

#### 4.1 System Architecture & Tech Stack

- [ ] **Stripe Connect (Custom Accounts)** — Each project gets a Connected Account (owned by the custodial adult) with platform-controlled payouts. Enables fund holding, routing, and compliance.
- [ ] **Stripe Treasury (Wallet)** — Embedded financial accounts linked to each custodial Connected Account, providing balance tracking, fund segregation per project, and programmatic fund movement.
- [ ] **Stripe Issuing (Virtual Cards)** — Virtual debit cards issued per-project that are only funded on demand after dual approval. Cards can be frozen/unfrozen programmatically per transaction.
- [ ] **KYC/KYB Provider Integration** — Stripe Identity for Adult KYC (Gov ID, proof of address) on the custodial parent. Minor verification via school-issued email + Student ID upload + teacher attestation. Proof of Relationship captured via parental consent flow (shared surname, school records, or signed declaration).

**Proposed data model additions:**

```
custodial_accounts
  id, parent_id (FK → user_profiles), student_id (FK → user_profiles),
  stripe_connected_account_id, stripe_treasury_financial_account_id,
  kyc_status (pending | adult_verified | minor_verified | fully_verified),
  relationship_verified, created_at, updated_at

wallet_balances
  id, custodial_account_id, project_id, available_balance, held_balance,
  total_disbursed, currency (GBP), updated_at

issued_cards
  id, custodial_account_id, project_id, stripe_card_id,
  card_status (active | frozen | cancelled), last_four,
  spending_limit_daily, spending_limit_weekly, created_at
```

#### 4.2 Custodial Onboarding Flow (Minor KYC)

- [ ] **Step 1 — Parent Initiates** — Parent signs up, completes Adult KYC via Stripe Identity (Gov ID scan, address verification). System creates a Stripe Connected Account with the parent as the beneficial owner.
- [ ] **Step 2 — Student Links** — Student signs up with school email. Parent receives a "link your child" request. Parent confirms the relationship (name, date of birth, school). System creates the custodial link.
- [ ] **Step 3 — Minor Verification** — Student uploads school ID or teacher provides attestation via the Teacher Dashboard. System stores verification status without retaining raw PII images (hash + verified flag only, GDPR-K minimisation).
- [ ] **Step 4 — Treasury & Card Provisioning** — Once both KYC tiers pass, system creates a Stripe Treasury Financial Account under the Connected Account and provisions a virtual Stripe Issuing card. Card starts in `frozen` state (unfrozen only during approved transactions).
- [ ] **Step 5 — Dual-Account Ready** — Parent sees full financial controls in their dashboard. Student sees a read-only "Tween Wallet" view showing balance, micro-goals, and a "Request Purchase" button.

#### 4.3 Dual-Approval Spending Matrix (Parent & Mentor)

- [ ] **Purchase Request Flow** — Student submits a purchase request (vendor, amount, reason, linked milestone). Request enters `pending_parent` status. Push notification + email sent to Parent.
- [ ] **Parent Approval** — Parent reviews request in their dashboard. If approved, status moves to `pending_mentor`. Push notification + email sent to Mentor. If declined, status moves to `declined_parent` with reason.
- [ ] **Mentor Approval** — Mentor reviews request in their dashboard. If approved, status moves to `approved`. If declined, status moves to `declined_mentor` with reason.
- [ ] **Transaction Execution** — On dual approval, system programmatically: (1) unfreezes the virtual card, (2) funds the card for the exact approved amount from the Treasury balance, (3) sets a 30-minute spending window, (4) auto-refreezes the card after window expires or transaction completes.
- [ ] **Escrow Hold Pattern** — For online purchases, system creates a Stripe Authorization Hold for the exact amount. Funds are captured only when the merchant settles. If not settled within 7 days, the hold is released back to the Treasury balance.

**Proposed data model:**

```
spending_requests
  id, custodial_account_id, project_id, milestone_id (nullable),
  student_id, parent_id, mentor_id,
  vendor_name, vendor_mcc (Merchant Category Code), amount, currency,
  reason, receipt_url (nullable),
  status (pending_parent | pending_mentor | approved | declined_parent |
          declined_mentor | funded | completed | expired),
  parent_decision_at, mentor_decision_at, funded_at, completed_at,
  stripe_authorization_id, created_at

approval_logs
  id, spending_request_id, approver_id, approver_role (parent | mentor),
  decision (approved | declined), reason (nullable), decided_at
```

**Key API endpoints:**

```
POST   /api/wallet/spending-request      — Student submits a purchase request
PATCH  /api/wallet/spending-request/:id   — Parent or Mentor approves/declines
GET    /api/wallet/spending-requests       — List requests (filtered by role)
POST   /api/wallet/fund-card              — Internal: fund card after dual approval
POST   /api/webhooks/stripe-issuing       — Stripe Issuing webhook (authorization, capture, decline)
```

#### 4.4 Automated Spending Guardrails

- [ ] **Vendor Whitelisting via MCC** — Virtual card configured with Stripe Issuing Spending Controls to only authorise transactions at approved Merchant Category Codes (e.g. 5411 Grocery, 5942 Book Stores, 5944 Craft Supplies). Blocked categories include: gambling, alcohol, tobacco, adult content, cash advances, money transfers.
- [ ] **Per-Vendor Allowlists** — Optional per-project vendor allowlist where the teacher pre-approves specific merchants (e.g. "Amazon", "Hobbycraft") by name. Transactions at unlisted vendors trigger an additional review step.
- [ ] **Velocity Limits** — Configurable daily cap (default £50/day), weekly cap (default £200/week), and single-transaction cap (default £100). Limits set by Parent in their dashboard, with Mentor able to request increases.
- [ ] **Cooling-Off Period** — All spending requests have a mandatory 1-hour delay between approval and card funding, giving either approver time to reverse their decision.
- [ ] **Receipt Upload Requirement** — After each purchase, student must upload a photo of the receipt within 48 hours. Failure to upload triggers a card freeze until resolved.

#### 4.5 Platform Dashboards (Wallet Views)

- [ ] **The Tween Wallet (Student View)** — A friendly, read-only dashboard showing: current project balance, funding progress, micro-goal tracker ("£15 more until baking trays!"), pending/completed purchase requests, a big "Request a Purchase" button, and a visual spending history timeline. No direct spending capability — all purchases go through the request flow.
- [ ] **Parent Financial Dashboard** — Full 360° control centre showing: all linked children's wallets, pending approval requests with one-tap approve/decline, complete transaction history with receipts, spending analytics (by category, over time), card controls (freeze/unfreeze, adjust limits), and downloadable CSV statements.
- [ ] **Mentor Financial Dashboard** — Project-focused view showing: all mentored students' wallets, pending approval queue (only requests already parent-approved), milestone-to-spending alignment check ("Is this purchase aligned with Milestone 2?"), and a flag button for suspicious requests.
- [ ] **Admin Financial Dashboard** — Platform-wide view with: aggregate wallet balances, flagged transactions, KYC status overview, fee tracking, and compliance audit logs.

#### 4.6 Transition to Adulthood (Age 18+)

- [ ] **Birthday Tracking** — System stores date of birth (encrypted at rest) and runs a daily cron job checking for users approaching 18.
- [ ] **90-Day Transition Flow** — At 17 years 9 months, student receives a "Growing Up" notification explaining upcoming changes. At 18, the system: (1) removes dual-approval requirement, (2) converts custodial Connected Account to an independent account, (3) runs full Adult KYC on the now-adult user, (4) preserves all transaction history, (5) notifies parent that oversight has ended.
- [ ] **Graduated Independence** — Optional "training wheels" mode where 18+ users can voluntarily keep mentor oversight for their first independent project.

### Epic 5: Oversight, Privacy & Verification

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
