-- RLS policies for reports and backings (Phase 6/7)
-- Reports: users can INSERT their own (reporter_id = auth.uid()); admin uses service role for SELECT/UPDATE
-- Backings: users can SELECT their own backings (backer_id = auth.uid()) for "Projects I've backed"

-- Users can create a report (reporter_id must be self)
CREATE POLICY "Users can create own reports"
  ON reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

-- Backers can view their own backings
CREATE POLICY "Backers can view own backings"
  ON backings FOR SELECT
  USING (backer_id = auth.uid());
