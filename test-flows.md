# Futurepreneurs — Test Flows & Credentials

**Created:** 2026-02-20
**Covers:** Phase 1 (Auth) + Phase 2 (Project Creation & Verification)
**Live URL:** https://futurepreneurs-sigma.vercel.app/

---

## Test Accounts

> **Password for ALL test accounts:** `TestPass123!`
>
> These accounts need to be created manually in Supabase Auth **and** the `user_profiles` table.
> A test school must also be added to the `schools` table first.

### Test School

| Field | Value |
|-------|-------|
| Name | Greenfield Academy |
| Email Domain | greenfield.sch.uk |
| City | Manchester |
| County | Greater Manchester |
| is_active | true |

### Student Accounts (2)

| # | Full Name | Email | Role | School |
|---|-----------|-------|------|--------|
| 1 | Emma Watson | emma.watson@greenfield.sch.uk | student | Greenfield Academy |
| 2 | James Patel | james.patel@greenfield.sch.uk | student | Greenfield Academy |

### Teacher Accounts (2)

| # | Full Name | Email | Role | Notes |
|---|-----------|-------|------|-------|
| 1 | Mr David Clarke | d.clarke@greenfield.sch.uk | teacher | Primary mentor for tests |
| 2 | Ms Sarah Thompson | s.thompson@greenfield.sch.uk | teacher | Secondary mentor |

### Parent Accounts (2)

| # | Full Name | Email | Role | Linked To |
|---|-----------|-------|------|-----------|
| 1 | Rachel Watson | rachel.watson@gmail.com | parent | Emma Watson (student 1) |
| 2 | Priya Patel | priya.patel@gmail.com | parent | James Patel (student 2) |

### Investor / Backer Accounts (2)

| # | Full Name | Email | Role |
|---|-----------|-------|------|
| 1 | Tom Bridges | tom.bridges@outlook.com | investor |
| 2 | Aisha Khan | aisha.khan@yahoo.com | investor |

### Admin Account (2)

| # | Full Name | Email | Role |
|---|-----------|-------|------|
| 1 | Admin One | admin@futurepreneurs.co.uk | admin |
| 2 | Admin Two | admin2@futurepreneurs.co.uk | admin |

---

## How to Create Test Accounts in Supabase

1. Go to your **Supabase dashboard** → Authentication → Users
2. Click **Add user** → **Create new user**
3. Enter the email and password (`TestPass123!`)
4. Tick **Auto Confirm User** (so you skip email verification)
5. Copy the user's **UUID** from the list after creation
6. Go to **Table Editor** → `user_profiles` → **Insert row**
7. Fill in: `id` (paste the UUID), `email`, `full_name`, `role`, `school_id` (for students/teachers — get this from the `schools` table), `is_verified` = true, `is_active` = true
8. Repeat for each account

**Important:** Create the school record in the `schools` table BEFORE creating student accounts, so the `school_id` foreign key works.

---

## Test Flows

### FLOW 1 — Homepage & Navigation

**Goal:** Confirm the public homepage loads and navigation works.
**User:** Not logged in (guest)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1.1 | Visit https://futurepreneurs-sigma.vercel.app/ | Homepage loads with hero section, navigation bar, and footer |
| 1.2 | Click "Sign Up" in the nav | Taken to /signup — see the role selection screen (Student, Teacher, Parent, Backer) |
| 1.3 | Click "Log In" in the nav | Taken to /login — see email + password form |
| 1.4 | Click the Futurepreneurs logo | Returns to homepage |
| 1.5 | Resize browser to mobile width (< 640px) | Layout adjusts — everything still readable, no horizontal scrolling |

---

### FLOW 2 — Sign Up (All Roles)

**Goal:** Confirm each role can sign up correctly.

#### 2A — Student Sign-Up

**User:** New student (not in the system yet)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 2A.1 | Go to /signup | See the "I am a..." role picker |
| 2A.2 | Click "Student" | Form appears with Full Name, Email, Password fields. Hint under email says "You must use your school email address" |
| 2A.3 | Enter name: "Test Student", email: "test@gmail.com", password: "TestPass123!" | - |
| 2A.4 | Click "Create Account" | **Error:** "Students must sign up with a school email address..." — because gmail.com is not a registered school |
| 2A.5 | Change email to "test@greenfield.sch.uk", submit again | **Success:** "Check your email to verify your account!" message appears |
| 2A.6 | Click "← Change role" link before submitting | Goes back to role selection |

