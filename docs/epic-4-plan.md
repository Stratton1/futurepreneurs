# Epic 4: Youth-Centric Digital Wallet & Card System — Implementation Plan

**Last Updated:** 2026-02-21
**Status:** PLANNED
**Dependencies:** Epic 3 (DONE), Stripe Connect/Treasury/Issuing activation

---

## Executive Summary

Epic 4 adds a digital wallet and virtual card system to Futurepreneurs, letting funded projects spend money through a dual-approval flow (Parent + Mentor must both approve every purchase). The system is built on Stripe Connect (Custom Accounts), Stripe Treasury (embedded wallets), and Stripe Issuing (virtual debit cards), all controlled by the platform.

**Core principle:** Zero-Trust Spending — every transaction requires explicit approval from BOTH the student's Parent AND their verified Mentor before funds deploy.

---

## Phase Breakdown

### Phase 4.0 — Prerequisites & Stripe Product Activation
> *Before any code is written*

| Task | Description | Owner |
|------|-------------|-------|
| Stripe Connect activation | Apply for Stripe Connect (Custom accounts) on the production Stripe account. UK-based. | Joseph |
| Stripe Treasury activation | Request Stripe Treasury access (invite-only programme). Requires Connect. | Joseph |
| Stripe Issuing activation | Request Stripe Issuing access for UK (GBP virtual cards). Requires Treasury. | Joseph |
| Stripe Identity activation | Enable Stripe Identity for KYC verification sessions. | Joseph |
| Environment variables | Add new env vars: `STRIPE_CONNECT_WEBHOOK_SECRET`, `STRIPE_ISSUING_WEBHOOK_SECRET` | Joseph |

**Important note on UK availability:** Stripe Treasury and Issuing are available in the UK but require invitation/approval from Stripe. If these products are not immediately available, Phase 4.1–4.2 (Connect + wallet balance tracking) can proceed independently, with payouts going to the custodial parent's bank account instead of a virtual card. The plan includes a **Fallback Path** for this scenario.

---

### Phase 4.1 — Database Schema & Data Model (Migration 015)

**New migration: `015_wallet_system.sql`**

