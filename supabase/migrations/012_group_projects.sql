-- 012_group_projects.sql
-- Group / club projects and multi-user collaboration

-- Add project type and group name to projects
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_type') THEN
    CREATE TYPE project_type AS ENUM ('individual', 'group');
  END IF;
END$$;

ALTER TABLE projects
  ADD COLUMN project_type project_type NOT NULL DEFAULT 'individual',
  ADD COLUMN group_name TEXT DEFAULT NULL;

-- Collaborators table
CREATE TABLE project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES user_profiles(id),
  accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX idx_collaborators_project ON project_collaborators(project_id);
CREATE INDEX idx_collaborators_user ON project_collaborators(user_id);

-- RLS
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;

-- Collaborators can view their own records
CREATE POLICY "Users can view own collaborator records"
  ON project_collaborators FOR SELECT
  USING (auth.uid() = user_id);

-- Project owner can view all collaborators for their projects
CREATE POLICY "Project owners can view collaborators"
  ON project_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_collaborators.project_id
      AND projects.student_id = auth.uid()
    )
  );

-- Project owner can invite collaborators
CREATE POLICY "Project owners can insert collaborators"
  ON project_collaborators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_collaborators.project_id
      AND projects.student_id = auth.uid()
    )
  );

-- Invited users can update their own record (accept/decline)
CREATE POLICY "Users can update own collaborator record"
  ON project_collaborators FOR UPDATE
  USING (auth.uid() = user_id);

-- Project owner can remove collaborators
CREATE POLICY "Project owners can delete collaborators"
  ON project_collaborators FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_collaborators.project_id
      AND projects.student_id = auth.uid()
    )
  );
