'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lightbulb, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface GuidedTipProps {
  title: string;
  body: string;
  learnMoreHref?: string;
  learnMoreLabel?: string;
}

export function GuidedTip({ title, body, learnMoreHref, learnMoreLabel }: GuidedTipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <Lightbulb className="h-4 w-4 text-blue-500 flex-shrink-0" />
        <span className="text-sm font-medium text-blue-800 flex-1">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-blue-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-blue-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-3 border-t border-blue-100 pt-3">
          <p className="text-sm text-blue-700 leading-relaxed">{body}</p>
          {learnMoreHref && (
            <Link
              href={learnMoreHref}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 mt-2"
            >
              {learnMoreLabel || 'Learn more'} <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
