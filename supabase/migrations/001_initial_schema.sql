-- Futurepreneurs: Initial Database Schema
-- Phase 1: Foundation & Auth + full schema for future phases

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SCHOOLS
-- ============================================================
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email_domain TEXT NOT NULL UNIQUE,
  city TEXT,
  county TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- USER PROFILES
-- Extends Supabase auth.users with app-specific fields
-- ============================================================
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'parent', 'investor', 'admin');

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  school_id UUID REFERENCES schools(id),
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  parent_id UUID REFERENCES user_profiles(id),  -- links student to parent
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_school ON user_profiles(school_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TYPE project_status AS ENUM (
  'draft', 'pending_verification', 'pending_consent', 'live', 'funded', 'completed', 'cancelled'
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES user_profiles(id),
  mentor_id UUID REFERENCES user_profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL,
  goal_amount NUMERIC(10,2) NOT NULL CHECK (goal_amount > 0 AND goal_amount <= 10000),
  total_raised NUMERIC(10,2) NOT NULL DEFAULT 0,
  backer_count INTEGER NOT NULL DEFAULT 0,
  status project_status NOT NULL DEFAULT 'draft',
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_student ON projects(student_id);
CREATE INDEX idx_projects_mentor ON projects(mentor_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);

-- ============================================================
-- MILESTONES
-- ============================================================
CREATE TYPE milestone_status AS ENUM ('pending', 'approved', 'disbursed');

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  status milestone_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_milestones_project ON milestones(project_id);

-- ============================================================
-- BACKINGS (Donations/Pledges)
-- ============================================================
CREATE TYPE backing_status AS ENUM ('pending', 'held', 'collected', 'refunded');

CREATE TABLE backings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id),
  backer_id UUID REFERENCES user_profiles(id), -- null for guest checkout
  backer_email TEXT NOT NULL,
  backer_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  stripe_payment_intent_id TEXT,
  status backing_status NOT NULL DEFAULT 'pending',
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_backings_project ON backings(project_id);
CREATE INDEX idx_backings_backer ON backings(backer_id);

-- ============================================================
-- PARENTAL CONSENT
-- ============================================================
CREATE TYPE consent_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE parental_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES user_profiles(id),
  parent_id UUID NOT NULL REFERENCES user_profiles(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  status consent_status NOT NULL DEFAULT 'pending',
  consented_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id) -- one consent record per project
);

-- ============================================================
-- DRAWDOWN REQUESTS
-- ============================================================
CREATE TYPE drawdown_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE drawdown_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_id UUID NOT NULL REFERENCES milestones(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  requested_by UUID NOT NULL REFERENCES user_profiles(id),
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  reason TEXT,
  status drawdown_status NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES user_profiles(id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  stripe_transfer_id TEXT
);

CREATE INDEX idx_drawdown_requests_project ON drawdown_requests(project_id);
CREATE INDEX idx_drawdown_requests_milestone ON drawdown_requests(milestone_id);

-- ============================================================
-- PROJECT UPDATES
-- ============================================================
CREATE TABLE project_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_updates_project ON project_updates(project_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- ============================================================
-- REPORTS (Content moderation)
-- ============================================================
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id),
  reporter_id UUID NOT NULL REFERENCES user_profiles(id),
  reason TEXT NOT NULL,
  details TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_project ON reports(project_id);
CREATE INDEX idx_reports_status ON reports(status);

-- ============================================================
-- UPDATED_AT TRIGGER
-- Automatically updates the updated_at column on row changes
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Basic policies for Phase 1 — will be expanded per phase
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE backings ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawdown_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Schools: readable by everyone
CREATE POLICY "Schools are viewable by everyone" ON schools FOR SELECT USING (true);

-- User profiles: users can read their own, admins can read all
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can insert their profile on signup" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Public project data: anyone can view live projects
CREATE POLICY "Anyone can view live projects" ON projects FOR SELECT USING (status = 'live' OR status = 'funded' OR status = 'completed');
CREATE POLICY "Students can view own projects" ON projects FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Mentors can view mentored projects" ON projects FOR SELECT USING (auth.uid() = mentor_id);

-- Notifications: users can only see their own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- SEED DATA: Sample schools for testing
-- ============================================================
INSERT INTO schools (name, email_domain, city, county) VALUES
  ('Riverside Academy', 'riverside.sch.uk', 'London', 'Greater London'),
  ('Oakwood High School', 'oakwood.sch.uk', 'Manchester', 'Greater Manchester'),
  ('St Mary''s School', 'stmarys.ac.uk', 'Birmingham', 'West Midlands'),
  ('Greenfield Comprehensive', 'greenfield.sch.uk', 'Leeds', 'West Yorkshire'),
  ('The Bridge School', 'bridgeschool.sch.uk', 'Bristol', 'Bristol');
