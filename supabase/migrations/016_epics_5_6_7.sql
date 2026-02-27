-- ============================================================
-- MIGRATION 016: Epics 5, 6 & 7
-- Epic 5: Enhanced Parent Dashboard, Privacy Checkpoints, Verification Badges
-- Epic 6: Circle of Gratitude Impact Reports
-- Epic 7: Stretch Goals, Corporate Matching Grants, Youth Grant Matching
-- ============================================================

-- ============================================================
-- EPIC 5: First-Drawdown Gate on parental_consents
-- ============================================================
ALTER TABLE parental_consents
  ADD COLUMN first_drawdown_acknowledged BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN first_drawdown_acknowledged_at TIMESTAMPTZ;

-- ============================================================
-- EPIC 5: Unified Audit Trail
-- ============================================================
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  actor_id UUID NOT NULL REFERENCES user_profiles(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_events_project ON audit_events(project_id);
CREATE INDEX idx_audit_events_actor ON audit_events(actor_id);
CREATE INDEX idx_audit_events_type ON audit_events(event_type);
CREATE INDEX idx_audit_events_created ON audit_events(created_at DESC);

-- ============================================================
-- EPIC 5: Parent Weekly Digest Preferences
-- ============================================================
CREATE TABLE parent_digest_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES user_profiles(id) UNIQUE,
  digest_enabled BOOLEAN NOT NULL DEFAULT true,
  digest_day TEXT NOT NULL DEFAULT 'monday'
    CHECK (digest_day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  last_digest_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_parent_digest_parent ON parent_digest_settings(parent_id);

-- ============================================================
-- EPIC 6: Extend project_updates for structured impact reports
-- ============================================================
ALTER TABLE project_updates
  ADD COLUMN author_id UUID REFERENCES user_profiles(id),
  ADD COLUMN update_type TEXT NOT NULL DEFAULT 'general'
    CHECK (update_type IN ('general', 'impact_report', 'milestone_complete', 'thank_you')),
  ADD COLUMN images TEXT[] DEFAULT '{}',
  ADD COLUMN funds_breakdown JSONB,
  ADD COLUMN learnings TEXT,
  ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN rejection_reason TEXT,
  ADD COLUMN approved_by UUID REFERENCES user_profiles(id),
  ADD COLUMN approved_at TIMESTAMPTZ,
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX idx_project_updates_author ON project_updates(author_id);
CREATE INDEX idx_project_updates_status ON project_updates(status);
CREATE INDEX idx_project_updates_type ON project_updates(update_type);

-- ============================================================
-- EPIC 7: Stretch Goals
-- ============================================================
CREATE TABLE stretch_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_amount NUMERIC(10,2) NOT NULL CHECK (target_amount > 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'unlocked')),
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stretch_goals_project ON stretch_goals(project_id);
CREATE INDEX idx_stretch_goals_status ON stretch_goals(status);

-- ============================================================
-- EPIC 7: Matching Sponsors (corporate + grant programmes)
-- ============================================================
CREATE TABLE matching_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  sponsor_type TEXT NOT NULL DEFAULT 'corporate'
    CHECK (sponsor_type IN ('corporate', 'grant')),
  match_ratio NUMERIC(3,1) NOT NULL DEFAULT 1.0 CHECK (match_ratio > 0),
  max_match_per_project NUMERIC(10,2) NOT NULL CHECK (max_match_per_project > 0),
  total_budget NUMERIC(10,2) NOT NULL CHECK (total_budget > 0),
  total_matched NUMERIC(10,2) NOT NULL DEFAULT 0,
  eligibility_criteria JSONB DEFAULT '{}',
  contact_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_matching_sponsors_type ON matching_sponsors(sponsor_type);
CREATE INDEX idx_matching_sponsors_active ON matching_sponsors(is_active);

-- ============================================================
-- EPIC 7: Matching Pledges (link sponsor to project)
-- ============================================================
CREATE TABLE matching_pledges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES matching_sponsors(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  match_ratio NUMERIC(3,1) NOT NULL CHECK (match_ratio > 0),
  max_match_amount NUMERIC(10,2) NOT NULL CHECK (max_match_amount > 0),
  matched_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'exhausted', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(sponsor_id, project_id)
);

CREATE INDEX idx_matching_pledges_sponsor ON matching_pledges(sponsor_id);
CREATE INDEX idx_matching_pledges_project ON matching_pledges(project_id);
CREATE INDEX idx_matching_pledges_status ON matching_pledges(status);

-- ============================================================
-- EPIC 7: Matching Transactions (audit trail per backing)
-- ============================================================
CREATE TABLE matching_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pledge_id UUID NOT NULL REFERENCES matching_pledges(id),
  backing_id UUID NOT NULL REFERENCES backings(id),
  original_amount NUMERIC(10,2) NOT NULL CHECK (original_amount > 0),
  matched_amount NUMERIC(10,2) NOT NULL CHECK (matched_amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_matching_transactions_pledge ON matching_transactions(pledge_id);
CREATE INDEX idx_matching_transactions_backing ON matching_transactions(backing_id);

-- ============================================================
-- UPDATED_AT TRIGGERS for new tables
-- ============================================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON parent_digest_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON project_updates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON stretch_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON matching_sponsors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON matching_pledges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Audit events: parents see events for their children's projects,
-- students see own projects, teachers see mentored projects
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view audit events for own projects" ON audit_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = audit_events.project_id AND projects.student_id = auth.uid())
  );

CREATE POLICY "Teachers can view audit events for mentored projects" ON audit_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = audit_events.project_id AND projects.mentor_id = auth.uid())
  );

