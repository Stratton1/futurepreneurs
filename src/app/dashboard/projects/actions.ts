'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { MAX_FUNDING_GOAL } from '@/lib/constants';
import { revalidatePath } from 'next/cache';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';
import { awardFirstProject } from '@/lib/badges';
import { generateMicroGoals } from '@/lib/queries/micro-goals';
import { createAuditEvent } from '@/lib/queries/audit-events';

interface MilestoneInput {
  title: string;
  description: string;
  amount: number;
}

interface CreateProjectData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  goalAmount: number;
  videoUrl?: string;
  images: string[];
  milestones: MilestoneInput[];
  mentorId?: string;
  projectType?: 'individual' | 'group';
  groupName?: string;
}

/** Create a new project (saves as draft) */
export async function createProject(data: CreateProjectData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can create projects' };
  }

  // Validate
  if (!data.title || data.title.trim().length < 3) {
    return { error: 'Project title must be at least 3 characters' };
  }
  if (!data.shortDescription || data.shortDescription.trim().length < 10) {
    return { error: 'Short description must be at least 10 characters' };
  }
  if (!data.description || data.description.trim().length < 50) {
    return { error: 'Description must be at least 50 characters' };
  }
  if (!data.category) {
    return { error: 'Please select a category' };
  }
  if (data.goalAmount <= 0 || data.goalAmount > MAX_FUNDING_GOAL) {
    return { error: `Funding goal must be between £1 and £${MAX_FUNDING_GOAL.toLocaleString()}` };
  }
  if (!data.milestones || data.milestones.length === 0) {
    return { error: 'Please add at least one milestone' };
  }

  // Validate milestone totals match goal
  const milestoneTotal = data.milestones.reduce((sum, m) => sum + m.amount, 0);
  if (Math.abs(milestoneTotal - data.goalAmount) > 0.01) {
    return { error: `Milestone amounts (£${milestoneTotal.toFixed(2)}) must add up to your funding goal (£${data.goalAmount.toFixed(2)})` };
  }

  const supabase = await createClient();

  // Insert project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      student_id: user.id,
      mentor_id: data.mentorId || null,
      title: data.title.trim(),
      short_description: data.shortDescription.trim(),
      description: data.description.trim(),
      category: data.category,
      goal_amount: data.goalAmount,
      video_url: data.videoUrl?.trim() || null,
      images: data.images,
      status: 'draft',
      project_type: data.projectType || 'individual',
      group_name: data.projectType === 'group' ? (data.groupName?.trim() || null) : null,
    })
    .select('id')
    .single();

  if (projectError || !project) {
    console.error('Project creation error:', projectError);
    return { error: 'Failed to create project. Please try again.' };
  }

  // Insert milestones
  const milestonesData = data.milestones.map((m, index) => ({
    project_id: project.id,
    title: m.title.trim(),
    description: m.description.trim(),
    amount: m.amount,
    sort_order: index,
    status: 'pending' as const,
  }));

  const { error: milestoneError } = await supabase
    .from('milestones')
    .insert(milestonesData);

  if (milestoneError) {
    console.error('Milestone creation error:', milestoneError);
    // Clean up the project if milestones fail
    await supabase.from('projects').delete().eq('id', project.id);
    return { error: 'Failed to save milestones. Please try again.' };
  }

  await awardFirstProject(user.id, project.id);

  revalidatePath('/dashboard/projects');
  return { success: true, projectId: project.id };
}

/** Update a draft project */
export async function updateProject(projectId: string, data: Partial<CreateProjectData>) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can edit projects' };
  }

  const supabase = await createClient();

  // Check project belongs to student and is in draft
  const { data: existing } = await supabase
    .from('projects')
    .select('id, student_id, status')
    .eq('id', projectId)
    .single();

  if (!existing) return { error: 'Project not found' };
  if (existing.student_id !== user.id) return { error: 'You can only edit your own projects' };
  if (existing.status !== 'draft') return { error: 'Only draft projects can be edited' };

  const updateFields: Record<string, unknown> = {};
  if (data.title) updateFields.title = data.title.trim();
  if (data.shortDescription) updateFields.short_description = data.shortDescription.trim();
  if (data.description) updateFields.description = data.description.trim();
  if (data.category) updateFields.category = data.category;
  if (data.goalAmount) updateFields.goal_amount = data.goalAmount;
  if (data.videoUrl !== undefined) updateFields.video_url = data.videoUrl?.trim() || null;
  if (data.images) updateFields.images = data.images;
  if (data.mentorId) updateFields.mentor_id = data.mentorId;
  if (data.projectType) {
    updateFields.project_type = data.projectType;
    updateFields.group_name = data.projectType === 'group' ? (data.groupName?.trim() || null) : null;
  }

  const { error } = await supabase
    .from('projects')
    .update(updateFields)
    .eq('id', projectId);

  if (error) return { error: 'Failed to update project' };

  // Update milestones if provided
  if (data.milestones) {
    // Delete old milestones and re-insert
    await supabase.from('milestones').delete().eq('project_id', projectId);
    const milestonesData = data.milestones.map((m, index) => ({
      project_id: projectId,
      title: m.title.trim(),
      description: m.description.trim(),
      amount: m.amount,
      sort_order: index,
      status: 'pending' as const,
    }));
    await supabase.from('milestones').insert(milestonesData);
  }

  revalidatePath('/dashboard/projects');
  return { success: true };
}

