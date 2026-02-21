-- Task completion tracking for learning lessons
CREATE TABLE IF NOT EXISTS task_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id, lesson_id, task_id)
);

-- RLS: users can read/write own records
ALTER TABLE task_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own task progress"
  ON task_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task progress"
  ON task_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own task progress"
  ON task_progress FOR DELETE
  USING (auth.uid() = user_id);
