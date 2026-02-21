-- 009_reward_tiers.sql
-- Safe reward tiers: students offer rewards to backers with teacher approval

CREATE TYPE reward_approval_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS reward_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  min_amount NUMERIC(10,2) NOT NULL CHECK (min_amount > 0),
  max_claims INTEGER, -- NULL = unlimited
  claimed_count INTEGER NOT NULL DEFAULT 0,
  approval_status reward_approval_status NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES user_profiles(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add reward_tier_id to backings
ALTER TABLE backings ADD COLUMN IF NOT EXISTS reward_tier_id UUID REFERENCES reward_tiers(id);

-- Indexes
CREATE INDEX idx_reward_tiers_project ON reward_tiers(project_id);
CREATE INDEX idx_backings_reward_tier ON backings(reward_tier_id) WHERE reward_tier_id IS NOT NULL;

-- RLS
ALTER TABLE reward_tiers ENABLE ROW LEVEL SECURITY;

-- Public can view approved tiers on live/funded/completed projects
CREATE POLICY "Public can view approved reward tiers"
  ON reward_tiers FOR SELECT
  USING (
    approval_status = 'approved'
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = reward_tiers.project_id
      AND projects.status IN ('live', 'funded', 'completed')
    )
  );

-- Students can view all tiers on their own projects
CREATE POLICY "Students can view own reward tiers"
  ON reward_tiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = reward_tiers.project_id
      AND projects.student_id = auth.uid()
    )
  );

-- Students can insert tiers on their own draft projects
CREATE POLICY "Students can create reward tiers"
  ON reward_tiers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = reward_tiers.project_id
      AND projects.student_id = auth.uid()
      AND projects.status = 'draft'
    )
  );

-- Students can update tiers on their own draft projects
CREATE POLICY "Students can update own reward tiers"
  ON reward_tiers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = reward_tiers.project_id
      AND projects.student_id = auth.uid()
      AND projects.status = 'draft'
    )
  );

-- Students can delete tiers on their own draft projects
CREATE POLICY "Students can delete own reward tiers"
  ON reward_tiers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = reward_tiers.project_id
      AND projects.student_id = auth.uid()
      AND projects.status = 'draft'
    )
  );

-- Teachers can view tiers on projects they mentor
CREATE POLICY "Teachers can view mentored project reward tiers"
  ON reward_tiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = reward_tiers.project_id
      AND projects.mentor_id = auth.uid()
    )
  );
