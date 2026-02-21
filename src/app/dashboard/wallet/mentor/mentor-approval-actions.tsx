'use client';

import { useState } from 'react';
import { approveSpendingRequest, declineSpendingRequest } from '../spending-actions';
import { Button } from '@/components/ui/button';

export function MentorApprovalActions({ requestId }: { requestId: string }) {
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="text-sm text-emerald-600 font-medium">Decision recorded</p>;
  }

  async function handleApprove() {
    setError(null);
    setIsApproving(true);
    const result = await approveSpendingRequest(requestId);
    setIsApproving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setDone(true);
    }
  }

  async function handleDecline() {
    setError(null);
    setIsDeclining(true);
    const result = await declineSpendingRequest(requestId, declineReason);
    setIsDeclining(false);
    if (result.error) {
      setError(result.error);
    } else {
      setDone(true);
    }
  }

  return (
    <div>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {showDeclineForm ? (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Reason for declining (optional)</label>
            <input
              type="text"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Not aligned with project goals"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <Button
            onClick={handleDecline}
            disabled={isDeclining}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            {isDeclining ? 'Declining...' : 'Confirm Decline'}
          </Button>
          <Button
            onClick={() => setShowDeclineForm(false)}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            onClick={handleApprove}
            disabled={isApproving}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </Button>
          <Button
            onClick={() => setShowDeclineForm(true)}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}
