'use server';

import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { generatePitch, type PitchAnswers } from '@/lib/ai/pitch-builder';
import { processContent } from '@/lib/ai/content-moderation';
import { checkRateLimit, recordGeneration } from '@/lib/ai/rate-limiter';
import { saveDraft, saveEditedPitch, markDraftApplied, getLatestDraft } from '@/lib/queries/pitch-drafts';
import { awardPitchPro } from '@/lib/badges';
import { revalidatePath } from 'next/cache';

/** Generate a pitch from student answers */
export async function generateAndSavePitch(
  projectId: string,
  answers: PitchAnswers,
): Promise<{ error?: string; pitch?: string; draftId?: string; isAiGenerated?: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id, student_id, status')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) return { error: 'Not your project' };

  // Content safety check on raw answers
  const allText = Object.values(answers).join(' ');
  const safety = processContent(allText);
  if (!safety.safe) {
    return { error: safety.reason || 'Content contains inappropriate language.' };
  }

  // Scrub PII from answers before generation
  const cleanAnswers: PitchAnswers = {
    problem: processContent(answers.problem).cleaned,
    solution: processContent(answers.solution).cleaned,
    audience: processContent(answers.audience).cleaned,
    fundsUsage: processContent(answers.fundsUsage).cleaned,
    uniqueness: processContent(answers.uniqueness).cleaned,
  };

  // Rate limit check
  const rateLimit = await checkRateLimit(user.id);
  if (!rateLimit.allowed) {
    return { error: 'You\'ve reached your daily limit of 10 AI generations. Try again tomorrow!' };
  }

  // Generate pitch
  const { pitch, isAiGenerated } = await generatePitch(cleanAnswers);

  // Scrub PII from generated pitch
  const cleanedPitch = processContent(pitch);
  if (!cleanedPitch.safe) {
    return { error: 'The generated content didn\'t pass our safety check. Please try adjusting your answers.' };
  }

  // Record generation for rate limiting
  if (isAiGenerated) {
    await recordGeneration(user.id);
  }

  // Save draft
  const result = await saveDraft(projectId, user.id, cleanAnswers, cleanedPitch.cleaned);
  if ('error' in result) return { error: result.error };

  revalidatePath(`/dashboard/projects/${projectId}/pitch-builder`);
  return { pitch: cleanedPitch.cleaned, draftId: result.id, isAiGenerated };
}

/** Save edits to a pitch draft */
export async function saveEdits(
  projectId: string,
  draftId: string,
  editedPitch: string,
): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  // Content safety check
  const safety = processContent(editedPitch);
  if (!safety.safe) {
    return { error: safety.reason || 'Content contains inappropriate language.' };
  }

  const result = await saveEditedPitch(draftId, safety.cleaned);
  if (result.error) return { error: result.error };

  revalidatePath(`/dashboard/projects/${projectId}/pitch-builder`);
  return {};
}

/** Apply the pitch to the project description */
export async function applyPitchToProject(
  projectId: string,
  draftId: string,
): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();

  // Get the draft
  const draft = await getLatestDraft(projectId);
  if (!draft || draft.id !== draftId) return { error: 'Draft not found' };

  const pitchText = draft.edited_pitch || draft.generated_pitch;
  if (!pitchText) return { error: 'No pitch content to apply' };

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id, student_id')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.student_id !== user.id) return { error: 'Not your project' };

  // Update project description
  const { error } = await supabase
    .from('projects')
    .update({ description: pitchText })
    .eq('id', projectId);

  if (error) return { error: 'Failed to update project description' };

  // Mark draft as applied and award badge
  await markDraftApplied(draftId);
  await awardPitchPro(user.id, projectId);

  revalidatePath(`/dashboard/projects/${projectId}/edit`);
  revalidatePath(`/dashboard/projects/${projectId}/pitch-builder`);
  return {};
}