CREATE POLICY "Parents can view audit events for children's projects" ON audit_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN user_profiles ON user_profiles.id = projects.student_id
      WHERE projects.id = audit_events.project_id
        AND user_profiles.parent_id = auth.uid()
    )
  );

-- Parent digest settings: parents manage their own
ALTER TABLE parent_digest_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own digest settings" ON parent_digest_settings
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert own digest settings" ON parent_digest_settings
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update own digest settings" ON parent_digest_settings
  FOR UPDATE USING (auth.uid() = parent_id);

-- Project updates: public reads approved updates on live/funded/completed projects;
-- students manage own; teachers read mentored
CREATE POLICY "Anyone can view approved updates on live projects" ON project_updates
  FOR SELECT USING (
    status = 'approved' AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
        AND projects.status IN ('live', 'funded', 'completed')
    )
  );

CREATE POLICY "Students can view own project updates" ON project_updates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_updates.project_id AND projects.student_id = auth.uid())
  );

CREATE POLICY "Teachers can view mentored project updates" ON project_updates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_updates.project_id AND projects.mentor_id = auth.uid())
  );

CREATE POLICY "Students can insert updates on own projects" ON project_updates
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND EXISTS (
      SELECT 1 FROM projects WHERE projects.id = project_updates.project_id AND projects.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own updates" ON project_updates
  FOR UPDATE USING (
    auth.uid() = author_id
  );

-- Stretch goals: public reads approved/unlocked on live projects;
-- students manage own; teachers read mentored
ALTER TABLE stretch_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved stretch goals on live projects" ON stretch_goals
  FOR SELECT USING (
    status IN ('approved', 'unlocked') AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = stretch_goals.project_id
        AND projects.status IN ('live', 'funded', 'completed')
    )
  );

CREATE POLICY "Students can view own project stretch goals" ON stretch_goals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = stretch_goals.project_id AND projects.student_id = auth.uid())
  );

CREATE POLICY "Teachers can view mentored project stretch goals" ON stretch_goals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = stretch_goals.project_id AND projects.mentor_id = auth.uid())
  );

CREATE POLICY "Students can insert stretch goals on own projects" ON stretch_goals
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = stretch_goals.project_id AND projects.student_id = auth.uid())
  );

CREATE POLICY "Students can update own project stretch goals" ON stretch_goals
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = stretch_goals.project_id AND projects.student_id = auth.uid())
  );

CREATE POLICY "Students can delete draft stretch goals" ON stretch_goals
  FOR DELETE USING (
    status IN ('draft', 'rejected') AND EXISTS (
      SELECT 1 FROM projects WHERE projects.id = stretch_goals.project_id AND projects.student_id = auth.uid()
    )
  );

-- Matching sponsors: public reads active sponsors
ALTER TABLE matching_sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active sponsors" ON matching_sponsors
  FOR SELECT USING (is_active = true);

-- Matching pledges: public reads active pledges on live projects
ALTER TABLE matching_pledges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pledges on live projects" ON matching_pledges
  FOR SELECT USING (
    status = 'active' AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = matching_pledges.project_id
        AND projects.status IN ('live', 'funded', 'completed')
    )
  );

-- Matching transactions: public reads for live project pledges
ALTER TABLE matching_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view matching transactions for live projects" ON matching_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matching_pledges
      JOIN projects ON projects.id = matching_pledges.project_id
      WHERE matching_pledges.id = matching_transactions.pledge_id
        AND projects.status IN ('live', 'funded', 'completed')
    )
  );
