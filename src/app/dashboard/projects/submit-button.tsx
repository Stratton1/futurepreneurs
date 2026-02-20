'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { submitForVerification } from './actions';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SubmitButton({ projectId }: { projectId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!confirm('Submit this project for teacher verification? Your teacher will review it before it goes live.')) return;

    setIsSubmitting(true);
    const result = await submitForVerification(projectId);

    if (result.error) {
      alert(result.error);
      setIsSubmitting(false);
      return;
    }

    router.refresh();
  };

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={handleSubmit}
      isLoading={isSubmitting}
    >
      <Send className="h-3.5 w-3.5 mr-1" /> Submit
    </Button>
  );
}