```sql
-- ============================================================
-- CUSTODIAL ACCOUNTS
-- Links a verified parent to a student with Stripe Connect
-- ============================================================
CREATE TYPE kyc_status AS ENUM (
  'pending', 'adult_verified', 'minor_verified', 'fully_verified', 'failed'
);

CREATE TABLE custodial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES user_profiles(id),
  student_id UUID NOT NULL REFERENCES user_profiles(id),
  stripe_connected_account_id TEXT,
  stripe_treasury_financial_account_id TEXT,
  kyc_status kyc_status NOT NULL DEFAULT 'pending',
  relationship_verified BOOLEAN NOT NULL DEFAULT false,
  relationship_evidence TEXT, -- 'parental_consent' | 'school_records' | 'declaration'
  date_of_birth_encrypted TEXT, -- encrypted at rest, used for age-18 transition
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

CREATE INDEX idx_custodial_accounts_parent ON custodial_accounts(parent_id);
CREATE INDEX idx_custodial_accounts_student ON custodial_accounts(student_id);

-- ============================================================
-- WALLET BALANCES
-- Per-project balance tracking within a custodial account
-- ============================================================
CREATE TABLE wallet_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custodial_account_id UUID NOT NULL REFERENCES custodial_accounts(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  available_balance NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (available_balance >= 0),
  held_balance NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (held_balance >= 0),
  total_disbursed NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total_disbursed >= 0),
  currency TEXT NOT NULL DEFAULT 'gbp',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(custodial_account_id, project_id)
);

CREATE INDEX idx_wallet_balances_custodial ON wallet_balances(custodial_account_id);
CREATE INDEX idx_wallet_balances_project ON wallet_balances(project_id);

-- ============================================================
-- ISSUED CARDS
-- Virtual debit cards linked to custodial accounts
-- ============================================================
CREATE TYPE card_status AS ENUM ('active', 'frozen', 'cancelled');

CREATE TABLE issued_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custodial_account_id UUID NOT NULL REFERENCES custodial_accounts(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  stripe_card_id TEXT NOT NULL,
  card_status card_status NOT NULL DEFAULT 'frozen',
  last_four TEXT NOT NULL,
  spending_limit_daily NUMERIC(10,2) NOT NULL DEFAULT 50.00,
  spending_limit_weekly NUMERIC(10,2) NOT NULL DEFAULT 200.00,
  spending_limit_per_transaction NUMERIC(10,2) NOT NULL DEFAULT 100.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(custodial_account_id, project_id)
);

CREATE INDEX idx_issued_cards_custodial ON issued_cards(custodial_account_id);

-- ============================================================
-- SPENDING REQUESTS
-- Dual-approval purchase requests from students
-- ============================================================
CREATE TYPE spending_request_status AS ENUM (
  'pending_parent', 'pending_mentor', 'approved',
  'declined_parent', 'declined_mentor',
  'funded', 'completed', 'expired', 'reversed'
);

CREATE TABLE spending_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custodial_account_id UUID NOT NULL REFERENCES custodial_accounts(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  milestone_id UUID REFERENCES milestones(id),
  student_id UUID NOT NULL REFERENCES user_profiles(id),
  parent_id UUID NOT NULL REFERENCES user_profiles(id),
  mentor_id UUID NOT NULL REFERENCES user_profiles(id),
  vendor_name TEXT NOT NULL,
  vendor_url TEXT,
  vendor_mcc TEXT, -- Merchant Category Code
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'gbp',
  reason TEXT NOT NULL,
  receipt_url TEXT,
  receipt_uploaded_at TIMESTAMPTZ,
  status spending_request_status NOT NULL DEFAULT 'pending_parent',
  parent_decision_at TIMESTAMPTZ,
  mentor_decision_at TIMESTAMPTZ,
  cooling_off_ends_at TIMESTAMPTZ, -- 1-hour cooling off after dual approval
  funded_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  stripe_authorization_id TEXT,
  card_unfrozen_at TIMESTAMPTZ,
  card_window_expires_at TIMESTAMPTZ, -- 30 min after unfreezing
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_spending_requests_custodial ON spending_requests(custodial_account_id);
CREATE INDEX idx_spending_requests_project ON spending_requests(project_id);
CREATE INDEX idx_spending_requests_student ON spending_requests(student_id);
CREATE INDEX idx_spending_requests_status ON spending_requests(status);
CREATE INDEX idx_spending_requests_parent ON spending_requests(parent_id, status);
CREATE INDEX idx_spending_requests_mentor ON spending_requests(mentor_id, status);

-- ============================================================
-- APPROVAL LOGS
-- Audit trail for every approval/decline decision
-- ============================================================
CREATE TABLE approval_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spending_request_id UUID NOT NULL REFERENCES spending_requests(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES user_profiles(id),
  approver_role TEXT NOT NULL CHECK (approver_role IN ('parent', 'mentor')),
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'declined', 'reversed')),
  reason TEXT,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_approval_logs_request ON approval_logs(spending_request_id);

-- ============================================================
-- VENDOR ALLOWLISTS
-- Per-project vendor restrictions set by teacher
-- ============================================================
CREATE TABLE vendor_allowlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  vendor_mcc TEXT,
  approved_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendor_allowlists_project ON vendor_allowlists(project_id);

-- ============================================================
-- BLOCKED MCC CATEGORIES
-- Platform-wide blocked merchant categories
-- ============================================================
CREATE TABLE blocked_mcc_categories (
  mcc TEXT PRIMARY KEY,
  category_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed blocked categories
INSERT INTO blocked_mcc_categories (mcc, category_name, reason) VALUES
  ('5813', 'Bars/Taverns/Lounges', 'Alcohol'),
  ('5921', 'Liquor Stores', 'Alcohol'),
  ('5993', 'Cigar Stores', 'Tobacco'),
  ('7995', 'Gambling', 'Gambling'),
  ('5967', 'Adult Content', 'Adult content'),
  ('6010', 'Cash Advances', 'Cash withdrawal'),
  ('6011', 'ATM Cash Disbursements', 'Cash withdrawal'),
  ('6012', 'Financial Institutions', 'Money transfers'),
  ('4829', 'Money Transfers', 'Money transfers'),
  ('7801', 'Government Lotteries', 'Gambling'),
  ('7802', 'Horse/Dog Racing', 'Gambling');

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE custodial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE issued_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE spending_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_allowlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_mcc_categories ENABLE ROW LEVEL SECURITY;

-- Custodial accounts: parent and student can view their own
CREATE POLICY "Parents view own custodial accounts"
  ON custodial_accounts FOR SELECT
  USING (auth.uid() = parent_id);
CREATE POLICY "Students view own custodial accounts"
  ON custodial_accounts FOR SELECT
  USING (auth.uid() = student_id);

-- Wallet balances: same as custodial
CREATE POLICY "Users view own wallet balances"
  ON wallet_balances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custodial_accounts ca
      WHERE ca.id = wallet_balances.custodial_account_id
        AND (ca.parent_id = auth.uid() OR ca.student_id = auth.uid())
    )
  );

-- Spending requests: student, parent, and mentor can view
CREATE POLICY "Students view own spending requests"
  ON spending_requests FOR SELECT
  USING (auth.uid() = student_id);
CREATE POLICY "Parents view child spending requests"
  ON spending_requests FOR SELECT
  USING (auth.uid() = parent_id);
CREATE POLICY "Mentors view mentored spending requests"
  ON spending_requests FOR SELECT
  USING (auth.uid() = mentor_id);
CREATE POLICY "Students can create spending requests"
  ON spending_requests FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Approval logs: viewable by request participants
CREATE POLICY "Request participants view approval logs"
  ON approval_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM spending_requests sr
      WHERE sr.id = approval_logs.spending_request_id
        AND (sr.student_id = auth.uid() OR sr.parent_id = auth.uid() OR sr.mentor_id = auth.uid())
    )
  );

-- Vendor allowlists: readable by project participants
CREATE POLICY "Anyone can read vendor allowlists"
  ON vendor_allowlists FOR SELECT USING (true);

-- Blocked MCCs: readable by all
CREATE POLICY "Anyone can read blocked MCCs"
  ON blocked_mcc_categories FOR SELECT USING (true);

-- Apply updated_at trigger
CREATE TRIGGER set_updated_at BEFORE UPDATE ON custodial_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON wallet_balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON issued_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON spending_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Files created/modified:**
- `supabase/migrations/015_wallet_system.sql` (new)

---

### Phase 4.2 — Custodial Account Onboarding & KYC

**What it does:** Parents complete KYC verification, link their child, and the system creates a Stripe Connected Account + Treasury Financial Account.

**Implementation steps:**

#### Step 1: Stripe helpers (`src/lib/stripe/connect.ts`)
- `createConnectedAccount(parentId, parentEmail, parentName)` — Creates a Stripe Connect Custom Account with the parent as the representative
- `createAccountLink(connectedAccountId, refreshUrl, returnUrl)` — Generates a Stripe onboarding link for the parent to complete KYC
- `getAccountStatus(connectedAccountId)` — Checks if KYC is complete
- `createTreasuryFinancialAccount(connectedAccountId)` — Creates a Treasury Financial Account under the Connected Account
- `createIssuingCard(financialAccountId, projectTitle)` — Provisions a virtual card in `frozen` state

#### Step 2: Onboarding API routes
- `POST /api/wallet/onboard` — Parent initiates custodial account creation. Creates Stripe Connected Account, returns onboarding link.
- `GET /api/wallet/onboard/status` — Check KYC status for a custodial account.
- `POST /api/wallet/onboard/link-child` — Parent confirms the parent-student relationship (validates against existing `parent_id` link in `user_profiles`).
- `POST /api/webhooks/stripe-connect` — Handles `account.updated` events to track KYC completion.

#### Step 3: Server actions (`src/app/dashboard/wallet/actions.ts`)
- `initiateOnboarding()` — Parent action: creates custodial account record, calls Stripe, returns link
- `confirmChildLink(studentId)` — Parent confirms relationship
- `checkOnboardingStatus(custodialAccountId)` — Checks Stripe + DB status

#### Step 4: Parent onboarding UI (`src/app/dashboard/wallet/onboard/page.tsx`)
- Step-by-step wizard:
  1. Welcome screen explaining the wallet system
  2. KYC verification (redirect to Stripe Identity/Connect hosted onboarding)
  3. Link child (select from already-linked children or enter student email)
  4. Confirmation screen showing wallet is ready
- Progress indicator showing completion status

#### Step 5: Minor verification enhancement
- Teacher attestation option in teacher dashboard (`src/app/dashboard/verify/[id]/minor-verification.tsx`)
- Admin can also verify minor status from admin dashboard
- Verification stored as boolean flag on `custodial_accounts.minor_verified` (no raw PII images stored)

**Files created:**
- `src/lib/stripe/connect.ts`
- `src/lib/stripe/treasury.ts`
- `src/lib/stripe/issuing.ts`
- `src/lib/queries/custodial-accounts.ts`
- `src/lib/queries/wallet-balances.ts`
- `src/app/api/wallet/onboard/route.ts`
- `src/app/api/wallet/onboard/status/route.ts`
- `src/app/api/wallet/onboard/link-child/route.ts`
- `src/app/api/webhooks/stripe-connect/route.ts`
- `src/app/dashboard/wallet/onboard/page.tsx`
- `src/app/dashboard/wallet/actions.ts`
- `src/types/wallet.ts`

**Files modified:**
- `src/app/dashboard/wallet/page.tsx` (if exists, or created)

---

### Phase 4.3 — Fund Transfer & Wallet Balance Management

**What it does:** When a project's drawdown is approved, funds move from the platform Stripe account to the custodial Treasury Financial Account, and the `wallet_balances` table is updated.

**Implementation steps:**

#### Step 1: Fund movement helpers (`src/lib/stripe/treasury.ts`)
- `transferToTreasury(financialAccountId, amountPence, projectId, milestoneId)` — Transfers funds from the platform account to the project's Treasury wallet
- `getFinancialAccountBalance(financialAccountId)` — Gets live balance from Stripe
- `syncWalletBalance(custodialAccountId, projectId)` — Syncs Stripe balance with local DB

#### Step 2: Integration with existing drawdown flow
- Modify `src/app/dashboard/drawdown/actions.ts` (or equivalent) to, after teacher approval:
  1. Look up the custodial account for the project's student
  2. If a Treasury account exists, transfer funds to Treasury instead of (or in addition to) direct bank transfer
  3. Update `wallet_balances` table
  4. Send notifications to parent and student

#### Step 3: Webhook handler for Treasury events
- `POST /api/webhooks/stripe-treasury` — Handles `treasury.received_credit`, `treasury.outbound_payment.posted`, etc.
- Updates `wallet_balances` on fund movements

**Files created:**
- `src/app/api/webhooks/stripe-treasury/route.ts`

**Files modified:**
- `src/lib/stripe/treasury.ts` (extend)
- Drawdown approval action (integrate Treasury transfer)
- `src/lib/queries/wallet-balances.ts` (extend)

---

### Phase 4.4 — Spending Request & Dual-Approval Flow

**What it does:** Students submit purchase requests, parents approve first, then mentors approve. Full audit trail.

**Implementation steps:**

#### Step 1: Spending request server actions (`src/app/dashboard/wallet/spending-actions.ts`)
- `createSpendingRequest(data)` — Student submits a purchase request. Validates: has custodial account, wallet has sufficient balance, amount within velocity limits, milestone alignment. Creates record in `pending_parent` status. Sends notification + email to parent.
- `approveSpendingRequest(requestId)` — Parent or mentor approves. If parent approves, moves to `pending_mentor`. If mentor approves, moves to `approved`, starts 1-hour cooling-off period. Creates `approval_logs` entry.
- `declineSpendingRequest(requestId, reason)` — Parent or mentor declines. Creates `approval_logs` entry with reason.
- `reverseApproval(requestId)` — Either approver can reverse within cooling-off period.
- `uploadReceipt(requestId, receiptUrl)` — Student uploads receipt photo after purchase.

#### Step 2: API routes
- `POST /api/wallet/spending-request` — Create spending request
- `PATCH /api/wallet/spending-request/[id]` — Approve/decline/reverse
- `GET /api/wallet/spending-requests` — List requests (filtered by role)
- `POST /api/wallet/spending-request/[id]/receipt` — Upload receipt

#### Step 3: Velocity limit checking (`src/lib/wallet/velocity-limits.ts`)
- `checkVelocityLimits(custodialAccountId, projectId, amount)` — Checks daily, weekly, and per-transaction caps against existing approved/funded requests
- Returns `{ allowed: boolean, reason?: string, dailyUsed, weeklyUsed }`

#### Step 4: Notification integration
- Parent receives notification + email when student requests a purchase
- Mentor receives notification + email when parent approves
- Student receives notification + email when request is fully approved or declined
- Student receives reminder if receipt not uploaded within 48 hours

**Files created:**
- `src/app/dashboard/wallet/spending-actions.ts`
- `src/app/api/wallet/spending-request/route.ts`
- `src/app/api/wallet/spending-request/[id]/route.ts`
- `src/app/api/wallet/spending-request/[id]/receipt/route.ts`
- `src/lib/wallet/velocity-limits.ts`
- `src/lib/queries/spending-requests.ts`

---

### Phase 4.5 — Card Funding & Transaction Execution

**What it does:** After dual approval + cooling-off period, the system unfreezes the virtual card, funds it for the exact amount, and auto-refreezes after 30 minutes.

**Implementation steps:**

#### Step 1: Card management helpers (`src/lib/stripe/issuing.ts`)
- `unfreezeCard(cardId)` — Sets card status to `active`
- `freezeCard(cardId)` — Sets card status to `inactive`
- `fundCard(financialAccountId, cardId, amountPence)` — Funds the card for exact amount
- `getCardDetails(cardId)` — Gets card status and details
- `setSpendingControls(cardId, controls)` — Sets MCC restrictions and spending limits

#### Step 2: Transaction execution flow (`src/lib/wallet/execute-transaction.ts`)
- `executeApprovedSpending(spendingRequestId)` — Called after cooling-off period:
  1. Verify spending request is in `approved` status
  2. Verify cooling-off period has elapsed
  3. Unfreeze the virtual card
  4. Fund the card for the exact approved amount
  5. Set 30-minute spending window
  6. Update request status to `funded`
  7. Notify student that card is ready to use
- `autoRefreezeExpiredCards()` — Cron job (Vercel Cron) that checks for cards past their spending window and refreezes them

#### Step 3: Stripe Issuing webhook (`src/app/api/webhooks/stripe-issuing/route.ts`)
- Handles `issuing_authorization.request` — Validate MCC, check if card should be authorized
- Handles `issuing_authorization.created` — Track authorization
- Handles `issuing_transaction.created` — Mark spending request as `completed`
- Handles `issuing_authorization.updated` — Track captures and reversals

#### Step 4: Cron job for auto-refreeze (`src/app/api/cron/refreeze-cards/route.ts`)
- Runs every 5 minutes via Vercel Cron
- Finds funded spending requests where `card_window_expires_at < now()`
- Refreezes the card
- If no transaction occurred, releases funds back to wallet
- Sends notification to student

#### Step 5: Receipt reminder cron (`src/app/api/cron/receipt-reminders/route.ts`)
- Runs daily
- Finds completed spending requests without receipt uploads > 24 hours old
- Sends reminder notification + email to student
- At 48 hours, triggers card freeze until receipt is uploaded

**Files created:**
- `src/lib/wallet/execute-transaction.ts`
- `src/app/api/webhooks/stripe-issuing/route.ts`
- `src/app/api/cron/refreeze-cards/route.ts`
- `src/app/api/cron/receipt-reminders/route.ts`
- `vercel.json` (or update for cron config)

**Files modified:**
- `src/lib/stripe/issuing.ts` (extend)

---

### Phase 4.6 — Spending Guardrails

**What it does:** Automated safety controls including MCC blocking, vendor allowlists, velocity limits, and cooling-off periods.

**Implementation steps:**

#### Step 1: MCC validation (`src/lib/wallet/mcc-validation.ts`)
- `isBlockedMCC(mcc)` — Check against `blocked_mcc_categories` table
- `isAllowedVendor(projectId, vendorName, vendorMcc)` — Check vendor allowlist
- Returns validation result with reason

#### Step 2: Issuing authorization handler (in webhook)
- When Stripe sends `issuing_authorization.request`, the webhook:
  1. Checks MCC against blocked list
  2. Checks vendor against project allowlist (if configured)
  3. Checks amount against remaining approved amount
  4. Returns `approved: true` or `approved: false` with reason

#### Step 3: Vendor allowlist management
- Teacher can manage vendor allowlists from their dashboard
- Server action: `addVendorToAllowlist(projectId, vendorName, mcc)`
- Server action: `removeVendorFromAllowlist(projectId, vendorId)`
- UI: `src/app/dashboard/wallet/[projectId]/vendors/page.tsx`

#### Step 4: Spending limits management (parent dashboard)
- Parent can adjust daily/weekly/per-transaction limits from their dashboard
- Server action: `updateSpendingLimits(cardId, limits)`
- Updates both DB and Stripe Issuing spending controls
- Mentor can request limit increases (creates a notification to parent)

**Files created:**
- `src/lib/wallet/mcc-validation.ts`
- `src/app/dashboard/wallet/[projectId]/vendors/page.tsx`
- `src/app/dashboard/wallet/[projectId]/vendors/actions.ts`

---

### Phase 4.7 — Dashboard Views (Wallet UIs)

**What it does:** Each role gets a wallet-specific dashboard view.

#### Student: Tween Wallet (`src/app/dashboard/wallet/page.tsx`)
- **Hero section:** Current project balance, funding progress micro-goal tracker
- **Big CTA:** "Request a Purchase" button (opens request form)
- **Pending requests:** Cards showing status of each request with progress steps
- **Spending history:** Visual timeline of completed purchases with receipt thumbnails
- **Card details:** Last four digits, status (frozen/active), visual card design
- **No direct spending controls** — everything goes through request flow

#### Parent: Financial Dashboard (`src/app/dashboard/wallet/parent/page.tsx`)
- **All children overview:** List of linked children with wallet summaries
- **Approval queue:** Pending requests with one-tap approve/decline buttons
- **Transaction history:** Full list with receipt images, vendor names, amounts
- **Spending analytics:** Simple charts (by category, over time) using lightweight chart lib
- **Card controls:** Freeze/unfreeze button, spending limit adjusters (sliders)
- **Download statements:** CSV export of all transactions

#### Mentor: Financial Dashboard (`src/app/dashboard/wallet/mentor/page.tsx`)
- **Mentored students overview:** List of mentored students' wallet activity
- **Approval queue:** Only shows requests already parent-approved
- **Milestone alignment:** Shows which milestone each request relates to, with visual indicator
- **Flag button:** Flag suspicious requests (creates admin notification)
- **Vendor allowlist:** Manage approved vendors per project

#### Admin: Financial Dashboard (`src/app/admin/wallet/page.tsx`)
- **Platform aggregate:** Total wallet balances, total disbursed, total pending
- **KYC overview:** List of custodial accounts with verification status
- **Flagged transactions:** Review flagged requests from mentors
- **Fee tracking:** Platform fees on wallet transactions
- **Compliance audit log:** Searchable log of all approval actions

**Files created:**
- `src/app/dashboard/wallet/page.tsx`
- `src/app/dashboard/wallet/parent/page.tsx`
- `src/app/dashboard/wallet/mentor/page.tsx`
- `src/app/dashboard/wallet/request/page.tsx` (spending request form)
- `src/app/admin/wallet/page.tsx`
- `src/components/features/wallet-balance-card.tsx`
- `src/components/features/spending-request-card.tsx`
- `src/components/features/spending-request-form.tsx`
- `src/components/features/approval-queue.tsx`
- `src/components/features/spending-timeline.tsx`
- `src/components/features/spending-analytics.tsx`
- `src/components/features/card-controls.tsx`
- `src/components/features/card-visual.tsx`
- `src/components/features/velocity-limit-controls.tsx`
- `src/components/features/vendor-allowlist-manager.tsx`
- `src/components/features/receipt-upload.tsx`

---

### Phase 4.8 — Age-18 Transition System

**What it does:** Automatically transitions users to independent accounts when they turn 18.

**Implementation steps:**

#### Step 1: Date of birth handling
- Encrypted storage in `custodial_accounts.date_of_birth_encrypted`
- Encryption at application layer using `aes-256-gcm` with key from env var `DOB_ENCRYPTION_KEY`
- Helper: `src/lib/wallet/dob-encryption.ts`

#### Step 2: Daily transition cron (`src/app/api/cron/age-transition/route.ts`)
- Runs daily at 00:00 UTC
- Decrypts DOB, checks for users at 17y9m (90-day warning) and 18y (transition)
- 90-day warning: Sends "Growing Up" notification to student + parent
- At 18: Converts account (see step 3)

#### Step 3: Account conversion flow
- Remove dual-approval requirement (set flag on custodial account)
- Optionally convert Stripe Connect Custom Account to Standard/Express
- Run adult KYC on the now-adult user
- Preserve all transaction history
- Notify parent that oversight has ended
- Offer "training wheels" option to keep mentor oversight

#### Step 4: Settings UI
- Student (18+) can opt into voluntary mentor oversight
- Parent is notified of all changes
- Server action: `enableGraduatedIndependence(custodialAccountId)`

**Files created:**
- `src/lib/wallet/dob-encryption.ts`
- `src/app/api/cron/age-transition/route.ts`
- `src/app/dashboard/wallet/settings/page.tsx`

---

## Fallback Path (If Stripe Treasury/Issuing Not Available)

If Stripe Treasury and/or Issuing are not available in the UK for this use case, the system falls back to a simpler but still secure model:

### Fallback: Managed Payouts
- **Instead of Treasury wallets:** Track balances in the `wallet_balances` table (our database is the source of truth)
- **Instead of virtual cards:** After dual approval, transfer funds directly to the parent's bank account via Stripe Connect payouts
- **Instead of MCC controls:** Rely on the dual-approval flow + receipt upload requirement for spending oversight
- **Same approval flow:** The entire dual-approval, cooling-off, and audit trail system works identically
- **Same dashboards:** All wallet dashboard views work the same — just without the virtual card UI

This fallback still delivers 90% of the value:
- Students still request purchases through the platform
- Parents and mentors still approve each request
- All spending is tracked with receipts
- Full audit trail and compliance logging
- The main difference is the parent receives a bank transfer and makes the purchase on behalf of the student, rather than the student having a virtual card

**Implementation impact:** Phases 4.1, 4.2, 4.4, 4.6 (partially), 4.7, and 4.8 proceed as designed. Phases 4.3 and 4.5 simplify to bank payouts instead of Treasury/Issuing operations.

---

## Environment Variables Required

```env
# Stripe Connect (new)
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...

