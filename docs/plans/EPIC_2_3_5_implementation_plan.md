# Epic 2, 3 & 5 — Implementation Plan

**Scope:** Educational Hub & Onboarding (Epic 2), Campaign Management & Teamwork (Epic 3), Oversight, Privacy & Verification (Epic 5).

**Reference:** [roadmap.md](../../roadmap.md) Part 2 — Post-MVP Roadmap.

---

## Prerequisites

- **Codebase state:** Phases 1–7 and Epic 1 are complete (auth, projects, verification, consent, payments, drawdowns, dashboards, notifications, admin, reports, avatars, display handles, trophy room).
- **Environment:** No new env vars required for Epic 2 (static content). Epics 3 and 5 use existing Supabase and app URL.
- **Database:** All migrations 001–006 applied on the target environment (initial schema, drawdown RLS, reports/backings RLS, avatar_config, display_handle, user_badges).

---

## Definitions

- **Micro-goal:** A small, time- or amount-based target within a project (e.g. “Week 1: Raise £50 for ingredients”). Progress is measured against project `total_raised`; distinct from **milestones**, which are funding buckets for drawdowns (e.g. “Buy equipment — £200”).
- **Reward tier:** A backer perk offered by the student (e.g. “Thank-you card for £10+”). Requires teacher approval before it is shown publicly. Stored in `project_reward_tiers`.
- **Checkpoint:** A mandatory approval gate (e.g. “first drawdown”) where a parent or teacher must sign off before the student can proceed; recorded in `approval_checkpoints` for audit.
- **Verification badge:** A trust signal on project cards and detail pages showing “Verified by [Teacher] at [School]” when the project has been reviewed by a teacher.

---

## Success criteria

- **Epic 2 done when:** Students can visit a central Learning hub (`/learn`), read bite-sized guides on business plan, pitch, marketing, and managing funds; and the project-creation flow includes “Why?” explanations and links to Learn. New students see a clear entry point (e.g. “First time? Start here”) from the dashboard.
- **Epic 3 done when:** Students can add a video pitch (allowlisted URLs) that teachers approve before it appears on the project page; define micro-goals with progress and celebration; create teacher-approved reward tiers visible to backers; and create group projects or add collaborators with shared edit access and correct RLS.
- **Epic 5 done when:** Parents have an enhanced dashboard with children, projects, spending breakdown, and consent links; the first drawdown can be gated by a parent checkpoint (optional); and live/funded projects display a “Verified by [Teacher] at [School]” badge on cards and detail pages.

---

## Todo list (comprehensive)

### Epic 2 — Educational Hub & Onboarding

- [ ] **2.1.1** Add learning content manifest (e.g. `src/content/learn/manifest.json`) with slugs and topics.
- [ ] **2.1.2** Create `src/app/(public)/learn/page.tsx` — list resources by topic.
- [ ] **2.1.3** Create `src/app/(public)/learn/[slug]/page.tsx` — dynamic resource page; slugs: business-plan, pitch, marketing, managing-funds.
- [ ] **2.1.4** Add static content (copy) for each of the four topics under `src/content/learn/` or inline in page.
- [ ] **2.2.1** Add "Learn" link to navbar (and footer if applicable).
- [ ] **2.2.2** Add "Why?" / "Learn more" copy and link to project new step "Milestones" (and optionally Basics, Details, Funding, Mentor).
- [ ] **2.2.3** Add "First time? Start here" (or similar) on student dashboard linking to /learn and create project.
- [ ] **2.2.4** (Optional) Add `user_learning_progress` table and "Mark as read" or checklist for modules; show progress on /learn.

### Epic 3 — Campaign Management & Teamwork

