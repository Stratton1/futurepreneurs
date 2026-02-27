'use server';

import { sendEmail } from '@/lib/email/resend';

// Simple in-memory rate limiter (resets on server restart)
const submissions = new Map<string, number[]>();
const MAX_PER_HOUR = 3;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const times = (submissions.get(identifier) ?? []).filter((t) => t > hourAgo);
  submissions.set(identifier, times);
  return times.length >= MAX_PER_HOUR;
}

function recordSubmission(identifier: string) {
  const times = submissions.get(identifier) ?? [];
  times.push(Date.now());
  submissions.set(identifier, times);
}

export async function submitContactForm(formData: {
  name: string;
  email: string;
  role: string;
  subject: string;
  message: string;
}): Promise<{ error?: string; success?: boolean }> {
  const { name, email, role, subject, message } = formData;

  // Validate
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return { error: 'Please fill in all required fields.' };
  }

  if (name.trim().length > 200 || email.trim().length > 200 || subject.trim().length > 300 || message.trim().length > 5000) {
    return { error: 'One or more fields exceed the maximum length.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { error: 'Please enter a valid email address.' };
  }

  // Rate limit by email
  if (isRateLimited(email.trim().toLowerCase())) {
    return { error: 'You\'ve sent too many messages recently. Please try again in an hour.' };
  }

  // Build email HTML
  const roleLabel = role || 'Not specified';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6, #10b981); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
      </div>
      <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">Name</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${escapeHtml(name.trim())}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px;">
              <a href="mailto:${escapeHtml(email.trim())}" style="color: #3b82f6;">${escapeHtml(email.trim())}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Role</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px;">${escapeHtml(roleLabel)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subject</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${escapeHtml(subject.trim())}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        <div style="color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message.trim())}</div>
      </div>
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
        Sent from the Futurepreneurs contact form
      </p>
    </div>
  `;

  const sent = await sendEmail(
    'hello@futurepreneurs.co.uk',
    `[Contact] ${subject.trim()}`,
    html
  );

  if (!sent) {
    // Still count as success to prevent info leaking, but log
    console.error('Failed to send contact form email');
  }

  recordSubmission(email.trim().toLowerCase());

  return { success: true };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
