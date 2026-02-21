import { NextResponse } from 'next/server';
import { getExpiredFundedRequests } from '@/lib/queries/spending-requests';
import { refreezeExpiredCard } from '@/lib/wallet/execute-transaction';
import { createAdminClient } from '@/lib/supabase/server';
import { executeApprovedSpending } from '@/lib/wallet/execute-transaction';

/** Cron job: runs every 5 minutes. Refreezes expired cards and funds approved requests. */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = { refrozen: 0, funded: 0, errors: 0 };

  // 1. Refreeze expired cards
  const expired = await getExpiredFundedRequests();
  for (const request of expired) {
    const result = await refreezeExpiredCard(request.id);
    if (result.success) {
      results.refrozen++;
    } else {
      results.errors++;
      console.error(`Failed to refreeze card for request ${request.id}:`, result.error);
    }
  }

  // 2. Fund approved requests past cooling-off period
  const admin = createAdminClient();
  const { data: approvedRequests } = await admin
    .from('spending_requests')
    .select('id')
    .eq('status', 'approved')
    .lt('cooling_off_ends_at', new Date().toISOString());

  if (approvedRequests) {
    for (const req of approvedRequests) {
      const result = await executeApprovedSpending(req.id);
      if (result.success) {
        results.funded++;
      } else {
        results.errors++;
        console.error(`Failed to fund request ${req.id}:`, result.error);
      }
    }
  }

  return NextResponse.json({
    success: true,
    ...results,
    timestamp: new Date().toISOString(),
  });
}