# Stripe Treasury (new, if available)
STRIPE_TREASURY_WEBHOOK_SECRET=whsec_...

# Stripe Issuing (new, if available)
STRIPE_ISSUING_WEBHOOK_SECRET=whsec_...

# Date of birth encryption
DOB_ENCRYPTION_KEY=... (32-byte hex key)

# Cron secret (Vercel cron authorization)
CRON_SECRET=...
```

---

## API Route Summary

| Method | Route | Purpose | Auth |
|--------|-------|---------|------|
| POST | `/api/wallet/onboard` | Parent initiates custodial account | Parent |
| GET | `/api/wallet/onboard/status` | Check KYC/onboarding status | Parent |
| POST | `/api/wallet/onboard/link-child` | Link parent to student | Parent |
| POST | `/api/wallet/spending-request` | Student submits purchase request | Student |
| PATCH | `/api/wallet/spending-request/[id]` | Approve/decline request | Parent/Mentor |
| GET | `/api/wallet/spending-requests` | List requests by role | Any auth'd |
| POST | `/api/wallet/spending-request/[id]/receipt` | Upload receipt | Student |
| POST | `/api/wallet/fund-card` | Internal: fund card after approval | System |
| POST | `/api/webhooks/stripe-connect` | Connect account events | Stripe |
| POST | `/api/webhooks/stripe-treasury` | Treasury fund events | Stripe |
| POST | `/api/webhooks/stripe-issuing` | Card auth/transaction events | Stripe |
| GET | `/api/cron/refreeze-cards` | Auto-refreeze expired cards | Cron |
| GET | `/api/cron/receipt-reminders` | Remind about missing receipts | Cron |
| GET | `/api/cron/age-transition` | Check for age-18 transitions | Cron |

---

## File Tree (New Files)

```
src/
  app/
    api/
      wallet/
        onboard/
          route.ts                    # POST — initiate onboarding
          status/route.ts             # GET — check status
          link-child/route.ts         # POST — link parent to student
        spending-request/
          route.ts                    # POST/GET — create/list requests
          [id]/
            route.ts                  # PATCH — approve/decline
            receipt/route.ts          # POST — upload receipt
        fund-card/route.ts            # POST — internal: fund after approval
      webhooks/
        stripe-connect/route.ts       # Connect account events
        stripe-treasury/route.ts      # Treasury events
        stripe-issuing/route.ts       # Issuing card events
      cron/
        refreeze-cards/route.ts       # Auto-refreeze expired cards
        receipt-reminders/route.ts    # Receipt upload reminders
        age-transition/route.ts       # Age-18 transition check
    dashboard/
      wallet/
        page.tsx                      # Student wallet view
        actions.ts                    # Onboarding server actions
        spending-actions.ts           # Spending request server actions
        onboard/page.tsx              # Parent onboarding wizard
        request/page.tsx              # Spending request form
        parent/page.tsx               # Parent financial dashboard
        mentor/page.tsx               # Mentor financial dashboard
        settings/page.tsx             # 18+ transition settings
        [projectId]/
          vendors/
            page.tsx                  # Vendor allowlist management
            actions.ts
    admin/
      wallet/page.tsx                 # Admin financial overview
  components/
    features/
      wallet-balance-card.tsx
      spending-request-card.tsx
      spending-request-form.tsx
      approval-queue.tsx
      spending-timeline.tsx
      spending-analytics.tsx
      card-controls.tsx
      card-visual.tsx
      velocity-limit-controls.tsx
      vendor-allowlist-manager.tsx
      receipt-upload.tsx
  lib/
    stripe/
      connect.ts                      # Connect account helpers
      treasury.ts                     # Treasury financial account helpers
      issuing.ts                      # Card issuing helpers
    wallet/
      velocity-limits.ts              # Daily/weekly/per-tx limit checking
      mcc-validation.ts               # MCC category validation
      execute-transaction.ts          # Card funding orchestration
      dob-encryption.ts               # DOB encryption/decryption
    queries/
      custodial-accounts.ts           # DB queries for custodial accounts
      wallet-balances.ts              # DB queries for wallet balances
      spending-requests.ts            # DB queries for spending requests
  types/
    wallet.ts                         # TypeScript types for wallet entities