- [ ] **3.1.1** Create migration `007_video_pitch_review.sql` (video_pitch_status, video_pitch_reviewed_by, video_pitch_reviewed_at on projects).
- [ ] **3.1.2** Update `src/types/database.ts` for video_pitch fields.
- [ ] **3.1.3** Add video URL field and validation (allowlist: youtube, vimeo, loom) on project create/edit; set video_pitch_status on save.
- [ ] **3.1.4** Add teacher video review UI (approve/reject) and server actions.
- [ ] **3.1.5** On public project page, show video only when video_pitch_status = approved.
- [ ] **3.2.1** Create migration `008_project_micro_goals.sql`.
- [ ] **3.2.2** Add types and queries for micro-goals; CRUD in project actions.
- [ ] **3.2.3** Add micro-goals UI in project edit; show on public project page with progress.
- [ ] **3.2.4** Add celebration (e.g. confetti or badge) when micro-goal target met.
- [ ] **3.3.1** Create migration `009_project_reward_tiers.sql`.
- [ ] **3.3.2** Add types and queries for reward tiers; student add/edit; teacher approve action.
- [ ] **3.3.3** Show "Rewards" on public project page; optional reward choice in back form and checkout metadata.
- [ ] **3.4.1** Create migration `010_project_type_and_members.sql` (project_type, project_members).
- [ ] **3.4.2** Add RLS for project_members; update project RLS so members can read/update.
- [ ] **3.4.3** "Create group project" flow: type selector, add members (same school), save.
- [ ] **3.4.4** Dashboard: list projects where user is lead or member; shared edit access.
- [ ] **3.4.5** "Add collaborator" on existing project; invite by email (same school); update project_type if needed.

### Epic 5 — Oversight, Privacy & Verification

- [ ] **5.1.1** Add `getParentOverview(parentId)` (or equivalent) and wire to parent dashboard.
- [ ] **5.1.2** Add parent dashboard sections: children list, projects & progress, spending breakdown, consent links.
- [ ] **5.2.1** Create migration `011_approval_checkpoints.sql` (if used).
- [ ] **5.2.2** Implement first-drawdown checkpoint: create on first request, block teacher approve until parent approves checkpoint; UI for parent to approve.
- [ ] **5.3.1** Ensure public project query returns mentor name and school for badge.
- [ ] **5.3.2** Create `VerificationBadge` component; add to project card and project detail page.

### Cross-cutting and docs

- [ ] **CC.1** Add/update TypeScript types in `src/types/database.ts` for all new tables and columns (video_pitch, micro_goals, reward_tiers, project_members, approval_checkpoints).
- [ ] **CC.2** Add RLS policies for new tables: project_micro_goals, project_reward_tiers, project_members, approval_checkpoints (as specified in each migration).
- [ ] **CC.3** Update roadmap.md, build_log.md, and project_memory.md when each epic is completed.

---

## Epic 2 — Educational Hub & Onboarding (detail)

**Goal:** Centralised learning content and guided project creation so students learn as they build.

### 2.1 Learning Platform

- **Content model (v1):** Static approach. No new DB table for v1. Use a manifest file at `src/content/learn/manifest.json` (or `src/content/learn/index.ts`) that exports an array of resources: `{ slug, title, description, topic }` where `topic` is one of `business_plan | pitch | marketing | managing_funds`. Slug-to-content mapping: either (a) one React page per slug that imports static copy, or (b) a single dynamic page `src/app/(public)/learn/[slug]/page.tsx` that switches on slug and renders inline copy or a markdown file from `src/content/learn/[slug].md`. Recommendation: (b) with inline copy or small JSON/MD files per topic to avoid extra build complexity.
- **Routes:**
  - `src/app/(public)/learn/page.tsx` — List all resources grouped by topic (four categories). Uses manifest to build the list; links to `/learn/[slug]`.
  - `src/app/(public)/learn/[slug]/page.tsx` — Dynamic resource page. Valid slugs: `business-plan`, `pitch`, `marketing`, `managing-funds`. Return 404 for unknown slugs. Reuse existing `(public)` layout and Navbar/Footer.
- **Learning topics and suggested headings:**
  - **business-plan:** What is a business plan?; Your idea in one sentence; Who is it for?; What do you need the money for?; “Learn more” link from project creation step “Details” or “Funding”.
  - **pitch:** What is a pitch?; Your project in 30 seconds; Why should someone back you?; “Learn more” from step “Basics” or “Review”.
  - **marketing:** How to tell people about your project; Social media safely; Asking for support; “Learn more” from step “Review” or a future “Promote” section.
  - **managing-funds:** Why milestones matter; Spending responsibly; When can you use the money?; “Learn more” from project creation step “Milestones” (step index 3 in STEPS array in `src/app/dashboard/projects/new/page.tsx`).
- **Content:** Bite-sized copy per topic (2–4 short sections); optional embedded YouTube/Vimeo/Loom URL in a dedicated “Watch” block; tone friendly and age-appropriate (no jargon). No external API; all copy in repo.
- **Optional (v1.1):** Table `user_learning_progress` (user_id, resource_slug, completed_at); “Mark as read” or checklist per resource; show “You’ve completed 3 of 4” on `/learn` when logged in.

