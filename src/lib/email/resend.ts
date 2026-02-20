import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/server';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM ?? 'Futurepreneurs <onboarding@resend.dev>';

/**
 * Send a transactional email. No-op if RESEND_API_KEY is not set (dev-friendly).
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!resendApiKey?.trim()) return false;

  try {
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html,
    });
    return !error;
  } catch {
    return false;
  }
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

/** Build simple HTML for a notification email. */
export function notificationEmailHtml(title: string, message: string, link?: string | null): string {
  const cta = link
    ? `<p><a href="${baseUrl}${link}" style="color: #059669;">View in dashboard</a></p>`
    : '';
  return `<p style="margin: 0 0 0.5em;">${title}</p><p style="margin: 0 0 1em; color: #374151;">${message}</p>${cta}`;
}

/**
 * Send a notification email to a user by id. Fetches email from user_profiles.
 * No-op if RESEND_API_KEY is missing or user has no email.
 */
export async function sendNotificationEmail(
  userId: string,
  subject: string,
  html: string
): Promise<boolean> {
  if (!resendApiKey?.trim()) return false;

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('email')
    .eq('id', userId)
    .single();

  if (!profile?.email) return false;

  return sendEmail(profile.email, subject, html);
}