supabase/
  migrations/
    015_wallet_system.sql             # Full wallet schema migration
```

---

## Recommended Build Order

1. **Phase 4.0** — Get Stripe product access (Joseph, before coding starts)
2. **Phase 4.1** — Database migration (can be built immediately)
3. **Phase 4.2** — Custodial onboarding + KYC (depends on 4.1 + Stripe Connect)
4. **Phase 4.3** — Fund transfer integration (depends on 4.2)
5. **Phase 4.4** — Spending request + dual approval (depends on 4.1, can parallel with 4.3)
6. **Phase 4.7** — Dashboard UIs (depends on 4.4, can parallel with 4.5)
7. **Phase 4.5** — Card funding + transaction execution (depends on 4.3 + Treasury/Issuing)
8. **Phase 4.6** — Spending guardrails (depends on 4.5)
9. **Phase 4.8** — Age transition (can be built last, low priority for launch)

**Parallelization opportunity:** Phases 4.4 (spending requests) and 4.7 (dashboards) can be built in parallel with 4.3 (fund transfer) and 4.5 (card funding), since the approval flow and UI don't depend on the actual Stripe Treasury/Issuing integration — they work against the database.

---

## Testing Strategy

| Area | Test Type | What to Test |
|------|-----------|--------------|
| Spending request flow | Integration | Full lifecycle: create → parent approve → mentor approve → fund → complete |
| Velocity limits | Unit | Daily, weekly, per-tx limits; edge cases around midnight rollover |
| MCC validation | Unit | Blocked categories, vendor allowlists, edge cases |
| Receipt upload | Integration | Upload flow, 48-hour reminder, card freeze trigger |
| Cooling-off reversal | Integration | Approve → reverse within 1 hour → verify funds returned |
| Concurrent approvals | Integration | Two requests hitting same wallet balance simultaneously |
| KYC onboarding | Manual | Full Stripe hosted onboarding flow in test mode |
| Card authorization | Integration | Simulate Stripe Issuing authorization webhooks |
| Age-18 transition | Unit | DOB calculation, 90-day warning, transition logic |
| Fallback path | Integration | Payout to bank account when Treasury/Issuing unavailable |

---

## Security Considerations

1. **All wallet API routes** use `getCurrentUser()` and verify role before proceeding
2. **Admin client** used only for cross-user operations (notifications, balance updates)
3. **DOB encryption** at application level — never stored in plaintext
4. **Stripe webhook signature verification** on all webhook endpoints
5. **Rate limiting** on spending request creation (prevents abuse)
6. **Idempotency** on card funding operations (prevents double-funding)
7. **Audit trail** — every approval, decline, reversal, and fund movement is logged
8. **No PII images stored** — minor verification uses hash + flag only
9. **Card always frozen by default** — only unfrozen for the exact approved transaction window