### 2.2 Guided Setup Flows

- **Where:** Existing project creation is multi-step in [src/app/dashboard/projects/new/page.tsx](../../src/app/dashboard/projects/new/page.tsx). The `STEPS` array has 6 steps: Basics, Details, Funding, Milestones, Mentor, Review. Add “Why this matters” or “Learn more” in the following places:
  - **Step 0 (Basics):** Short line under title/category: “A clear title and description help backers understand your idea.” Link to `/learn/pitch`.
  - **Step 1 (Details):** “Describe what you’ll do and what you need.” Link to `/learn/business-plan`.
  - **Step 2 (Funding):** “Set a realistic goal — you can’t change it once live.” Link to `/learn/managing-funds`.
  - **Step 3 (Milestones):** Expandable or tooltip: “Why do I need milestones? — They help you and your backers see how the money will be used, and your teacher approves each use.” Link to `/learn/managing-funds`.
  - **Step 4 (Mentor):** “A teacher from your school verifies your project so backers know it’s real.” Optional link to How it works.
  - **Step 5 (Review):** No mandatory addition; optional “Tips for a great project” linking to `/learn`.
- **Entry points:**
  - **Navbar:** [src/components/features/navbar.tsx](../../src/components/features/navbar.tsx) — Add a “Learn” link (e.g. next to “How It Works”) pointing to `/learn`. Visible to all; no auth required.
  - **Footer:** If [src/components/features/footer.tsx](../../src/components/features/footer.tsx) has a links column, add “Learning resources” → `/learn`.
  - **Dashboard:** [src/app/dashboard/page.tsx](../../src/app/dashboard/page.tsx) — For role `student`, add a prominent card or banner: “First time? Start here — Learn how to create a great project, then create yours.” Primary CTA to `/learn`, secondary to `/dashboard/projects/new`.
- **Acceptance criteria:**
  - A user can open `/learn` and see four topics (business plan, pitch, marketing, managing funds); each topic has at least one resource; clicking a resource opens `/learn/[slug]` with readable content.
  - On project new step “Milestones” (step 3), a “Why do I need milestones?” expandable or tooltip is visible and includes a link to `/learn/managing-funds`.
  - A student on the dashboard sees “First time? Start here” (or equivalent) with a link to `/learn` and to create a project.
  - Navbar shows “Learn” linking to `/learn`.

---

## Epic 3 — Campaign Management & Teamwork (detail)

**Goal:** Richer campaigns (video pitch, micro-goals, rewards), teacher-moderated content, group/multi-user projects.

### 3.1 Guided Video Pitch Integration

- **Schema (migration `007_video_pitch_review.sql`):** Add to `projects`: `video_pitch_status TEXT` (check or enum: `pending_review`, `approved`, `rejected`), `video_pitch_reviewed_by UUID REFERENCES user_profiles(id)`, `video_pitch_reviewed_at TIMESTAMPTZ`. Default `video_pitch_status` to `pending_review` when `video_url` is set. No new RLS on projects; existing project RLS suffices.
- **Allowed domains:** Only allow video URLs from: `youtube.com`, `www.youtube.com`, `youtu.be`, `vimeo.com`, `www.vimeo.com`, `loom.com`, `www.loom.com`. Validate in server action (e.g. in [src/app/dashboard/projects/actions.ts](../../src/app/dashboard/projects/actions.ts)); reject with error message: “Video must be from YouTube, Vimeo, or Loom.”
- **File paths:** (1) Project create/edit form: [src/app/dashboard/projects/new/page.tsx](../../src/app/dashboard/projects/new/page.tsx) and edit page under `src/app/dashboard/projects/[id]/edit/` — add or reuse “Video pitch URL” field; on save call action that sets `video_url` and `video_pitch_status = pending_review` if URL changed. (2) Teacher review: add a “Video pitch” section to [src/app/dashboard/verify/[id]/page.tsx](../../src/app/dashboard/verify/[id]/page.tsx) (or dedicated “Review video” area) with Approve / Reject buttons. (3) Public project page: [src/app/(public)/projects/[id]/page.tsx](../../src/app/(public)/projects/[id]/page.tsx) — render video embed only when `video_pitch_status === 'approved'`; otherwise show “Video under review” or nothing.
- **Actions:** `updateProjectVideoPitch(projectId, videoUrl)` (student: validate URL, set video_url and video_pitch_status); `approveVideoPitch(projectId)`, `rejectVideoPitch(projectId)` (teacher only). Place in [src/app/dashboard/projects/actions.ts](../../src/app/dashboard/projects/actions.ts) or in verify actions. Notify student on approve/reject (existing notification pattern).
- **Acceptance criteria:** Student can add a YouTube/Vimeo/Loom URL on project create/edit; after save, video shows “Under review” in dashboard. Teacher can approve or reject on verify page; when approved, video appears on public project page; when rejected, it does not.

