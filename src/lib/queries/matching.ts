import { createAdminClient } from '@/lib/supabase/server';
import type { MatchingSponsor, MatchingPledge, MatchingTransaction } from '@/types/funding';

/** Get all active sponsors. */
export async function getActiveSponsors(): Promise<MatchingSponsor[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('matching_sponsors')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (data || []) as MatchingSponsor[];
}

/** Get all sponsors (admin view). */
export async function getAllSponsors(): Promise<MatchingSponsor[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('matching_sponsors')
    .select('*')
    .order('created_at', { ascending: false });

  return (data || []) as MatchingSponsor[];
}

/** Get a single sponsor by ID. */
export async function getSponsorById(sponsorId: string): Promise<MatchingSponsor | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('matching_sponsors')
    .select('*')
    .eq('id', sponsorId)
    .single();

  return (data as MatchingSponsor) || null;
}

/** Get matching pledges for a project with sponsor data. */
export async function getMatchingPledgesForProject(
  projectId: string
): Promise<(MatchingPledge & { sponsor: MatchingSponsor })[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('matching_pledges')
    .select('*, sponsor:matching_sponsors(*)')
    .eq('project_id', projectId)
    .eq('status', 'active');

  if (!data) return [];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  return data.map((d: any) => ({
    ...d,
    sponsor: Array.isArray(d.sponsor) ? d.sponsor[0] : d.sponsor,
  })) as (MatchingPledge & { sponsor: MatchingSponsor })[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/** Get all pledges for a sponsor (admin view). */
export async function getPledgesForSponsor(
  sponsorId: string
): Promise<(MatchingPledge & { project_title: string })[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('matching_pledges')
    .select('*, project:projects(title)')
    .eq('sponsor_id', sponsorId)
    .order('created_at', { ascending: false });

  if (!data) return [];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  return data.map((d: any) => ({
    ...d,
    project_title: Array.isArray(d.project) ? d.project[0]?.title : d.project?.title || '',
  })) as (MatchingPledge & { project_title: string })[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/**
 * Calculate the match amount for a backing, capped by:
 * - remaining budget for the pledge (max_match_amount - matched_amount)
 * - remaining sponsor budget (total_budget - total_matched)
 */
export function calculateMatchAmount(
  backingAmount: number,
  pledge: MatchingPledge,
  sponsor: MatchingSponsor
): number {
  const rawMatch = backingAmount * pledge.match_ratio;

  const pledgeRemaining = Number(pledge.max_match_amount) - Number(pledge.matched_amount);
  const sponsorRemaining = Number(sponsor.total_budget) - Number(sponsor.total_matched);

  return Math.max(0, Math.min(rawMatch, pledgeRemaining, sponsorRemaining));
}

/** Record a matching transaction and update pledge/sponsor totals. */
export async function recordMatchTransaction(
  pledgeId: string,
  backingId: string,
  originalAmount: number,
  matchedAmount: number
): Promise<MatchingTransaction | null> {
  if (matchedAmount <= 0) return null;

  const supabase = createAdminClient();

  // Insert transaction
  const { data: txn, error } = await supabase
    .from('matching_transactions')
    .insert({
      pledge_id: pledgeId,
      backing_id: backingId,
      original_amount: originalAmount,
      matched_amount: matchedAmount,
    })
    .select('*')
    .single();

  if (error || !txn) {
    console.error('Failed to record match transaction:', error);
    return null;
  }

  // Update pledge matched_amount
  await supabase.rpc('increment_field', {
    p_table: 'matching_pledges',
    p_id: pledgeId,
    p_field: 'matched_amount',
    p_amount: matchedAmount,
  }).then(({ error: e }) => {
    // Fallback: direct update if RPC doesn't exist
    if (e) {
      return supabase
        .from('matching_pledges')
        .update({
          matched_amount: Number(txn.matched_amount) + matchedAmount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pledgeId);
    }
  });

  // Update sponsor total_matched
  const { data: pledge } = await supabase
    .from('matching_pledges')
    .select('sponsor_id')
    .eq('id', pledgeId)
    .single();

  if (pledge) {
    // Direct update approach — read current value and add
    const sponsor = await getSponsorById(pledge.sponsor_id);
    if (sponsor) {
      await supabase
        .from('matching_sponsors')
        .update({
          total_matched: Number(sponsor.total_matched) + matchedAmount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pledge.sponsor_id);
    }
  }

  return txn as MatchingTransaction;
}

/**
 * Process matching for a new backing.
 * Finds active pledges for the project, calculates match amounts,
 * records transactions, and returns total matched amount.
 */
export async function processMatchingForBacking(
  projectId: string,
  backingId: string,
  backingAmount: number
): Promise<number> {
  const pledges = await getMatchingPledgesForProject(projectId);
  let totalMatched = 0;

  for (const pledge of pledges) {
    if (!pledge.sponsor.is_active) continue;

    // Check date validity
    const now = new Date();
    if (pledge.sponsor.starts_at && new Date(pledge.sponsor.starts_at) > now) continue;
    if (pledge.sponsor.ends_at && new Date(pledge.sponsor.ends_at) < now) continue;

    const matchAmount = calculateMatchAmount(backingAmount, pledge, pledge.sponsor);
    if (matchAmount > 0) {
      const txn = await recordMatchTransaction(
        pledge.id,
        backingId,
        backingAmount,
        matchAmount
      );
      if (txn) {
        totalMatched += matchAmount;
      }
    }
  }

  return totalMatched;
}
