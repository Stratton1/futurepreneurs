'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { createAuditEvent } from '@/lib/queries/audit-events';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';
import { revalidatePath } from 'next/cache';

export async function updateDigestSettings(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'parent') {
    return { error: 'Only parents can manage digest settings' };
  }

  const digestEnabled = formData.get('digest_enabled') === 'true';
  const digestDay = formData.get('digest_day') as string;

  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  if (!validDays.includes(digestDay)) {
    return { error: 'Invalid day selected' };
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from('parent_digest_settings')
    .upsert(
      {
        parent_id: user.id,
        digest_enabled: digestEnabled,
        digest_day: digestDay,
      },
      { onConflict: 'parent_id' }
    );

  if (error) {
    console.error('Failed to update digest settings:', error);
    return { error: 'Failed to save settings' };
  }

  revalidatePath('/dashboard/parent-hub');
  return { success: true };
}

export async function acknowledgeFirstDrawdown(projectId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'parent') {
    return { error: 'Only parents can acknowledge drawdowns' };
  }

  const supabase = createAdminClient();

  // Verify this parent is linked to the consent record
  const { data: consent } = await supabase
    .from('parental_consents')
    .select('id, student_id, project_id')
    .eq('project_id', projectId)
    .eq('parent_id', user.id)
    .eq('status', 'approved')
    .single();

  if (!consent) {
    return { error: 'No consent record found for this project' };
  }

  const { error } = await supabase
    .from('parental_consents')
    .update({
      first_drawdown_acknowledged: true,
      first_drawdown_acknowledged_at: new Date().toISOString(),
    })
    .eq('id', consent.id);

  if (error) {
    console.error('Failed to acknowledge first drawdown:', error);
    return { error: 'Failed to acknowledge' };
  }

  // Log audit event
  await createAuditEvent(projectId, user.id, 'first_drawdown_acknowledged');

  // Get project title for notifications
  const { data: project } = await supabase
    .from('projects')
    .select('title, student_id, mentor_id')
    .eq('id', projectId)
    .single();

  if (project) {
    const html = notificationEmailHtml(
      'First drawdown acknowledged',
      `${user.full_name} has acknowledged the first drawdown for "${project.title}". Teacher can now approve drawdown requests.`,
      `/dashboard/drawdowns`
    );

    // Notify student and teacher
    const notifyIds = [project.student_id, project.mentor_id].filter(Boolean) as string[];
    await Promise.all([
      ...notifyIds.map((id) =>
        supabase.from('notifications').insert({
          user_id: id,
          type: 'first_drawdown_acknowledged',
          title: 'First drawdown acknowledged',
          message: `${user.full_name} has acknowledged the first drawdown for "${project.title}"`,
          link: '/dashboard/drawdowns',
        })
      ),
      ...notifyIds.map((id) =>
        sendNotificationEmail(id, `First drawdown acknowledged — ${project.title}`, html)
      ),
    ]);
  }

  revalidatePath('/dashboard/parent-hub');
  revalidatePath('/dashboard/drawdowns');
  return { success: true };
}
