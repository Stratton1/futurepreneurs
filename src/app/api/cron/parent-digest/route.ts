import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend';
import { auditEventLabel } from '@/lib/queries/parent-overview';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/** Cron job: runs daily. Sends weekly digest emails to parents on their chosen day. */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = DAYS[new Date().getDay()];
  const supabase = createAdminClient();

  // Find parents whose digest day is today and digest is enabled
  const { data: settings } = await supabase
    .from('parent_digest_settings')
    .select('parent_id, last_digest_sent_at')
    .eq('digest_enabled', true)
    .eq('digest_day', today);

  if (!settings || settings.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  for (const setting of settings) {
    const sinceDate = setting.last_digest_sent_at || oneWeekAgo;

    // Get parent email
    const { data: parent } = await supabase
      .from('user_profiles')
      .select('email, full_name')
      .eq('id', setting.parent_id)
      .single();

    if (!parent?.email) continue;

    // Get children
    const { data: children } = await supabase
      .from('user_profiles')
      .select('id, full_name')
      .eq('parent_id', setting.parent_id);

    if (!children || children.length === 0) continue;

    const childIds = children.map((c) => c.id);

    // Get projects for these children
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, student_id, total_raised, goal_amount, status')
      .in('student_id', childIds);

    if (!projects || projects.length === 0) continue;

    const projectIds = projects.map((p) => p.id);

    // Get recent audit events
    const { data: events } = await supabase
      .from('audit_events')
      .select('event_type, created_at, project_id')
      .in('project_id', projectIds)
      .gte('created_at', sinceDate)
      .order('created_at', { ascending: false })
      .limit(20);

    // Build email content
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    let html = `<h2 style="margin: 0 0 16px; color: #111827;">Weekly Summary for ${parent.full_name}</h2>`;

    // Project summaries
    html += `<h3 style="margin: 16px 0 8px; color: #374151;">Projects</h3>`;
    for (const project of projects) {
      const child = children.find((c) => c.id === project.student_id);
      const pct = Number(project.goal_amount) > 0
        ? Math.round((Number(project.total_raised) / Number(project.goal_amount)) * 100)
        : 0;
      html += `<p style="margin: 4px 0; color: #4B5563;">
        <strong>${project.title}</strong> by ${child?.full_name ?? 'Student'}
        — ${project.status} (${pct}% funded)
      </p>`;
    }

    // Recent activity
    if (events && events.length > 0) {
      html += `<h3 style="margin: 16px 0 8px; color: #374151;">Recent Activity</h3>`;
      for (const event of events.slice(0, 10)) {
        const project = projects.find((p) => p.id === event.project_id);
        html += `<p style="margin: 4px 0; color: #4B5563;">
          ${auditEventLabel(event.event_type)} on "${project?.title ?? 'Unknown'}"
        </p>`;
      }
    } else {
      html += `<p style="margin: 8px 0; color: #6B7280;">No new activity this week.</p>`;
    }

    html += `<p style="margin: 16px 0 0;"><a href="${baseUrl}/dashboard/parent-hub" style="color: #059669;">View Parent Hub</a></p>`;
    html += `<p style="margin: 8px 0 0; color: #9CA3AF; font-size: 12px;">You can change your digest preferences in the Parent Hub settings.</p>`;

    const success = await sendEmail(
      parent.email,
      'Your weekly Futurepreneurs digest',
      html
    );

    if (success) {
      sent++;
      // Update last sent time
      await supabase
        .from('parent_digest_settings')
        .update({ last_digest_sent_at: new Date().toISOString() })
        .eq('parent_id', setting.parent_id);
    }
  }

  return NextResponse.json({ sent });
}
