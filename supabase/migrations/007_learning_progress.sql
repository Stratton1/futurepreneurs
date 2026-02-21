-- Epic 2: Learning progress tracking
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  score INTEGER,
  UNIQUE(user_id, module_id, lesson_id)
);

CREATE INDEX idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX idx_learning_progress_module ON learning_progress(user_id, module_id);

ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own learning progress"
  ON learning_progress FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own learning progress"
  ON learning_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

COMMENT ON TABLE learning_progress IS 'Tracks student progress through learning modules and lessons.';