### 3.2 Scaffolded Micro-Goals

- **Schema (migration `008_project_micro_goals.sql`):** Create table `project_micro_goals` with columns: `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`, `project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE`, `label TEXT NOT NULL`, `target_amount NUMERIC(10,2) NOT NULL CHECK (target_amount > 0)`, `sort_order INTEGER NOT NULL DEFAULT 0`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`. Index on `project_id`. RLS: enable RLS; policy SELECT/INSERT/UPDATE/DELETE for users who can SELECT the project (same as milestones: student owner, mentor, or public if live/funded/completed).
- **Queries:** Add `getMicroGoalsByProject(projectId)` and `upsertMicroGoals(projectId, goals[])` (replace all micro-goals for project). File: `src/lib/queries/micro-goals.ts` or extend [src/lib/queries/projects.ts](../../src/lib/queries/projects.ts). Include micro-goals in project detail query where needed.
- **Student UI:** In project edit (e.g. new “Micro-goals” step or tab, or same page as milestones), allow add/remove/reorder micro-goals; each row: label (text), target amount (number). Save via server action that calls upsert. Public project page: new section “Micro-goals” or “Goals” (above or below main milestones) with list of micro-goals and a progress bar per goal: `min(100, (total_raised / target_amount) * 100)`; when `total_raised >= target_amount`, show as complete (e.g. checkmark or “Done”).
- **Celebration:** When project page loads and `total_raised >= target_amount` for one or more micro-goals that were previously incomplete, trigger a one-time celebration (e.g. CSS animation, confetti component, or small “Goal reached!” badge). Can be client-side only (compare previous total_raised from sessionStorage or prop) or a lightweight API that returns “newly completed micro-goal ids” for this session.
- **Acceptance criteria:** Student can add/edit/remove micro-goals on project edit; public project page shows micro-goals with progress; when funding reaches a micro-goal target, a celebration or “reached” state is visible.

### 3.3 Safe Reward Tiers

- **Schema (migration `009_project_reward_tiers.sql`):** Create table `project_reward_tiers` with columns: `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`, `project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE`, `title TEXT NOT NULL`, `description TEXT`, `min_amount NUMERIC(10,2) NOT NULL CHECK (min_amount >= 0)`, `sort_order INTEGER NOT NULL DEFAULT 0`, `teacher_approved_at TIMESTAMPTZ`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`. RLS: SELECT for project visibility; INSERT/UPDATE for project owner (student); UPDATE teacher_approved_at only for project mentor. Max 5 tiers per project (enforce in app).
- **Student UI:** On project create/edit, section “Reward tiers” (optional): add up to 5 tiers with title, description, minimum amount. Save as pending (teacher_approved_at = null). Teacher UI: In verify page or project review, list reward tiers; buttons “Approve” / “Reject” per tier; on Approve set `teacher_approved_at = now()`.
- **Public:** Project page “Rewards” section: list tiers where `teacher_approved_at IS NOT NULL`, ordered by sort_order/min_amount. Back form ([BackProjectForm](../../src/components/features/back-project-form.tsx)): optional “Choose a reward” dropdown (tier id + label); pass `reward_tier_id` in checkout metadata or backings table if column added. Types: extend Backing or checkout payload with optional `reward_tier_id`.
- **Acceptance criteria:** Student can add reward tiers; teacher can approve/reject; only approved tiers appear on public page; backer can optionally select a tier when backing (and it is stored for fulfilment reference).

### 3.4 Group / Club & Multi-User

