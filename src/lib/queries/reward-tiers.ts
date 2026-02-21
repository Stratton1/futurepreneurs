import { createClient, createAdminClient } from '@/lib/supabase/server';

export interface RewardTier {
  id: string;
  project_id: string;
  title: string;
  description: string;
  min_amount: number;
  max_claims: number | null;
  claimed_count: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  sort_order: number;
  created_at: string;
}

/** Get approved reward tiers for a public project */
export async function getApprovedRewardTiers(projectId: string): Promise<RewardTier[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('reward_tiers')
    .select('*')
    .eq('project_id', projectId)
    .eq('approval_status', 'approved')
    .order('sort_order', { ascending: true });

  return (data ?? []) as RewardTier[];
}

/** Get all reward tiers for a project (student's own or teacher's mentored) */
export async function getAllRewardTiers(projectId: string): Promise<RewardTier[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('reward_tiers')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true });

  return (data ?? []) as RewardTier[];
}

/** Increment claimed_count for a reward tier (called from webhook) */
export async function incrementClaimedCount(rewardTierId: string): Promise<void> {
  const admin = createAdminClient();
  const { data: tier } = await admin
    .from('reward_tiers')
    .select('claimed_count')
    .eq('id', rewardTierId)
    .single();

  if (tier) {
    await admin
      .from('reward_tiers')
      .update({ claimed_count: Number(tier.claimed_count) + 1 })
      .eq('id', rewardTierId);
  }
}