/** Submit project for teacher verification */
export async function submitForVerification(projectId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can submit projects' };
  }

  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('id, student_id, status, mentor_id, title')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) return { error: 'You can only submit your own projects' };
  if (project.status !== 'draft') return { error: 'Only draft projects can be submitted' };
  if (!project.mentor_id) return { error: 'Please select a mentor before submitting' };

  const { error } = await supabase
    .from('projects')
    .update({ status: 'pending_verification' })
    .eq('id', projectId);

  if (error) return { error: 'Failed to submit project' };

  // Use admin client for cross-user notification
  const adminClient = createAdminClient();
  await adminClient.from('notifications').insert({
    user_id: project.mentor_id,
    type: 'verification_request',
    title: 'New project to verify',
    message: `${user.full_name} has submitted "${project.title}" for your verification.`,
    link: `/dashboard/verify/${projectId}`,
  });
  await sendNotificationEmail(
    project.mentor_id,
    'New project to verify',
    notificationEmailHtml(
      'New project to verify',
      `${user.full_name} has submitted "${project.title}" for your verification.`,
      `/dashboard/verify/${projectId}`
    )
  );

  revalidatePath('/dashboard/projects');
  return { success: true };
}

/** Teacher approves a project */
export async function approveProject(projectId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can verify projects' };
  }

  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('id, mentor_id, status, student_id, title')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.mentor_id !== user.id) return { error: 'You are not the mentor for this project' };
  if (project.status !== 'pending_verification') return { error: 'This project is not awaiting verification' };

  const { error } = await supabase
    .from('projects')
    .update({ status: 'pending_consent' })
    .eq('id', projectId);

  if (error) return { error: 'Failed to approve project' };

  // Use admin client for cross-user operations (notifications, consent records)
  const adminClient = createAdminClient();

  // Notify the student
  await adminClient.from('notifications').insert({
    user_id: project.student_id,
    type: 'project_approved',
    title: 'Project approved by teacher!',
    message: `"${project.title}" has been approved by ${user.full_name}. Now waiting for parent consent.`,
    link: `/dashboard/projects`,
  });
  await sendNotificationEmail(
    project.student_id,
    'Project approved by teacher!',
    notificationEmailHtml(
      'Project approved by teacher!',
      `"${project.title}" has been approved by ${user.full_name}. Now waiting for parent consent.`,
      '/dashboard/projects'
    )
  );

  // Auto-create consent record from student's linked parent if none exist
  const { data: existingConsents } = await adminClient
    .from('parental_consents')
    .select('parent_id')
    .eq('project_id', projectId);

  if (!existingConsents || existingConsents.length === 0) {
    // Look up the student's linked parent
    const { data: studentProfile } = await adminClient
      .from('user_profiles')
      .select('parent_id')
      .eq('id', project.student_id)
      .single();

    if (studentProfile?.parent_id) {
      await adminClient.from('parental_consents').insert({
        student_id: project.student_id,
        parent_id: studentProfile.parent_id,
        project_id: projectId,
        status: 'pending',
      });

      // Notify the parent
      await adminClient.from('notifications').insert({
        user_id: studentProfile.parent_id,
        type: 'consent_request',
        title: 'Consent needed',
        message: `"${project.title}" needs your consent to go live.`,
        link: `/dashboard/consent/${projectId}`,
      });
      await sendNotificationEmail(
        studentProfile.parent_id,
        'Consent needed',
        notificationEmailHtml(
          'Consent needed',
          `"${project.title}" needs your consent to go live.`,
          `/dashboard/consent/${projectId}`
        )
      );
    }
  } else {
    // Notify existing linked parents
    for (const consent of existingConsents) {
      await adminClient.from('notifications').insert({
        user_id: consent.parent_id,
        type: 'consent_request',
        title: 'Consent needed',
        message: `"${project.title}" needs your consent to go live.`,
        link: `/dashboard/consent/${projectId}`,
      });
      await sendNotificationEmail(
        consent.parent_id,
        'Consent needed',
        notificationEmailHtml(
          'Consent needed',
          `"${project.title}" needs your consent to go live.`,
          `/dashboard/consent/${projectId}`
        )
      );
    }
  }

  await createAuditEvent(projectId, user.id, 'project_verified');

  revalidatePath('/dashboard/verify');
  revalidatePath('/dashboard/consent');
  return { success: true };
}

