'use client';

import { useState } from 'react';
import { approveDrawdownRequest, rejectDrawdownRequest } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DrawdownApprovalActionsProps {
  drawdownId: string;
  projectId?: string;
}

export function DrawdownApprovalActions({ drawdownId }: DrawdownApprovalActionsProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setError(null);
    setIsApproving(true);
    const result = await approveDrawdownRequest(drawdownId);
    setIsApproving(false);
    if (result.error) setError(result.error);
  }

  async function handleReject(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setIsRejecting(true);
    const result = await rejectDrawdownRequest(drawdownId, rejectReason.trim() || null);
    setIsRejecting(false);
    setShowRejectInput(false);
    setRejectReason('');
    if (result.error) setError(result.error);
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {error && <p className="text-sm text-red-600 w-full text-right">{error}</p>}
      {!showRejectInput ? (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleApprove}
            disabled={isApproving || isRejecting}
            isLoading={isApproving}
          >
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRejectInput(true)}
            disabled={isApproving || isRejecting}
          >
            Reject
          </Button>
        </div>
      ) : (
        <form onSubmit={handleReject} className="flex flex-col gap-2 w-full sm:w-64">
          <Input
            label="Reason (optional)"
            type="text"
            placeholder="e.g. Need more details"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="danger"
              size="sm"
              disabled={isRejecting}
              isLoading={isRejecting}
            >
              Confirm reject
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { setShowRejectInput(false); setRejectReason(''); setError(null); }}
              disabled={isRejecting}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
