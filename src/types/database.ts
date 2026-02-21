// Database types for Futurepreneurs
// These mirror the Supabase/PostgreSQL schema

export type UserRole = 'student' | 'teacher' | 'parent' | 'investor' | 'admin';

export type ProjectStatus = 'draft' | 'pending_verification' | 'pending_consent' | 'live' | 'funded' | 'completed' | 'cancelled';

export type MilestoneStatus = 'pending' | 'approved' | 'disbursed';

export type DrawdownStatus = 'pending' | 'approved' | 'rejected';

export type BackingStatus = 'pending' | 'held' | 'collected' | 'refunded';

export type ConsentStatus = 'pending' | 'approved' | 'rejected';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface School {
  id: string;
  name: string;
  email_domain: string;
  city: string | null;
  county: string | null;
  created_at: string;
  updated_at: string;
}

/** Built avatar options (zero-PII); no photo upload. */
export interface AvatarConfig {
  hairStyle?: string;
  hairColor?: string;
  skinTone?: string;
  accessories?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  school_id: string | null;
  parent_id: string | null;
  avatar_url: string | null;
  avatar_config: AvatarConfig | null;
  display_handle: string | null;
  bio: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  student_id: string;
  mentor_id: string | null;
  title: string;
  description: string;
  short_description: string | null;
  category: string;
  goal_amount: number;
  total_raised: number;
  backer_count: number;
  status: ProjectStatus;
  images: string[];
  video_url: string | null;
  is_featured: boolean;
  logo_config: import('@/lib/logo-templates').LogoConfig | null;
  logo_url: string | null;
  logo_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  amount: number;
  sort_order: number;
  status: MilestoneStatus;
  created_at: string;
  updated_at: string;
}

export interface Backing {
  id: string;
  project_id: string;
  backer_id: string | null; // null for guest checkout
  backer_email: string;
  backer_name: string;
  amount: number;
  stripe_payment_intent_id: string | null;
  status: BackingStatus;
  is_anonymous: boolean;
  created_at: string;
}

export interface ParentalConsent {
  id: string;
  student_id: string;
  parent_id: string;
  project_id: string;
  status: ConsentStatus;
  consented_at: string | null;
  created_at: string;
}

export interface DrawdownRequest {
  id: string;
  milestone_id: string;
  project_id: string;
  requested_by: string;
  amount: number;
  reason: string | null;
  status: DrawdownStatus;
  approved_by: string | null;
  requested_at: string;
  approved_at: string | null;
  stripe_transfer_id: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  project_id: string;
  reporter_id: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  title: string;
  content: string;
  created_at: string;
}
