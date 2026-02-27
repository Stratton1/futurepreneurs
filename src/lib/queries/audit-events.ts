import { createAdminClient } from '@/lib/supabase/server';
import type { AuditEventType, AuditEventWithActor } from '@/types/audit';

/** Log an audit event. Uses admin client to bypass RLS. */
export async function createAuditEvent(
  projectId: string,
  actorId: string,
  eventType: AuditEventType,
  eventData: Record<string, unknown> = {}
) {
  const supabase = createAdminClient();

  const { error } = await supabase.from('audit_events').insert({
    project_id: projectId,
    actor_id: actorId,
    event_type: eventType,
    event_data: eventData,
  });

  if (error) {
    console.error('Failed to create audit event:', error);
  }
}

/** Get recent audit events for a parent (across all their children's projects). */
export async function getRecentAuditEventsForParent(
  parentId: string,
  limit = 20
): Promise<AuditEventWithActor[]> {
  const supabase = createAdminClient();

  // Get all children of this parent
  const { data: children } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('parent_id', parentId);

  if (!children || children.length === 0) return [];

  const childIds = children.map((c) => c.id);

  // Get all projects belonging to those children
  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .in('student_id', childIds);

  if (!projects || projects.length === 0) return [];

  const projectIds = projects.map((p) => p.id);

  // Get audit events for those projects
  const { data: events } = await supabase
    .from('audit_events')
    .select(`
      id, project_id, actor_id, event_type, event_data, created_at,
      actor:user_profiles!audit_events_actor_id_fkey(full_name, role),
      project:projects!audit_events_project_id_fkey(title)
    `)
    .in('project_id', projectIds)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!events) return [];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  return events.map((e: any) => ({
    ...e,
    actor: Array.isArray(e.actor) ? e.actor[0] : e.actor,
    project: Array.isArray(e.project) ? e.project[0] : e.project,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/** Get audit events for a specific project. */
export async function getAuditEventsForProject(
  projectId: string,
  limit = 50
): Promise<AuditEventWithActor[]> {
  const supabase = createAdminClient();

  const { data: events } = await supabase
    .from('audit_events')
    .select(`
      id, project_id, actor_id, event_type, event_data, created_at,
      actor:user_profiles!audit_events_actor_id_fkey(full_name, role),
      project:projects!audit_events_project_id_fkey(title)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!events) return [];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  return events.map((e: any) => ({
    ...e,
    actor: Array.isArray(e.actor) ? e.actor[0] : e.actor,
    project: Array.isArray(e.project) ? e.project[0] : e.project,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
