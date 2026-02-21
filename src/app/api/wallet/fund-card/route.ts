import { NextResponse } from 'next/server';
import { executeApprovedSpending } from '@/lib/wallet/execute-transaction';

/** Internal endpoint: triggers card funding after cooling-off period.
 *  Called by the cron job or manually by admin. */
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { spendingRequestId } = body;

  if (!spendingRequestId) {
    return NextResponse.json({ error: 'spendingRequestId is required' }, { status: 400 });
  }

  const result = await executeApprovedSpending(spendingRequestId);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