#### 2B — Teacher Sign-Up

**User:** New teacher

| Step | Action | Expected Result |
|------|--------|-----------------|
| 2B.1 | Go to /signup → Click "Teacher / Mentor" | Form shows "Signing up as: Teacher / Mentor" |
| 2B.2 | Enter name: "Test Teacher", email: "teacher@gmail.com", password: "TestPass123!" | - |
| 2B.3 | Submit | **Success:** No school email restriction for teachers — account created message shown |

#### 2C — Parent Sign-Up

| Step | Action | Expected Result |
|------|--------|-----------------|
| 2C.1 | Go to /signup → Click "Parent / Guardian" | Form shows "Signing up as: Parent / Guardian" |
| 2C.2 | Fill in valid details, submit | **Success** |

#### 2D — Investor Sign-Up

| Step | Action | Expected Result |
|------|--------|-----------------|
| 2D.1 | Go to /signup → Click "Backer / Supporter" | Form shows "Signing up as: Investor / Backer" |
| 2D.2 | Fill in valid details, submit | **Success** |

#### 2E — Validation Checks

| Step | Action | Expected Result |
|------|--------|-----------------|
| 2E.1 | Submit with empty fields | Form won't submit (HTML required attributes) |
| 2E.2 | Enter a single-word name (e.g. "Emma") | **Error:** "Please enter your full name (first and last name)" |
| 2E.3 | Enter a weak password (e.g. "password") | **Error:** "Password must contain at least one uppercase letter" |
| 2E.4 | Enter a short password (e.g. "Ab1") | **Error:** "Password must be at least 8 characters long" |
| 2E.5 | Enter a password with no number (e.g. "Abcdefgh") | **Error:** "Password must contain at least one number" |

---

### FLOW 3 — Login & Dashboard

**Goal:** Confirm login works and each role sees the correct dashboard.

#### 3A — Student Login

**User:** Emma Watson (student 1)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 3A.1 | Go to /login | Login form shown |
| 3A.2 | Enter email: emma.watson@greenfield.sch.uk, password: TestPass123! | - |
| 3A.3 | Click "Log In" | Redirected to /dashboard |
| 3A.4 | Check dashboard content | Shows "Welcome, Emma Watson!", role = "Student", quick action = "My Projects" |
| 3A.5 | Click "My Projects" quick action | Goes to /dashboard/projects — shows empty state: "Create Your First Project" |
| 3A.6 | Click "Log out" button | Logged out, redirected to homepage or login |

#### 3B — Teacher Login

**User:** Mr David Clarke (teacher 1)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 3B.1 | Log in as d.clarke@greenfield.sch.uk | Redirected to /dashboard |
| 3B.2 | Check dashboard | Shows "Welcome, Mr David Clarke!", role = "Teacher / Mentor", quick action = "Verify Projects" |
| 3B.3 | Click "Verify Projects" | Goes to /dashboard/verify — shows empty state (no pending projects yet) |

#### 3C — Parent Login

**User:** Rachel Watson (parent 1)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 3C.1 | Log in as rachel.watson@gmail.com | Redirected to /dashboard |
| 3C.2 | Check dashboard | Shows welcome + role = "Parent / Guardian", quick action = "Consent Requests" |
| 3C.3 | Click "Consent Requests" | Goes to /dashboard/consent — empty state (no projects need consent yet) |

#### 3D — Investor Login

**User:** Tom Bridges (investor 1)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 3D.1 | Log in as tom.bridges@outlook.com | Redirected to /dashboard |
| 3D.2 | Check dashboard | Shows welcome + role = "Investor / Backer", quick action = "Browse Projects" |

#### 3E — Wrong Password

| Step | Action | Expected Result |
|------|--------|-----------------|
| 3E.1 | Enter a valid email but wrong password | **Error:** "Invalid email or password. Please try again." |
| 3E.2 | Enter a completely unknown email | **Error:** Same message (no information leak about which accounts exist) |