- **Schema (migration `010_project_type_and_members.sql`):** Add to `projects`: `project_type TEXT NOT NULL DEFAULT 'individual'` (check: `project_type IN ('individual', 'group')`). Create table `project_members` with columns: `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`, `project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE`, `user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE`, `role TEXT NOT NULL DEFAULT 'member'` (check: `role IN ('lead', 'member')`), `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, UNIQUE(project_id, user_id). Index on project_id and user_id. RLS: enable on project_members; SELECT for users who are in project_members for that project, or are project student/mentor, or parent of student; INSERT for project student (lead) or mentor (inviting on behalf); UPDATE/DELETE for lead or mentor. Update projects RLS so that SELECT/UPDATE is also allowed for users who appear in project_members (so members can edit).
- **Create group project flow:** Route: reuse `/dashboard/projects/new` with query param `?type=group` or a type selector at step 0. When type is group: after basics, add “Add team members” step — search students from same school (same school_id as current user); add by email or select from list; store in project_members with role `member`; creator is `lead`. Save project with `project_type = 'group'` and insert project_members. Only lead can remove members in v1 (optional).
- **Dashboard:** “My Projects” ([src/app/dashboard/projects/page.tsx](../../src/app/dashboard/projects/page.tsx)) must include projects where current user is in project_members (in addition to student_id). Query: e.g. `getProjectsForUser(userId)` that returns projects where `student_id = userId OR id IN (SELECT project_id FROM project_members WHERE user_id = userId)`.
- **Add collaborator to existing project:** On project edit or settings page (for project owner/lead), “Add collaborator” — input email; validate same school; insert into project_members; optionally set project_type to `group` if currently `individual`. Notify added user (optional).
- **Acceptance criteria:** Student can create a group project and add members from same school; all members see the project in “My Projects” and can edit. Student can add a collaborator to an existing individual project; collaborator sees project and can edit.

---

## Epic 5 — Oversight, Privacy & Verification (detail)

**Goal:** Stronger parent oversight, approval gates, visible trust signals.

### 5.1 Enhanced Parent Dashboard

- **Data:** New query `getParentOverview(parentId)` (or equivalent) return shape: list of linked children (id, full_name, email); per child, list of projects (id, title, status, goal_amount, total_raised, milestone summary); per project, recent drawdowns (amount, status, date). Reuse or compose from existing `getDrawdownsForParent`, project list by parent/consent. File: add to [src/lib/queries/](../../src/lib/queries/) e.g. `parent-overview.ts` or extend drawdowns/projects.
- **UI:** Where it lives: either extend [src/app/dashboard/page.tsx](../../src/app/dashboard/page.tsx) for role `parent` with new sections, or create `src/app/dashboard/parent/page.tsx` and redirect parents there from dashboard home. Sections: (1) “Your children” — list with link to consent/drawdowns; (2) “Projects & progress” — per child, their projects with funding bar and milestone status; (3) “Spending breakdown” — list of approved drawdowns (project, amount, date); (4) “Consent” — link to existing `/dashboard/consent`. Use existing components and links to drawdown/consent pages.

### 5.2 Privacy Checkpoints (Approval Flow)

- **Schema (migration `011_approval_checkpoints.sql`, optional):** Create table `approval_checkpoints` with columns: `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`, `project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE`, `checkpoint_type TEXT NOT NULL` (e.g. `first_drawdown`), `approved_by UUID REFERENCES user_profiles(id)`, `approved_at TIMESTAMPTZ`, `notes TEXT`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`. Unique on (project_id, checkpoint_type) so one approval per type per project. RLS: SELECT for project student, mentor, parent (consent); INSERT for system or student (when creating checkpoint); UPDATE for parent (to set approved_by/approved_at).
- **When checkpoint is created and when it blocks:** For `first_drawdown`: when the first drawdown request is submitted for a project (no prior drawdown requests exist), insert a row into `approval_checkpoints` with checkpoint_type = `first_drawdown`, approved_by = null. Teacher approval of that drawdown request is blocked until a parent has approved the checkpoint (approved_by and approved_at set). Parent can approve from dashboard or consent area: “First drawdown request for [Project] — Approve to allow mentor to release funds.” Action: `approveCheckpoint(projectId, checkpointType)` (parent only).
- **UI:** Parent dashboard or consent page: show “Pending checkpoints” when there are checkpoints for their child’s projects with approved_at IS NULL; button “Approve” calls `approveCheckpoint`. Drawdown approval action (teacher): before updating drawdown to approved, check that if checkpoint_type = first_drawdown exists for this project, it has been approved; otherwise return error.

