'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveProjectUpdate, rejectProjectUpdate } from '@/app/dashboard/projects/[id]/updates/actions';
import { CheckCircle2, XCircle } from 'lucide-react';

interface UpdateActionsProps {
  updateId: string;
}

export function UpdateActions({ updateId }: UpdateActionsProps) {
  const router = useRouter();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setSubmitting(true);
    setError(null);
    const result = await approveProjectUpdate(updateId);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/dashboard/verify-updates');
    }
  }

  async function handleReject() {
    if (!reason.trim()) {
      setError('Please provide a reason');
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await rejectProjectUpdate(updateId, reason.trim());
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/dashboard/verify-updates');
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {!showRejectForm ? (
        <div className="flex items-center gap-3">
          <button
            onClick={handleApprove}
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            {submitting ? 'Approving...' : 'Approve & Publish'}
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Reason for rejection
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Explain what needs to change..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              disabled={submitting || !reason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
            <button
              onClick={() => {
                setShowRejectForm(false);
                setReason('');
                setError(null);
              }}
              disabled={submitting}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
