import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { createAdminClient } from '@/lib/supabase/server';
import { createConnectedAccount, createAccountLink } from '@/lib/stripe/connect';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'parent') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { studentId } = body;

  if (!studentId) {
    return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify student is linked to parent
  const { data: student } = await admin
    .from('user_profiles')
    .select('id, full_name, parent_id')
    .eq('id', studentId)
    .eq('role', 'student')
    .single();

  if (!student || student.parent_id !== user.id) {
    return NextResponse.json({ error: 'Student not found or not linked' }, { status: 404 });
  }

  // Check existing custodial account
  const { data: existing } = await admin
    .from('custodial_accounts')
    .select('id, stripe_connected_account_id')
    .eq('parent_id', user.id)
    .eq('student_id', studentId)
    .single();

  if (existing?.stripe_connected_account_id) {
    const link = await createAccountLink(existing.stripe_connected_account_id);
    return NextResponse.json({ onboardingUrl: link.url, accountId: existing.id });
  }

  try {
    const account = await createConnectedAccount(user.email, user.full_name, {
      parentId: user.id,
      studentId,
    });

    const { data: custodialAccount } = await admin
      .from('custodial_accounts')
      .upsert({
        parent_id: user.id,
        student_id: studentId,
        stripe_connected_account_id: account.id,
        kyc_status: 'pending',
        relationship_verified: true,
        relationship_evidence: 'parental_consent',
      }, { onConflict: 'parent_id,student_id' })
      .select('id')
      .single();

    const link = await createAccountLink(account.id);

    return NextResponse.json({
      onboardingUrl: link.url,
      accountId: custodialAccount?.id,
    });
  } catch (err) {
    console.error('Onboarding API error:', err);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