---

### FLOW 4 — Project Creation (Student)

**Goal:** Student creates a complete project with milestones and selects a mentor.
**User:** Emma Watson (student 1)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.1 | Log in as Emma Watson | Dashboard shown |
| 4.2 | Go to /dashboard/projects | "My Projects" page, empty state shown |
| 4.3 | Click "Create Your First Project" (or "+ New Project" button) | Taken to /dashboard/projects/new — Step 1 of 6 shown (Basics) |

#### Step 1 — Basics

| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.4 | Leave title empty, click Next | "Next" button is disabled (title must be 3+ chars) |
| 4.5 | Enter title: "Emma's Eco Candles" | - |
| 4.6 | Enter short description (10+ chars): "Handmade eco-friendly candles from recycled materials" | - |
| 4.7 | Select category: "Crafts & Making" | - |
| 4.8 | Click "Next" | Moves to Step 2 (Details) |

#### Step 2 — Details

| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.9 | Enter a description under 50 chars | "Next" button stays disabled |
| 4.10 | Enter a full description (50+ chars): "I want to start a candle-making business using recycled wax and sustainable materials. Each candle will be hand-poured and use natural fragrances. I plan to sell them at school fairs and online to start with." | - |
| 4.11 | Optionally add a video URL | - |
| 4.12 | Click "Next" | Moves to Step 3 (Funding) |

#### Step 3 — Funding

| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.13 | Enter goal amount: 0 | "Next" stays disabled |
| 4.14 | Enter goal amount: 15000 | Should show validation error (max £10,000) |
| 4.15 | Enter goal amount: 500 | - |
| 4.16 | Click "Next" | Moves to Step 4 (Milestones) |

#### Step 4 — Milestones

| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.17 | See milestone editor. Add milestone: "Buy wax and materials — £200" | First milestone row added |
| 4.18 | Add milestone: "Buy moulds and packaging — £150" | Second milestone row |
| 4.19 | Add milestone: "First market stall fees — £150" | Third milestone |
| 4.20 | Check that milestone total matches the £500 goal | Total shown = £500 = goal. "Next" becomes enabled |
| 4.21 | Change one milestone to break the total (e.g. £100 instead of £150) | Total = £450 ≠ £500. "Next" is disabled. Error message shown. |
| 4.22 | Fix the amount back to £150, click "Next" | Moves to Step 5 (Mentor) |

#### Step 5 — Mentor

| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.23 | Page loads teachers from /api/teachers | Dropdown or list shows Mr David Clarke and Ms Sarah Thompson (teachers at Greenfield Academy) |
| 4.24 | Select "Mr David Clarke" as mentor | - |
| 4.25 | Click "Next" | Moves to Step 6 (Review) |

#### Step 6 — Review & Submit

| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.26 | Review screen shows all entered details: title, description, category, goal, milestones, mentor | All correct |
| 4.27 | Click "Save as Draft" | Project saved. Redirected to /dashboard/projects. Project appears with "Draft" status badge (grey) |

---

### FLOW 5 — Submit for Verification (Student)

**Goal:** Student submits a draft project for teacher review.
**User:** Emma Watson (student 1)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 5.1 | Go to /dashboard/projects | See "Emma's Eco Candles" with Draft badge |
| 5.2 | Click "Submit for Review" button | Confirmation dialog appears |
| 5.3 | Confirm | Status changes to "Pending Verification" (amber badge). Submit button disappears. |
| 5.4 | Check the notifications table in Supabase | A notification was created for Mr David Clarke (the mentor) with type "verification_request" |

---

### FLOW 6 — Teacher Verification

**Goal:** Teacher reviews and approves/rejects a student project.
**User:** Mr David Clarke (teacher 1)

#### 6A — Approve a Project

| Step | Action | Expected Result |
|------|--------|-----------------|
| 6A.1 | Log in as d.clarke@greenfield.sch.uk | Dashboard shown |
| 6A.2 | Click "Verify Projects" | /dashboard/verify — see "Emma's Eco Candles" in the pending section with amber border |
| 6A.3 | Click on the project | /dashboard/verify/[id] — full project details shown: description, funding goal, milestones, video |
| 6A.4 | Click "Approve" | Project status changes to "Pending Consent" |
| 6A.5 | Check notifications table | Notification sent to Emma Watson ("Project approved by teacher!") AND to the linked parent (Rachel Watson) ("Consent needed") |
| 6A.6 | Return to /dashboard/verify | Project no longer in the "pending" section |

