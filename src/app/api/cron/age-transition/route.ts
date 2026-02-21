import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { decryptDOB, calculateAge, daysUntilAge } from '@/lib/wallet/dob-encryption';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';

/** Cron job: runs daily. Checks for age-18 transitions and 90-day warnings. */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const results = { warnings: 0, transitions: 0, errors: 0 };

  // Get all active custodial accounts with encrypted DOB
  const { data: accounts } = await admin
    .from('custodial_accounts')
    .select('id, parent_id, student_id, date_of_birth_encrypted')
    .eq('is_active', true)
    .not('date_of_birth_encrypted', 'is', null);

  if (!accounts || accounts.length === 0) {
    return NextResponse.json({ success: true, ...results, timestamp: new Date().toISOString() });
  }

  for (const account of accounts) {
    try {
      const dob = decryptDOB(account.date_of_birth_encrypted!);
      const age = calculateAge(dob);
      const daysTo18 = daysUntilAge(dob, 18);

      if (age >= 18) {
        // Transition: mark account for adult independence
        await admin
          .from('custodial_accounts')
          .update({ kyc_status: 'fully_verified' })
          .eq('id', account.id);

        // Notify student
        await admin.from('notifications').insert({
          user_id: account.student_id,
          type: 'age_transition',
          title: 'Happy Birthday! You\'re 18!',
          message: 'You\'ve turned 18! Your account is transitioning to independent mode. You can now manage your finances directly.',
          link: '/dashboard/wallet/settings',
        });
        await sendNotificationEmail(
          account.student_id,
          'Your Futurepreneurs account is growing up!',
          notificationEmailHtml(
            'Happy Birthday!',
            'You\'ve turned 18! Your Futurepreneurs wallet is transitioning to independent mode. Visit your settings to learn about what\'s changed.',
            '/dashboard/wallet/settings'
          )
        );

        // Notify parent
        await admin.from('notifications').insert({
          user_id: account.parent_id,
          type: 'age_transition_parent',
          title: 'Your child has turned 18',
          message: 'Your child\'s Futurepreneurs account is transitioning to independent mode. Dual-approval requirements are being lifted.',
          link: '/dashboard/wallet/parent',
        });
        await sendNotificationEmail(
          account.parent_id,
          'Your child\'s Futurepreneurs account is transitioning',
          notificationEmailHtml(
            'Account transition',
            'Your child has turned 18 and their Futurepreneurs wallet is transitioning to independent mode. Dual-approval requirements will be lifted.',
            '/dashboard/wallet/parent'
          )
        );

        results.transitions++;
      } else if (daysTo18 <= 90 && daysTo18 > 89) {
        // 90-day warning (send only once, when daysTo18 hits exactly 90)
        await admin.from('notifications').insert({
          user_id: account.student_id,
          type: 'age_transition_warning',
          title: 'Growing up soon!',
          message: `In ${daysTo18} days, you'll turn 18 and your wallet will transition to independent mode. Start preparing!`,
          link: '/dashboard/wallet/settings',
        });
        await sendNotificationEmail(
          account.student_id,
          'Your Futurepreneurs account is changing soon',
          notificationEmailHtml(
            'Growing up!',
            `In ${daysTo18} days you'll turn 18 and your Futurepreneurs wallet will transition to independent mode.`,
            '/dashboard/wallet/settings'
          )
        );

        await admin.from('notifications').insert({
          user_id: account.parent_id,
          type: 'age_transition_warning_parent',
          title: 'Your child is turning 18 soon',
          message: `Your child will turn 18 in ${daysTo18} days. Their wallet will transition to independent mode at that time.`,
          link: '/dashboard/wallet/parent',
        });

        results.warnings++;
      }
    } catch (err) {
      console.error(`Age transition error for account ${account.id}:`, err);
      results.errors++;
    }
  }

  return NextResponse.json({
    success: true,
    ...results,
    timestamp: new Date().toISOString(),
  });
}
