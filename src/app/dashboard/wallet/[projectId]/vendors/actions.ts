'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { revalidatePath } from 'next/cache';

/** Teacher adds a vendor to the project's allowlist. */
export async function addVendorToAllowlist(
  projectId: string,
  vendorName: string,
  vendorMcc?: string
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can manage vendor allowlists' };
  }

  if (!vendorName.trim()) return { error: 'Vendor name is required' };

  const admin = createAdminClient();

  // Verify teacher mentors this project
  const { data: project } = await admin
    .from('projects')
    .select('id, mentor_id')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Project not found' };
  if (project.mentor_id !== user.id) {
    return { error: 'You can only manage vendors for projects you mentor' };
  }

  const { error } = await admin.from('vendor_allowlists').insert({
    project_id: projectId,
    vendor_name: vendorName.trim(),
    vendor_mcc: vendorMcc?.trim() || null,
    approved_by: user.id,
  });

  if (error) {
    console.error('Add vendor error:', error);
    return { error: 'Failed to add vendor' };
  }

  revalidatePath(`/dashboard/wallet/${projectId}/vendors`);
  return { success: true };
}

/** Teacher removes a vendor from the project's allowlist. */
export async function removeVendorFromAllowlist(projectId: string, vendorId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher') {
    return { error: 'Only teachers can manage vendor allowlists' };
  }

  const admin = createAdminClient();

  // Verify teacher mentors this project
  const { data: project } = await admin
    .from('projects')
    .select('id, mentor_id')
    .eq('id', projectId)
    .single();

  if (!project || project.mentor_id !== user.id) {
    return { error: 'Not authorized' };
  }

  const { error } = await admin
    .from('vendor_allowlists')
    .delete()
    .eq('id', vendorId)
    .eq('project_id', projectId);

  if (error) {
    console.error('Remove vendor error:', error);
    return { error: 'Failed to remove vendor' };
  }

  revalidatePath(`/dashboard/wallet/${projectId}/vendors`);
  return { success: true };
}
