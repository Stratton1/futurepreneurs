import { NextResponse } from 'next/server';
import { getRequestsMissingReceipts } from '@/lib/queries/spending-requests';
import { createAdminClient } from '@/lib/supabase/server';
import { sendNotificationEmail, notificationEmailHtml } from '@/lib/email/resend';

/** Cron job: runs daily. Sends receipt upload reminders. */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  let reminders = 0;

  // Find completed requests missing receipts (> 24 hours old)
  const missingReceipts = await getRequestsMissingReceipts(24);

  for (const req of missingReceipts) {
    const completedAt = req.completed_at ? new Date(req.completed_at) : new Date(req.created_at);
    const hoursOld = (Date.now() - completedAt.getTime()) / (1000 * 60 * 60);

    // Send reminder notification
    await admin.from('notifications').insert({
      user_id: req.student_id,
      type: 'receipt_reminder',
      title: 'Receipt needed',
      message: `Please upload a receipt for your £${Number(req.amount).toFixed(2)} purchase at ${req.vendor_name}.${hoursOld >= 48 ? ' This is overdue!' : ''}`,
      link: '/dashboard/wallet',
    });

    await sendNotificationEmail(
      req.student_id,
      'Please upload your receipt',
      notificationEmailHtml(
        'Receipt needed',
        `You made a purchase of £${Number(req.amount).toFixed(2)} at ${req.vendor_name}. Please upload your receipt.${hoursOld >= 48 ? ' This receipt is overdue and your card may be frozen until it is uploaded.' : ''}`,
        '/dashboard/wallet'
      )
    );

    reminders++;
  }

  return NextResponse.json({
    success: true,
    reminders_sent: reminders,
    timestamp: new Date().toISOString(),
  });
}
