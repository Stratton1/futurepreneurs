export type StretchGoalStatus = 'draft' | 'pending_approval' | 'approved' | 'unlocked' | 'rejected';

export interface StretchGoal {
  id: string;
  project_id: string;
  title: string;
  description: string;
  target_amount: number;
  sort_order: number;
  status: StretchGoalStatus;
  approved_by: string | null;
  approved_at: string | null;
  unlocked_at: string | null;
  created_at: string;
  updated_at: string;
}

export type SponsorType = 'corporate' | 'grant';

export interface MatchingSponsor {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  sponsor_type: SponsorType;
  match_ratio: number;
  max_match_per_project: number;
  total_budget: number;
  total_matched: number;
  eligibility_criteria: Record<string, unknown>;
  contact_email: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchingPledge {
  id: string;
  sponsor_id: string;
  project_id: string;
  match_ratio: number;
  max_match_amount: number;
  matched_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  sponsor?: MatchingSponsor;
}

export interface MatchingTransaction {
  id: string;
  pledge_id: string;
  backing_id: string;
  original_amount: number;
  matched_amount: number;
  created_at: string;
}
