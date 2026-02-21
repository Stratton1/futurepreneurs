import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getCustodialAccountById } from '@/lib/queries/custodial-accounts';
import { getAccountStatus } from '@/lib/stripe/connect';

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('accountId');

  if (!accountId) {
    return NextResponse.json({ error: 'accountId is required' }, { status: 400 });
  }

  const account = await getCustodialAccountById(accountId);
  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  if (account.parent_id !== user.id && account.student_id !== user.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  if (!account.stripe_connected_account_id) {
    return NextResponse.json({
      status: 'not_started',
      kycStatus: account.kyc_status,
    });
  }

  try {
    const stripeStatus = await getAccountStatus(account.stripe_connected_account_id);
    return NextResponse.json({
      status: stripeStatus.requirements_met ? 'complete' : 'pending',
      kycStatus: account.kyc_status,
      requirementsMet: stripeStatus.requirements_met,
      currentlyDue: stripeStatus.currently_due,
    });
  } catch (err) {
    console.error('Status check error:', err);
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}