/** Sanitize user-provided text: trim, limit length, strip HTML tags */
function sanitizeText(text: string, maxLength: number = 500): string {
  return text.trim().replace(/<[^>]*>/g, '').slice(0, maxLength);
}

/** Teacher requests changes on a project */
export async function requestChanges(projectId: string, feedback: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can request changes' };
  }

  if (!feedback || feedback.trim().length === 0) {
    return { error: 'Please provide feedback about what changes are needed' };
  }
  feedback = sanitizeText(feedback);

  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('id, mentor_id, status, student_id, title')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.mentor_id !== user.id) return { error: 'You are not the mentor for this project' };
  if (project.status !== 'pending_verification') return { error: 'This project is not awaiting verification' };

  const { error } = await supabase
    .from('projects')
    .update({ status: 'draft' })
    .eq('id', projectId);

  if (error) return { error: 'Failed to update project status' };

  // Use admin client for cross-user notification
  const adminClient = createAdminClient();
  await adminClient.from('notifications').insert({
    user_id: project.student_id,
    type: 'changes_requested',
    title: 'Changes requested',
    message: `${user.full_name} has requested changes on "${project.title}": ${feedback}`,
    link: `/dashboard/projects`,
  });
  await sendNotificationEmail(
    project.student_id,
    'Changes requested',
    notificationEmailHtml(
      'Changes requested',
      `${user.full_name} has requested changes on "${project.title}": ${feedback}`,
      '/dashboard/projects'
    )
  );

  await createAuditEvent(projectId, user.id, 'project_changes_requested', { feedback });

  revalidatePath('/dashboard/verify');
  revalidatePath('/dashboard/projects');
  return { success: true };
}

/** Teacher rejects a project */
export async function rejectProject(projectId: string, reason: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can reject projects' };
  }

  if (!reason || reason.trim().length === 0) {
    return { error: 'Please provide a reason for the rejection' };
  }
  reason = sanitizeText(reason);

  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('id, mentor_id, status, student_id, title')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.mentor_id !== user.id) return { error: 'You are not the mentor for this project' };
  if (project.status !== 'pending_verification') return { error: 'This project is not awaiting verification' };

  const { error } = await supabase
    .from('projects')
    .update({ status: 'cancelled' })
    .eq('id', projectId);

  if (error) return { error: 'Failed to reject project' };

  // Use admin client for cross-user notification
  const adminClient = createAdminClient();
  await adminClient.from('notifications').insert({
    user_id: project.student_id,
    type: 'project_rejected',
    title: 'Project not approved',
    message: `${user.full_name} was unable to approve "${project.title}": ${reason}`,
    link: `/dashboard/projects`,
  });
  await sendNotificationEmail(
    project.student_id,
    'Project not approved',
    notificationEmailHtml(
      'Project not approved',
      `${user.full_name} was unable to approve "${project.title}": ${reason}`,
      '/dashboard/projects'
    )
  );

  await createAuditEvent(projectId, user.id, 'project_rejected', { reason });

  revalidatePath('/dashboard/verify');
  return { success: true };
}

