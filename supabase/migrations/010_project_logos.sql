-- 010_project_logos.sql
-- Add logo columns to projects table for the Business Logo Creator

ALTER TABLE projects
  ADD COLUMN logo_config JSONB DEFAULT NULL,
  ADD COLUMN logo_url TEXT DEFAULT NULL,
  ADD COLUMN logo_approved BOOLEAN DEFAULT false;

-- Teachers can view logo_approved and approve/reject
-- RLS already covers projects table; these new columns inherit existing policies
