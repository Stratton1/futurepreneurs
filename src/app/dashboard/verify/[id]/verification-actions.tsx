'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { approveProject, requestChanges, rejectProject } from '@/app/dashboard/projects/actions';
import { Check, MessageSquare, X } from 'lucide-react';

export function VerificationActions({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [action, setAction] = useState<'approve' | 'changes' | 'reject' | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsSubmitting(true);
    setError(null);
    const result = await approveProject(projectId);
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }
    setSuccess('Project approved! Waiting for parent consent.');
    setTimeout(() => router.push('/dashboard/verify'), 2000);
  };

  const handleRequestChanges = async () => {
    if (!feedback.trim()) {
      setError('Please explain what changes you would like the student to make.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const result = await requestChanges(projectId, feedback);
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }
    setSuccess('Changes requested. The student has been notified.');
    setTimeout(() => router.push('/dashboard/verify'), 2000);
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      setError('Please provide a reason for rejecting this project.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const result = await rejectProject(projectId, feedback);
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }
    setSuccess('Project rejected. The student has been notified.');
    setTimeout(() => router.push('/dashboard/verify'), 2000);
  };

  if (success) {
    return <Alert type="success" message={success} />;
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Your Decision</h2>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {!action && (
        <div className="flex gap-3">
          <Button onClick={() => handleApprove()} isLoading={isSubmitting}>
            <Check className="h-4 w-4 mr-1" /> Approve
          </Button>
          <Button variant="secondary" onClick={() => setAction('changes')}>
            <MessageSquare className="h-4 w-4 mr-1" /> Request Changes
          </Button>
          <Button variant="danger" onClick={() => setAction('reject')}>
            <X className="h-4 w-4 mr-1" /> Reject
          </Button>
        </div>
      )}

      {(action === 'changes' || action === 'reject') && (
        <div className="space-y-4">
          <Textarea
            label={action === 'changes' ? 'What changes would you like?' : 'Reason for rejection'}
            id="feedback"
            placeholder={
              action === 'changes'
                ? 'e.g., Please add more detail about how you will spend the funding...'
                : 'e.g., This project does not meet our guidelines because...'
            }
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
          <div className="flex gap-3">
            <Button
              onClick={action === 'changes' ? handleRequestChanges : handleReject}
              variant={action === 'reject' ? 'danger' : 'primary'}
              isLoading={isSubmitting}
            >
              {action === 'changes' ? 'Send Feedback' : 'Confirm Rejection'}
            </Button>
            <Button variant="outline" onClick={() => { setAction(null); setFeedback(''); setError(null); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