### 5.3 Teacher / School Verification Badges

- **Data:** Ensure public project query (e.g. [src/lib/queries/public-projects.ts](../../src/lib/queries/public-projects.ts) LIST_SELECT and DETAIL_SELECT) returns mentor relation with `full_name` and mentor’s school (join through user_profiles.school_id to schools.name). If projects do not have a `verified_at` timestamp, the badge can rely on “has mentor + status is live/funded/completed”. Optionally add `projects.verified_at TIMESTAMPTZ` (set when teacher verifies project) for “Verified on [date]” copy.
- **Component:** Create [src/components/features/verification-badge.tsx](../../src/components/features/verification-badge.tsx). Props: `teacherName: string`, `schoolName: string`, `verifiedAt?: string | null`. Renders a small badge (e.g. shield icon + “Verified by [Teacher] at [School]”). Use on [ProjectCard](../../src/components/features/project-card.tsx) (compact) and on [src/app/(public)/projects/[id]/page.tsx](../../src/app/(public)/projects/[id]/page.tsx) (detail page). Only render when project status is live, funded, or completed and mentor is set.
- **Acceptance criteria:** Live/funded/completed projects with a mentor display “Verified by [Teacher name] at [School name]” on the project card and on the project detail page.

---

## Data model summary (migrations)

| Migration | Purpose |
|-----------|---------|
| `007_video_pitch_review.sql` | video_pitch_status, video_pitch_reviewed_by, video_pitch_reviewed_at on projects |
| `008_project_micro_goals.sql` | project_micro_goals table |
| `009_project_reward_tiers.sql` | project_reward_tiers table |
| `010_project_type_and_members.sql` | project_type on projects, project_members table |
| `011_approval_checkpoints.sql` | approval_checkpoints table (optional) |

---

## Execution order (recommended)

1. **Epic 5** — Verification badges, enhanced parent dashboard, then privacy checkpoints.
2. **Epic 2** — Learning centre (`/learn`), then guided setup copy/tooltips in project creation.
3. **Epic 3** — Video pitch (007 + UI) → micro-goals (008 + UI) → reward tiers (009 + UI) → group/multi-user (010 + UI and RLS).

---

## Implementation notes and risks

- **Risks and dependencies:** (1) Group project and multi-user share the same `project_members` table and RLS; ensure project list queries and edit permissions are consistent. (2) Video URL allowlist (YouTube, Vimeo, Loom) must be maintained; new domains require code change and safety review. (3) Parent overview query may need pagination or limits if a parent has many children or projects; start with a simple list and optimize if needed. (4) First-drawdown checkpoint adds a step for parents; ensure copy is clear and notifications point to the right place.
- **Testing checklist (manual):**
  - Epic 2: Open /learn, click each topic, read content; create new project and confirm “Why?” / “Learn more” appears on Milestones step; as new student, confirm dashboard shows “First time? Start here” with link to /learn.
  - Epic 3: Add video pitch URL (YouTube), save; as teacher, approve video and confirm it appears on public page. Add micro-goals, back project past a target, confirm progress and celebration. Add reward tiers, teacher approves, confirm tiers on public page and optional selection in back form. Create group project, add member from same school, confirm both see project and can edit; add collaborator to individual project, confirm collaborator sees and can edit.
  - Epic 5: As parent, open dashboard and confirm children, projects, spending breakdown, consent links. Submit first drawdown as student; as parent approve checkpoint; as teacher approve drawdown. Confirm live project shows “Verified by [Teacher] at [School]” on card and detail page.
- **Rollback:** Migrations 007–011 can be reverted with down migrations if a release is rolled back. Create corresponding down migrations when adding: `007_video_pitch_review.sql` (drop columns), `008_project_micro_goals.sql` (drop table), `009_project_reward_tiers.sql` (drop table), `010_project_type_and_members.sql` (drop table and column), `011_approval_checkpoints.sql` (drop table). Application code should handle missing columns/tables gracefully (e.g. no video status shown, no micro-goals section) when running against an older DB.

---

## Out of scope

- Epic 4 (Wallet), Epic 6 (Impact reports, chat), Epic 7 (Stretch goals, matching).
- Admin-editable learning content (phase 2 of Epic 2).
