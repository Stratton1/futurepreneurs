-- 011_pitch_drafts.sql
-- AI Pitch Builder: drafts and rate limiting

-- Pitch drafts table
CREATE TABLE pitch_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  generated_pitch TEXT,
  edited_pitch TEXT,
  is_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pitch_drafts_project ON pitch_drafts(project_id);
CREATE INDEX idx_pitch_drafts_user ON pitch_drafts(user_id);

-- AI generation log for rate limiting
CREATE TABLE ai_generation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  generation_type TEXT NOT NULL DEFAULT 'pitch',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ai_gen_log_user_date ON ai_generation_log(user_id, created_at);

-- RLS
ALTER TABLE pitch_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_log ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own drafts
CREATE POLICY "Users can view own drafts"
  ON pitch_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts"
  ON pitch_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON pitch_drafts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can view own generation log
CREATE POLICY "Users can view own generation log"
  ON ai_generation_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generation log"
  ON ai_generation_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger for pitch_drafts
CREATE TRIGGER set_pitch_drafts_updated_at
  BEFORE UPDATE ON pitch_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
