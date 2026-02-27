'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deactivateSponsor, updateSponsor } from '../actions';

interface SponsorActionsProps {
  sponsorId: string;
  isActive: boolean;
}

export function SponsorActions({ sponsorId, isActive }: SponsorActionsProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleToggle() {
    if (!confirm(isActive ? 'Deactivate this sponsor?' : 'Reactivate this sponsor?')) return;
    setSubmitting(true);
    if (isActive) {
      await deactivateSponsor(sponsorId);
    } else {
      await updateSponsor(sponsorId, { isActive: true });
    }
    setSubmitting(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      disabled={submitting}
      className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
        isActive
          ? 'border-red-200 text-red-600 hover:bg-red-50'
          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
      }`}
    >
      {submitting ? 'Processing...' : isActive ? 'Deactivate' : 'Reactivate'}
    </button>
  );
}
