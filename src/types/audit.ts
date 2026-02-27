export type AuditEventType =
  | 'drawdown_requested'
  | 'drawdown_approved'
  | 'drawdown_rejected'
  | 'spending_requested'
  | 'spending_parent_approved'
  | 'spending_parent_declined'
  | 'spending_mentor_approved'
  | 'spending_mentor_rejected'
  | 'consent_approved'
  | 'consent_rejected'
  | 'project_verified'
  | 'project_changes_requested'
  | 'project_rejected'
  | 'first_drawdown_acknowledged'
  | 'update_submitted'
  | 'update_approved'
  | 'update_rejected'
  | 'stretch_goal_submitted'
  | 'stretch_goal_approved'
  | 'stretch_goal_rejected'
  | 'stretch_goal_unlocked';

export interface AuditEvent {
  id: string;
  project_id: string;
  actor_id: string;
  event_type: AuditEventType;
  event_data: Record<string, unknown>;
  created_at: string;
}

export interface AuditEventWithActor extends AuditEvent {
  actor: {
    full_name: string;
    role: string;
  };
  project: {
    title: string;
  };
}

export interface ParentDigestSettings {
  id: string;
  parent_id: string;
  digest_enabled: boolean;
  digest_day: string;
  last_digest_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Human-readable label for audit event types */
export function auditEventLabel(eventType: string): string {
  const labels: Record<string, string> = {
    drawdown_requested: 'Drawdown requested',
    drawdown_approved: 'Drawdown approved',
    drawdown_rejected: 'Drawdown rejected',
    spending_requested: 'Purchase requested',
    spending_parent_approved: 'Purchase approved by parent',
    spending_parent_declined: 'Purchase declined by parent',
    spending_mentor_approved: 'Purchase approved by mentor',
    spending_mentor_rejected: 'Purchase rejected by mentor',
    consent_approved: 'Consent given',
    consent_rejected: 'Consent declined',
    project_verified: 'Project verified',
    project_changes_requested: 'Changes requested',
    project_rejected: 'Project rejected',
    first_drawdown_acknowledged: 'First drawdown acknowledged',
    update_submitted: 'Update posted',
    update_approved: 'Update approved',
    update_rejected: 'Update rejected',
    stretch_goal_submitted: 'Stretch goal submitted',
    stretch_goal_approved: 'Stretch goal approved',
    stretch_goal_rejected: 'Stretch goal rejected',
    stretch_goal_unlocked: 'Stretch goal unlocked',
  };
  return labels[eventType] || eventType;
}
