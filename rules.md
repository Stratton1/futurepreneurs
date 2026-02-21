# Rules — Futurepreneurs

**Purpose:** Hard rules that must never be broken during development. Reference this before making any significant decision.

**Last Updated:** 2026-02-21

---

## 1. Safety Rules (Non-Negotiable)

- **School email required:** Students MUST sign up with a verified school-issued email. No exceptions.
- **Teacher verification:** Every project MUST be verified by a teacher/mentor before going live.
- **Parental consent:** Every project MUST have parental consent before going live.
- **No lump-sum access:** Students NEVER get direct access to full funds. Milestone-based drawdowns only.
- **Teacher approves drawdowns:** Every drawdown request MUST be approved by the assigned teacher/mentor.
- **Audit trail:** Every financial action (backing, drawdown request, approval, disbursement) MUST be logged with timestamp and actor.
- **Content moderation:** Admin MUST have tools to flag, review, and remove inappropriate content.
- **GDPR for minors:** Extra care with data handling. Minimise data collection. Parental consent for data processing.

## 2. Financial Rules

- **Currency:** GBP (£) only. No multi-currency support in v1.
- **Max funding goal:** £10,000 per project. Enforced at creation time.
- **Funding model:** All-or-nothing. Funds only collected when goal is 100% reached.
- **No time limit:** Campaigns run until funded or cancelled by the student.
- **Platform fee:** 2.5% deducted from successfully funded projects before any disbursement.
- **No card data stored:** Stripe handles all payment data. We never store card details.

## 3. Access Control Rules

- **Students** can only see their own projects, milestones, and drawdown requests.
- **Teachers** can only see projects and drawdowns for students they mentor.
- **Parents** can only see their own child's projects and drawdown activity. Cannot approve or reject anything.
- **Investors/Backers** can see public project pages and their own backing history.
- **Admins** can see everything. Admin access is restricted and never given to other roles.
- **Guest checkout** is allowed for backers (no account required to fund a project).
- **No role escalation:** A user cannot change their own role. Only admins can manage roles.

## 4. Code & Engineering Rules

- **Never commit secrets.** All API keys, passwords, and sensitive config go in `.env.local` (which is gitignored).
- **TypeScript strict mode.** No `any` types unless absolutely necessary and documented.
- **Mobile-first.** Every UI component must work on mobile before desktop is considered.
- **Accessible.** Good contrast ratios, keyboard navigation, screen reader support. No decorative-only images without alt text.
- **No over-engineering.** Use the simplest solution that works. Don't build abstractions until there's a clear need.
- **Test critical paths.** Payment logic, drawdown calculations, fee calculations, and auth flows must have tests.
- **Consistent naming.** Follow the conventions in CLAUDE.md — no exceptions.
- **Admin client safety.** When using `createAdminClient()` to bypass RLS, ALWAYS verify user identity via `getCurrentUser()` first. Never expose admin client operations to unauthenticated requests.

## 5. Communication Rules

- **Phase approval required.** Never start a new phase without Joseph's explicit approval.
- **Plain English.** No jargon in communications with Joseph unless he asks for it.
- **1–2 questions at a time.** Don't overwhelm with choices.
- **Options + recommendation.** When a decision is needed, present 2–3 options with a clear recommendation.
- **Report format:** What was done, what's next, any blockers.

## 6. Design Rules

- **Bright, youthful, friendly.** Not corporate. Not patronising.
- **Card-based layouts** for projects.
- **White/light backgrounds** for readability.
- **Rounded, friendly fonts.**
- **Clear calls to action** on every page.
- **Encouraging copy tone.** Use "you" and "your". Keep it short. Be positive.
- **No emoji overload.** Keep it clean.

## 7. Data Rules

- **Soft delete preferred.** Don't permanently delete records — mark them as inactive/archived where possible.
- **Timestamps on everything.** Every record should have `created_at` and `updated_at`.
- **UUID primary keys.** Use UUIDs, not auto-incrementing integers.
- **Consistent status enums.** Define status values clearly and use them consistently across the app.

## 8. Deployment Rules

- **Vercel for hosting.** Deploy via Vercel, connected to the repo.
- **Environment variables** must be set in Vercel dashboard for production.
- **No manual deployments.** Push to main = auto-deploy.
- **Preview deployments** for branches (Vercel does this automatically).