#### 6B — Request Changes

**Prereq:** Create a second project as James Patel, submit it for verification with Mr Clarke as mentor.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 6B.1 | Log in as Mr Clarke, go to /dashboard/verify | See James's project in pending |
| 6B.2 | Click on the project | Details page shown |
| 6B.3 | Click "Request Changes" | Feedback textarea appears |
| 6B.4 | Enter feedback: "Please add more detail about how you'll spend the materials budget" | - |
| 6B.5 | Submit | Project status returns to "Draft". Notification sent to James. |
| 6B.6 | Log in as James → /dashboard/projects | Project shows Draft badge again. Student can edit and re-submit. |

#### 6C — Reject a Project

| Step | Action | Expected Result |
|------|--------|-----------------|
| 6C.1 | Create and submit a test project, then log in as teacher | See project in pending |
| 6C.2 | Click "Reject" | Reason textarea appears |
| 6C.3 | Enter reason: "This project is not suitable for the platform" | - |
| 6C.4 | Submit | Project status set to "Cancelled". Notification sent to student. |

---

### FLOW 7 — Invite Parent (Student)

**Goal:** Student links a parent to their project so the parent can give consent.
**User:** Emma Watson (student 1)

**Prereq:** Emma's project must be in "Pending Consent" status (teacher has approved it).

| Step | Action | Expected Result |
|------|--------|-----------------|
| 7.1 | Log in as Emma, go to /dashboard/projects | See project with "Pending Consent" badge and "Invite Parent" button |
| 7.2 | Click "Invite Parent" | Taken to /dashboard/projects/[id]/invite-parent |
| 7.3 | Enter email: nonexistent@email.com | **Error:** "No parent account found with that email. They need to sign up as a parent first." |
| 7.4 | Enter email: rachel.watson@gmail.com | **Success:** Parent linked to project |
| 7.5 | Try the same email again | **Error:** "This parent is already linked to this project" |
| 7.6 | Check `parental_consents` table in Supabase | New record: student_id = Emma, parent_id = Rachel, project_id = the project, status = "pending" |

---

### FLOW 8 — Parental Consent

**Goal:** Parent reviews and gives or declines consent.
**User:** Rachel Watson (parent 1)

#### 8A — Give Consent

| Step | Action | Expected Result |
|------|--------|-----------------|
| 8A.1 | Log in as rachel.watson@gmail.com | Dashboard shown |
| 8A.2 | Click "Consent Requests" | /dashboard/consent — see Emma's project with orange border |
| 8A.3 | Click on the project | /dashboard/consent/[id] — full project details + blue info box explaining what consent means |
| 8A.4 | Click "Give Consent" | Confirmation dialog appears |
| 8A.5 | Confirm | Project status changes to "Live" |
| 8A.6 | Check notifications | Emma receives "Your project is live!" notification. Mr Clarke receives "Project is live" notification. |
| 8A.7 | Return to /dashboard/consent | No more pending projects |

#### 8B — Decline Consent

