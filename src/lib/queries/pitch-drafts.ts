import { createAdminClient } from '@/lib/supabase/server';
import type { PitchAnswers } from '@/lib/ai/pitch-builder';

export interface PitchDraft {
  id: string;
  project_id: string;
  user_id: string;
  answers: PitchAnswers;
  generated_pitch: string | null;
  edited_pitch: string | null;
  is_applied: boolean;
  created_at: string;
  updated_at: string;
}

/** Get the latest pitch draft for a project */
export async function getLatestDraft(projectId: string): Promise<PitchDraft | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('pitch_drafts')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return data as PitchDraft | null;
}

/** Save or update a pitch draft */
export async function saveDraft(
  projectId: string,
  userId: string,
  answers: PitchAnswers,
  generatedPitch: string | null,
): Promise<{ id: string } | { error: string }> {
  const supabase = createAdminClient();

  // Upsert: check if there's an existing draft
  const existing = await getLatestDraft(projectId);

  if (existing && !existing.is_applied) {
    const { error } = await supabase
      .from('pitch_drafts')
      .update({
        answers,
        generated_pitch: generatedPitch,
        edited_pitch: null,
      })
      .eq('id', existing.id);

    if (error) return { error: 'Failed to update draft' };
    return { id: existing.id };
  }

  // Create new draft
  const { data, error } = await supabase
    .from('pitch_drafts')
    .insert({
      project_id: projectId,
      user_id: userId,
      answers,
      generated_pitch: generatedPitch,
    })
    .select('id')
    .single();

  if (error || !data) return { error: 'Failed to save draft' };
  return { id: data.id };
}

/** Save an edited version of the pitch */
export async function saveEditedPitch(
  draftId: string,
  editedPitch: string,
): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('pitch_drafts')
    .update({ edited_pitch: editedPitch })
    .eq('id', draftId);

  if (error) return { error: 'Failed to save edits' };
  return {};
}

/** Mark a draft as applied to the project */
export async function markDraftApplied(draftId: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('pitch_drafts')
    .update({ is_applied: true })
    .eq('id', draftId);

  if (error) return { error: 'Failed to mark as applied' };
  return {};
}
