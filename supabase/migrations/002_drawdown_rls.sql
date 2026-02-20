-- RLS policies for drawdown_requests
-- Students: SELECT and INSERT for their own projects (requested_by = self, project.student_id = self)
-- Teachers: SELECT and UPDATE for projects they mentor (project.mentor_id = self)
-- Parents: SELECT for projects where they gave consent or are linked parent

-- Students can view drawdown requests for their own projects
CREATE POLICY "Students can view own project drawdowns"
  ON drawdown_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = drawdown_requests.project_id
      AND p.student_id = auth.uid()
    )
  );

-- Students can insert drawdown requests for their own projects (requested_by = auth.uid())
CREATE POLICY "Students can create drawdowns for own projects"
  ON drawdown_requests FOR INSERT
  WITH CHECK (
    requested_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = drawdown_requests.project_id
      AND p.student_id = auth.uid()
    )
  );

-- Teachers can view drawdown requests for projects they mentor
CREATE POLICY "Teachers can view mentored project drawdowns"
  ON drawdown_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = drawdown_requests.project_id
      AND p.mentor_id = auth.uid()
    )
  );

-- Teachers can update drawdown requests (approve/reject) for projects they mentor
CREATE POLICY "Teachers can update mentored project drawdowns"
  ON drawdown_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = drawdown_requests.project_id
      AND p.mentor_id = auth.uid()
    )
  );

-- Parents can view drawdown requests for projects where they gave consent
CREATE POLICY "Parents can view consented project drawdowns"
  ON drawdown_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parental_consents pc
      WHERE pc.project_id = drawdown_requests.project_id
      AND pc.parent_id = auth.uid()
      AND pc.status = 'approved'
    )
    OR
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_profiles up ON up.id = p.student_id
      WHERE p.id = drawdown_requests.project_id
      AND up.parent_id = auth.uid()
    )
  );