**Prereq:** Set up a second project (James Patel's) at "Pending Consent" with Priya Patel linked as parent.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 8B.1 | Log in as priya.patel@gmail.com | See James's project in consent requests |
| 8B.2 | Click on the project | Details page shown |
| 8B.3 | Click "Decline" | Reason textarea appears |
| 8B.4 | Enter reason: "I'd like to discuss this further before approving" | - |
| 8B.5 | Submit | Project returns to "Draft" status. James gets a notification explaining the decline. |

---

### FLOW 9 — Full Happy Path (End-to-End)

**Goal:** Walk through the entire journey from project creation to going live.
**Users:** Emma Watson (student), Mr David Clarke (teacher), Rachel Watson (parent)

| Step | Who | Action | Expected Status After |
|------|-----|--------|-----------------------|
| 9.1 | Emma | Creates a project with milestones, selects Mr Clarke as mentor | **Draft** |
| 9.2 | Emma | Submits project for review | **Pending Verification** |
| 9.3 | Mr Clarke | Logs in, sees project in verify list, approves it | **Pending Consent** |
| 9.4 | Emma | Invites Rachel Watson as parent | Parental consent record created |
| 9.5 | Rachel | Logs in, sees project in consent list, gives consent | **Live** |
| 9.6 | Emma | Checks dashboard — project shows "Live" badge | Confirmed |
| 9.7 | Guest | (Not yet built) Visits project page — should be publicly visible | Phase 3 |

---

### FLOW 10 — Edge Cases & Error Handling

| # | Test | Expected Result |
|---|------|-----------------|
| 10.1 | Teacher tries to access /dashboard/projects/new | Should be blocked (only students can create projects). Ideally redirected or shown an error. |
| 10.2 | Parent tries to access /dashboard/verify | Should see empty state or be blocked |
| 10.3 | Student tries to access /dashboard/verify | Should see empty state or be blocked |
| 10.4 | Not logged in, visit /dashboard | Redirected to /login |
| 10.5 | Student creates project, another student tries to submit it | Error: "You can only submit your own projects" |
| 10.6 | Teacher who is NOT the mentor tries to approve a project | Error: "You are not the mentor for this project" |
| 10.7 | Try to submit a project that's already pending verification | Error: "Only draft projects can be submitted" |
| 10.8 | Parent tries to consent to a project they're not linked to | Error: "You do not have permission to consent to this project" |
| 10.9 | Try to give consent when project is not in pending_consent status | Error: "This project is not awaiting consent" |
| 10.10 | Create a project with milestone amounts that don't add up to the goal | Form prevents proceeding (Next button disabled) |

---

### FLOW 11 — Mobile Responsiveness

**Goal:** Confirm key pages work well on a phone-sized screen.

| Step | Page | What to Check |
|------|------|---------------|
| 11.1 | Homepage | Hero text readable, buttons tappable, no overflow |
| 11.2 | Sign-up page | Role cards stack vertically, form fields full-width |
| 11.3 | Login page | Form centred and usable |
| 11.4 | Dashboard | Welcome card stacks properly, quick actions full-width |
| 11.5 | Create Project wizard | Steps indicator visible, form fields usable, milestone editor workable |
| 11.6 | Teacher verify page | Project cards stack, all text readable |
| 11.7 | Parent consent page | Project cards stack, buttons tappable |

---

## Quick Reference — Account Pairs

For testing flows that involve two roles interacting:

| Flow | Account 1 | Account 2 | Account 3 |
|------|-----------|-----------|-----------|
| Student creates → Teacher verifies | Emma Watson (student) | Mr David Clarke (teacher) | — |
| Student creates → Teacher verifies → Parent consents | Emma Watson | Mr David Clarke | Rachel Watson (parent) |
| Second student flow | James Patel (student) | Ms Sarah Thompson (teacher) | Priya Patel (parent) |
| Backer views projects | Tom Bridges (investor) | — | — |

---

## Supabase Setup Checklist (Do This First)

Before testing, make sure these exist in your Supabase database:

- [ ] **School record** in `schools` table (Greenfield Academy, domain: greenfield.sch.uk)
- [ ] **10 auth users** created in Supabase Auth (2 students, 2 teachers, 2 parents, 2 investors, 2 admins) — all with Auto Confirm ticked
- [ ] **10 user_profiles** rows matching those auth users (correct role, school_id for students)
- [ ] **Teachers' is_verified = true** (so they show up in the mentor dropdown)
- [ ] Confirm the live site loads at https://futurepreneurs-sigma.vercel.app/

---

## What's NOT Testable Yet (Future Phases)

| Feature | Phase |
|---------|-------|
| Public project browsing page | Phase 3 |
| Individual project pages (public) | Phase 3 |
| Search and filter | Phase 3 |
| Stripe payments / backing a project | Phase 4 |
| Milestone drawdown requests | Phase 5 |
| Email notifications (Resend) | Phase 6 |
| Admin dashboard / moderation | Phase 6 |
| Content reporting | Phase 7 |
