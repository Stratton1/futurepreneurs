'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { giveConsent, declineConsent } from '@/app/dashboard/projects/actions';
import { ShieldCheck, X } from 'lucide-react';

export function ConsentActions({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [showDecline, setShowDecline] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleConsent = async () => {
    if (!confirm('Give consent for this project to go live? It will be visible to the public.')) return;

    setIsSubmitting(true);
    setError(null);
    const result = await giveConsent(projectId);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setSuccess('Consent given! The project is now live.');
    setTimeout(() => router.push('/dashboard/consent'), 2000);
  };

  const handleDecline = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const result = await declineConsent(projectId, reason);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setSuccess('Consent declined. The project has been moved back to draft.');
    setTimeout(() => router.push('/dashboard/consent'), 2000);
  };

  if (success) {
    return <Alert type="success" message={success} />;
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Your Decision</h2>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {!showDecline ? (
        <div className="flex gap-3">
          <Button onClick={handleConsent} isLoading={isSubmitting}>
            <ShieldCheck className="h-4 w-4 mr-1" /> Give Consent
          </Button>
          <Button variant="outline" onClick={() => setShowDecline(true)}>
            <X className="h-4 w-4 mr-1" /> Decline
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            label="Reason for declining"
            id="declineReason"
            placeholder="Please explain why you're unable to give consent..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDecline} isLoading={isSubmitting}>
              Confirm Decline
            </Button>
            <Button variant="outline" onClick={() => { setShowDecline(false); setReason(''); setError(null); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