/** Parent gives consent */
export async function giveConsent(projectId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'parent') {
    return { error: 'Only parents can give consent' };
  }

  // Use admin client — parent can't read pending_consent projects or parental_consents via RLS
  const adminClient = createAdminClient();

  const { data: project } = await adminClient
    .from('projects')
    .select('id, status, student_id, title, mentor_id, goal_amount')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  // Already live: consent was likely given (e.g. double-click or another guardian). Treat as success so UI doesn't show an error.
  if (project.status === 'live') return { success: true };
  if (project.status !== 'pending_consent') return { error: 'This project is not awaiting consent' };

  // Verify this parent has a consent record for this project
  const { data: consent } = await adminClient
    .from('parental_consents')
    .select('id, status')
    .eq('project_id', projectId)
    .eq('parent_id', user.id)
    .single();

  if (!consent) return { error: 'You do not have permission to consent to this project' };
  if (consent.status === 'approved') return { success: true }; // Already consented

  // Update consent record
  await adminClient
    .from('parental_consents')
    .update({ status: 'approved', consented_at: new Date().toISOString() })
    .eq('id', consent.id)
    .eq('status', 'pending'); // Only update if still pending (prevents race)

  // Set project to live — conditional update prevents double-transition
  const { error } = await adminClient
    .from('projects')
    .update({ status: 'live' })
    .eq('id', projectId)
    .eq('status', 'pending_consent');

  if (error) return { error: 'Failed to update project status' };

  // Auto-generate micro-goals (25%, 50%, 75%, 100%)
  await generateMicroGoals(projectId, Number(project.goal_amount));

  // Notify student
  await adminClient.from('notifications').insert({
    user_id: project.student_id,
    type: 'project_live',
    title: 'Your project is live!',
    message: `"${project.title}" has been approved and is now visible to the public. Good luck!`,
    link: `/dashboard/projects`,
  });
  await sendNotificationEmail(
    project.student_id,
    'Your project is live!',
    notificationEmailHtml(
      'Your project is live!',
      `"${project.title}" has been approved and is now visible to the public. Good luck!`,
      '/dashboard/projects'
    )
  );

  // Notify teacher
  if (project.mentor_id) {
    await adminClient.from('notifications').insert({
      user_id: project.mentor_id,
      type: 'project_live',
      title: 'Project is live',
      message: `"${project.title}" is now live after receiving parent consent.`,
      link: `/dashboard/verify`,
    });
    await sendNotificationEmail(
      project.mentor_id,
      'Project is live',
      notificationEmailHtml(
        'Project is live',
        `"${project.title}" is now live after receiving parent consent.`,
        '/dashboard/verify'
      )
    );
  }

  await createAuditEvent(projectId, user.id, 'consent_approved');

  revalidatePath('/dashboard/consent');
  revalidatePath('/dashboard/projects');
  return { success: true };
}

/** Parent declines consent */
export async function declineConsent(projectId: string, reason: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'parent') {
    return { error: 'Only parents can decline consent' };
  }

  if (!reason || reason.trim().length === 0) {
    return { error: 'Please provide a reason for declining consent' };
  }
  reason = sanitizeText(reason);

  // Use admin client — parent can't read pending_consent projects or parental_consents via RLS
  const adminClient = createAdminClient();

  const { data: project } = await adminClient
    .from('projects')
    .select('id, status, student_id, title')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.status === 'live') return { error: 'This project is already live. Consent was already given.' };
  if (project.status !== 'pending_consent') return { error: 'This project is not awaiting consent' };

  const { data: consent } = await adminClient
    .from('parental_consents')
    .select('id')
    .eq('project_id', projectId)
    .eq('parent_id', user.id)
    .single();

  if (!consent) return { error: 'You do not have permission for this project' };

  await adminClient
    .from('parental_consents')
    .update({ status: 'rejected' })
    .eq('id', consent.id);

  await adminClient
    .from('projects')
    .update({ status: 'draft' })
    .eq('id', projectId);

  await adminClient.from('notifications').insert({
    user_id: project.student_id,
    type: 'consent_declined',
    title: 'Parent consent declined',
    message: `Your parent/guardian was unable to give consent for "${project.title}": ${reason}. The project has been moved back to draft.`,
    link: `/dashboard/projects`,
  });
  await sendNotificationEmail(
    project.student_id,
    'Parent consent declined',
    notificationEmailHtml(
      'Parent consent declined',
      `Your parent/guardian was unable to give consent for "${project.title}": ${reason}. The project has been moved back to draft.`,
      '/dashboard/projects'
    )
  );

  await createAuditEvent(projectId, user.id, 'consent_rejected', { reason });

  revalidatePath('/dashboard/consent');
  revalidatePath('/dashboard/projects');
  return { success: true };
}

/** Link a parent to a student's project (student invites parent) */
export async function linkParentToProject(projectId: string, parentEmail: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Only students can invite parents' };
  }

  const supabase = await createClient();

  // Find the parent user by email
  const { data: parent } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', parentEmail.toLowerCase().trim())
    .eq('role', 'parent')
    .eq('is_active', true)
    .single();

  if (!parent) {
    return { error: 'No parent account found with that email. They need to sign up as a parent first.' };
  }

  // Check if consent record already exists
  const { data: existing } = await supabase
    .from('parental_consents')
    .select('id')
    .eq('project_id', projectId)
    .eq('parent_id', parent.id)
    .single();

  if (existing) {
    return { error: 'This parent is already linked to this project' };
  }

  const { error } = await supabase.from('parental_consents').insert({
    student_id: user.id,
    parent_id: parent.id,
    project_id: projectId,
    status: 'pending',
  });

  if (error) return { error: 'Failed to link parent' };

  revalidatePath('/dashboard/projects');
  return { success: true };
}
