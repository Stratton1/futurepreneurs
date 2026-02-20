-- Epic 1: Trophy Room — user badges (achievements)
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_type, project_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_type ON user_badges(badge_type);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Users can only view their own badges
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  USING (user_id = auth.uid());

-- Only server (service role) can insert badges
-- No policy for INSERT so anon/authenticated cannot insert; admin client used in app

COMMENT ON TABLE user_badges IS 'Earned badges for Trophy Room: first_project, fully_funded, milestone_master, etc.';
