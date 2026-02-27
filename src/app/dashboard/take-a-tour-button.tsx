'use client';

import { HelpCircle } from 'lucide-react';
import { useWalkthrough } from '@/components/features/walkthrough/use-walkthrough';

export function TakeATourButton({ role }: { role: string }) {
  const { startWalkthrough } = useWalkthrough();

  return (
    <button
      onClick={() => startWalkthrough(role)}
      className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
    >
      <HelpCircle className="h-4 w-4" />
      Take a Tour
    </button>
  );
}
