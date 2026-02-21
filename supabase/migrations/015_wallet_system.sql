-- ============================================================
-- Epic 4: Youth-Centric Digital Wallet & Card System
-- Migration 015: Wallet system tables
-- ============================================================

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
  relationship_evidence TEXT,
  date_of_birth_encrypted TEXT,
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
  vendor_mcc TEXT,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'gbp',
  reason TEXT NOT NULL,
  receipt_url TEXT,
  receipt_uploaded_at TIMESTAMPTZ,
  status spending_request_status NOT NULL DEFAULT 'pending_parent',
  parent_decision_at TIMESTAMPTZ,
  mentor_decision_at TIMESTAMPTZ,
  cooling_off_ends_at TIMESTAMPTZ,
  funded_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  stripe_authorization_id TEXT,
  card_unfrozen_at TIMESTAMPTZ,
  card_window_expires_at TIMESTAMPTZ,
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
-- ROW LEVEL SECURITY
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

-- Wallet balances: custodial account participants can view
CREATE POLICY "Users view own wallet balances"
  ON wallet_balances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custodial_accounts ca
      WHERE ca.id = wallet_balances.custodial_account_id
        AND (ca.parent_id = auth.uid() OR ca.student_id = auth.uid())
    )
  );

-- Issued cards: custodial account participants can view
CREATE POLICY "Users view own issued cards"
  ON issued_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custodial_accounts ca
      WHERE ca.id = issued_cards.custodial_account_id
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

-- Vendor allowlists: readable by all authenticated users
CREATE POLICY "Anyone can read vendor allowlists"
  ON vendor_allowlists FOR SELECT USING (true);

-- Blocked MCCs: readable by all
CREATE POLICY "Anyone can read blocked MCCs"
  ON blocked_mcc_categories FOR SELECT USING (true);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON custodial_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON wallet_balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON issued_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON spending_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
