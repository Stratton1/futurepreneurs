'use server';

import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { awardTeamPlayer } from '@/lib/badges';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';
import { revalidatePath } from 'next/cache';

/** Invite a student to collaborate on a project (by email, same school only) */
export async function inviteCollaborator(
  projectId: string,
  email: string,
): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();
  const admin = createAdminClient();

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id, student_id, project_type')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) return { error: 'Only the project owner can invite collaborators' };
  if (project.project_type !== 'group') return { error: 'This is not a group project' };

  // Find the student by email
  const { data: invitee } = await admin
    .from('user_profiles')
    .select('id, full_name, role, school_id')
    .eq('email', email.trim().toLowerCase())
    .single();

  if (!invitee) return { error: 'No user found with that email address' };
  if (invitee.role !== 'student') return { error: 'Only students can be invited as collaborators' };
  if (invitee.id === user.id) return { error: 'You can\'t invite yourself' };

  // Same school check
  if (user.school_id && invitee.school_id !== user.school_id) {
    return { error: 'Collaborators must be from the same school' };
  }

  // Check if already invited
  const { data: existing } = await supabase
    .from('project_collaborators')
    .select('id')
    .eq('project_id', projectId)
    .eq('user_id', invitee.id)
    .maybeSingle();

  if (existing) return { error: 'This student has already been invited' };

  // Create invitation
  const { error } = await supabase
    .from('project_collaborators')
    .insert({
      project_id: projectId,
      user_id: invitee.id,
      role: 'member',
      invited_by: user.id,
      accepted: false,
    });

  if (error) return { error: 'Failed to send invitation' };

  // Fetch project title for a better notification message
  const { data: projDetails } = await admin
    .from('projects')
    .select('title')
    .eq('id', projectId)
    .single();
  const projTitle = projDetails?.title ?? 'a group project';

  // Create notification for the invitee
  await admin
    .from('notifications')
    .insert({
      user_id: invitee.id,
      type: 'team_invitation',
      title: 'Team Invitation',
      message: `You've been invited to join "${projTitle}"!`,
      link: `/dashboard`,
    });

  // Send email notification to the invitee
  await sendNotificationEmail(
    invitee.id,
    'You\'ve been invited to join a project on Futurepreneurs!',
    notificationEmailHtml(
      'Team Invitation',
      `${user.full_name} has invited you to collaborate on "${projTitle}". Log in to accept or decline the invitation.`,
      '/dashboard'
    )
  );

  revalidatePath(`/dashboard/projects/${projectId}/team`);
  return {};
}

/** Accept a collaboration invitation */
export async function acceptInvitation(
  collaboratorId: string,
): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const admin = createAdminClient();

  // Get the invitation
  const { data: collab } = await admin
    .from('project_collaborators')
    .select('id, project_id, user_id')
    .eq('id', collaboratorId)
    .single();

  if (!collab) return { error: 'Invitation not found' };
  if (collab.user_id !== user.id) return { error: 'Not your invitation' };

  // Accept
  const { error } = await admin
    .from('project_collaborators')
    .update({ accepted: true })
    .eq('id', collaboratorId);

  if (error) return { error: 'Failed to accept invitation' };

  // Award team player badge to both the invitee and project owner
  await awardTeamPlayer(user.id, collab.project_id);

  // Notify the project owner
  const { data: project } = await admin
    .from('projects')
    .select('student_id, title')
    .eq('id', collab.project_id)
    .single();

  if (project) {
    await awardTeamPlayer(project.student_id, collab.project_id);

    await admin
      .from('notifications')
      .insert({
        user_id: project.student_id,
        type: 'team_accepted',
        title: 'Invitation Accepted',
        message: `${user.full_name} has joined your project "${project.title}"!`,
        link: `/dashboard/projects/${collab.project_id}/team`,
      });

    // Send email notification to the project owner
    await sendNotificationEmail(
      project.student_id,
      'A team member has joined your project!',
      notificationEmailHtml(
        'Invitation Accepted',
        `${user.full_name} has accepted your invitation and joined "${project.title}". Visit your team page to see your full team.`,
        `/dashboard/projects/${collab.project_id}/team`
      )
    );
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/projects/${collab.project_id}/team`);
  return {};
}

/** Decline a collaboration invitation */
export async function declineInvitation(
  collaboratorId: string,
): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const admin = createAdminClient();

  const { data: collab } = await admin
    .from('project_collaborators')
    .select('id, user_id')
    .eq('id', collaboratorId)
    .single();

  if (!collab) return { error: 'Invitation not found' };
  if (collab.user_id !== user.id) return { error: 'Not your invitation' };

  // Fetch project details before deleting so we can notify the owner
  const { data: projForDecline } = await admin
    .from('project_collaborators')
    .select('project_id')
    .eq('id', collaboratorId)
    .single();

  const { error } = await admin
    .from('project_collaborators')
    .delete()
    .eq('id', collaboratorId);

  if (error) return { error: 'Failed to decline invitation' };

  // Notify the project owner that the invitation was declined
  if (projForDecline?.project_id) {
    const { data: projOwner } = await admin
      .from('projects')
      .select('student_id, title')
      .eq('id', projForDecline.project_id)
      .single();

    if (projOwner) {
      await admin.from('notifications').insert({
        user_id: projOwner.student_id,
        type: 'team_declined',
        title: 'Invitation Declined',
        message: `${user.full_name} has declined the invitation to join "${projOwner.title}".`,
        link: `/dashboard/projects/${projForDecline.project_id}/team`,
      });

      await sendNotificationEmail(
        projOwner.student_id,
        'Team invitation declined',
        notificationEmailHtml(
          'Invitation Declined',
          `${user.full_name} has declined the invitation to join "${projOwner.title}".`,
          `/dashboard/projects/${projForDecline.project_id}/team`
        )
      );
    }
  }

  revalidatePath('/dashboard');
  return {};
}

/** Remove a collaborator from a project (owner action) */
export async function removeCollaborator(
  projectId: string,
  collaboratorId: string,
): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id, student_id')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) return { error: 'Only the project owner can remove collaborators' };

  const { error } = await supabase
    .from('project_collaborators')
    .delete()
    .eq('id', collaboratorId)
    .eq('project_id', projectId);

  if (error) return { error: 'Failed to remove collaborator' };

  revalidatePath(`/dashboard/projects/${projectId}/team`);
  return {};
}
