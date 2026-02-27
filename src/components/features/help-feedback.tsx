'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export function HelpFeedback({ articleId }: { articleId: string }) {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`help_feedback_${articleId}`);
    if (stored === 'yes' || stored === 'no') {
      setFeedback(stored);
    }
  }, [articleId]);

  const handleFeedback = (value: 'yes' | 'no') => {
    setFeedback(value);
    localStorage.setItem(`help_feedback_${articleId}`, value);
  };

  if (feedback) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">
          {feedback === 'yes'
            ? 'Glad this helped! Thanks for your feedback.'
            : 'Sorry this wasn\'t helpful. We\'ll work on improving it.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-600 mb-3">Was this article helpful?</p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => handleFeedback('yes')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
        >
          <ThumbsUp className="h-4 w-4" />
          Yes
        </button>
        <button
          onClick={() => handleFeedback('no')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all"
        >
          <ThumbsDown className="h-4 w-4" />
          No
        </button>
      </div>
    </div>
  );
}
