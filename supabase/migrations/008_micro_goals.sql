-- 008_micro_goals.sql
-- Scaffolded micro-goals: break funding targets into smaller visual milestones with celebrations

CREATE TABLE IF NOT EXISTS micro_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount NUMERIC(10,2) NOT NULL CHECK (target_amount > 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  reached_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_micro_goals_project ON micro_goals(project_id);

-- RLS
ALTER TABLE micro_goals ENABLE ROW LEVEL SECURITY;

-- Anyone can view micro-goals on public (live/funded/completed) projects
CREATE POLICY "Public can view micro-goals on live projects"
  ON micro_goals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = micro_goals.project_id
      AND projects.status IN ('live', 'funded', 'completed')
    )
  );

-- Students can view micro-goals on their own projects (any status)
CREATE POLICY "Students can view own project micro-goals"
  ON micro_goals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = micro_goals.project_id
      AND projects.student_id = auth.uid()
    )
  );

-- Teachers can view micro-goals on projects they mentor
CREATE POLICY "Teachers can view mentored project micro-goals"
  ON micro_goals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = micro_goals.project_id
      AND projects.mentor_id = auth.uid()
    )
  );
