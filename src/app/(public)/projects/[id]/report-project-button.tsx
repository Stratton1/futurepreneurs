'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createReport } from './actions';

const REPORT_REASONS: { value: string; label: string }[] = [
  { value: 'inappropriate_content', label: 'Inappropriate content' },
  { value: 'misleading_or_false', label: 'Misleading or false information' },
  { value: 'spam', label: 'Spam' },
  { value: 'harassment_or_bullying', label: 'Harassment or bullying' },
  { value: 'copyright', label: 'Copyright concern' },
  { value: 'other', label: 'Other' },
];

interface ReportProjectButtonProps {
  projectId: string;
}

export function ReportProjectButton({ projectId }: ReportProjectButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await createReport(projectId, reason, details || null);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
    setReason('');
    setDetails('');
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
    }, 1500);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-600 transition-colors"
        aria-label="Report this project"
      >
        <Flag className="h-4 w-4" />
        Report project
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-dialog-title"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="report-dialog-title" className="text-lg font-semibold text-gray-900 mb-4">
              Report this project
            </h2>

            {submitted ? (
              <p className="text-emerald-600 font-medium">Report submitted. Thank you.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                )}
                <div>
                  <label htmlFor="report-reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <select
                    id="report-reason"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select a reason</option>
                    {REPORT_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="report-details" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional details (optional)
                  </label>
                  <textarea
                    id="report-details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Any extra context for our team..."
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={submitting || !reason}>
                    {submitting ? 'Submitting...' : 'Submit report'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
