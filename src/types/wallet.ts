// Wallet system types for Futurepreneurs Epic 4
// These mirror the wallet-related Supabase/PostgreSQL schema

export type KycStatus = 'pending' | 'adult_verified' | 'minor_verified' | 'fully_verified' | 'failed';

export type CardStatus = 'active' | 'frozen' | 'cancelled';

export type SpendingRequestStatus =
  | 'pending_parent'
  | 'pending_mentor'
  | 'approved'
  | 'declined_parent'
  | 'declined_mentor'
  | 'funded'
  | 'completed'
  | 'expired'
  | 'reversed';

export type ApprovalDecision = 'approved' | 'declined' | 'reversed';

export type ApproverRole = 'parent' | 'mentor';

export interface CustodialAccount {
  id: string;
  parent_id: string;
  student_id: string;
  stripe_connected_account_id: string | null;
  stripe_treasury_financial_account_id: string | null;
  kyc_status: KycStatus;
  relationship_verified: boolean;
  relationship_evidence: string | null;
  date_of_birth_encrypted: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalletBalance {
  id: string;
  custodial_account_id: string;
  project_id: string;
  available_balance: number;
  held_balance: number;
  total_disbursed: number;
  currency: string;
  updated_at: string;
}

export interface IssuedCard {
  id: string;
  custodial_account_id: string;
  project_id: string;
  stripe_card_id: string;
  card_status: CardStatus;
  last_four: string;
  spending_limit_daily: number;
  spending_limit_weekly: number;
  spending_limit_per_transaction: number;
  created_at: string;
  updated_at: string;
}

export interface SpendingRequest {
  id: string;
  custodial_account_id: string;
  project_id: string;
  milestone_id: string | null;
  student_id: string;
  parent_id: string;
  mentor_id: string;
  vendor_name: string;
  vendor_url: string | null;
  vendor_mcc: string | null;
  amount: number;
  currency: string;
  reason: string;
  receipt_url: string | null;
  receipt_uploaded_at: string | null;
  status: SpendingRequestStatus;
  parent_decision_at: string | null;
  mentor_decision_at: string | null;
  cooling_off_ends_at: string | null;
  funded_at: string | null;
  completed_at: string | null;
  stripe_authorization_id: string | null;
  card_unfrozen_at: string | null;
  card_window_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApprovalLog {
  id: string;
  spending_request_id: string;
  approver_id: string;
  approver_role: ApproverRole;
  decision: ApprovalDecision;
  reason: string | null;
  decided_at: string;
}

export interface VendorAllowlist {
  id: string;
  project_id: string;
  vendor_name: string;
  vendor_mcc: string | null;
  approved_by: string;
  created_at: string;
}

export interface BlockedMccCategory {
  mcc: string;
  category_name: string;
  reason: string;
  created_at: string;
}

// Composite types for dashboard views

export interface SpendingRequestWithDetails extends SpendingRequest {
  project_title?: string;
  student_name?: string;
  parent_name?: string;
  mentor_name?: string;
  milestone_title?: string;
}

export interface WalletOverview {
  custodial_account: CustodialAccount;
  balances: WalletBalance[];
  cards: IssuedCard[];
  pending_requests_count: number;
  total_available: number;
  total_held: number;
}

export interface SpendingLimits {
  daily: number;
  weekly: number;
  per_transaction: number;
}

export interface VelocityCheckResult {
  allowed: boolean;
  reason?: string;
  daily_used: number;
  weekly_used: number;
  daily_limit: number;
  weekly_limit: number;
}
