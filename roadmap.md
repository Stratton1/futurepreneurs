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

### Phase 4 — Payments & Funding (IN PROGRESS)

- [x] Stripe account setup (test mode keys, webhook configured)
- [ ] Stripe integration (card, Apple Pay, Google Pay)
- [ ] Backing/donation flow
- [ ] All-or-nothing logic (funds held until goal reached)
- [ ] Real-time funding progress updates
- [ ] Guest checkout (back without an account)
- [ ] Platform fee (2.5%) applied on successful projects

### Phase 5 — Milestone Drawdowns (PLANNED)

- [ ] Drawdown request flow (student requests against a milestone)
- [ ] Teacher/mentor approval flow
- [ ] Parent visibility of drawdown activity
- [ ] Audit trail for all drawdown actions
- [ ] Fund disbursement via Stripe

### Phase 6 — Dashboards & Notifications (PLANNED)

- [ ] Student dashboard
- [ ] Teacher dashboard
- [ ] Parent dashboard
- [ ] Investor/backer dashboard
- [ ] Admin dashboard (users, projects, payments, moderation, fees)
- [ ] Email notifications for key events
- [ ] On-platform notification centre

### Phase 7 — Trust, Safety & Polish (PLANNED)

- [ ] Content moderation tools (flag/remove projects)
- [ ] Reporting system
- [ ] Terms of service and privacy policy pages
- [ ] Contact/support page
- [ ] Social sharing
- [ ] Mobile responsiveness polish
- [ ] Performance and accessibility audit

---

## Part 2: Post-MVP Roadmap

### Epic 1: Safe Identity & Gamification

- [ ] **Zero-PII Avatars** — A fun avatar builder (choose hairstyles, colours, accessories) that lets students personalise their profile without uploading real photographs, protecting personally identifiable information.
- [ ] **Safe Usernames** — An automated generator that creates safe, anonymous user handles (e.g. "BrightSpark42", "IdeaMaker77") so students never need to use their real name publicly.
- [ ] **Trophy Room** — A digital portfolio and achievement wall where students can display skill badges (e.g. "First Project", "Fully Funded", "Milestone Master") and funding milestones, encouraging progress and celebrating success.

### Epic 2: Educational Hub & Onboarding

- [ ] **Learning Platform** — A centralised resource centre with bite-sized guides, video tutorials, and interactive modules teaching students how to write a business plan, create a pitch, market a project, and manage funds responsibly.
- [ ] **Guided Setup Flows** — Step-by-step interactive wizards that walk students through every stage of creating a campaign, explaining the "why" behind each requirement (e.g. "Why do I need milestones?") so they learn as they build.

### Epic 3: Campaign Management & Teamwork

- [ ] **Guided Video Pitch Integration** — Safe, moderated tools to record or embed a short video pitch directly on the project page, with content review by teachers before publishing.
- [ ] **Scaffolded Micro-Goals** — Tools to break down a large funding target into smaller, achievable steps (e.g. "Week 1: Raise £50 for ingredients") with visual progress tracking and celebratory animations.
- [ ] **Safe Reward Tiers** — A structured system for students to offer backers tangible or digital rewards (e.g. thank-you cards, early access, custom items) with teacher approval on all reward descriptions.
- [ ] **Group / Club Fundraising Mode** — Dedicated project pages for school clubs, sports teams, or student groups to raise funds together under a single campaign with shared management tools.
- [ ] **Multi-User / One Project** — Collaboration tools allowing multiple students to safely co-manage a single campaign — shared editing, split responsibilities, and joint milestone tracking.

### Epic 4: Safe Funding & Financial Mechanics

- [ ] **Safe Funding & Financial Mechanics** — Enhanced payment gateway designed for custodial accounts and minor KYC (Know Your Customer) restrictions, ensuring all fund flows are compliant with regulations for under-18s.
- [ ] **"Materials, Not Cash" Fulfillment** — An option to route raised funds directly to verified vendors (e.g. Amazon, craft suppliers) to purchase supplies on the student's behalf, rather than paying cash to minors.
- [ ] **Stretch Goals** — Allowing projects to set secondary funding targets (e.g. "If we hit £600, we will also buy a logo design") that unlock automatically if the initial goal is met early.
- [ ] **Corporate Matching Grants Integration** — Automated matching from corporate sponsors who pledge to double contributions to qualifying student projects, increasing funding impact.
- [ ] **Youth Grant Matching Integration** — Integration with youth entrepreneurship grant programmes (e.g. Prince's Trust, Young Enterprise) that can top up or match student-raised funds.

### Epic 5: Oversight, Privacy & Verification

- [ ] **Enhanced Parent Dashboard** — An expanded hub for parents to monitor activity, view spending breakdowns, see milestone progress, and manage consent settings — all in one place.
- [ ] **Privacy Checkpoints (The Approval Flow)** — Mandatory review gates at key moments (project creation, going live, first drawdown) requiring parent or teacher sign-off before the student can proceed, with clear audit trails.
- [ ] **Teacher / School Verification Badges** — Visual trust badges displayed on project pages showing that a real teacher at a verified school has reviewed and approved the project, boosting backer confidence.

### Epic 6: Post-Campaign & Community

- [ ] **The "Circle of Gratitude" Impact Reports** — A structured, guided template for students to post updates and photos showing backers exactly how their funds were used, what was achieved, and what they learned along the way.
- [ ] **In-App Mentorship Chat** — Safely moderated, text-based channels where students can get advice from verified alumni, local business owners, or professional mentors — with all messages reviewed for safety.

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
