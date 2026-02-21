'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { approveLogo, rejectLogo } from '@/app/dashboard/projects/[id]/logo/actions';

interface LogoApprovalCardProps {
  projectId: string;
  approved: boolean;
  canApprove: boolean;
}

export function LogoApprovalCard({ projectId, approved, canApprove }: LogoApprovalCardProps) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await approveLogo(projectId);
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await rejectLogo(projectId);
    setLoading(false);
  };

  if (approved) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-700">
        <CheckCircle className="h-4 w-4" />
        <span>Logo approved</span>
      </div>
    );
  }

  if (!canApprove) {
    return (
      <p className="text-sm text-gray-500">
        Logo approval will be available during project verification.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-amber-700">This logo needs your approval.</p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleApprove}
          disabled={loading}
          className="text-emerald-600"
        >
          <CheckCircle className="h-4 w-4 mr-1" /> Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReject}
          disabled={loading}
          className="text-red-600"
        >
          <XCircle className="h-4 w-4 mr-1" /> Reject
        </Button>
      </div>
    </div>
  );
}
